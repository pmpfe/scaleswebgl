/**
 * Renderizador WebGL
 */
class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = null;
        this.shader = null;
        this.wireframeMode = true;
        
        this.initGL();
        this.initShaders();
        this.resize();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    /**
     * Inicializa o contexto WebGL
     */
    initGL() {
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        
        if (!this.gl) {
            alert('WebGL não está disponível no seu navegador!');
            throw new Error('WebGL not supported');
        }
        
        const gl = this.gl;
        
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.lineWidth(1.0);
    }
    
    /**
     * Inicializa os shaders
     */
    initShaders() {
        const gl = this.gl;
        
        // Vertex shader
        const vsSource = `
            attribute vec3 aPosition;
            attribute vec3 aColor;
            
            uniform mat4 uModelMatrix;
            uniform mat4 uViewMatrix;
            uniform mat4 uProjectionMatrix;
            uniform bool uUseVertexColors;
            uniform vec3 uColor;
            
            varying vec3 vColor;
            
            void main() {
                gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
                vColor = uUseVertexColors ? aColor : uColor;
            }
        `;
        
        // Fragment shader
        const fsSource = `
            precision mediump float;
            
            uniform float uAlpha;
            varying vec3 vColor;
            
            void main() {
                gl_FragColor = vec4(vColor, uAlpha);
            }
        `;
        
        const vertexShader = this.compileShader(gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, fsSource);
        
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Erro ao linkar shaders:', gl.getProgramInfoLog(program));
            return;
        }
        
        this.shader = {
            program: program,
            attribs: {
                position: gl.getAttribLocation(program, 'aPosition'),
                color: gl.getAttribLocation(program, 'aColor')
            },
            uniforms: {
                modelMatrix: gl.getUniformLocation(program, 'uModelMatrix'),
                viewMatrix: gl.getUniformLocation(program, 'uViewMatrix'),
                projectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix'),
                color: gl.getUniformLocation(program, 'uColor'),
                alpha: gl.getUniformLocation(program, 'uAlpha'),
                useVertexColors: gl.getUniformLocation(program, 'uUseVertexColors')
            }
        };
    }
    
    /**
     * Compila um shader
     */
    compileShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Erro ao compilar shader:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    /**
     * Redimensiona o canvas
     */
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Limpa o buffer
     */
    clear() {
        const gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    
    /**
     * Renderiza um objeto
     */
    renderObject(object, modelMatrix, viewMatrix, projectionMatrix, alpha = 1.0) {
        const gl = this.gl;
        
        gl.useProgram(this.shader.program);
        
        // Define matrizes
        gl.uniformMatrix4fv(this.shader.uniforms.modelMatrix, false, modelMatrix);
        gl.uniformMatrix4fv(this.shader.uniforms.viewMatrix, false, viewMatrix);
        gl.uniformMatrix4fv(this.shader.uniforms.projectionMatrix, false, projectionMatrix);
        
        // Define cor e alpha
        const useModelColors = window.useModelColors !== undefined ? window.useModelColors : false;
        gl.uniform1i(this.shader.uniforms.useVertexColors, useModelColors && object.colors ? 1 : 0);
        gl.uniform3fv(this.shader.uniforms.color, object.color);
        gl.uniform1f(this.shader.uniforms.alpha, alpha);
        
        // Renderiza o objeto
        object.render(gl, this.shader);
    }
    
    /**
     * Cria uma matriz de projeção em perspectiva
     */
    createProjectionMatrix(fov, aspect, near, far) {
        const mat = mat4.create();
        mat4.perspective(mat, fov, aspect, near, far);
        return mat;
    }
    
    /**
     * Cria uma matriz de visualização
     */
    createViewMatrix(eye, center, up) {
        const mat = mat4.create();
        mat4.lookAt(mat, eye, center, up);
        return mat;
    }
    
    /**
     * Ativa/desativa modo wireframe
     */
    setWireframeMode(enabled) {
        this.wireframeMode = enabled;
    }
}
