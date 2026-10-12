# BhuSetu 3D — 3D ULPIN Generation & Vertical Property Mapping System

> **“One Parcel. Every Floor. Every Property. One Digital Identity.”**

BhuSetu 3D is a cutting-edge 3D GIS-based property mapping and cadastral intelligence platform. It demonstrates how traditional 2D land-parcel identification systems (cadastres) can be modernized into a unified **3D digital property map**, connecting ground parcel boundaries to vertical buildings, physical floors, and individual deedable property units.

---

## 🌟 Core Value Proposition

Traditional property registries represent land solely in flat **2D space**. In modern high-density urban areas, a single 1,200 m² land parcel may contain a 10-story tower with dozens of discrete commercial shops, offices, and residential apartments. 

BhuSetu 3D establishes a unified digital hierarchy:

```
Cadastral Land Parcel (2D DGPS Boundary)
  └── Demo ULPIN (Deterministic Digital Identity)
       └── Building (Volumetric 3D Extrusion)
            └── Floor Strata (Zoning & Clearance Slabs)
                 └── Property Unit (Deed, Tax ID, Owner, Area)
```

---

## 🚀 Key Features

### 1. Interactive 2D/3D GIS Cadastral Dashboard
- **Leaflet Cadastral Map**: Multi-polygon boundary mapping color-coded by land use (*Residential, Commercial, Mixed Use, Institutional*), custom survey markers, hover tooltips, and Esri Satellite Imagery toggle.
- **Three.js 3D Architectural Extrusions**: Real-time volumetric visualization with wireframe boundary lines, corner cadastral pins, floor division bands, window mullions, and studio lighting.
- **Split 2D/3D View Mode**: Side-by-side synchronized view showing the 2D ground boundary on the left and the 3D vertical structure on the right.

### 2. Vertical Strata Explorer & Floor Slider
- **Vertical Floor Slider**: Top-down floor selector (*Floor $N$ down to Ground*) isolating the active floor with an architectural glow while dimming non-selected levels.
- **Exploded 3D View**: Smooth vertical separation along the Y-axis allowing thorough inspection of internal floor plates and units.
- **Interactive Strata Tree**: Interactive DOM tree navigation from parcel $\rightarrow$ building $\rightarrow$ floor $\rightarrow$ unit.

### 3. Deterministic Demo ULPIN Engine
- Computes deterministic, reproducible demonstration identifiers combining normalized state, district, tehsil, and a 32-bit cadastral coordinate hash (e.g., `CG-RPR-ARN-7F29A102`).
- **One-Click 3D Generation**: Instantly extrudes procedural structures and deedable units onto the live map.

### 4. Cadastral Governance & Export Tools
- **Side-by-Side Parcel Comparison**: Benchmark plot areas, floor heights, FAR/FSI consumed, built-up areas, and strata unit density.
- **Digital Property Certificate Card**: Standardized printable record card with simulated vector QR code, cadastral specifications, unit breakdown, and browser print/PDF integration.
- **Pre-populated Demo City**: 50+ pre-mapped parcels, 35+ buildings, 120+ vertical floors, and 300+ units across BhuSetu Smart District (Raipur / Atal Nagar sector).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React Icons
- **3D Graphics**: Three.js (WebGL rendering, custom orbit controls, raycaster picking, procedural geometry)
- **2D Mapping**: Leaflet with OpenStreetMap & Esri World Imagery tiles
- **State Management**: Zustand
- **Fonts**: Plus Jakarta Sans, Inter, JetBrains Mono

---

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun

### Installation

```bash
# Clone the repository
git clone <YOUR_GITHUB_REPO_URL>
cd bhusetu-3d

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## ⚠️ Hackathon Disclaimer

**BhuSetu 3D is a hackathon prototype** developed for research and technical demonstration. ULPINs generated in this application are demonstration identifiers based on transparent algorithmic hash functions and are **not official Government of India land records** or legal cadastral certificates.

---

## 📄 License

Apache-2.0
