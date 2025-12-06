/**
 * Sistema de animação e transições entre escalas
 */
class AnimationController {
    constructor(objects, scaleFactor, transitionDuration) {
        this.objects = objects;
        this.scaleFactor = scaleFactor;
        this.transitionDuration = transitionDuration;
        this.baseScale = objects[0].scale;
        
        this.currentIndex = 0;
        this.targetIndex = 0;
        this.isTransitioning = false;
        this.transitionProgress = 0;
        this.continuousPosition = 0.0; // Posição contínua entre objetos (0.0 a objects.length-1)
        this.targetContinuousPosition = 0.0;
        this.isSliderControlled = false;
        
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
     * Vai para a próxima escala (com transição direta de 1 passo)
     */
    nextScale() {
        if (this.targetIndex < this.objects.length - 1) {
            this.startTransition(this.targetIndex + 1);
        }
    }
    
    /**
     * Vai para a escala anterior (com transição direta de 1 passo)
     */
    prevScale() {
        if (this.targetIndex > 0) {
            this.startTransition(this.targetIndex - 1);
        }
    }
    
    /**
     * Vai para uma escala específica, passando por todas as escalas intermédias
     * @param {number} targetIndex - Índice da escala de destino
     */
    jumpToScale(targetIndex) {
        if (targetIndex < 0 || targetIndex >= this.objects.length) return;
        if (targetIndex === this.targetIndex) return;
        
        this.isSliderControlled = false;
        this.isPlaying = false;
        
        // Se está antes do alvo, move um passo de cada vez
        if (targetIndex > this.targetIndex) {
            this.nextScale();
            // Agenda o próximo passo quando terminar
            this._scheduleJump(targetIndex);
        } else {
            this.prevScale();
            this._scheduleJump(targetIndex);
        }
    }
    
    /**
     * Agenda o próximo passo do salto
     * @private
     */
    _scheduleJump(targetIndex) {
        if (!this._jumpTimeout) {
            this._jumpTimeout = setTimeout(() => {
                this._jumpTimeout = null;
                if (this.targetIndex !== targetIndex && !this.isPlaying) {
                    this.jumpToScale(targetIndex);
                }
            }, this.transitionDuration * 1000 + 100);
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
        this.isSliderControlled = false;
        
        // Calcula nova distância da câmera
        const targetObject = this.objects[newIndex];
        this.camera.targetDistance = this.calculateCameraDistance(targetObject);
    }
    
    /**
     * Define a posição contínua via slider (0.0 a objects.length-1)
     */
    setContinuousPosition(position) {
        const newPosition = Math.max(0, Math.min(position, this.objects.length - 1));
        const targetIndex = Math.round(newPosition);
        
        // Se o salto é muito grande (mais de 1 escala), passa por todas as intermédias
        const currentTarget = this.targetIndex;
        const distance = Math.abs(targetIndex - currentTarget);
        
        if (distance > 1 && !this.isTransitioning) {
            // Usa transição encadeada através de escalas intermédias
            this.jumpToScale(targetIndex);
        } else {
            // Transição suave/interpolação contínua
            this.isPlaying = false;
            this.isSliderControlled = true;
            this.targetContinuousPosition = newPosition;
        }
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
            distance = maxDist * 2.5 * (object.scale / this.baseScale);
        }
        
        return Math.max(3.0, Math.min(distance, 1e10)); // Limitar para evitar valores extremos
    }
    
    /**
     * Atualiza a animação
     */
    update(deltaTime) {
        // Atualiza rotação automática
        if (this.autoRotateEnabled) {
            this.rotationAngle += deltaTime * 0.5 * this.speed;
        }
        
        // Atualiza posição contínua (slider ou transições discretas)
        if (this.isSliderControlled) {
            // Transição rápida de 0.3s para a posição do slider
            const diff = this.targetContinuousPosition - this.continuousPosition;
            const transitionSpeed = 1.0 / 0.3; // Completa em 0.3s
            const maxChange = deltaTime * transitionSpeed * Math.abs(diff);
            
            if (Math.abs(diff) < 0.001) {
                this.continuousPosition = this.targetContinuousPosition;
            } else {
                this.continuousPosition += Math.sign(diff) * Math.min(Math.abs(diff), maxChange);
            }
            
            // Atualiza índices baseado na posição contínua
            this.currentIndex = Math.floor(this.continuousPosition);
            this.targetIndex = Math.min(this.currentIndex + 1, this.objects.length - 1);
            
        } else if (this.isTransitioning) {
            // Transição discreta entre objetos (modo automático)
            this.transitionProgress += (deltaTime / this.transitionDuration) * this.speed;
            
            if (this.transitionProgress >= 1.0) {
                this.transitionProgress = 1.0;
                this.isTransitioning = false;
                this.currentIndex = this.targetIndex;
                this.continuousPosition = this.currentIndex;
                this.targetContinuousPosition = this.currentIndex;
                
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
        
        // Calcula distância da câmera baseada na escala atual
        const currentObject = this.getCurrentObjectForCamera();
        this.camera.targetDistance = this.calculateCameraDistance(currentObject);
        
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
     * Obtém o objeto para cálculo de câmera (baseado na posição contínua)
     */
    getCurrentObjectForCamera() {
        const index = Math.round(this.continuousPosition);
        return this.objects[Math.max(0, Math.min(index, this.objects.length - 1))];
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
        
        // Determina o fator de transição
        let t;
        if (this.isSliderControlled) {
            // Interpolação contínua baseada na posição do slider
            t = this.continuousPosition - this.currentIndex;
        } else if (this.isTransitioning) {
            // Transição discreta com easing
            t = this.easeInOutCubic(this.transitionProgress);
        } else {
            // Sem transição
            t = 0.0;
        }
        
        if (t < 0.001 && !this.isSliderControlled) {
            // Apenas o objeto atual (sem interpolação)
            info.objects.push({
                object: this.getCurrentObject(),
                alpha: 1.0,
                scale: this.getCurrentObject().scale / this.baseScale
            });
        } else {
            // Transição/interpolação entre dois objetos
            const currentObject = this.objects[this.currentIndex];
            const targetObject = this.objects[this.targetIndex];
            
            const currentRelativeScale = currentObject.scale / this.baseScale;
            const targetRelativeScale = targetObject.scale / this.baseScale;
            
            // Ambos os objetos interpolam de suas escalas ATUAIS para suas escalas FINAIS
            // Objeto atual: de currentRelativeScale para (currentRelativeScale / targetRelativeScale)
            // Objeto alvo: de targetRelativeScale para targetRelativeScale (já está no tamanho final renderizado)
            
            // Interpolação linear simples entre os tamanhos
            const currentScale = currentRelativeScale * (1.0 - t) + (currentRelativeScale / targetRelativeScale) * t;
            const targetScale = targetRelativeScale * (1.0 - t) + targetRelativeScale * t;
            
            // Fade out do objeto atual e fade in do objeto alvo
            const currentAlpha = 1.0 - t;
            const targetAlpha = t;
            
            info.objects.push({
                object: currentObject,
                alpha: currentAlpha,
                scale: currentScale
            });
            
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
    
    /**
     * Obtém a posição contínua atual
     */
    getContinuousPosition() {
        if (this.isSliderControlled) {
            return this.continuousPosition;
        } else if (this.isTransitioning) {
            return this.currentIndex + this.transitionProgress;
        } else {
            return this.currentIndex;
        }
    }
}
