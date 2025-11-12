/**
 * Aplicação principal
 */
class PowersOfTenApp {
    constructor() {
        this.canvas = null;
        this.renderer = null;
        this.objLoader = null;
        this.objects = [];
        this.animation = null;
        this.config = null;
        
        this.lastTime = 0;
        this.isRunning = false;
        
        this.ui = {
            playPause: null,
            reset: null,
            nextScale: null,
            prevScale: null,
            speed: null,
            speedValue: null,
            autoRotate: null,
            wireframe: null,
            currentScale: null,
            currentObject: null,
            currentSize: null,
            loading: null
        };
    }
    
    /**
     * Inicializa a aplicação
     */
    async init() {
        console.log('Inicializando Powers of Ten...');
        
        // Referências aos elementos da UI
        this.canvas = document.getElementById('canvas');
        this.ui.playPause = document.getElementById('playPause');
        this.ui.reset = document.getElementById('reset');
        this.ui.nextScale = document.getElementById('nextScale');
        this.ui.prevScale = document.getElementById('prevScale');
        this.ui.speed = document.getElementById('speed');
        this.ui.speedValue = document.getElementById('speedValue');
        this.ui.autoRotate = document.getElementById('autoRotate');
        this.ui.wireframe = document.getElementById('wireframe');
        this.ui.currentScale = document.getElementById('currentScale');
        this.ui.currentObject = document.getElementById('currentObject');
        this.ui.currentSize = document.getElementById('currentSize');
        this.ui.loading = document.getElementById('loading');
        
        // Inicializa o renderizador
        this.renderer = new Renderer(this.canvas);
        this.objLoader = new OBJLoader();
        
        // Carrega a configuração
        await this.loadConfig();
        
        // Carrega os objetos
        await this.loadObjects();
        
        // Inicializa o controlador de animação
        this.animation = new AnimationController(
            this.objects,
            this.config.scaleFactor,
            this.config.transitionDuration
        );
        
        // Configura eventos
        this.setupEvents();
        
        // Esconde o loading
        this.ui.loading.style.display = 'none';
        
        // Atualiza a UI
        this.updateUI();
        
        // Inicia o loop de renderização
        this.isRunning = true;
        this.lastTime = performance.now();
        this.render();
        
        console.log('Aplicação inicializada!');
    }
    
    /**
     * Carrega a configuração
     */
    async loadConfig() {
        try {
            const response = await fetch('config.json');
            this.config = await response.json();
            console.log('Configuração carregada:', this.config);
        } catch (error) {
            console.error('Erro ao carregar configuração:', error);
            // Usa configuração padrão
            this.config = {
                scaleFactor: 1000,
                transitionDuration: 3.0,
                scales: []
            };
        }
    }
    
    /**
     * Carrega todos os objetos
     */
    async loadObjects() {
        console.log('Carregando objetos...');
        
        for (let i = 0; i < this.config.scales.length; i++) {
            const scaleConfig = this.config.scales[i];
            const obj = new ScaleObject(scaleConfig, i);
            await obj.load(this.renderer.gl, this.objLoader);
            this.objects.push(obj);
            
            console.log(`Objeto ${i + 1}/${this.config.scales.length} carregado: ${obj.name}`);
        }
        
        console.log('Todos os objetos carregados!');
    }
    
