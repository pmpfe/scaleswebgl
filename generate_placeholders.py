import math
import os

def write_obj(filename, vertices, faces, object_name="Object"):
    with open(filename, 'w') as f:
        f.write(f"o {object_name}\n")
        for v in vertices:
            f.write(f"v {v[0]:.4f} {v[1]:.4f} {v[2]:.4f}\n")
        for face in faces:
            f.write("f " + " ".join(str(idx + 1) for idx in face) + "\n")
    print(f"Generated {filename}")

def generate_sphere(radius=1.0, rings=12, sectors=24):
    vertices = []
    faces = []
    for r in range(rings + 1):
        for s in range(sectors):
            y = math.sin(-math.pi/2 + math.pi * r / rings) * radius
            x = math.cos(2 * math.pi * s / sectors) * math.sin(math.pi * r / rings) * radius
            z = math.sin(2 * math.pi * s / sectors) * math.sin(math.pi * r / rings) * radius
            vertices.append((x, y, z))
    
    for r in range(rings):
        for s in range(sectors):
            p1 = r * sectors + s
            p2 = r * sectors + (s + 1) % sectors
            p3 = (r + 1) * sectors + (s + 1) % sectors
            p4 = (r + 1) * sectors + s
            faces.append((p1, p2, p3, p4))
    return vertices, faces

def generate_icosahedron(radius=1.0):
    t = (1.0 + math.sqrt(5.0)) / 2.0
    vertices = [
        (-1, t, 0), (1, t, 0), (-1, -t, 0), (1, -t, 0),
        (0, -1, t), (0, 1, t), (0, -1, -t), (0, 1, -t),
        (t, 0, -1), (t, 0, 1), (-t, 0, -1), (-t, 0, 1)
    ]
    # Normalize to radius
    normalized_verts = []
    for v in vertices:
        length = math.sqrt(v[0]**2 + v[1]**2 + v[2]**2)
        normalized_verts.append((v[0]/length * radius, v[1]/length * radius, v[2]/length * radius))
    
    faces = [
        (0, 11, 5), (0, 5, 1), (0, 1, 7), (0, 7, 10), (0, 10, 11),
        (1, 5, 9), (5, 11, 4), (11, 10, 2), (10, 7, 6), (7, 1, 8),
        (3, 9, 4), (3, 4, 2), (3, 2, 6), (3, 6, 8), (3, 8, 9),
        (4, 9, 5), (2, 4, 11), (6, 2, 10), (8, 6, 7), (9, 8, 1)
    ]
    return normalized_verts, faces

def generate_dna(length=10.0, radius=2.0, turns=3):
    vertices = []
    faces = []
    segments = 40
    for i in range(segments + 1):
        angle = (i / segments) * turns * 2 * math.pi
        y = (i / segments) * length - (length / 2)
        
        # Strand 1
        x1 = math.cos(angle) * radius
        z1 = math.sin(angle) * radius
        vertices.append((x1, y, z1))
        
        # Strand 2 (offset by PI)
        x2 = math.cos(angle + math.pi) * radius
        z2 = math.sin(angle + math.pi) * radius
        vertices.append((x2, y, z2))
        
        # Add a "rung" (line) every few steps as a thin box
        if i % 4 == 0 and i < segments:
             # Just create simple cubes/boxes for rungs would be complex logic, 
             # keeping it to simple points/lines logic for obj is hard without thickness.
             # We will just generate the two strands as points for now (OBJ needs faces usually)
             pass

    # Simple approach: Create little cubes along the path
    vertices = []
    faces = []
    
    def add_cube(cx, cy, cz, size):
        start_idx = len(vertices)
        s = size / 2
        vs = [
            (cx-s, cy-s, cz-s), (cx+s, cy-s, cz-s), (cx+s, cy+s, cz-s), (cx-s, cy+s, cz-s),
            (cx-s, cy-s, cz+s), (cx+s, cy-s, cz+s), (cx+s, cy+s, cz+s), (cx-s, cy+s, cz+s)
        ]
        vertices.extend(vs)
        # 6 faces of cube
        fs = [
            (0,1,2,3), (7,6,5,4), (0,4,5,1), (1,5,6,2), (2,6,7,3), (3,7,4,0)
        ]
        for face in fs:
            faces.append(tuple(x + start_idx for x in face))

    for i in range(segments + 1):
        angle = (i / segments) * turns * 2 * math.pi
        y = (i / segments) * length - (length / 2)
        x1 = math.cos(angle) * radius
        z1 = math.sin(angle) * radius
        x2 = math.cos(angle + math.pi) * radius
        z2 = math.sin(angle + math.pi) * radius
        
        add_cube(x1, y, z1, 0.4)
        add_cube(x2, y, z2, 0.4)
        
        # Rungs
        if i % 2 == 0:
            mx, my, mz = (x1+x2)/2, y, (z1+z2)/2
            # Interpolate cubes across
            steps = 3
            for k in range(1, steps):
                t = k / steps
                lx = x1 + (x2-x1)*t
                ly = y
                lz = z1 + (z2-z1)*t
                add_cube(lx, ly, lz, 0.2)

    return vertices, faces

