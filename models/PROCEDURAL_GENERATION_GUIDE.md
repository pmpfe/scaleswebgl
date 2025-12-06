# Procedurally Generating Models for ScalesWebGL

For models with limited or no free downloads (atoms, DNA, viruses, nebulae), this guide provides simple procedural generation approaches suitable for WebGL.

---

## Quick Reference: Which Models Need Procedural Generation

| Model | Why Procedural | Difficulty | Tools |
|-------|----------------|-----------|-------|
| Hydrogen Atom | Not pre-made; simple concept | ⭐ Easy | Three.js or Blender |
| Water Molecule (H2O) | Simple 3-atom structure | ⭐ Easy | Three.js or Blender |
| DNA Double Helix | Some pre-made but simpler to generate | ⭐⭐ Medium | Blender script or Three.js |
| Virus | Geometric patterns (icosahedron) | ⭐⭐ Medium | Blender or Three.js |
| Bacteria | Simple capsule geometry | ⭐ Easy | Three.js primitives |
| Human Cell | Complex but can simplify significantly | ⭐⭐ Medium | Blender |
| Pollen Grain | Bump-mapped sphere | ⭐ Easy | Three.js + texture |
| Mountain | Heightmap-based | ⭐⭐ Medium | Blender or procedural noise |
| Small Town | Grid of building blocks | ⭐⭐ Medium | Procedural generation script |
| Large City | Scaled version of town | ⭐⭐ Medium | Procedural + LOD system |
| Country Map | GIS data conversion | ⭐⭐⭐ Hard | Natural Earth data + Blender |
| Solar System | Orbital mechanics | ⭐⭐ Medium | Three.js with orbital math |
| Kuiper Belt | Asteroid field | ⭐ Easy | Procedural particle distribution |
| Oort Cloud | Sparse point cloud | ⭐ Easy | Procedural point generation |
| Star Cluster | Point light distribution | ⭐ Easy | Three.js lights |
| Nebula | Volumetric cloud | ⭐⭐⭐ Hard | Particle system or shader |
| Galaxy | Spiral disk + stars | ⭐⭐ Medium | Particle system |

---

## Simple Models (Three.js Only - No Blender Needed)

### 1. Hydrogen Atom

**Concept**: 1 proton (nucleus) + 1 electron in orbital

```javascript
// Simple Hydrogen Atom in Three.js
function createHydrogenAtom() {
    const group = new THREE.Group();
    
    // Nucleus (proton)
    const nucleusGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const nucleusMaterial = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    group.add(nucleus);
    
    // Electron cloud (orbital)
    const orbitalGeometry = new THREE.BufferGeometry();
    const points = [];
    const radius = 2;
    for (let i = 0; i < 128; i++) {
        const angle = (i / 128) * Math.PI * 2;
        points.push(
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
        );
    }
    orbitalGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(points), 3));
    const orbitalLine = new THREE.LineLoop(orbitalGeometry, new THREE.LineBasicMaterial({ color: 0x0000FF }));
    group.add(orbitalLine);
    
    // Electron
    const electronGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const electronMaterial = new THREE.MeshPhongMaterial({ color: 0x0000FF });
    const electron = new THREE.Mesh(electronGeometry, electronMaterial);
    electron.position.set(radius, 0, 0);
    group.add(electron);
    
    // Animate electron
    group.userData.animate = function(time) {
        electron.position.x = Math.cos(time) * radius;
        electron.position.z = Math.sin(time) * radius;
    };
    
    return group;
}
```

### 2. Water Molecule (H2O)

**Concept**: 1 oxygen (center) + 2 hydrogens + bonds