    /**
     * Configura eventos da UI
     */
    setupEvents() {
        // Botão Play/Pause
        this.ui.playPause.addEventListener('click', () => {
            if (this.animation.isPlaying) {
                this.animation.pause();
                this.ui.playPause.textContent = '▶ Play';
            } else {
                this.animation.play();
                this.ui.playPause.textContent = '⏸ Pause';
            }
        });
        
        // Botão Reset
        this.ui.reset.addEventListener('click', () => {
            this.animation.reset();
            this.ui.playPause.textContent = '▶ Play';
            this.updateUI();
        });
        
        // Botões de navegação
        this.ui.nextScale.addEventListener('click', () => {
            this.animation.nextScale();
        });
        
        this.ui.prevScale.addEventListener('click', () => {
            this.animation.prevScale();
        });
        
        // Controle de velocidade
        this.ui.speed.addEventListener('input', (e) => {
            const speed = parseFloat(e.target.value);
            this.animation.setSpeed(speed);
            this.ui.speedValue.textContent = speed.toFixed(1);
        });
        
        // Rotação automática
        this.ui.autoRotate.addEventListener('change', (e) => {
            this.animation.setAutoRotate(e.target.checked);
        });
        
        // Modo wireframe
        this.ui.wireframe.addEventListener('change', (e) => {
            this.renderer.setWireframeMode(e.target.checked);
        });
        
        // Teclas de atalho
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case ' ':
                    e.preventDefault();
                    this.ui.playPause.click();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.ui.nextScale.click();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.ui.prevScale.click();
                    break;
                case 'r':
                case 'R':
                    this.ui.reset.click();
                    break;
            }
        });
    }
    
    /**
     * Atualiza a interface
     */
    updateUI() {
        const currentIndex = this.animation.getCurrentIndex();
        const currentObject = this.objects[currentIndex];
        
        if (currentObject) {
            this.ui.currentScale.textContent = currentObject.scale.toExponential(2);
            this.ui.currentObject.textContent = currentObject.name;
            this.ui.currentSize.textContent = currentObject.size;
        }
        
        // Atualiza estado dos botões
        this.ui.prevScale.disabled = currentIndex === 0;
        this.ui.nextScale.disabled = currentIndex === this.objects.length - 1;
    }
    
    /**
     * Loop principal de renderização
     */
    render() {
        if (!this.isRunning) return;
        
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000.0;
        this.lastTime = currentTime;
        
        // Atualiza animação
        this.animation.update(deltaTime);
        
        // Atualiza UI
        this.updateUI();
        
        // Renderiza a cena
        this.renderScene();
        
        // Próximo frame
        requestAnimationFrame(() => this.render());
    }
    
    /**
     * Renderiza a cena
     */
    renderScene() {
        const gl = this.renderer.gl;
        this.renderer.clear();
        
        // Informações de renderização
        const renderInfo = this.animation.getRenderInfo();
        
        // Matriz de projeção
        const aspect = this.canvas.width / this.canvas.height;
        const projectionMatrix = this.renderer.createProjectionMatrix(
            45 * Math.PI / 180,
            aspect,
            0.1,
            1000.0
        );
        
        // Matriz de visualização (câmera)
        const eye = vec3.fromValues(
            0,
            renderInfo.cameraDistance * 0.3,
            renderInfo.cameraDistance
        );
        const center = vec3.fromValues(0, 0, 0);
        const up = vec3.fromValues(0, 1, 0);
        const viewMatrix = this.renderer.createViewMatrix(eye, center, up);
        
        // Renderiza cada objeto
        for (const item of renderInfo.objects) {
            const modelMatrix = mat4.create();
            
            // Rotação
            mat4.rotateY(modelMatrix, modelMatrix, renderInfo.rotationAngle);
            mat4.rotateX(modelMatrix, modelMatrix, renderInfo.rotationAngle * 0.3);
            
            // Escala
            mat4.scale(modelMatrix, modelMatrix, [item.scale, item.scale, item.scale]);
            
            // Renderiza
            this.renderer.renderObject(
                item.object,
                modelMatrix,
                viewMatrix,
                projectionMatrix,
                item.alpha
            );
        }
    }
    
    /**
     * Para a aplicação
     */
    stop() {
        this.isRunning = false;
    }
}

// Inicializa a aplicação quando a página carregar
let app;

window.addEventListener('load', async () => {
    app = new PowersOfTenApp();
    try {
        await app.init();
    } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
        document.getElementById('loading').innerHTML = `
            <div style="color: #f44336;">
                <h2>Erro ao carregar</h2>
                <p>${error.message}</p>
            </div>
        `;
    }
});
