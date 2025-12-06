# Quick Model Download Checklist

## Priority 1: Models Most Readily Available (Start Here)

| # | Object | Recommended Source | Search Term | Why Suitable |
|---|--------|-------------------|------------|-------------|
| 10 | Tennis Ball | Sketchfab + Procedural | "ball" or "sphere" | Simple sphere, easily textured |
| 18 | Earth Planet | Sketchfab | "Earth planet" or "globe" | Common, many free versions |
| 19 | Jupiter | Sketchfab | "Jupiter planet" | Similar to Earth, stylized versions available |
| 20 | Sun/Star | Sketchfab | "sun" or "star" | Simple glowing sphere |
| 11 | Human Figure | Quaternius/Sketchfab | "low-poly human" or "character" | Stylized low-poly versions widely available |
| 12 | Tree | CGTrader Free | "tree" or "conifer" | Multiple free options listed on CGTrader |
| 8 | Ant | Sketchfab | "ant insect" | Several free models available |
| 9 | Bee | Sketchfab | "bee insect" | Multiple versions found |

---

## Priority 2: Models with Good Alternatives (Secondary)

| # | Object | Best Source | Search Strategy | Alternative Approach |
|---|--------|-------------|-----------------|----------------------|
| 3 | DNA Helix | Sketchfab/YouTube tutorials | "DNA double helix" | Generate procedurally in Blender |
| 4 | Virus | Sketchfab | "bacteriophage" or "virus" | Procedural geometric shapes |
| 5 | Bacteria | Sketchfab | "bacteria e.coli" | Simple capsule with flagella |
| 6 | Human Cell | Sketchfab + Educational | "animal cell" or "cell structure" | Procedural sphere with organelles |
| 7 | Pollen | Sketchfab | "pollen grain" or "spore" | Bump-mapped sphere |
| 13 | Blue Whale | Sketchfab/Generic Fish | "whale" or "large fish" | Procedural fish mesh |
| 14 | Mountain | Sketchfab/Procedural | "mountain terrain" | Procedurally generated heightmap |

---

## Priority 3: Models Requiring Procedural Generation (DIY)

| # | Object | Complexity | Recommended Approach | Tools |
|---|--------|-----------|---------------------|-------|
| 1 | Hydrogen Atom | Low | Sphere (nucleus) + small sphere (electron) + torus (orbit) | Blender primitives or Three.js |
| 2 | Water Molecule | Low | 3 spheres positioned (1 O, 2 H) with bonds | Blender or procedural code |
| 15 | Small Town | High | Multiple building prefabs arranged in grid | Blender or game engine |
| 16 | Large City | Very High | Grid of building blocks, simplified/stylized | Procedural generation script |
| 17 | Country Map | High | GIS heightmap converted to 3D mesh | Natural Earth data + Blender |
| 21 | Solar System | Medium | Spheres (planets) on elliptical orbits + lines | Procedural orbital mechanics |
| 22 | Neptune Orbit | Low | Blue sphere + orbital path | Sphere + torus |
| 23 | Kuiper Belt | Medium | Sparse asteroid field (1000+ small objects) | Procedural particle system |
| 24 | Oort Cloud | Medium | Extremely sparse sphere of points | Procedural point cloud |
| 25 | Star Cluster | Medium | Sphere distribution of glowing points | Point lights or spheres |
| 26 | Nebula | High | Volumetric cloud with emission | Particle system + volumetric renderer |
| 27 | Galactic Arm | Medium | Spiral pattern extruded | Procedural spiral generator |
| 28 | Galaxy (Milky Way) | High | Spiral disk with arms and stars | Particle system or pre-made optimized |
| 29 | Local Group | Very High | Multiple galaxy objects positioned | Multiple galaxy models |
| 30 | Virgo Supercluster | Very High | Abstract web structure of galaxy nodes | Procedural network visualization |

---

## Direct Download Workflow

### For Each Model:

1. **Visit Primary Source** (Sketchfab, CGTrader, etc.)
2. **Search** using recommended search term
3. **Filter**:
   - License: Any (but verify CC license)
   - Format: GLTF/GLB preferred, OBJ acceptable
   - Downloadable: ✓ Yes
   - File Size: < 50 MB preferred
4. **Download** in GLTF or OBJ format
5. **Convert if needed** (using Blender)
6. **Save to**: `/home/paulo/code/scaleswebgl/models/`