```javascript
function createWaterMolecule() {
    const group = new THREE.Group();
    
    // Oxygen atom (center)
    const oxygenGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const oxygenMaterial = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
    const oxygen = new THREE.Mesh(oxygenGeometry, oxygenMaterial);
    group.add(oxygen);
    
    // Hydrogen positions (asymmetric for realistic water shape)
    const h1Pos = new THREE.Vector3(-0.5, 0.7, 0);
    const h2Pos = new THREE.Vector3(0.5, 0.7, 0);
    
    // Hydrogen atoms
    const hydrogenGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const hydrogenMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
    
    const hydrogen1 = new THREE.Mesh(hydrogenGeometry, hydrogenMaterial);
    hydrogen1.position.copy(h1Pos);
    group.add(hydrogen1);
    
    const hydrogen2 = new THREE.Mesh(hydrogenGeometry, hydrogenMaterial);
    hydrogen2.position.copy(h2Pos);
    group.add(hydrogen2);
    
    // Bonds (lines from O to H)
    const bondGeometry = new THREE.BufferGeometry();
    bondGeometry.setAttribute('position', new THREE.BufferAttribute(
        new Float32Array([0, 0, 0, ...h1Pos.toArray()]), 3
    ));
    const bondLine1 = new THREE.Line(bondGeometry, new THREE.LineBasicMaterial({ color: 0x888888 }));
    group.add(bondLine1);
    
    const bondGeometry2 = new THREE.BufferGeometry();
    bondGeometry2.setAttribute('position', new THREE.BufferAttribute(
        new Float32Array([0, 0, 0, ...h2Pos.toArray()]), 3
    ));
    const bondLine2 = new THREE.Line(bondGeometry2, new THREE.LineBasicMaterial({ color: 0x888888 }));
    group.add(bondLine2);
    
    return group;
}
```

### 3. Simple Bacteria (E. coli)

**Concept**: Ellipsoid body + flagella

```javascript
function createBacteria() {
    const group = new THREE.Group();
    
    // Main body (ellipsoid - using scaled sphere)
    const bodyGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x00AA00 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.scale.set(2, 1, 1); // Elongate for rod shape
    group.add(body);
    
    // Flagella (simple cylinder/torus)
    const flagellaGeometry = new THREE.TorusGeometry(0.15, 0.05, 8, 32);
    const flagellaMaterial = new THREE.MeshPhongMaterial({ color: 0x0088CC });
    const flagella = new THREE.Mesh(flagellaGeometry, flagellaMaterial);
    flagella.position.set(-0.6, 0, 0);
    flagella.rotation.y = Math.PI / 2;
    group.add(flagella);
    
    // Animation
    group.userData.animate = function(time) {
        flagella.rotation.x += 0.05;
    };
    
    return group;
}
```

### 4. Tennis Ball

**Concept**: Yellow sphere + white curved stripe texture

```javascript
function createTennisBall() {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    
    // Create simple texture (procedural)
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Yellow background
    ctx.fillStyle = '#CCFF00';
    ctx.fillRect(0, 0, 512, 512);
    
    // White curved stripes
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.arc(256, 256, 150, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(256, 256, 120, 0, Math.PI * 2);
    ctx.stroke();
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshPhongMaterial({ map: texture });
    
    const ball = new THREE.Mesh(geometry, material);
    return ball;
}
```

### 5. Pollen Grain

**Concept**: Bumpy sphere

```javascript
function createPollenGrain() {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    
    // Create bumpy surface using Perlin noise
    const positions = geometry.attributes.position;
    const posArray = positions.array;
    const noiseScale = 0.2;
    
    for (let i = 0; i < posArray.length; i += 3) {
        const x = posArray[i];
        const y = posArray[i + 1];
        const z = posArray[i + 2];
        
        // Simple sine-based bump pattern
        const bump = 1 + 0.1 * Math.sin(x * 10) * Math.sin(y * 10) * Math.sin(z * 10);
        
        posArray[i] *= bump;
        posArray[i + 1] *= bump;
        posArray[i + 2] *= bump;
    }
    
    positions.needsUpdate = true;
    geometry.computeVertexNormals();
    
    const material = new THREE.MeshPhongMaterial({ 
        color: 0xFFDD88,
        wireframe: false
    });
    
    return new THREE.Mesh(geometry, material);
}
```

### 6. Simple Mountain

**Concept**: Cone or terrain-like mesh

```javascript
function createMountain() {
    // Create base terrain using PlaneGeometry with displacement
    const geometry = new THREE.PlaneGeometry(10, 10, 32, 32);
    
    const positions = geometry.attributes.position;
    const posArray = positions.array;
    
    // Create height variation
    for (let i = 0; i < posArray.length; i += 3) {
        const x = posArray[i];
        const y = posArray[i + 1];
        
        // Gaussian hill
        const distance = Math.sqrt(x * x + y * y);
        const height = Math.exp(-distance * distance / 10) * 3;
        
        posArray[i + 2] = height;
    }
    
    positions.needsUpdate = true;
    geometry.computeVertexNormals();
    
    const material = new THREE.MeshPhongMaterial({ 
        color: 0x8B7355,
        side: THREE.DoubleSide
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 4;
    
    return mesh;
}
```

