#!/usr/bin/env python3
"""
Utilitário para validar todos os modelos OBJ, GLTF e GLB para Cosmic Scales
"""

import sys
import os
import json
import struct
import glob

def validate_obj(filename):
    """Valida um arquivo OBJ usando a lógica existente"""
    print(f"\n📊 Analisando OBJ: {filename}")
    print("=" * 60)

    try:
        vertices = []
        lines = []
        faces = []

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
                    if len(parts) >= 4:
                        x, y, z = float(parts[1]), float(parts[2]), float(parts[3])
                        vertices.append((x, y, z))
                elif cmd == 'l':
                    # Linha
                    indices = [int(p.split('/')[0]) - 1 for p in parts[1:]]
                    lines.append(indices)
                elif cmd == 'f':
                    # Face
                    indices = []
                    for p in parts[1:]:
                        idx = int(p.split('/')[0]) - 1
                        indices.append(idx)
                    faces.append(indices)

        # Estatísticas básicas
        print(f"✓ Vértices: {len(vertices)}")
        print(f"✓ Linhas: {len(lines)}")
        print(f"✓ Faces: {len(faces)}")

        if len(vertices) == 0:
            print("  ❌ ERRO: Nenhum vértice encontrado!")
            return False

        # Calcular bounding box
        if vertices:
            min_x = min(v[0] for v in vertices)
            max_x = max(v[0] for v in vertices)
            min_y = min(v[1] for v in vertices)
            max_y = max(v[1] for v in vertices)
            min_z = min(v[2] for v in vertices)
            max_z = max(v[2] for v in vertices)

            center = ((min_x + max_x) / 2, (min_y + max_y) / 2, (min_z + max_z) / 2)
            size = (max_x - min_x, max_y - min_y, max_z - min_z)
            max_size = max(size)

            print(f"📐 Bounding Box - Max dimension: {max_size:.3f}")

            # Verificações
            is_centered = all(abs(c) < 0.1 for c in center)
            if is_centered:
                print("  ✓ Objeto está centrado")
            else:
                print("  ⚠️  Objeto NÃO está centrado")

            is_normalized = max_size <= 2.0
            if is_normalized:
                print("  ✓ Objeto está normalizado")
            else:
                print("  ⚠️  Objeto NÃO está normalizado")

            vertex_count_ok = len(vertices) < 10000
            if vertex_count_ok:
                print("  ✓ Número de vértices OK para performance")
            else:
                print("  ⚠️  Muitos vértices! Considere simplificar (<10000)")

            if len(vertices) > 65535:
                print("  ❌ ERRO: Mais de 65535 vértices (limite do Uint16Array)")
                return False

        return True

    except Exception as e:
        print(f"❌ Erro ao validar OBJ {filename}: {e}")
        return False

