/**
 * Renderiza uma grelha de referência que representa a escala atual
 */
class Grid {
    constructor(gl) {
        this.gl = gl;
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.lineCount = 0;
        
        this.createGrid();
    }
    
    /**
     * Cria a geometria da grelha
     * Grelha 10x10 com linhas de -5 a +5 em cada eixo
     */
    createGrid() {
        const gl = this.gl;
        const divisions = 10;
        const vertices = [];
        const indices = [];
        
        // Linhas paralelas ao eixo X (horizontais)
        for (let i = 0; i <= divisions; i++) {
            const z = -5 + (i * 10 / divisions);
            vertices.push(-5, 0, z);  // Ponto inicial
            vertices.push(5, 0, z);   // Ponto final
        }
        
        // Linhas paralelas ao eixo Z (verticais quando visto de cima)
        for (let i = 0; i <= divisions; i++) {
            const x = -5 + (i * 10 / divisions);
            vertices.push(x, 0, -5);  // Ponto inicial
            vertices.push(x, 0, 5);   // Ponto final
        }
        
        // Índices para linhas
        for (let i = 0; i < vertices.length / 3; i++) {
            indices.push(i);
        }
        
        this.lineCount = indices.length;
        
        // Criar buffers
        const verticesArray = new Float32Array(vertices);
        const indicesArray = new Uint16Array(indices);
        
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, verticesArray, gl.STATIC_DRAW);
        
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesArray, gl.STATIC_DRAW);
    }
    
    /**
     * Renderiza a grelha
     */
    render(gl, shader, modelMatrix, viewMatrix, projectionMatrix) {
        gl.useProgram(shader.program);
        
        // Define matrizes
        gl.uniformMatrix4fv(shader.uniforms.modelMatrix, false, modelMatrix);
        gl.uniformMatrix4fv(shader.uniforms.viewMatrix, false, viewMatrix);
        gl.uniformMatrix4fv(shader.uniforms.projectionMatrix, false, projectionMatrix);
        
        // Cor da grelha (cinzento escuro com transparência)
        gl.uniform3fv(shader.uniforms.color, [0.3, 0.3, 0.3]);
        gl.uniform1f(shader.uniforms.alpha, 0.5);
        gl.uniform1i(shader.uniforms.useVertexColors, 0);
        
        // Bind vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(shader.attribs.position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shader.attribs.position);
        
        // Desativa cores de vértice se existir
        if (shader.attribs.color !== -1) {
            gl.disableVertexAttribArray(shader.attribs.color);
        }
        
        // Bind index buffer e renderiza
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.LINES, this.lineCount, gl.UNSIGNED_SHORT, 0);
    }
    
    /**
     * Formata a escala atual para exibição
     * @param {number} scale - Escala em metros (ex: 1e-9 para 1nm)
     * @returns {string} - Texto formatado (ex: "1 nm", "10 μm", "1 mm")
     */
    static formatScale(scale) {
        if (scale >= 1) {
            return `${scale.toFixed(0)} m`;
        } else if (scale >= 1e-2) {
            return `${(scale * 100).toFixed(0)} cm`;
        } else if (scale >= 1e-3) {
            return `${(scale * 1000).toFixed(0)} mm`;
        } else if (scale >= 1e-6) {
            return `${(scale * 1e6).toFixed(0)} μm`;
        } else if (scale >= 1e-9) {
            return `${(scale * 1e9).toFixed(1)} nm`;
        } else if (scale >= 1e-12) {
            return `${(scale * 1e12).toFixed(1)} pm`;
        } else {
            return `${scale.toExponential(2)} m`;
        }
    }
}