### 7. Solar System

**Concept**: Multiple orbiting spheres

```javascript
function createSolarSystem() {
    const group = new THREE.Group();
    
    // Sun
    const sunGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sunMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xFFDD00,
        emissive: 0xFFDD00
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    group.add(sun);
    
    // Planets data: [name, size, distance, color, speed]
    const planets = [
        ['Mercury', 0.05, 2, 0x888888, 0.04],
        ['Venus', 0.08, 3, 0xFFDD00, 0.015],
        ['Earth', 0.1, 4, 0x0066FF, 0.01],
        ['Mars', 0.07, 5, 0xFF6644, 0.008],
        ['Jupiter', 0.2, 7, 0xFFDD88, 0.002],
        ['Saturn', 0.18, 9, 0xCCBB99, 0.0009]
    ];
    
    const planetMeshes = [];
    
    planets.forEach(([name, size, distance, color, speed]) => {
        const geometry = new THREE.SphereGeometry(size, 16, 16);
        const material = new THREE.MeshPhongMaterial({ color });
        const planet = new THREE.Mesh(geometry, material);
        
        // Store orbital data
        planet.userData = { distance, speed, angle: 0 };
        planetMeshes.push(planet);
        group.add(planet);
        
        // Orbital line
        const orbitalGeometry = new THREE.BufferGeometry();
        const points = [];
        for (let i = 0; i <= 64; i++) {
            const angle = (i / 64) * Math.PI * 2;
            points.push(
                Math.cos(angle) * distance,
                0,
                Math.sin(angle) * distance
            );
        }
        orbitalGeometry.setAttribute('position', 
            new THREE.BufferAttribute(new Float32Array(points), 3));
        const orbitalLine = new THREE.LineLoop(
            orbitalGeometry, 
            new THREE.LineBasicMaterial({ color: 0x444444 })
        );
        group.add(orbitalLine);
    });
    
    // Animation
    group.userData.animate = function(time) {
        planetMeshes.forEach(planet => {
            planet.userData.angle += planet.userData.speed;
            planet.position.x = Math.cos(planet.userData.angle) * planet.userData.distance;
            planet.position.z = Math.sin(planet.userData.angle) * planet.userData.distance;
        });
    };
    
    return group;
}
```

### 8. Star Cluster

**Concept**: Multiple glowing spheres

```javascript
function createStarCluster() {
    const group = new THREE.Group();
    
    // Generate random star positions
    for (let i = 0; i < 100; i++) {
        const size = Math.random() * 0.3 + 0.05;
        const geometry = new THREE.SphereGeometry(size, 8, 8);
        
        // Yellow to white colors
        const hue = 0.1 + Math.random() * 0.1;
        const color = new THREE.Color().setHSL(hue, 1, 0.7);
        
        const material = new THREE.MeshPhongMaterial({ 
            color,
            emissive: color
        });
        const star = new THREE.Mesh(geometry, material);
        
        // Random position in sphere
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = 5 + Math.random() * 5;
        
        star.position.set(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );
        
        group.add(star);
    }
    
    return group;
}
```

---

## Medium Complexity Models (Requires Blender)

### 1. DNA Double Helix

**Blender Python Script**:

```python
import bpy
import math

# Clear default scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Create DNA helix using curve
curve_data = bpy.data.curves.new('DNA', type='CURVE')
curve_data.dimensions = '3D'
polyline = curve_data.splines.new('BEZIER')
polyline.bezier_points.add(199)

# Generate helix points
for i in range(200):
    t = i / 20.0
    x = 2 * math.cos(t)
    y = t / 2.0
    z = 2 * math.sin(t)
    
    point = polyline.bezier_points[i]
    point.co = (x, y, z, 1)

# Convert to mesh
curve_obj = bpy.data.objects.new('DNA', curve_data)
bpy.context.collection.objects.link(curve_obj)

# Add thickness to curve
curve_data.bevel_depth = 0.3
curve_data.resolution_u = 8

# Export as glTF
bpy.ops.export_scene.gltf(filepath='DNA.glb', use_format='GLB')
```

