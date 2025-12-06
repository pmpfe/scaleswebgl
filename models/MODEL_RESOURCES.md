# Free 3D Model Resources for ScalesWebGL

This document provides a comprehensive list of free 3D models suitable for the ScalesWebGL project, organized by object category. All models are recommended to be simple, low-polygon for optimal performance.

## Key Sources

- **Sketchfab** (https://sketchfab.com) - Filter by "Downloadable" and look for CC licenses
- **CGTrader Free** (https://www.cgtrader.com/free-3d-models) - 150K+ free models
- **TurboSquid Free** (https://www.turbosquid.com/Search/3D-Models/free) - Professional free models
- **Free3D** (https://www.free3d.com) - Community 3D models
- **Quaternius** (https://quaternius.com) - Low-poly free assets (some paid)
- **Poly Haven** (https://polyhaven.com/models) - CC0 models
- **Thingiverse** (https://www.thingiverse.com) - 3D printing models (often convertible)

---

## Model Recommendations by Category

### 1. **Hydrogen Atom**
- **Source**: Procedurally Generated (Recommended)
- **Reason**: Atomic models are rarely pre-made; simple sphere with orbital electrons works best
- **Alternative**: Search "atom structure" on Sketchfab
- **Format**: Generate with simple OBJ or use GLTF sphere primitive
- **DIY Approach**: 
  - Nucleus: 1 sphere (center)
  - Electron: 1 small sphere on orbital path
  - Orbital: Simple torus or line
  
### 2. **Water Molecule (H2O)**
- **Sketchfab Search**: "molecule water h2o"
- **Recommended Model**: "H2O Water Molecule" or similar chemistry models
- **Format**: OBJ/GLTF
- **Alternative**: Procedurally generate with 3 spheres (1 oxygen, 2 hydrogen)
- **Direct Resource**: Search Sketchfab with filter "Animated" OFF, License "Any"

### 3. **DNA Double Helix**
- **Sketchfab Search**: "DNA helix structure"
- **Top Options**: "DNA Strand", "Double Helix DNA Model"
- **CGTrader**: Search "DNA" under science category
- **Format**: OBJ/GLTF
- **Performance Note**: Pre-made models can be high-poly; request low-poly versions
- **Alternative**: Search "nucleotide chain" or "molecular biology"

### 4. **Virus/Bacteriophage**
- **Sketchfab Search**: "virus", "bacteriophage", "coronavirus"
- **Notable Models**: T4 Bacteriophage structures available
- **CGTrader**: Search "virus structure"
- **Format**: OBJ/GLTF
- **Recommendation**: T4 Bacteriophage (distinctive icosahedral + tail shape)
- **Performance**: May need decimation (reduce polycount)

### 5. **Bacteria (E. coli)**
- **Sketchfab Search**: "bacteria", "e.coli", "bacillus"
- **Format**: OBJ/GLTF
- **Recommended Shape**: Rod-shaped (prolate spheroid)
- **DIY Alternative**: Simple ellipsoid/capsule with flagella details
- **Model Note**: Many science education sites have simplified versions

### 6. **Human Cell**
- **Sketchfab Search**: "cell biology", "animal cell", "human cell structure"
- **Key Features**: Nucleus, mitochondria, organelles
- **Format**: OBJ/GLTF
- **Recommended**: Cross-section view or transparent cutaway
- **Performance**: Complex - look for simplified educational models
- **CGTrader**: Search "cell structure" or "animal cell diagram"

### 7. **Pollen Grain**
- **Sketchfab Search**: "pollen", "pollen grain", "spore"
- **Format**: OBJ/GLTF
- **Characteristic**: Spiky/bumpy spherical shape
- **Alternative**: Procedurally generated bump-mapped sphere
- **Resources**: Botanical 3D model collections

### 8. **Ant**
- **Sketchfab Search**: "ant", "insect", "arthropod"
- **Top Sources**: 
  - Sketchfab: Search "ant" (filter: Downloadable)
  - CGTrader: Animal section
  - Quaternius: Has some low-poly insects (check free pack)
- **Format**: OBJ/GLTF
- **Performance**: Look for low-poly game-ready versions
- **Recommended Polycount**: 1000-5000 triangles

### 9. **Bee**
- **Sketchfab Search**: "bee", "honey bee", "insect"
- **Top Model**: Search for "bee 3D model" with CC license
- **Format**: OBJ/GLTF
- **Features**: Wings, stripes, antennae
- **Polycount**: 2000-8000 triangles for good detail
- **Alternative**: "Wasp" or generic flying insect models

### 10. **Tennis Ball**
- **Sketchfab Search**: "tennis ball", "ball", "sphere"
- **Simple Option**: UV-textured sphere (yellow with curved stripes)
- **Format**: OBJ/GLTF
- **Polycount**: Low (sphere primitive sufficient)
- **Texture**: Download from Polyhaven or create simple 2D stripe pattern
- **DIY**: Basic sphere with yellow material + white stripe texture

### 11. **Human Figure**
- **Sketchfab Search**: "human figure", "man", "woman", "low-poly character"
- **Quaternius**: Excellent low-poly character packs (some free)
- **Format**: OBJ/GLTF
- **Recommended**: 
  - "Low Poly Human" 
  - "Stylized Character"
  - Simple rigged or non-rigged versions
- **Polycount**: 5000-15000 for recognizable but performant
- **License**: Ensure CC/free commercial use

### 12. **Tree**
- **CGTrader Search**: "tree", "conifer", "oak", "pine"
- **Available Free Models**:
  - Conifer - Macedonian pine
  - Snow-Covered Trees Stylized Winter Nature
  - Various XfrogPlants models
- **Sketchfab**: "tree", "forest", "vegetation"
- **Format**: OBJ/GLTF
- **Quaternius**: Nature pack may have stylized trees
- **Recommendation**: Stylized low-poly tree ~3000-8000 triangles

### 13. **Blue Whale**
- **Sketchfab Search**: "whale", "marine animal", "sea creature"
- **Alternative Searches**: 
  - "fish", "large fish" 
  - "whale shark"
  - "sea animal"
- **CGTrader Search**: "whale", "marine life"
- **Format**: OBJ/GLTF
- **If Unavailable**: Use generic fish/whale procedural alternative
- **DIY Option**: Elongated ellipsoid with fins

### 14. **Mountain**
- **Sketchfab Search**: "mountain", "terrain", "landscape"
- **CGTrader Search**: "mountain", "heightmap terrain"
- **Format**: OBJ/GLTF (terrain often uses heightmaps)
- **Recommendation**: Single low-poly mountain peak (5000-20000 triangles)
- **Alternative**: Procedurally generated with Perlin noise or Unity terrain

### 15. **Small Town/City (Low-Density)**
- **Sketchfab Search**: "village", "town", "small city", "low-poly town"
- **CGTrader Search**: "town", "village buildings"
- **Format**: OBJ/GLTF
- **Recommended Models**:
  - "Low Poly Town"
  - "Stylized Village"
  - "Simple Buildings Collection"
- **Polycount**: 20000-50000 total (multiple buildings)
- **Note**: May be multiple objects to combine

### 16. **Large City**
- **Sketchfab Search**: "city", "urban", "metropolis", "low-poly city"
- **CGTrader**: "city", "cityscape", "urban environment"
- **Format**: OBJ/GLTF
- **Challenge**: Extremely high polycount - look for:
  - Pre-optimized game-ready versions
  - Stylized/low-poly interpretations
  - Voxel-based cities
- **Alternatives**:
  - Procedurally generate with grid of buildings
  - Use multiple simplified building prefabs
- **Resources**: Game asset stores often have optimized versions

### 17. **Country Map**
- **Source Recommendation**: Procedurally Generated or Procedural GIS Data
- **Sketchfab Search**: "country map", "world map", "map model", "geography"
- **Format**: OBJ/GLTF (usually flat with height variation)
- **Resources**:
  - Natural Earth (naturalearthdata.com) - GIS data convertible to 3D
  - Thingiverse: "country map" (3D printing models)
  - CGTrader: "map", "geography"
- **DIY Approach**: 
  - Import GIS heightmap
  - Convert to mesh in Blender
  - Simplify/decimate for performance

### 18. **Earth Planet**
- **Sketchfab Search**: "Earth", "planet Earth", "globe"
- **Top Models**: Multiple "Planet Earth" with textures available
- **CGTrader Search**: "Earth planet", "globe"
- **Format**: OBJ/GLTF
- **Recommended**: UV-textured sphere with blue/green/brown materials
- **Polycount**: 2000-10000 for good visual quality
- **Texture Source**: Polyhaven.com has CC0 Earth textures
- **Famous Resources**:
  - NASA's Blue Marble texture
  - Polyhaven Earth materials

### 19. **Jupiter Planet**
- **Sketchfab Search**: "Jupiter", "planet Jupiter", "gas giant"
- **CGTrader Search**: "Jupiter planet"
- **Format**: OBJ/GLTF
- **Characteristics**: Orange/tan bands with Great Red Spot
- **Polycount**: 2000-8000 sphere with bands/texture
- **Material**: Procedural stripes or texture map
- **Alternative**: Simple orange sphere with bands texture

### 20. **Sun (Star)**
- **Sketchfab Search**: "sun", "star", "sphere emissive"
- **CGTrader Search**: "sun", "star"
- **Format**: OBJ/GLTF
- **Characteristics**: Yellow/white glowing sphere
- **Material Properties**: 
  - Emissive material (glowing)
  - High brightness
- **Polycount**: 1000-4000 (simple sphere)
- **Shader Note**: May need emission/glow shader in scene

### 21. **Solar System Diagram**
- **Sketchfab Search**: "solar system", "planetary system", "orbit"
- **Format**: OBJ/GLTF (usually multiple objects)
- **Recommendation**: Complete models with planets + orbits
- **Complexity**: Multiple objects (Sun + 8+ planets + orbital paths)
- **Alternative**: Procedurally generate with correct orbital mechanics
- **Visualization**: Look for educational/to-scale versions

### 22. **Neptune Orbit**
- **Sketchfab Search**: "Neptune", "Neptune orbit", "outer planets"
- **CGTrader Search**: "Neptune planet"
- **Format**: OBJ/GLTF
- **Characteristics**: Blue/cyan sphere
- **Material**: Similar to Earth but more uniform blue color
- **Polycount**: 2000-6000
- **Note**: Often part of solar system models

### 23. **Kuiper Belt Diagram**
- **Sketchfab Search**: "Kuiper Belt", "asteroid field", "debris field"
- **Format**: OBJ/GLTF (particle system or objects)
- **Alternative**: Procedurally generate asteroid field
- **DIY Approach**:
  - Generate 1000+ small random sphere/rock models
  - Place in torus orbit around sun
  - Use particle system or instancing
- **Resource**: Limited pre-made models; mostly DIY needed

### 24. **Oort Cloud Diagram**
- **Source**: Procedurally Generated (Recommended)
- **Sketchfab Search**: "Oort cloud", "comet cloud"
- **DIY Approach**:
  - Spherical distribution of 1000+ tiny particles
  - Very sparse distribution (larger radius)
  - Represent as dots or simple spheres
- **Challenge**: Visual representation challenging at scale
- **Alternative**: Iconic 2D cross-section with 3D interpretation

### 25. **Star Cluster**
- **Sketchfab Search**: "star cluster", "globular cluster", "open cluster"
- **Format**: OBJ/GLTF or particle data
- **Models**: Some pre-made clusters available
- **Alternative**: Procedurally generate with:
  - Sphere distribution of point lights/spheres
  - Varying sizes for brightness variation
- **Recommended**: "Pleiades" or "Orion Cluster" models if available

### 26. **Nebula**
- **Sketchfab Search**: "nebula", "gas cloud", "Orion Nebula"
- **Format**: GLTF (with volumetric rendering) or OBJ (sculpted)
- **Visualization Challenge**: Nebulae typically need:
  - Volumetric rendering
  - Emission materials
  - Particle systems
- **Models Available**: Some stylized nebula sculptures on Sketchfab
- **DIY Approach**: Volumetric texture + particle effects

### 27. **Galactic Arm Diagram**
- **Sketchfab Search**: "galaxy arm", "spiral arm", "galactic structure"
- **Format**: OBJ/GLTF or procedural
- **Typical Representation**: Flat spiral disk with arms
- **Alternative**: 2D spiral extruded to 3D
- **Resource**: Limited pre-made; usually procedurally created

### 28. **Galaxy (Milky Way)**
- **Sketchfab Search**: "galaxy", "Milky Way", "spiral galaxy"
- **CGTrader Search**: "galaxy", "milky way"
- **Format**: OBJ/GLTF
- **Top Models**: 
  - "Milky Way Galaxy"
  - "Spiral Galaxy"
  - "Galaxy Model"
- **Challenge**: Often high-poly for detail; may need decimation
- **Alternative**: Texture-mapped flat disk or particle system
- **Polycount**: 10000-100000 (highly variable)

### 29. **Local Group of Galaxies**
- **Source**: Procedurally Generated (Recommended)
- **Sketchfab Search**: "Local Group", "galaxies", "galaxy cluster"
- **Components**: Milky Way, Andromeda, Triangulum + 50+ dwarf galaxies
- **DIY Approach**:
  - Use galaxy models (repeated/scaled)
  - Position according to known distances
  - Create orbital system
- **Visualization**: Challenging at true scale; usually stylized

### 30. **Virgo Supercluster**
- **Source**: Procedurally Generated (Strongly Recommended)
- **Challenge**: Extreme scale (over 300 million light-years)
- **DIY Approach**:
  - Stylized representation of galaxy clusters
  - Grid or web-like structure
  - Spheres/nodes representing Local Groups
  - Not realistic 3D model; more abstract visualization
- **Alternative**: Use 2D tree/web structure with selective 3D elements

---

## Download & Format Conversion Guide

### Recommended Download Workflow:

1. **Visit Source Website** (Sketchfab, CGTrader, etc.)
2. **Check License**: Ensure CC0 or CC-BY (free commercial use)
3. **Download Files**: Select OBJ or GLTF format
4. **If Format Not Available**:
   - Download available format (FBX, 3DS, Blend, STL, DAE)
   - Convert using: 
     - Blender (free, open-source)
     - Online converters (CloudConvert, Online-Convert)
     - Assimp command-line tool

### Format Priorities:
1. **GLTF/GLB** (Recommended for WebGL) - Includes materials
2. **OBJ + MTL** (Compatible) - Needs separate material file
3. **FBX** (Convert to GLTF using Blender)
4. **Blend** (Blender native - export to GLTF)

### Blender Export to GLTF:
```
File → Export As → glTF Binary (.glb)
Settings:
  - Format: glTF Binary
  - Include: Meshes, Materials, Animations (if applicable)
  - Scale: 1.0
```

---

## Performance Optimization Tips

### Triangle Count Guidelines:
- **Simple Objects** (atoms, molecules): 100-1,000 triangles
- **Recognizable Objects** (balls, insects): 1,000-10,000 triangles
- **Complex Objects** (humans, trees): 5,000-50,000 triangles
- **Scenes** (city, landscape): 50,000-500,000 triangles total

### Optimization Techniques:
1. **Decimate Modifier** (Blender): Reduce polycount by 50-90%
2. **Level of Detail (LOD)**: Multiple mesh versions for distance
3. **Texture Baking**: Replace materials with textures
4. **Combine Meshes**: Merge multiple objects into single mesh
5. **Remove Unnecessary Details**: Delete internal geometry

### Tools for Decimation:
- Blender: Modifiers → Decimate
- MeshLab: Filters → Mesh → Simplification
- Instant Meshes: Automatic retopology

---

## Legal & License Considerations

### Recommended Licenses:
- **CC0** (Public Domain) - Best option
- **CC-BY** (Attribution required) - Note source
- **CC-BY-SA** - Must share modifications
- **CC-BY-NC** - Non-commercial (check project use)

### License Checklist:
- [ ] Check license before downloading
- [ ] Read specific license terms
- [ ] Ensure commercial use allowed
- [ ] Keep attribution file with model
- [ ] Note license in documentation

---

## Quick Reference Links

| Source | URL | Content | Format |
|--------|-----|---------|--------|
| Sketchfab | https://sketchfab.com | 1M+ models | OBJ, GLTF, FBX |
| CGTrader Free | https://cgtrader.com/free-3d-models | 150K+ free | OBJ, FBX, 3DS |
| TurboSquid Free | https://turbosquid.com/Search/3D-Models/free | Professional | Various |
| Free3D | https://free3d.com | Community | Various |
| Quaternius | https://quaternius.com | Low-poly assets | OBJ, GLTF |
| Poly Haven | https://polyhaven.com/models | CC0 models | GLTF, OBJ |
| Thingiverse | https://thingiverse.com | 3D printing | STL, OBJ |
| Polyhaven Textures | https://polyhaven.com | Textures/materials | PNG, EXR |
| Poly Haven HDRI | https://polyhaven.com/hdris | Lighting | EXR, HDR |

---

## Next Steps

1. **Start Downloads**: Begin with most essential models (1, 2, 11, 18)
2. **Test Integration**: Load each model into ScalesWebGL project
3. **Optimize**: Decimate models as needed for performance
4. **Create Variants**: Generate procedural versions where needed
5. **Document**: Track sources and licenses for each model

---

## Additional Resources

- **Blender 3D**: https://www.blender.org - Free modeling/animation
- **MeshLab**: https://www.meshlab.net - Mesh processing
- **Assimp**: https://assimp-docs.readthedocs.io - Model conversion CLI
- **WebGL Loaders**: Three.js has built-in GLTF/OBJ loaders
- **Texture Resources**: 
  - Polyhaven: https://polyhaven.com (CC0)
  - Sketchfab Textures: Free textures available
  - Textura: https://www.textura.pro

---

**Last Updated**: December 2025
**Recommendation**: Start with simple procedurally generated models (atoms, molecules, simple planets) 
and gradually add more complex pre-made models as time permits.
