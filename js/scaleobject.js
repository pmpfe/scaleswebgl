/**
 * Classe que representa um objeto em uma determinada escala
 */
class ScaleObject {
    constructor(config, index) {
        this.name = config.name;
        this.scale = config.scale;
        this.size = config.size;
        this.modelPath = config.model;
        this.color = config.color || [1.0, 1.0, 1.0];
        this.description = config.description || '';
        this.index = index;
        
        this.vertices = null;
        this.indices = null;
        this.loaded = false;
        
        // Buffers WebGL
        this.vertexBuffer = null;
        this.indexBuffer = null;
    }
    
    /**
     * Carrega o modelo OBJ ou gera geometria procedural
     */
    async load(gl, objLoader) {
        try {
            // Tenta carregar o modelo OBJ
            const modelData = await objLoader.load(this.modelPath);
            this.vertices = modelData.vertices;
            this.indices = modelData.indices;
        } catch (error) {
            console.warn(`Não foi possível carregar ${this.modelPath}, usando geometria procedural:`, error);
            this.generateProceduralGeometry();
        }
        
        // Cria buffers WebGL
        this.createBuffers(gl);
        this.loaded = true;
    }
    
    /**
     * Gera geometria procedural baseada no tipo de objeto
     */
    generateProceduralGeometry() {
        const type = this.getGeometryType();
        
        switch (type) {
            case 'helix':
                this.generateHelix();
                break;
            case 'icosahedron':
                this.generateIcosahedron();
                break;
            case 'sphere':
                this.generateSphere(16, 16);
                break;
            case 'cube':
                this.generateCube();
                break;
            case 'torus':
                this.generateTorus();
                break;
            case 'spiral':
                this.generateSpiral();
                break;
            default:
                this.generateSphere(16, 16);
        }
    }
    
    /**
     * Determina o tipo de geometria baseado no nome do objeto
     */
    getGeometryType() {
        const name = this.name.toLowerCase();
        
        if (name.includes('dna') || name.includes('molécula')) return 'helix';
        if (name.includes('vírus')) return 'icosahedron';
        if (name.includes('célula') || name.includes('grão')) return 'sphere';
        if (name.includes('edifício') || name.includes('cubo')) return 'cube';
        if (name.includes('galáxia') || name.includes('via')) return 'spiral';
        if (name.includes('sistema')) return 'torus';
        
        return 'sphere';
    }
    
    /**
     * Gera uma dupla hélice (DNA)
     */
    generateHelix() {
        const vertices = [];
        const indices = [];
        const turns = 4;
        const segments = 100;
        const radius = 0.3;
        const height = 2.0;
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const angle = t * turns * Math.PI * 2;
            const y = (t - 0.5) * height;
            
            // Primeira hélice
            vertices.push(
                Math.cos(angle) * radius,
                y,
                Math.sin(angle) * radius
            );
            
            // Segunda hélice (oposta)
            vertices.push(
                Math.cos(angle + Math.PI) * radius,
                y,
                Math.sin(angle + Math.PI) * radius
            );
            
            if (i < segments) {
                const base = i * 2;
                // Linhas da primeira hélice
                indices.push(base, base + 2);
                // Linhas da segunda hélice
                indices.push(base + 1, base + 3);
                // Conectores entre hélices
                if (i % 5 === 0) {
                    indices.push(base, base + 1);
                }
            }
        }
        
