/**
 * Sistema de animação e transições entre escalas
 */
class AnimationController {
    constructor(objects, scaleFactor, transitionDuration) {
        this.objects = objects;
        this.scaleFactor = scaleFactor;
        this.transitionDuration = transitionDuration;
        
        this.currentIndex = 0;
        this.targetIndex = 0;
        this.isTransitioning = false;
        this.transitionProgress = 0;
        
        this.isPlaying = false;
        this.autoRotateEnabled = true;
        this.rotationAngle = 0;
        this.speed = 1.0;
        
        this.camera = {
            distance: 5.0,
            targetDistance: 5.0
        };
    }
    
    /**
     * Inicia a reprodução automática
     */
    play() {
        this.isPlaying = true;
    }
    
    /**
     * Pausa a reprodução
     */
    pause() {
        this.isPlaying = false;
    }
    
    /**
     * Reinicia a animação
     */
    reset() {
        this.currentIndex = 0;
        this.targetIndex = 0;
        this.isTransitioning = false;
        this.transitionProgress = 0;
        this.rotationAngle = 0;
        this.pause();
    }
    
    /**
     * Vai para a próxima escala
     */
    nextScale() {
        if (this.targetIndex < this.objects.length - 1) {
            this.startTransition(this.targetIndex + 1);
        }
    }
    
    /**
     * Vai para a escala anterior
     */
    prevScale() {
        if (this.targetIndex > 0) {
            this.startTransition(this.targetIndex - 1);
        }
    }
    
    /**
     * Inicia uma transição para uma nova escala
     */
    startTransition(newIndex) {
        if (newIndex < 0 || newIndex >= this.objects.length) return;
        
        this.currentIndex = this.targetIndex;
        this.targetIndex = newIndex;
        this.isTransitioning = true;
        this.transitionProgress = 0;
        
        // Calcula nova distância da câmera
        const targetObject = this.objects[newIndex];
        this.camera.targetDistance = this.calculateCameraDistance(targetObject);
    }
    
    /**
     * Calcula a distância ideal da câmera para um objeto
     */
    calculateCameraDistance(object) {
        // Distância base proporcional ao tamanho do objeto
        let distance = 5.0;
        
        if (object.vertices) {
            // Calcula o bounding box do objeto
            let maxDist = 0;
            for (let i = 0; i < object.vertices.length; i += 3) {
                const x = object.vertices[i];
                const y = object.vertices[i + 1];
                const z = object.vertices[i + 2];
                const dist = Math.sqrt(x * x + y * y + z * z);
                maxDist = Math.max(maxDist, dist);
            }
            distance = maxDist * 2.5;
        }
        
        return Math.max(3.0, Math.min(distance, 20.0));
    }
    
    /**
     * Atualiza a animação
     */
    update(deltaTime) {
        // Atualiza rotação automática
        if (this.autoRotateEnabled) {
            this.rotationAngle += deltaTime * 0.5 * this.speed;
        }
        
        // Atualiza transição
        if (this.isTransitioning) {
            this.transitionProgress += (deltaTime / this.transitionDuration) * this.speed;
            
            if (this.transitionProgress >= 1.0) {
                this.transitionProgress = 1.0;
                this.isTransitioning = false;
                this.currentIndex = this.targetIndex;
                
                // Se estiver em modo play, continua para a próxima escala
                if (this.isPlaying && this.currentIndex < this.objects.length - 1) {
                    setTimeout(() => this.nextScale(), 1000);
                } else if (this.isPlaying && this.currentIndex >= this.objects.length - 1) {
                    this.pause();
                }
            }
        } else if (this.isPlaying && !this.isTransitioning) {
            // Inicia a primeira transição
            this.nextScale();
        }
        
        // Suaviza a distância da câmera
        const distDiff = this.camera.targetDistance - this.camera.distance;
        this.camera.distance += distDiff * deltaTime * 2.0;
    }
    
    /**
     * Obtém o objeto atual
     */
    getCurrentObject() {
        return this.objects[this.currentIndex];
    }
    
    /**
     * Obtém o objeto alvo
     */
    getTargetObject() {
        return this.objects[this.targetIndex];
    }
    
    /**
     * Obtém informações para renderização
     */
    getRenderInfo() {
        const info = {
            objects: [],
            cameraDistance: this.camera.distance,
            rotationAngle: this.rotationAngle
        };
        
        if (!this.isTransitioning) {
            // Apenas o objeto atual
            info.objects.push({
                object: this.getCurrentObject(),
                alpha: 1.0,
                scale: 1.0
            });
        } else {
            // Transição entre dois objetos
            const t = this.easeInOutCubic(this.transitionProgress);
            const currentObject = this.objects[this.currentIndex];
            const targetObject = this.objects[this.targetIndex];
            
            // Objeto atual (fade out e zoom)
            const zoomingOut = this.targetIndex > this.currentIndex;
            const currentScale = zoomingOut ? 1.0 - t * 0.5 : 1.0 + t * 0.5;
            const currentAlpha = 1.0 - t;
            
            info.objects.push({
                object: currentObject,
                alpha: currentAlpha,
                scale: currentScale
            });
            
            // Objeto alvo (fade in e zoom)
            const targetScale = zoomingOut ? 0.5 + t * 0.5 : 1.5 - t * 0.5;
            const targetAlpha = t;
            
            info.objects.push({
                object: targetObject,
                alpha: targetAlpha,
                scale: targetScale
            });
        }
        
        return info;
    }
    
    /**
     * Função de easing para transições suaves
     */
    easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    /**
     * Define a velocidade de animação
     */
    setSpeed(speed) {
        this.speed = Math.max(0.1, Math.min(speed, 3.0));
    }
    
    /**
     * Ativa/desativa rotação automática
     */
    setAutoRotate(enabled) {
        this.autoRotateEnabled = enabled;
    }
    
    /**
     * Obtém o índice atual
     */
    getCurrentIndex() {
        return this.isTransitioning ? this.targetIndex : this.currentIndex;
    }
}
