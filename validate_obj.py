#!/usr/bin/env python3
"""
Utilitário para validar e normalizar modelos OBJ para Powers of Ten
"""

import sys
import math
import os

def read_obj(filename):
    """Lê um arquivo OBJ e retorna vértices e linhas/faces"""
    vertices = []
    lines = []
    faces = []
    
    try:
        with open(filename, 'r') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                
                parts = line.split()
                if not parts:
                    continue
                
                cmd = parts[0]
                
                if cmd == 'v':
                    # Vértice
                    x, y, z = float(parts[1]), float(parts[2]), float(parts[3])
                    vertices.append((x, y, z))
                elif cmd == 'l':
                    # Linha
                    indices = [int(p) - 1 for p in parts[1:]]
                    lines.append(indices)
                elif cmd == 'f':
                    # Face
                    indices = []
                    for p in parts[1:]:
                        # Suporta f v, f v/vt, f v/vt/vn, f v//vn
                        idx = int(p.split('/')[0]) - 1
                        indices.append(idx)
                    faces.append(indices)
    
    except Exception as e:
        print(f"❌ Erro ao ler {filename}: {e}")
        return None, None, None
    
    return vertices, lines, faces

def calculate_bounds(vertices):
    """Calcula o bounding box dos vértices"""
    if not vertices:
        return None
    
    min_x = min(v[0] for v in vertices)
    max_x = max(v[0] for v in vertices)
    min_y = min(v[1] for v in vertices)
    max_y = max(v[1] for v in vertices)
    min_z = min(v[2] for v in vertices)
    max_z = max(v[2] for v in vertices)
    
    return {
        'min': (min_x, min_y, min_z),
        'max': (max_x, max_y, max_z),
        'center': ((min_x + max_x) / 2, (min_y + max_y) / 2, (min_z + max_z) / 2),
        'size': (max_x - min_x, max_y - min_y, max_z - min_z)
    }

def normalize_vertices(vertices, bounds):
    """Normaliza vértices para ficar entre -1 e 1"""
    center = bounds['center']
    max_size = max(bounds['size'])
    
    if max_size == 0:
        return vertices
    
    normalized = []
    for v in vertices:
        x = (v[0] - center[0]) / (max_size / 2)
        y = (v[1] - center[1]) / (max_size / 2)
        z = (v[2] - center[2]) / (max_size / 2)
        normalized.append((x, y, z))
    
    return normalized

def write_obj(filename, vertices, lines, faces):
    """Escreve um arquivo OBJ"""
    try:
        with open(filename, 'w') as f:
            f.write("# Normalized by Powers of Ten utility\n\n")
            
            # Vértices
            f.write("# Vertices\n")
            for v in vertices:
                f.write(f"v {v[0]:.6f} {v[1]:.6f} {v[2]:.6f}\n")
            
            f.write("\n")
            
            # Linhas
            if lines:
                f.write("# Lines\n")
                for l in lines:
                    indices_str = ' '.join(str(i + 1) for i in l)
                    f.write(f"l {indices_str}\n")
            
            # Faces
            if faces:
                f.write("\n# Faces\n")
                for face in faces:
                    indices_str = ' '.join(str(i + 1) for i in face)
                    f.write(f"f {indices_str}\n")
        
        return True
    except Exception as e:
        print(f"❌ Erro ao escrever {filename}: {e}")
        return False

