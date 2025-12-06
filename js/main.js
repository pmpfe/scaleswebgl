/**
 * Aplicação principal
 */
class PowersOfTenApp {
    constructor() {
        this.canvas = null;
        this.renderer = null;
        this.modelLoader = null;
        this.objects = [];
        this.animation = null;
        this.config = null;
        this.logger = null;
        
        this.lastTime = 0;
        this.isRunning = false;
        
        this.ui = {
            playPause: null,
            reset: null,
            nextScale: null,
            prevScale: null,
            speed: null,
            speedValue: null,
            scaleSlider: null,
            scaleSliderValue: null,
            autoRotate: null,
            wireframe: null,
            currentScale: null,
            currentObject: null,
            currentSize: null,
            loading: null,
            objectListItems: null
        };
    }
    
    /**
     * Inicializa a aplicação
     */
    async init() {
        console.log('Inicializando Cosmic Scales...');
        
        // Referências aos elementos da UI
        this.canvas = document.getElementById('canvas');
        this.ui.playPause = document.getElementById('playPause');
        this.ui.reset = document.getElementById('reset');
        this.ui.nextScale = document.getElementById('nextScale');
        this.ui.prevScale = document.getElementById('prevScale');
        this.ui.speed = document.getElementById('speed');
        this.ui.speedValue = document.getElementById('speedValue');
        this.ui.scaleSlider = document.getElementById('scaleSlider');
        this.ui.scaleSliderValue = document.getElementById('scaleSliderValue');
        this.ui.autoRotate = document.getElementById('autoRotate');
        this.ui.wireframe = document.getElementById('wireframe');
        this.ui.useModelColors = document.getElementById('useModelColors');
        this.ui.currentScale = document.getElementById('currentScale');
        this.ui.currentObject = document.getElementById('currentObject');
        this.ui.currentSize = document.getElementById('currentSize');
        this.ui.loading = document.getElementById('loading');
        this.ui.objectListItems = document.getElementById('objectListItems');
        this.ui.logWindow = document.getElementById('logWindow');
        this.ui.logHeader = document.getElementById('logHeader');
        this.ui.logBody = document.getElementById('logBody');
        
        // Inicializa o renderizador
        this.renderer = new Renderer(this.canvas);
        this.modelLoader = new ModelLoader();

        // Inicializa logger
        this.initLogger();
        
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
        
        // Atualiza slider de escala
        const continuousPos = this.animation.getContinuousPosition();
        this.ui.scaleSlider.value = continuousPos;
        this.ui.scaleSliderValue.textContent = Math.round(continuousPos);
        
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
            this.logInfo('Configuração carregada com sucesso');
        } catch (error) {
            console.error('Erro ao carregar configuração:', error);
            // Usa configuração padrão
            this.config = {
                scaleFactor: 1000,
                transitionDuration: 3.0,
                scales: []
            };
            this.logError('Erro ao carregar config.json; usando configuração padrão. Detalhe: ' + error.message);
        }
    }
    
    /**
     * Carrega todos os objetos
     */
    async loadObjects() {
        console.log('Carregando objetos...');
        this.logInfo('Carregando objetos...');
        
        for (let i = 0; i < this.config.scales.length; i++) {
            const scaleConfig = this.config.scales[i];
            const obj = new ScaleObject(scaleConfig, i);
            try {
                const result = await obj.load(this.renderer.gl, this.modelLoader);
                this.objects.push(obj);
                const fmt = scaleConfig.model.split('.').pop();
                if (result.success) {
                    this.logInfo(`Carregado ${obj.name} (${fmt}, ${result.verticesCount} vértices)`);
                } else {
                    this.logWarn(`Fallback procedural para ${obj.name} (modelo: ${fmt}, erro no load)`);
                }
                console.log(`Objeto ${i + 1}/${this.config.scales.length} carregado: ${obj.name}`);
            } catch (err) {
                this.objects.push(obj); // já gerou geometria procedural
                this.logError(`Erro ao carregar ${scaleConfig.name}: ${err.message}`);
            }
        }
        
        console.log('Todos os objetos carregados!');
        this.logInfo('Todos os objetos carregados');
        
        // Configura o slider de escala
        this.ui.scaleSlider.max = this.objects.length - 1;
        
        // Popula a lista de objetos
        this.populateObjectList();
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
        
        // Controlo de velocidade
        this.ui.speed.addEventListener('input', (e) => {
            const speed = parseFloat(e.target.value);
            this.animation.setSpeed(speed);
            this.ui.speedValue.textContent = speed.toFixed(1);
        });
        
        // Slider de escala contínua
        this.ui.scaleSlider.addEventListener('input', (e) => {
            const position = parseFloat(e.target.value);
            this.animation.setContinuousPosition(position);
            const index = Math.round(position);
            this.ui.scaleSliderValue.textContent = index;
            this.updateObjectListHighlight();
        });
        
        // Rotação automática
        this.ui.autoRotate.addEventListener('change', (e) => {
            this.animation.setAutoRotate(e.target.checked);
        });
        
        // Modo wireframe
        this.ui.wireframe.addEventListener('change', (e) => {
            this.renderer.setWireframeMode(e.target.checked);
        });
        
        // Usar cores do modelo
        this.ui.useModelColors.addEventListener('change', (e) => {
            window.useModelColors = e.target.checked;
        });
        
        // Inicializar flag global
        window.useModelColors = false;
        
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
     * Popula a lista de objetos no painel lateral
     */
    populateObjectList() {
        this.ui.objectListItems.innerHTML = '';
        
        this.config.scales.forEach((scaleConfig, index) => {
            const item = document.createElement('div');
            item.className = 'object-list-item';
            item.dataset.index = index;
            
            const name = document.createElement('span');
            name.className = 'object-list-item-name';
            name.textContent = scaleConfig.name;
            
            const scale = document.createElement('span');
            scale.className = 'object-list-item-scale';
            scale.textContent = scaleConfig.size;
            
            item.appendChild(name);
            item.appendChild(scale);
            
            // Click handler - salta para esta escala
            item.addEventListener('click', () => {
                this.ui.scaleSlider.value = index;
                this.animation.setContinuousPosition(index);
                this.updateObjectListHighlight();
            });
            
            this.ui.objectListItems.appendChild(item);
        });
    }
    
    /**
     * Atualiza o destaque dos objetos visíveis na lista
     */
    updateObjectListHighlight() {
        const items = document.querySelectorAll('.object-list-item');
        const renderInfo = this.animation.getRenderInfo();
        
        // Remove todos os destaques
        items.forEach(item => {
            item.classList.remove('visible', 'primary');
        });
        
        // Adiciona destaque aos objetos visíveis
        renderInfo.objects.forEach((info, idx) => {
            if (info.alpha > 0.01) { // Apenas objetos visíveis
                const objectIndex = this.objects.indexOf(info.object);
                if (objectIndex !== -1 && items[objectIndex]) {
                    items[objectIndex].classList.add('visible');
                    // O objeto com maior alpha é o "primary"
                    if (info.alpha > 0.5) {
                        items[objectIndex].classList.add('primary');
                    }
                }
            }
        });
        
        // Scroll automático para o item principal visível
        const primaryItem = document.querySelector('.object-list-item.primary');
        if (primaryItem) {
            primaryItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
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
        
        // Atualiza slider se estiver em animação automática
        if (this.animation.isPlaying || this.animation.isSliderControlled) {
            const continuousPos = this.animation.getContinuousPosition();
            this.ui.scaleSlider.value = continuousPos;
            this.ui.scaleSliderValue.textContent = Math.round(continuousPos);
        }
        
        // Atualiza destaque da lista
        this.updateObjectListHighlight();
        
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
            1e20
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

    /**
     * Inicializa logger e eventos de drag da janela
     */
    initLogger() {
        if (!this.ui.logWindow || !this.ui.logHeader || !this.ui.logBody) return;
        this.logger = {
            drag: { active: false, offsetX: 0, offsetY: 0 },
            body: this.ui.logBody,
            maxEntries: 200
        };
        const header = this.ui.logHeader;
        const win = this.ui.logWindow;
        const drag = this.logger.drag;
        header.addEventListener('mousedown', (e) => {
            drag.active = true;
            const rect = win.getBoundingClientRect();
            drag.offsetX = e.clientX - rect.left;
            drag.offsetY = e.clientY - rect.top;
            win.style.right = 'auto';
            document.body.style.userSelect = 'none';
        });
        window.addEventListener('mousemove', (e) => {
            if (!drag.active) return;
            const left = e.clientX - drag.offsetX;
            const top = e.clientY - drag.offsetY;
            win.style.left = `${left}px`;
            win.style.top = `${top}px`;
        });
        window.addEventListener('mouseup', () => {
            drag.active = false;
            document.body.style.userSelect = '';
        });
    }

    log(level, message) {
        if (!this.logger) return;
        const body = this.logger.body;
        const time = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.className = `log-entry ${level}`;
        entry.innerHTML = `<span class="log-time">[${time}]</span>${message}`;
        body.appendChild(entry);
        // limita entradas
        while (body.children.length > this.logger.maxEntries) {
            body.removeChild(body.firstChild);
        }
        body.scrollTop = body.scrollHeight;
    }

    logInfo(msg) { this.log('info', msg); }
    logWarn(msg) { this.log('warn', msg); }
    logError(msg) { this.log('error', msg); }
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
