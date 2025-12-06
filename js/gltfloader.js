/**
 * Carregador simples para GLTF/GLB
 * Suporta leitura de uma malha (primeiro primitive) com POSITION, NORMAL e indices.
 */
class GLTFLoader {
    /**
     * Carrega um ficheiro .gltf ou .glb e devolve { vertices, indices }
     */
    static async load(url) {
        const lower = url.toLowerCase();
        if (lower.endsWith('.glb')) {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const arrayBuffer = await response.arrayBuffer();
            const gltf = this._parseGLB(arrayBuffer);
            return this._extractGeometry(gltf);
        }
        if (lower.endsWith('.gltf')) {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const gltf = await response.json();
            // carregar buffers externos
            if (gltf.buffers) {
                const base = url.substring(0, url.lastIndexOf('/') + 1);
                for (const buffer of gltf.buffers) {
                    if (buffer.uri && !buffer.uri.startsWith('data:')) {
                        const bresp = await fetch(base + buffer.uri);
                        if (!bresp.ok) throw new Error(`HTTP error ${bresp.status} buffer`);
                        buffer._data = await bresp.arrayBuffer();
                    }
                }
            }
            return this._extractGeometry(gltf);
        }
        throw new Error('Formato GLTF/GLB inválido: ' + url);
    }

    static _parseGLB(arrayBuffer) {
        const view = new DataView(arrayBuffer);
        const magic = view.getUint32(0, true);
        if (magic !== 0x46546c67) throw new Error('GLB inválido');
        const length = view.getUint32(8, true);
        let offset = 12;
        const jsonLength = view.getUint32(offset, true);
        const jsonType = view.getUint32(offset + 4, true);
        if (jsonType !== 0x4e4f534a) throw new Error('Chunk JSON não encontrado');
        const jsonData = new Uint8Array(arrayBuffer, offset + 8, jsonLength);
        const gltf = JSON.parse(new TextDecoder().decode(jsonData));
        offset += 8 + jsonLength;
        if (offset < length) {
            const binLength = view.getUint32(offset, true);
            const binType = view.getUint32(offset + 4, true);
            if (binType === 0x004e4942) {
                const binData = arrayBuffer.slice(offset + 8, offset + 8 + binLength);
                if (gltf.buffers && gltf.buffers.length > 0) {
                    gltf.buffers[0]._data = binData;
                }
            }
        }
        return gltf;
    }