def validate_obj(filename):
    """Valida e mostra informações sobre um arquivo OBJ"""
    print(f"\n📊 Analisando: {filename}")
    print("=" * 60)
    
    vertices, lines, faces = read_obj(filename)
    
    if vertices is None:
        return False
    
    # Estatísticas
    print(f"✓ Vértices: {len(vertices)}")
    print(f"✓ Linhas: {len(lines)}")
    print(f"✓ Faces: {len(faces)}")
    
    # Calcular total de arestas
    total_edges = len(lines) * 2  # Aproximação
    for face in faces:
        total_edges += len(face)
    print(f"✓ Arestas aproximadas: {total_edges}")
    
    # Bounding box
    bounds = calculate_bounds(vertices)
    if bounds:
        print(f"\n📐 Bounding Box:")
        print(f"  Min: ({bounds['min'][0]:.3f}, {bounds['min'][1]:.3f}, {bounds['min'][2]:.3f})")
        print(f"  Max: ({bounds['max'][0]:.3f}, {bounds['max'][1]:.3f}, {bounds['max'][2]:.3f})")
        print(f"  Center: ({bounds['center'][0]:.3f}, {bounds['center'][1]:.3f}, {bounds['center'][2]:.3f})")
        print(f"  Size: ({bounds['size'][0]:.3f}, {bounds['size'][1]:.3f}, {bounds['size'][2]:.3f})")
        
        max_size = max(bounds['size'])
        print(f"  Max dimension: {max_size:.3f}")
        
        # Verificações
        print(f"\n🔍 Verificações:")
        
        is_centered = all(abs(c) < 0.1 for c in bounds['center'])
        if is_centered:
            print("  ✓ Objeto está centrado")
        else:
            print("  ⚠️  Objeto NÃO está centrado (considere normalizar)")
        
        is_normalized = max_size <= 2.0
        if is_normalized:
            print("  ✓ Objeto está normalizado")
        else:
            print("  ⚠️  Objeto NÃO está normalizado (considere normalizar)")
        
        vertex_count_ok = len(vertices) < 10000
        if vertex_count_ok:
            print("  ✓ Número de vértices OK para performance")
        else:
            print("  ⚠️  Muitos vértices! Considere simplificar (<10000)")
        
        if len(vertices) > 65535:
            print("  ❌ ERRO: Mais de 65535 vértices (limite do Uint16Array)")
            return False
    
    return True

def normalize_obj(input_file, output_file=None):
    """Normaliza um arquivo OBJ"""
    print(f"\n🔧 Normalizando: {input_file}")
    
    vertices, lines, faces = read_obj(input_file)
    
    if vertices is None:
        return False
    
    bounds = calculate_bounds(vertices)
    normalized_vertices = normalize_vertices(vertices, bounds)
    
    if output_file is None:
        base, ext = os.path.splitext(input_file)
        output_file = f"{base}_normalized{ext}"
    
    if write_obj(output_file, normalized_vertices, lines, faces):
        print(f"✓ Arquivo normalizado salvo em: {output_file}")
        return True
    
    return False

def main():
    """Função principal"""
    if len(sys.argv) < 2:
        print("""
╔════════════════════════════════════════════════════════════════╗
║  Powers of Ten - Utilitário de Validação de Modelos OBJ       ║
╚════════════════════════════════════════════════════════════════╝

Uso:
  python validate_obj.py <arquivo.obj> [opções]

Opções:
  --validate    Apenas valida o arquivo (padrão)
  --normalize   Normaliza o arquivo (centra e escala para -1 a 1)
  --output <arquivo>  Especifica arquivo de saída para normalização

Exemplos:
  python validate_obj.py models/dna.obj
  python validate_obj.py models/earth.obj --normalize
  python validate_obj.py models/city.obj --normalize --output models/city_norm.obj
        """)
        return
    
    input_file = sys.argv[1]
    
    if not os.path.exists(input_file):
        print(f"❌ Arquivo não encontrado: {input_file}")
        return
    
    # Validar sempre
    if not validate_obj(input_file):
        return
    
    # Normalizar se solicitado
    if '--normalize' in sys.argv:
        output_file = None
        if '--output' in sys.argv:
            output_idx = sys.argv.index('--output')
            if output_idx + 1 < len(sys.argv):
                output_file = sys.argv[output_idx + 1]
        
        normalize_obj(input_file, output_file)
    
    print("\n✓ Concluído!")

if __name__ == '__main__':
    main()