def validate_gltf(filename):
    """Valida um arquivo GLTF de forma rigorosa"""
    print(f"\n📊 Analisando GLTF: {filename}")
    print("=" * 60)

    try:
        with open(filename, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Verificar estrutura básica
        if 'asset' not in data:
            print("  ❌ ERRO: Campo 'asset' ausente")
            return False

        version = data['asset'].get('version', '1.0')
        print(f"✓ Versão GLTF: {version}")

        if 'scenes' in data:
            print(f"✓ Cenas: {len(data['scenes'])}")
        if 'nodes' in data:
            print(f"✓ Nós: {len(data['nodes'])}")
        if 'meshes' in data:
            print(f"✓ Malhas: {len(data['meshes'])}")
            total_primitives = sum(len(mesh.get('primitives', [])) for mesh in data['meshes'])
            print(f"✓ Primitivas totais: {total_primitives}")
        if 'materials' in data:
            print(f"✓ Materiais: {len(data['materials'])}")
        if 'buffers' in data:
            print(f"✓ Buffers: {len(data['buffers'])}")
        if 'bufferViews' in data:
            print(f"✓ BufferViews: {len(data['bufferViews'])}")
        if 'accessors' in data:
            print(f"✓ Accessors: {len(data['accessors'])}")

        # Verificar se tem pelo menos uma malha
        if 'meshes' not in data or len(data['meshes']) == 0:
            print("  ❌ ERRO: Nenhuma malha encontrada!")
            return False

        # Verificar se as malhas têm primitivas
        has_primitives = False
        for mesh in data['meshes']:
            if 'primitives' in mesh and len(mesh['primitives']) > 0:
                has_primitives = True
                break

        if not has_primitives:
            print("  ❌ ERRO: Nenhuma primitiva encontrada nas malhas!")
            return False

        # 🔍 VALIDAÇÃO RIGOROSA DOS BUFFERS
        if 'buffers' in data:
            model_dir = os.path.dirname(filename)
            for i, buffer in enumerate(data['buffers']):
                print(f"\n🔍 Validando buffer {i}:")

                if 'uri' in buffer:
                    uri = buffer['uri']
                    print(f"  URI: {uri}")

                    # Verificar se é data URI (embutido)
                    if uri.startswith('data:'):
                        print("  ✓ Buffer embutido (data URI)")
                        # Poderia validar o data URI, mas por enquanto assume válido
                    else:
                        # Buffer externo - verificar se arquivo existe
                        buffer_path = os.path.join(model_dir, uri)
                        if os.path.exists(buffer_path):
                            file_size = os.path.getsize(buffer_path)
                            expected_size = buffer.get('byteLength', 0)
                            print(f"  ✓ Arquivo encontrado: {uri} ({file_size} bytes)")

                            if expected_size > 0 and file_size != expected_size:
                                print(f"  ⚠️  Tamanho do arquivo ({file_size}) != byteLength declarado ({expected_size})")
                        else:
                            print(f"  ❌ ERRO: Arquivo de buffer não encontrado: {uri}")
                            return False
                else:
                    print("  ❌ ERRO: Buffer sem URI definido")
                    return False

        # Verificar se bufferViews referenciam buffers existentes
        if 'bufferViews' in data:
            num_buffers = len(data.get('buffers', []))
            for bv in data['bufferViews']:
                buffer_idx = bv.get('buffer', -1)
                if buffer_idx < 0 or buffer_idx >= num_buffers:
                    print(f"  ❌ ERRO: bufferView referencia buffer inválido: {buffer_idx}")
                    return False

        # Verificar se accessors referenciam bufferViews existentes
        if 'accessors' in data:
            num_buffer_views = len(data.get('bufferViews', []))
            for acc in data['accessors']:
                bv_idx = acc.get('bufferView')
                if bv_idx is not None and (bv_idx < 0 or bv_idx >= num_buffer_views):
                    print(f"  ❌ ERRO: accessor referencia bufferView inválido: {bv_idx}")
                    return False

        print("  ✓ Estrutura GLTF válida e buffers verificados")
        return True

    except json.JSONDecodeError as e:
        print(f"❌ Erro ao fazer parse do JSON GLTF {filename}: {e}")
        return False
    except Exception as e:
        print(f"❌ Erro ao validar GLTF {filename}: {e}")
        return False

def validate_glb(filename):
    """Valida um arquivo GLB de forma rigorosa"""
    print(f"\n📊 Analisando GLB: {filename}")
    print("=" * 60)

    try:
        with open(filename, 'rb') as f:
            # Verificar magic number
            magic = f.read(4)
            if magic != b'glTF':
                print("  ❌ ERRO: Magic number inválido (não é um arquivo GLB)")
                return False

            # Versão
            version = struct.unpack('<I', f.read(4))[0]
            print(f"✓ Versão GLB: {version}")

            # Tamanho total
            total_size = struct.unpack('<I', f.read(4))[0]
            file_size = os.path.getsize(filename)
            if total_size != file_size:
                print(f"  ⚠️  Tamanho declarado ({total_size}) != tamanho real ({file_size})")

            # Primeiro chunk (JSON)
            json_length = struct.unpack('<I', f.read(4))[0]
            json_type = f.read(4)
            if json_type != b'JSON':
                print("  ❌ ERRO: Primeiro chunk não é JSON")
                return False

            print(f"✓ Chunk JSON: {json_length} bytes")

            json_data = f.read(json_length)
            try:
                data = json.loads(json_data.decode('utf-8'))
            except json.JSONDecodeError as e:
                print(f"❌ Erro ao fazer parse do JSON GLB: {e}")
                return False

            # Segundo chunk (BIN) - verificar se existe
            if f.tell() < file_size:
                bin_length = struct.unpack('<I', f.read(4))[0]
                bin_type = f.read(4)
                if bin_type != b'BIN\0':
                    print("  ⚠️  Segundo chunk não é BIN (pode ser OK se não houver dados binários)")
                else:
                    print(f"✓ Chunk BIN: {bin_length} bytes")

                    # Verificar se há dados suficientes no arquivo
                    remaining_data = file_size - f.tell()
                    if remaining_data < bin_length:
                        print(f"  ❌ ERRO: Arquivo truncado - esperado {bin_length} bytes BIN, mas só restam {remaining_data}")
                        return False
            else:
                print("  ⚠️  Nenhum chunk BIN encontrado")

            # Usar mesma validação do GLTF
            if 'asset' not in data:
                print("  ❌ ERRO: Campo 'asset' ausente")
                return False

            gltf_version = data['asset'].get('version', '1.0')
            print(f"✓ Versão GLTF interna: {gltf_version}")

            if 'meshes' in data:
                print(f"✓ Malhas: {len(data['meshes'])}")
                total_primitives = sum(len(mesh.get('primitives', [])) for mesh in data['meshes'])
                print(f"✓ Primitivas totais: {total_primitives}")

            # Verificar se tem pelo menos uma malha
            if 'meshes' not in data or len(data['meshes']) == 0:
                print("  ❌ ERRO: Nenhuma malha encontrada!")
                return False

            has_primitives = False
            for mesh in data['meshes']:
                if 'primitives' in mesh and len(mesh['primitives']) > 0:
                    has_primitives = True
                    break

            if not has_primitives:
                print("  ❌ ERRO: Nenhuma primitiva encontrada nas malhas!")
                return False

            # Para GLB, verificar se buffers referenciam dados corretos
            if 'buffers' in data:
                for i, buffer in enumerate(data['buffers']):
                    byte_length = buffer.get('byteLength', 0)
                    print(f"✓ Buffer {i}: {byte_length} bytes")

                    # Em GLB, buffers sem URI devem usar o chunk BIN
                    if 'uri' not in buffer:
                        if bin_length > 0:
                            if byte_length != bin_length:
                                print(f"  ⚠️  Buffer {i}: byteLength ({byte_length}) != tamanho do chunk BIN ({bin_length})")
                        else:
                            print(f"  ❌ ERRO: Buffer {i} sem URI e sem chunk BIN")
                            return False

            print("  ✓ Estrutura GLB válida e dados binários verificados")
            return True

    except Exception as e:
        print(f"❌ Erro ao validar GLB {filename}: {e}")
        return False

def validate_model(filename):
    """Valida um modelo baseado na extensão"""
    ext = os.path.splitext(filename)[1].lower()

    if ext == '.obj':
        return validate_obj(filename)
    elif ext == '.gltf':
        return validate_gltf(filename)
    elif ext == '.glb':
        return validate_glb(filename)
    else:
        print(f"❌ Formato não suportado: {ext}")
        return False

def main():
    """Função principal"""
    print("""
╔════════════════════════════════════════════════════════════════╗
║  Cosmic Scales - Validação Completa de Modelos               ║
╚════════════════════════════════════════════════════════════════╝
    """)

    # Encontrar todos os arquivos de modelo
    model_files = []
    for pattern in ['*.obj', '*.gltf', '*.glb']:
        model_files.extend(glob.glob(os.path.join('models', pattern)))

    if not model_files:
        print("❌ Nenhum arquivo de modelo encontrado em 'models/'")
        return

    print(f"📁 Encontrados {len(model_files)} arquivos de modelo:")
    for f in sorted(model_files):
        print(f"  - {f}")
    print()

    # Validar cada arquivo
    valid_count = 0
    invalid_count = 0
    invalid_files = []

    for filename in sorted(model_files):
        if validate_model(filename):
            valid_count += 1
        else:
            invalid_count += 1
            invalid_files.append(filename)

    print(f"""
╔════════════════════════════════════════════════════════════════╗
║  RESULTADO DA VALIDAÇÃO                                       ║
╚════════════════════════════════════════════════════════════════╝

✓ Modelos válidos: {valid_count}
❌ Modelos inválidos: {invalid_count}

Total: {len(model_files)} modelos analisados
    """)

    if invalid_files:
        print("""
⚠️  ARQUIVOS INVÁLIDOS ENCONTRADOS:""")
        for f in invalid_files:
            print(f"  ❌ {f}")
        print("""
💡 RECOMENDAÇÕES:
   - Para GLTF com buffers externos faltantes: converta para GLB ou obtenha os arquivos .bin
   - Para modelos corrompidos: substitua por versões válidas
   - Verifique viewers online como https://gltf-viewer.donmccurdy.com/ para testar modelos
        """)

if __name__ == '__main__':
    # Mudar para o diretório do script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    main()