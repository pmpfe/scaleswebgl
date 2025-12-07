/**
 * Classe que representa um objeto em uma determinada escala
 */
class ScaleObject {
    constructor(config, index) {
        this.name = config.name;
        this.scale = config.scale;  // Escala da grelha (ordem de magnitude)
        this.objectSize = config.objectSize || config.scale;  // Tamanho real do objeto em metros
        this.size = config.size;
        this.modelPath = config.model;
        this.color = config.color || [1.0, 1.0, 1.0];
        this.description = config.description || '';
        this.index = index;
        
        this.vertices = null;
        this.indices = null;
        this.colors = null;
        this.loaded = false;
        this.modelBoundingSize = 1.0;  // Tamanho do bounding box do modelo 3D
        
        // Buffers WebGL
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.colorBuffer = null;
    }
    
    /**
     * Carrega o modelo OBJ ou usa o ponto de interrogação como fallback
     * Cadeia de tentativas:
     * 1. Carrega modelo original
     * 2. Se falhar, tenta modelo_fallback (automático)
     * 3. Se falhar, usa ponto de interrogação (question_mark.obj)
     */
    async load(gl, modelLoader) {
        let usedFallback = false;
        let fallbackType = 'none';
        
        console.log(`[ScaleObject] Tentando carregar: ${this.modelPath}`);
        
        try {
            // Detecta e carrega modelo (OBJ, GLTF ou GLB)
            // O ModelLoader já trata do fallback automático (ficheiro_fallback)
            const modelData = await modelLoader.load(this.modelPath);
            this.vertices = modelData.vertices;
            this.indices = modelData.indices;
            this.colors = modelData.colors || null;
            
            // Calcula bounding box do modelo
            this.calculateBoundingBox();
            
            console.log(`✓ Carregado: ${this.name} (${this.vertices.length / 3} vértices, tamanho modelo: ${this.modelBoundingSize.toFixed(4)} unidades)`);
        } catch (error) {
            console.warn(`Falha ao carregar ${this.modelPath}:`, error.message);
            
            // Usa o ponto de interrogação como fallback
            try {
                console.log(`[ScaleObject] Usando ponto de interrogação para ${this.name}`);
                const questionMarkData = await modelLoader.load('models/question_mark.obj');
                this.vertices = questionMarkData.vertices;
                this.indices = questionMarkData.indices;
                // Usa cor laranja para o ponto de interrogação
                this.colors = questionMarkData.colors || null;
                usedFallback = true;
                fallbackType = 'question_mark';
                
                // Calcula bounding box
                this.calculateBoundingBox();
                
                console.warn(`⚠️  Modelo não encontrado: ${this.modelPath} → Usando ponto de interrogação (${this.vertices.length / 3} vértices)`);
            } catch (questionMarkError) {
                console.error(`ERRO CRÍTICO: Não foi possível carregar ponto de interrogação:`, questionMarkError);
                throw new Error(`Impossível carregar modelo ou fallback para ${this.name}`);
            }
        }
        
        // Cria buffers WebGL
        this.createBuffers(gl);
        this.loaded = true;

        return {
            success: !usedFallback,
            usedFallback,
            fallbackType,
            verticesCount: this.vertices ? this.vertices.length / 3 : 0
        };
    }
    
    /**
     * Calcula o bounding box do modelo para determinar seu tamanho real
     */
    calculateBoundingBox() {
        if (!this.vertices) {
            this.modelBoundingSize = 1.0;
            return;
        }
        
        let minX = Infinity, minY = Infinity, minZ = Infinity;
        let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
        
        for (let i = 0; i < this.vertices.length; i += 3) {
            const x = this.vertices[i];
            const y = this.vertices[i + 1];
            const z = this.vertices[i + 2];
            
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            minZ = Math.min(minZ, z);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
            maxZ = Math.max(maxZ, z);
        }
        
        // Tamanho é a maior dimensão do bounding box
        const sizeX = maxX - minX;
        const sizeY = maxY - minY;
        const sizeZ = maxZ - minZ;
        this.modelBoundingSize = Math.max(sizeX, sizeY, sizeZ);
    }
    
    /**
     * Cria buffers WebGL para o objeto
     */
    createBuffers(gl) {
        // Buffer de vértices
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
        
        // Buffer de cores (se existirem)
        if (this.colors) {
            this.colorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
        }
        
        // Buffer de índices
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
    }
    
    /**
     * Renderiza o objeto
     */
    render(gl, shader) {
        if (!this.loaded) return;
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(shader.attribs.position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shader.attribs.position);
        
        // Bind cores se existirem
        if (this.colorBuffer && shader.attribs.color !== -1) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.vertexAttribPointer(shader.attribs.color, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(shader.attribs.color);
        } else if (shader.attribs.color !== -1) {
            gl.disableVertexAttribArray(shader.attribs.color);
        }
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.LINES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }
}
