/**
 * Carregador universal de modelos (OBJ, GLTF, GLB)
 */
class ModelLoader {
    constructor() {
        this.objLoader = new OBJLoader();
    }

    /**
     * Carrega um modelo pelo caminho e extensão, com suporte a fallback.
     * Tenta carregar o ficheiro original, depois o _fallback, depois lança erro.
     * Retorna { vertices: Float32Array, indices: Uint16Array }
     */
    async load(path) {
        const lower = path.toLowerCase();
        
        // Tenta carregar o ficheiro original
        try {
            if (lower.endsWith('.obj')) {
                return this.objLoader.load(path);
            }
            if (lower.endsWith('.gltf') || lower.endsWith('.glb')) {
                return GLTFLoader.load(path);
            }
            throw new Error(`Formato de modelo não suportado: ${path}`);
        } catch (primaryError) {
            // Se falhar, tenta com _fallback
            const fallbackPath = this.getFallbackPath(path);
            
            if (fallbackPath !== path) {
                try {
                    console.warn(`Falha ao carregar ${path}, tentando fallback: ${fallbackPath}`);
                    const lowerFallback = fallbackPath.toLowerCase();
                    if (lowerFallback.endsWith('.obj')) {
                        return this.objLoader.load(fallbackPath);
                    }
                    if (lowerFallback.endsWith('.gltf') || lowerFallback.endsWith('.glb')) {
                        return GLTFLoader.load(fallbackPath);
                    }
                } catch (fallbackError) {
                    // Fallback também falhou
                    console.warn(`Falha ao carregar fallback ${fallbackPath}:`, fallbackError);
                    throw new Error(`Impossível carregar ${path} ou seu fallback ${fallbackPath}`);
                }
            }
            
            throw primaryError;
        }
    }

    /**
     * Gera o caminho do ficheiro fallback
     * Exemplo: galaxy.obj -> galaxy_fallback.obj
     */
    getFallbackPath(path) {
        // Encontra a extensão
        const dotIndex = path.lastIndexOf('.');
        if (dotIndex === -1) {
            return path + '_fallback';
        }
        
        const name = path.substring(0, dotIndex);
        const ext = path.substring(dotIndex);
        return name + '_fallback' + ext;
    }
}
