/**
 * Carregador universal de modelos (OBJ, GLTF, GLB)
 */
class ModelLoader {
    constructor() {
        this.objLoader = new OBJLoader();
    }

    /**
     * Carrega um modelo pelo caminho e extensão.
     * Retorna { vertices: Float32Array, indices: Uint16Array }
     */
    async load(path) {
        const lower = path.toLowerCase();
        if (lower.endsWith('.obj')) {
            return this.objLoader.load(path);
        }
        if (lower.endsWith('.gltf') || lower.endsWith('.glb')) {
            return GLTFLoader.load(path);
        }
        throw new Error(`Formato de modelo não suportado: ${path}`);
    }
}