### 2. Simple Virus (Icosahedron)

**Blender Python Script**:

```python
import bpy

# Clear default
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Add icosphere (virus-like shape)
bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=(0,0,0))
virus = bpy.context.active_object

# Convert to icosphere for virus-like shape
bpy.context.view_layer.objects.active = virus
virus.select_set(True)
bpy.ops.object.shade_smooth()

# Add bumps (uses displacement)
bpy.ops.object.modifier_add(type='DISPLACE')
displace = virus.modifiers['Displace']

# Create cloud texture for bumps
cloud_texture = bpy.data.textures.new('CloudTexture', type='CLOUDS')
displace.texture = cloud_texture
displace.strength = 0.2

# Material
material = bpy.data.materials.new('VirusMaterial')
material.use_nodes = True
material.node_tree.nodes['Principled BSDF'].inputs[0].default_value = (0.8, 0.2, 0.2, 1.0)  # Red

virus.data.materials.append(material)

# Export
bpy.ops.export_scene.gltf(filepath='virus.glb', use_format='GLB')
```

### 3. Human Cell (Cross-Section)

**Blender: Manual approach**:
1. Create sphere (cell body)
2. Cut in half (Boolean modifier)
3. Add internal organelles (small spheres/torus shapes)
4. Use transparency for nucleus
5. Color-code components

---

## Complex Models (Procedural Generation + Shaders)

### 1. Nebula (Requires Particle System)

```javascript
// Three.js nebula using particles
function createNebula() {
    const particlesGeometry = new THREE.BufferGeometry();
    
    const particleCount = 10000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        // Spherical distribution
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const radius = Math.pow(Math.random(), 0.33) * 10;
        
        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi);
        
        // Color gradient (blue/purple)
        const hue = Math.random() * 0.2 + 0.6;
        const color = new THREE.Color().setHSL(hue, 1, 0.5);
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
    }
    
    particlesGeometry.setAttribute('position', 
        new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', 
        new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true
    });
    
    return new THREE.Points(particlesGeometry, material);
}
```

---

## Export to ScalesWebGL

### Blender Export Settings:

1. File → Export As → glTF Binary (.glb)
2. Settings:
   - Format: glTF Binary (.glb)
   - Include: Meshes, Materials, Textures
   - Export: All shapes ✓
   - Animations: Include if applicable
   - Scale: 1.0

### Save to Project:

```bash
# Copy to models directory
cp ~/Downloads/model_name.glb /home/paulo/code/scaleswebgl/models/procedural/
```

---

## Loading in ScalesWebGL

```javascript
// In your objloader.js or main.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();

// Load procedurally generated model
gltfLoader.load('models/procedural/hydrogen_atom.glb', (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    
    // Animate if has animation data
    if (model.userData.animate) {
        function animate(time) {
            model.userData.animate(time);
        }
    }
});
```

---

## Performance Optimization

| Model | Polycount | Optimization |
|-------|-----------|--------------|
| Hydrogen Atom | 100-200 | Already optimized |
| Water Molecule | 400-600 | Already optimized |
| Bacteria | 500-1000 | Already optimized |
| DNA Helix | 5000-10000 | Reduce segments |
| Virus | 2000-5000 | Reduce icosphere subdiv |
| Star Cluster | 10000-100000 | Use instancing |
| Galaxy | 50000+ | Use particle system |

---

## Summary

**Recommended Procedural Workflow**:
1. Simple models → Use Three.js directly (atoms, molecules, clusters)
2. Complex static → Generate in Blender, export to GLTF
3. Very complex → Use particle systems and shaders
4. Keep polycount < 100K per object for 60 FPS target

**Time Estimates**:
- Three.js simple models: 30 mins
- Blender complex models: 1-2 hours
- Particle/shader effects: 2+ hours

**Start with**: Hydrogen, Water, Tennis Ball, Earth
**Then add**: DNA, Virus, Mountain, Solar System
**Finally**: Galaxy, Nebula, City (time-permitting)
