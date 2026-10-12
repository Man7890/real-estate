/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Building, Floor } from '../../types';
import { Maximize2, RotateCcw, Layers, Play, Pause, Eye } from 'lucide-react';

interface Building3DViewerProps {
  building?: Building;
  selectedFloorId: string | null;
  onSelectFloor: (floorId: string) => void;
  exploded: boolean;
  onToggleExploded: () => void;
  className?: string;
  parcelAreaSqM?: number;
}

export const Building3DViewer: React.FC<Building3DViewerProps> = ({
  building,
  selectedFloorId,
  onSelectFloor,
  exploded,
  onToggleExploded,
  className = '',
  parcelAreaSqM = 1200,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [autoRotate, setAutoRotate] = useState(false);
  const [hoveredFloor, setHoveredFloor] = useState<string | null>(null);

  // References for Three.js scene instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const floorMeshesRef = useRef<{ id: string; group: THREE.Group; baseMesh: THREE.Mesh; edgesMesh: THREE.LineSegments; basePosY: number }[]>([]);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 5, 0));
  const sphericalRef = useRef<{ radius: number; theta: number; phi: number }>({
    radius: 28,
    theta: Math.PI / 4,
    phi: Math.PI / 3,
  });

  // Initialize Scene, Camera, Renderer
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 400;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0F172A');
    scene.fog = new THREE.FogExp2('#0F172A', 0.015);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight('#E2E8F0', 1.2);
    scene.add(ambientLight);

    const dirKeyLight = new THREE.DirectionalLight('#FFFFFF', 2.0);
    dirKeyLight.position.set(20, 40, 20);
    dirKeyLight.castShadow = true;
    dirKeyLight.shadow.mapSize.width = 1024;
    dirKeyLight.shadow.mapSize.height = 1024;
    scene.add(dirKeyLight);

    const dirRimLight = new THREE.DirectionalLight('#60A5FA', 1.4);
    dirRimLight.position.set(-25, 20, -25);
    scene.add(dirRimLight);

    // 5. Cadastral Ground Plane & Grid
    const groundGeo = new THREE.PlaneGeometry(36, 36);
    const groundMat = new THREE.MeshStandardMaterial({
      color: '#1E293B',
      roughness: 0.85,
      metalness: 0.1,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Parcel Boundary Wireframe
    const parcelGeo = new THREE.PlaneGeometry(24, 20);
    const parcelEdges = new THREE.EdgesGeometry(parcelGeo);
    const parcelLine = new THREE.LineSegments(
      parcelEdges,
      new THREE.LineBasicMaterial({ color: '#3B82F6', linewidth: 2 })
    );
    parcelLine.rotation.x = -Math.PI / 2;
    parcelLine.position.y = 0.02;
    scene.add(parcelLine);

    // Cadastral Corner Pins
    const pinGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 8);
    const pinMat = new THREE.MeshStandardMaterial({ color: '#60A5FA', emissive: '#1D4ED8' });
    [
      [-12, -10],
      [12, -10],
      [12, 10],
      [-12, 10],
    ].forEach(([px, pz]) => {
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.set(px, 0.2, pz);
      scene.add(pin);
    });

    // Subtle Cadastral Grid
    const grid = new THREE.GridHelper(36, 18, '#334155', '#1E293B');
    grid.position.y = 0.01;
    scene.add(grid);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate) {
        sphericalRef.current.theta += 0.005;
        updateCameraPosition();
      }

      // Smooth exploded lerp
      const explodeFactor = exploded ? 2.5 : 0;
      floorMeshesRef.current.forEach((item, index) => {
        const targetY = item.basePosY + index * explodeFactor;
        item.group.position.y += (targetY - item.group.position.y) * 0.1;
      });

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update Building Meshes when building changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !building) return;

    // Remove old floors
    floorMeshesRef.current.forEach((item) => {
      scene.remove(item.group);
      item.group.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
    });
    floorMeshesRef.current = [];

    const floorHeight = 1.8;
    const bldgWidth = 14;
    const bldgDepth = 12;

    building.floors.forEach((floor, idx) => {
      const group = new THREE.Group();
      const basePosY = idx * (floorHeight + 0.1) + floorHeight / 2 + 0.1;

      // Floor slab geometry
      const slabGeo = new THREE.BoxGeometry(bldgWidth, floorHeight, bldgDepth);

      // Glass and concrete materials
      const isSelected = floor.id === selectedFloorId;
      const isGround = idx === 0;

      const slabMat = new THREE.MeshStandardMaterial({
        color: isSelected
          ? '#3B82F6'
          : isGround
          ? '#334155'
          : idx % 2 === 0
          ? '#253347'
          : '#1E293B',
        roughness: 0.3,
        metalness: 0.2,
        transparent: true,
        opacity: selectedFloorId ? (isSelected ? 0.95 : 0.35) : 0.85,
        emissive: isSelected ? '#1E40AF' : '#000000',
        emissiveIntensity: isSelected ? 0.4 : 0,
      });

      const slabMesh = new THREE.Mesh(slabGeo, slabMat);
      slabMesh.castShadow = true;
      slabMesh.receiveShadow = true;
      slabMesh.userData = { floorId: floor.id, floorName: floor.floorName, floorNumber: floor.floorNumber };
      group.add(slabMesh);

      // Architectural Edge Linework
      const edgesGeo = new THREE.EdgesGeometry(slabGeo);
      const edgesMat = new THREE.LineBasicMaterial({
        color: isSelected ? '#93C5FD' : '#64748B',
        linewidth: isSelected ? 2 : 1,
      });
      const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
      group.add(edgesMesh);

      // Floor Partition divider bands (horizontal strip)
      const bandGeo = new THREE.BoxGeometry(bldgWidth + 0.3, 0.15, bldgDepth + 0.3);
      const bandMat = new THREE.MeshStandardMaterial({
        color: isSelected ? '#60A5FA' : '#475569',
        roughness: 0.5,
      });
      const bandMesh = new THREE.Mesh(bandGeo, bandMat);
      bandMesh.position.y = -floorHeight / 2;
      group.add(bandMesh);

      // Window mullions (vertical decorative lines)
      const mullionGeo = new THREE.BoxGeometry(0.12, floorHeight - 0.2, 0.12);
      const mullionMat = new THREE.MeshBasicMaterial({ color: isSelected ? '#93C5FD' : '#64748B' });
      for (let mx = -5; mx <= 5; mx += 2.5) {
        const mullionF = new THREE.Mesh(mullionGeo, mullionMat);
        mullionF.position.set(mx, 0, bldgDepth / 2 + 0.05);
        group.add(mullionF);

        const mullionB = new THREE.Mesh(mullionGeo, mullionMat);
        mullionB.position.set(mx, 0, -bldgDepth / 2 - 0.05);
        group.add(mullionB);
      }

      group.position.y = basePosY;
      scene.add(group);

      floorMeshesRef.current.push({
        id: floor.id,
        group,
        baseMesh: slabMesh,
        edgesMesh,
        basePosY,
      });
    });

    // Center camera on building center
    const totalHeight = building.floors.length * (floorHeight + 0.1);
    cameraTargetRef.current.set(0, totalHeight / 2, 0);
    updateCameraPosition();
  }, [building, selectedFloorId]);

  // Update Materials when selection or hover changes
  useEffect(() => {
    floorMeshesRef.current.forEach((item) => {
      const isSelected = item.id === selectedFloorId;
      const isHovered = item.id === hoveredFloor;
      const mat = item.baseMesh.material as THREE.MeshStandardMaterial;
      const edgeMat = item.edgesMesh.material as THREE.LineBasicMaterial;

      if (isSelected) {
        mat.color.set('#3B82F6');
        mat.emissive.set('#1D4ED8');
        mat.emissiveIntensity = 0.5;
        mat.opacity = 0.95;
        edgeMat.color.set('#BFDBFE');
      } else if (isHovered) {
        mat.color.set('#2563EB');
        mat.emissive.set('#1E3A8A');
        mat.emissiveIntensity = 0.25;
        mat.opacity = 0.75;
        edgeMat.color.set('#93C5FD');
      } else {
        mat.color.set(selectedFloorId ? '#1E293B' : '#334155');
        mat.emissive.set('#000000');
        mat.emissiveIntensity = 0;
        mat.opacity = selectedFloorId ? 0.35 : 0.85;
        edgeMat.color.set(selectedFloorId ? '#475569' : '#64748B');
      }
    });
  }, [selectedFloorId, hoveredFloor]);

  // Camera Orbit helper
  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { radius, theta, phi } = sphericalRef.current;
    const target = cameraTargetRef.current;

    cameraRef.current.position.set(
      target.x + radius * Math.sin(phi) * Math.sin(theta),
      target.y + radius * Math.cos(phi),
      target.z + radius * Math.sin(phi) * Math.cos(theta)
    );
    cameraRef.current.lookAt(target);
  };

  // Mouse & Touch Controls
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // 1. Orbit Rotation
    if (isDraggingRef.current) {
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      sphericalRef.current.theta -= deltaX * 0.008;
      sphericalRef.current.phi = Math.max(
        0.1,
        Math.min(Math.PI / 2 - 0.05, sphericalRef.current.phi - deltaY * 0.008)
      );

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      updateCameraPosition();
      return;
    }

    // 2. Raycaster Hover Detection
    if (!canvasRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const checkMeshes = floorMeshesRef.current.map((f) => f.baseMesh);
    const intersects = raycaster.intersectObjects(checkMeshes);

    if (intersects.length > 0) {
      const hitFloorId = intersects[0].object.userData.floorId;
      setHoveredFloor(hitFloorId);
      if (canvasRef.current) canvasRef.current.style.cursor = 'pointer';
    } else {
      setHoveredFloor(null);
      if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    isDraggingRef.current = false;

    // Check click hit
    if (!canvasRef.current || !cameraRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const checkMeshes = floorMeshesRef.current.map((f) => f.baseMesh);
    const intersects = raycaster.intersectObjects(checkMeshes);

    if (intersects.length > 0) {
      const hitFloorId = intersects[0].object.userData.floorId;
      if (hitFloorId) {
        onSelectFloor(hitFloorId);
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    sphericalRef.current.radius = Math.max(
      10,
      Math.min(60, sphericalRef.current.radius + e.deltaY * 0.03)
    );
    updateCameraPosition();
  };

  const resetCamera = () => {
    const totalHeight = (building?.floors.length || 4) * 1.9;
    cameraTargetRef.current.set(0, totalHeight / 2, 0);
    sphericalRef.current = {
      radius: 28,
      theta: Math.PI / 4,
      phi: Math.PI / 3,
    };
    updateCameraPosition();
  };

  const currentFloorObj = building?.floors.find((f) => f.id === selectedFloorId);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-[#0F172A] select-none ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

      {/* Clean HUD Top Left: Building / Floor status */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-1.5">
        <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 text-white">
          <div className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
            {building?.buildingName || 'Cadastral Structure'}
          </div>
          <div className="text-sm font-bold flex items-center gap-2">
            <span>{currentFloorObj ? currentFloorObj.floorName : 'All Floors View'}</span>
            {currentFloorObj && (
              <span className="text-xs font-normal text-slate-300">
                · {currentFloorObj.units.length} Units · {currentFloorObj.areaSqM} m²
              </span>
            )}
          </div>
        </div>

        {exploded && (
          <div className="bg-blue-900/80 backdrop-blur-md border border-blue-500/30 rounded-md px-2.5 py-1 text-xs text-blue-200 font-medium flex items-center gap-1.5 self-start">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>Exploded Strata Mode Active</span>
          </div>
        )}
      </div>

      {/* Floating HUD Bottom Bar Controls */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        {/* Interaction hints */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 bg-black/40 backdrop-blur-sm border border-white/5 px-2.5 py-1 rounded-md">
          <span>Drag: Rotate</span>
          <span>·</span>
          <span>Scroll: Zoom</span>
          <span>·</span>
          <span>Click: Select Floor</span>
        </div>

        {/* Action button cluster */}
        <div className="flex items-center gap-1.5 pointer-events-auto ml-auto">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg backdrop-blur-md border transition-colors flex items-center gap-1.5 ${
              autoRotate
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-black/50 border-white/10 text-slate-300 hover:text-white'
            }`}
            title="Auto-rotate building model"
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{autoRotate ? 'Stop' : 'Orbit'}</span>
          </button>

          <button
            onClick={onToggleExploded}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg backdrop-blur-md border transition-all flex items-center gap-1.5 shadow-sm ${
              exploded
                ? 'bg-blue-600 border-blue-400 text-white shadow-blue-500/20'
                : 'bg-black/60 border-white/15 text-slate-200 hover:text-white hover:bg-black/80'
            }`}
            title="Explode floors vertically for vertical inspection"
          >
            <Layers className="w-3.5 h-3.5 text-blue-300" />
            <span>{exploded ? 'Collapse 3D' : 'Exploded View'}</span>
          </button>

          <button
            onClick={resetCamera}
            className="p-1.5 text-xs font-medium rounded-lg bg-black/50 border border-white/10 text-slate-300 hover:text-white transition-colors"
            title="Reset 3D camera angle"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