    static _extractGeometry(gltf) {
        if (!gltf.meshes || gltf.meshes.length === 0) throw new Error('Sem meshes no GLTF');
        
        // Criar mapa de mesh -> nodes para obter transformações
        const meshToNodes = new Map();
        if (gltf.nodes) {
            for (const node of gltf.nodes) {
                if (node.mesh !== undefined) {
                    if (!meshToNodes.has(node.mesh)) {
                        meshToNodes.set(node.mesh, []);
                    }
                    meshToNodes.get(node.mesh).push(node);
                }
            }
        }
        
        // Concatenar todos os primitives de todos os meshes
        const allVertices = [];
        const allIndices = [];
        const allColors = [];
        let vertexOffset = 0;
        let hasColors = false;
        
        // Calcular translação média para centrar o modelo
        let avgTranslation = [0, 0, 0];
        let nodeCount = 0;
        for (let meshIndex = 0; meshIndex < gltf.meshes.length; meshIndex++) {
            const nodes = meshToNodes.get(meshIndex) || [];
            if (nodes.length > 0 && nodes[0].translation) {
                avgTranslation[0] += nodes[0].translation[0];
                avgTranslation[1] += nodes[0].translation[1];
                avgTranslation[2] += nodes[0].translation[2];
                nodeCount++;
            }
        }
        if (nodeCount > 0) {
            avgTranslation[0] /= nodeCount;
            avgTranslation[1] /= nodeCount;
            avgTranslation[2] /= nodeCount;
        }
        
        for (let meshIndex = 0; meshIndex < gltf.meshes.length; meshIndex++) {
            const mesh = gltf.meshes[meshIndex];
            
            // Obter transformação do node (se existir)
            const nodes = meshToNodes.get(meshIndex) || [];
            const node = nodes[0]; // Usar primeiro node se houver múltiplos
            const translation = node?.translation || [0, 0, 0];
            const scale = node?.scale || [1, 1, 1];
            const rotation = node?.rotation || [0, 0, 0, 1]; // quaternion
            
            // Translação relativa à média (para centrar)
            const relTranslation = [
                translation[0] - avgTranslation[0],
                translation[1] - avgTranslation[1],
                translation[2] - avgTranslation[2]
            ];
            
            for (const prim of mesh.primitives) {
                const vertices = prim.attributes && prim.attributes.POSITION !== undefined
                    ? this._getAccessor(gltf, prim.attributes.POSITION)
                    : [];
                
                // Tentar obter cores de COLOR_0 ou do material
                let colors = null;
                if (prim.attributes && prim.attributes.COLOR_0 !== undefined) {
                    colors = this._getAccessor(gltf, prim.attributes.COLOR_0);
                } else if (prim.material !== undefined && gltf.materials && gltf.materials[prim.material]) {
                    // Extrair cor do material
                    const material = gltf.materials[prim.material];
                    const pbr = material.pbrMetallicRoughness || {};
                    const baseColor = pbr.baseColorFactor || [1, 1, 1, 1];
                    // Criar array de cores repetindo a baseColor para cada vértice
                    const numVertices = vertices.length / 3;
                    colors = [];
                    for (let i = 0; i < numVertices; i++) {
                        colors.push(baseColor[0], baseColor[1], baseColor[2]);
                    }
                }
                
                if (colors) hasColors = true;
                
                let indices = prim.indices !== undefined 
                    ? this._getAccessor(gltf, prim.indices) 
                    : [];
                
                const numVertices = vertices.length / 3;
                
                // Se não houver indices, gerar sequência
                if (indices.length === 0 && vertices.length > 0) {
                    for (let i = 0; i < numVertices; i++) {
                        indices.push(i);
                    }
                }
                
                // Aplicar transformações aos vértices (baking)
                for (let i = 0; i < numVertices; i++) {
                    let x = vertices[i * 3];
                    let y = vertices[i * 3 + 1];
                    let z = vertices[i * 3 + 2];
                    
                    // Aplicar escala
                    x *= scale[0];
                    y *= scale[1];
                    z *= scale[2];
                    
                    // Aplicar rotação (quaternion) - simplificado, assumindo rotação identidade por agora
                    // Para rotações complexas seria necessário implementar multiplicação quaternion->matriz
                    
                    // Aplicar translação relativa (centrada)
                    x += relTranslation[0];
                    y += relTranslation[1];
                    z += relTranslation[2];
                    
                    allVertices.push(x, y, z);
                }
                
                // Adicionar cores (ou branco se não houver)
                if (colors) {
                    allColors.push(...colors);
                } else {
                    for (let i = 0; i < numVertices; i++) {
                        allColors.push(1.0, 1.0, 1.0);
                    }
                }
                
                // Adicionar índices com offset
                for (const idx of indices) {
                    allIndices.push(idx + vertexOffset);
                }
                
                vertexOffset += numVertices;
            }
        }
        
        return {
            vertices: new Float32Array(allVertices),
            indices: new Uint16Array(allIndices),
            colors: hasColors ? new Float32Array(allColors) : null
        };
    }

    static _getAccessor(gltf, accessorIndex) {
        const accessor = gltf.accessors[accessorIndex];
        const bufferView = gltf.bufferViews[accessor.bufferView];
        const buffer = gltf.buffers[bufferView.buffer];
        const data = buffer._data;
        const byteOffset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
        const count = accessor.count;
        const comps = this._componentCount(accessor.type);
        const Typed = this._typedArray(accessor.componentType);
        const stride = bufferView.byteStride || comps * Typed.BYTES_PER_ELEMENT;
        const out = [];
        for (let i = 0; i < count; i++) {
            const off = byteOffset + i * stride;
            const view = new Typed(data, off, comps);
            for (let j = 0; j < comps; j++) out.push(view[j]);
        }
        return out;
    }

    static _componentCount(type) {
        switch (type) {
            case 'SCALAR': return 1;
            case 'VEC2': return 2;
            case 'VEC3': return 3;
            case 'VEC4': return 4;
            default: throw new Error('Tipo não suportado: ' + type);
        }
    }

    static _typedArray(componentType) {
        switch (componentType) {
            case 5120: return Int8Array;
            case 5121: return Uint8Array;
            case 5122: return Int16Array;
            case 5123: return Uint16Array;
            case 5125: return Uint32Array;
            case 5126: return Float32Array;
            default: throw new Error('componentType não suportado: ' + componentType);
        }
    }
}