### Directory Structure:
```
models/
├── atoms/
│   ├── hydrogen.glb
│   ├── water_molecule.glb
│   └── dna_helix.glb
├── biology/
│   ├── virus.glb
│   ├── bacteria.glb
│   ├── cell.glb
│   └── pollen.glb
├── animals/
│   ├── ant.glb
│   ├── bee.glb
│   └── whale.glb
├── objects/
│   ├── tennis_ball.glb
│   └── tree.glb
├── humans/
│   └── human_figure.glb
├── terrain/
│   ├── mountain.glb
│   ├── small_town.glb
│   ├── city.glb
│   ├── country_map.glb
│   └── landscape.glb
└── space/
    ├── earth.glb
    ├── jupiter.glb
    ├── neptune.glb
    ├── sun.glb
    ├── solar_system.glb
    ├── star_cluster.glb
    ├── nebula.glb
    ├── galaxy.glb
    ├── oort_cloud.glb
    └── virgo_supercluster.glb
```

---

## Specific Model Recommendations (When Available)

### High-Confidence Finds on Sketchfab:

**Earth**
- Search: "planet earth" 
- Filter: Downloadable
- Expected finds: 50+ models
- Recommended: Look for textured, UV-mapped spheres

**Sun**
- Search: "sun" + "star"
- Expected: 20+ models
- Recommendation: Choose one with emissive/glow shader

**Human Figure**
- Sketchfab: "low-poly human" → usually 10+ results
- Quaternius: Check "Characters" section (some free)
- CGTrader Free: "character human" section

**Tree**
- CGTrader Free: Confirmed available (Macedonian pine, etc.)
- Sketchfab: "tree" → many results
- Recommendation: Stylized low-poly versions for performance

**Ant**
- Sketchfab: "ant" + filter "Downloadable"
- Estimated results: 5-15 free models
- Look for: Game-ready versions with <5K triangles

---

## Testing in ScalesWebGL

### Load Order:
1. Simple geometry (sphere) → test loading
2. Single model (tennis ball) → test material/texture
3. Multiple models → test performance
4. Complex models → optimize if needed

### Quick WebGL Test:
```javascript
// In your objloader.js or similar
const loader = new GLTFLoader();
loader.load('models/tennis_ball.glb', function(gltf) {
    scene.add(gltf.scene);
});
```

---

## Optimization Checklist

For each downloaded model:
- [ ] Verify file format (GLTF/OBJ)
- [ ] Check file size (< 10 MB per model)
- [ ] Test loading in ScalesWebGL
- [ ] Measure frame rate (target: 60 FPS)
- [ ] If slow: Decimate model (reduce polycount)
- [ ] Re-test frame rate
- [ ] Document final polycount and performance

### Quick Decimation Command (Blender CLI):
```bash
blender -b model.blend -P decimate.py --render-frame 1
```

**decimate.py**:
```python
import bpy
mesh = bpy.context.object.data
bpy.ops.object.modifier_add(type='DECIMATE')
bpy.context.object.modifiers['Decimate'].ratio = 0.5
bpy.ops.object.modifier_apply(modifier='Decimate')
bpy.ops.wm.save_mainfile()
```

---

## License Documentation Template

Create a file for each model: `MODEL_NAME_LICENSE.txt`

```
Model Name: [Name]
Source: [Sketchfab/CGTrader/etc]
URL: [Direct link]
Artist: [Name if known]
License: [CC0/CC-BY/etc]
License URL: [Full license link]
Attribution: [Required if CC-BY]
Downloaded: [Date]
Format: [GLTF/OBJ/etc]
Polycount: [Approx triangles]
Notes: [Any conversions or modifications]
```

---

## Pro Tips

1. **Batch Download**: Save searches on Sketchfab/CGTrader to download multiple models in one session
2. **Keyword Variations**: Try variations ("ball"→"sphere", "insect"→"bug")
3. **Sort by Rating**: High-rated models usually higher quality
4. **Check Previews**: Always preview before download
5. **License First**: Read license BEFORE download to avoid issues
6. **Convert Formats**: Keep original + converted versions for flexibility
7. **Performance First**: Start with simple models, optimize later
8. **Batch Convert**: Convert multiple models to GLTF at once using Blender

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| File not downloading | Try different browser or mirror site |
| Format not available | Convert using Blender or online converter |
| Model too high-poly | Decimate in Blender (50-75% reduction) |
| Wrong scale | Scale in Blender before export |
| Missing textures | Bake textures or re-download with textures |
| Won't load in WebGL | Verify GLTF/OBJ format and file integrity |
| Low performance | Reduce polycount or use LOD system |

---

**Start Date**: Focus on Priority 1 models this week
**Target**: Have 10-15 working models loaded by end of week
**Success Criteria**: All models load, 60+ FPS on target hardware
