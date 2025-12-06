/**
 * Carregador de arquivos OBJ
 */
class OBJLoader {
    constructor() {
        this.cache = new Map();
    }
    
    /**
     * Carrega um arquivo OBJ
     */
    async load(path) {
        // Verifica cache
        if (this.cache.has(path)) {
            return this.cache.get(path);
        }
        
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const text = await response.text();
            const data = this.parse(text);
            
            this.cache.set(path, data);
            return data;
        } catch (error) {
            throw new Error(`Erro ao carregar ${path}: ${error.message}`);
        }
    }
    
    /**
     * Faz o parsing de um arquivo OBJ
     */
    parse(text) {
        const vertices = [];
        const indices = [];
        const tempVertices = [];
        const lines = text.split('\n');
        
        for (let line of lines) {
            line = line.trim();
            
            if (line.startsWith('#') || line === '') {
                continue;
            }
            
            const parts = line.split(/\s+/);
            const type = parts[0];
            
            if (type === 'v') {
                // Vértice
                tempVertices.push({
                    x: parseFloat(parts[1]),
                    y: parseFloat(parts[2]),
                    z: parseFloat(parts[3])
                });
            } else if (type === 'f') {
                // Face - converte para linhas
                const faceIndices = [];
                for (let i = 1; i < parts.length; i++) {
                    const indexData = parts[i].split('/');
                    const vertexIndex = parseInt(indexData[0]) - 1;
                    faceIndices.push(vertexIndex);
                }
                
                // Cria linhas das arestas da face
                for (let i = 0; i < faceIndices.length; i++) {
                    const nextIndex = (i + 1) % faceIndices.length;
                    indices.push(faceIndices[i], faceIndices[nextIndex]);
                }
            } else if (type === 'l') {
                // Linha
                for (let i = 1; i < parts.length - 1; i++) {
                    indices.push(
                        parseInt(parts[i]) - 1,
                        parseInt(parts[i + 1]) - 1
                    );
                }
            }
        }
        
        // Converte vértices para array tipado
        const vertexArray = new Float32Array(tempVertices.length * 3);
        for (let i = 0; i < tempVertices.length; i++) {
            vertexArray[i * 3] = tempVertices[i].x;
            vertexArray[i * 3 + 1] = tempVertices[i].y;
            vertexArray[i * 3 + 2] = tempVertices[i].z;
        }
        
        return {
            vertices: vertexArray,
            indices: new Uint16Array(indices),
            colors: null
        };
    }
    
    /**
     * Limpa o cache
     */
    clearCache() {
        this.cache.clear();
    }
}