        this.vertices = new Float32Array(vertices);
        this.indices = new Uint16Array(indices);
    }
    
    /**
     * Gera um icosaedro (vírus)
     */
    generateIcosahedron() {
        const t = (1.0 + Math.sqrt(5.0)) / 2.0;
        
        const vertices = new Float32Array([
            -1,  t,  0,    1,  t,  0,   -1, -t,  0,    1, -t,  0,
             0, -1,  t,    0,  1,  t,    0, -1, -t,    0,  1, -t,
             t,  0, -1,    t,  0,  1,   -t,  0, -1,   -t,  0,  1
        ]);
        
        const indices = new Uint16Array([
            0,11,5,  0,5,1,   0,1,7,   0,7,10,  0,10,11,
            1,5,9,   5,11,4,  11,10,2, 10,7,6,  7,1,8,
            3,9,4,   3,4,2,   3,2,6,   3,6,8,   3,8,9,
            4,9,5,   2,4,11,  6,2,10,  8,6,7,   9,8,1
        ]);
        
        this.vertices = vertices;
        this.indices = indices;
    }
    
    /**
     * Gera uma esfera
     */
    generateSphere(latBands, longBands) {
        const vertices = [];
        const indices = [];
        
        for (let lat = 0; lat <= latBands; lat++) {
            const theta = lat * Math.PI / latBands;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);
            
            for (let long = 0; long <= longBands; long++) {
                const phi = long * 2 * Math.PI / longBands;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);
                
                const x = cosPhi * sinTheta;
                const y = cosTheta;
                const z = sinPhi * sinTheta;
                
                vertices.push(x, y, z);
            }
        }
        
        for (let lat = 0; lat < latBands; lat++) {
            for (let long = 0; long < longBands; long++) {
                const first = (lat * (longBands + 1)) + long;
                const second = first + longBands + 1;
                
                indices.push(first, second);
                indices.push(first, first + 1);
            }
        }
        
        this.vertices = new Float32Array(vertices);
        this.indices = new Uint16Array(indices);
    }
    
    /**
     * Gera um cubo
     */
    generateCube() {
        const vertices = new Float32Array([
            -1, -1,  1,   1, -1,  1,   1,  1,  1,  -1,  1,  1,
            -1, -1, -1,   1, -1, -1,   1,  1, -1,  -1,  1, -1
        ]);
        
        const indices = new Uint16Array([
            0,1, 1,2, 2,3, 3,0,  // frente
            4,5, 5,6, 6,7, 7,4,  // trás
            0,4, 1,5, 2,6, 3,7   // conexões
        ]);
        
        this.vertices = vertices;
        this.indices = indices;
    }
    
    /**
     * Gera um torus
     */
    generateTorus() {
        const vertices = [];
        const indices = [];
        const majorRadius = 1.0;
        const minorRadius = 0.3;
        const majorSegments = 32;
        const minorSegments = 16;
        
        for (let i = 0; i <= majorSegments; i++) {
            const u = i / majorSegments * Math.PI * 2;
            const cu = Math.cos(u);
            const su = Math.sin(u);
            
            for (let j = 0; j <= minorSegments; j++) {
                const v = j / minorSegments * Math.PI * 2;
                const cv = Math.cos(v);
                const sv = Math.sin(v);
                
                const x = (majorRadius + minorRadius * cv) * cu;
                const y = minorRadius * sv;
                const z = (majorRadius + minorRadius * cv) * su;
                
                vertices.push(x, y, z);
            }
        }
        
        for (let i = 0; i < majorSegments; i++) {
            for (let j = 0; j < minorSegments; j++) {
                const a = i * (minorSegments + 1) + j;
                const b = a + minorSegments + 1;
                
                indices.push(a, b);
                indices.push(a, a + 1);
            }
        }
        
        this.vertices = new Float32Array(vertices);
        this.indices = new Uint16Array(indices);
    }
    
    /**
     * Gera uma espiral (galáxia)
     */
    generateSpiral() {
        const vertices = [];
        const indices = [];
        const arms = 3;
        const pointsPerArm = 50;
        
        for (let arm = 0; arm < arms; arm++) {
            const armAngle = (arm / arms) * Math.PI * 2;
            
            for (let i = 0; i <= pointsPerArm; i++) {
                const t = i / pointsPerArm;
                const angle = t * Math.PI * 4 + armAngle;
                const radius = t * 2;
                
                const x = Math.cos(angle) * radius;
                const y = (Math.random() - 0.5) * 0.2 * t;
                const z = Math.sin(angle) * radius;
                
                vertices.push(x, y, z);
                
                if (i < pointsPerArm) {
                    const idx = arm * (pointsPerArm + 1) + i;
                    indices.push(idx, idx + 1);
                }
            }
        }
        
        this.vertices = new Float32Array(vertices);
        this.indices = new Uint16Array(indices);
    }
    
    /**
     * Cria buffers WebGL para o objeto
     */
    createBuffers(gl) {
        // Buffer de vértices
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
        
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
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.LINES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }
}