def generate_water_molecule():
    vertices = []
    faces = []
    
    def add_sphere(cx, cy, cz, r):
        v, f = generate_sphere(r, 8, 16)
        start_idx = len(vertices)
        for x, y, z in v:
            vertices.append((x + cx, y + cy, z + cz))
        for face in f:
            faces.append(tuple(idx + start_idx for idx in face))

    # Oxygen (Center)
    add_sphere(0, 0, 0, 1.0)
    # Hydrogens (Offset)
    angle = 104.5 * math.pi / 180 / 2
    dist = 1.5
    add_sphere(math.sin(angle)*dist, math.cos(angle)*dist, 0, 0.6)
    add_sphere(-math.sin(angle)*dist, math.cos(angle)*dist, 0, 0.6)
    
    return vertices, faces

def generate_tree():
    vertices = []
    faces = []
    
    # Trunk (Cylinder approx)
    trunk_h = 2.0
    trunk_r = 0.5
    segments = 8
    
    # Base circle
    for i in range(segments):
        ang = 2 * math.pi * i / segments
        vertices.append((math.cos(ang)*trunk_r, 0, math.sin(ang)*trunk_r))
    # Top circle of trunk
    for i in range(segments):
        ang = 2 * math.pi * i / segments
        vertices.append((math.cos(ang)*trunk_r, trunk_h, math.sin(ang)*trunk_r))
        
    # Trunk faces
    for i in range(segments):
        p1 = i
        p2 = (i + 1) % segments
        p3 = p2 + segments
        p4 = p1 + segments
        faces.append((p1, p2, p3, p4))
        
    # Leaves (Cone)
    leaves_base_y = trunk_h
    leaves_tip_y = trunk_h + 4.0
    leaves_r = 2.0
    
    base_start_idx = len(vertices)
    for i in range(segments):
        ang = 2 * math.pi * i / segments
        vertices.append((math.cos(ang)*leaves_r, leaves_base_y, math.sin(ang)*leaves_r))
    
    tip_idx = len(vertices)
    vertices.append((0, leaves_tip_y, 0))
    
    for i in range(segments):
        p1 = base_start_idx + i
        p2 = base_start_idx + ((i + 1) % segments)
        p3 = tip_idx
        faces.append((p1, p2, p3))
        
    return vertices, faces

# --- Execution ---
output_dir = "models/gemini"
os.makedirs(output_dir, exist_ok=True)

# Sun
v, f = generate_sphere(5.0, 24, 48) # Larger sphere
write_obj(f"{output_dir}/sun.obj", v, f, "Sun")

# Jupiter
v, f = generate_sphere(1.0, 24, 48)
write_obj(f"{output_dir}/jupiter.obj", v, f, "Jupiter")

# Virus
v, f = generate_icosahedron(1.0)
write_obj(f"{output_dir}/virus.obj", v, f, "Virus")

# DNA
v, f = generate_dna()
write_obj(f"{output_dir}/dna.obj", v, f, "DNA")

# Water
v, f = generate_water_molecule()
write_obj(f"{output_dir}/h2o_molecule.obj", v, f, "Water")
# Note: config uses .gltf for water usually, but we overwrite with obj or change config if needed.
# Since I copied a GLB earlier, I'll leave the OBJ as an option or overwrite if I convert.
# For now, let's keep the GLB I copied earlier as it's binary and smaller, but this OBJ is a good backup.

# Tree
v, f = generate_tree()
write_obj(f"{output_dir}/tree.obj", v, f, "Tree")

# Ant (Simplified: 3 spheres)
def generate_ant():
    vertices = []
    faces = []
    def add_sphere(cx, cy, cz, r, sx=1, sy=1, sz=1):
        v, f = generate_sphere(r, 8, 16)
        start_idx = len(vertices)
        for x, y, z in v:
            vertices.append((x*sx + cx, y*sy + cy, z*sz + cz))
        for face in f:
            faces.append(tuple(idx + start_idx for idx in face))
            
    add_sphere(0, 0, 0, 0.5) # Thorax
    add_sphere(0, 0, 0.8, 0.4) # Head
    add_sphere(0, 0, -1.0, 0.7, 1, 1, 1.5) # Abdomen
    return vertices, faces

v, f = generate_ant()
write_obj(f"{output_dir}/ant.obj", v, f, "Ant")

print("All procedural models generated.")
