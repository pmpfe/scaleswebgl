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
            distance: 8.0,
            targetDistance: 8.0
        };
    }
    
    /**
     * Inicia a reprodução automática
     */
    play() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            // Se não está em transição e não está no slider, inicia a transição
            if (!this.isTransitioning && !this.isSliderControlled) {
                // Se está no final, volta ao início
                if (this.currentIndex >= this.objects.length - 1) {
                    this.reset();
                }
                // Agenda a primeira transição
                setTimeout(() => {
                    if (this.isPlaying) {
                        this.nextScale();
                    }
                }, 100);
            }
        }
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
     * Salta imediatamente para uma escala sem animação encadeada
     * Usado quando o utilizador clica num objeto da lista
     */
    jumpToScaleImmediate(targetIndex) {
        if (targetIndex < 0 || targetIndex >= this.objects.length) return;
        
        // Cancela qualquer jump agendado
        if (this._jumpTimeout) {
            clearTimeout(this._jumpTimeout);
            this._jumpTimeout = null;
        }
        
        // Para qualquer animação em curso
        this.isSliderControlled = false;
        this.isPlaying = false;
        
        // Salta diretamente para o índice alvo
        this.currentIndex = this.targetIndex;
        this.targetIndex = targetIndex;
        this.continuousPosition = targetIndex;
        this.targetContinuousPosition = targetIndex;
        this.isTransitioning = true;
        this.transitionProgress = 0;
        
        // Calcula nova distância da câmera
        const targetObject = this.objects[targetIndex];
        this.camera.targetDistance = this.calculateCameraDistance(targetObject);
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
     * Com o novo sistema de grelha, a câmera deve estar sempre à mesma distância
     * porque a grelha é que muda de escala, não os objetos
     */
    calculateCameraDistance(object) {
        // Distância fixa que permite ver a grelha 10x10 com FOV=45°
        // A grelha já se adapta, então a câmera fica sempre no mesmo sítio
        return 8.0; // Distância que permite ver confortavelmente a grelha completa
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
     * Nova abordagem: grelha representa a escala, objetos têm dimensão física real
     */
    getRenderInfo() {
        const info = {
            objects: [],
            cameraDistance: this.camera.distance,
            rotationAngle: this.rotationAngle,
            gridScale: 1.0,  // Escala da grelha em metros
            gridLabel: ''    // Label da grelha (ex: "1 nm", "10 μm")
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
            // Apenas o objeto atual
            const currentObject = this.getCurrentObject();
            
            // A grelha representa a ordem de magnitude do objeto
            // Ex: átomo H (0.05nm) → grelha de 0.1nm (1e-10m)
            info.gridScale = currentObject.scale;
            
            // O objeto é renderizado com tamanho relativo à grelha
            // Precisa normalizar pelo tamanho do modelo 3D (bounding box)
            // Exemplo: objectSize=1.7m, gridScale=2m, modelBoundingSize=2.0
            // objectScaleInGrid = (1.7 / 2) / 2.0 = 0.425
            const objectScaleInGrid = (currentObject.objectSize / info.gridScale) / (currentObject.modelBoundingSize || 1.0);
            
            info.objects.push({
                object: currentObject,
                alpha: 1.0,
                scale: objectScaleInGrid
            });
        } else {
            // Transição entre dois objetos
            const currentObject = this.objects[this.currentIndex];
            const targetObject = this.objects[this.targetIndex];
            
            // Durante a transição, a escala da grelha muda suavemente
            // de currentObject.scale para targetObject.scale
            const logCurrentScale = Math.log10(currentObject.scale);
            const logTargetScale = Math.log10(targetObject.scale);
            const logGridScale = logCurrentScale * (1.0 - t) + logTargetScale * t;
            info.gridScale = Math.pow(10, logGridScale);
            
            // Ambos os objetos são renderizados com tamanho relativo à grelha atual
            // Normaliza pelo tamanho do bounding box de cada modelo
            const currentScaleInGrid = (currentObject.objectSize / info.gridScale) / (currentObject.modelBoundingSize || 1.0);
            const targetScaleInGrid = (targetObject.objectSize / info.gridScale) / (targetObject.modelBoundingSize || 1.0);
            
            // Fade out do objeto atual e fade in do objeto alvo
            const currentAlpha = 1.0 - t;
            const targetAlpha = t;
            
            info.objects.push({
                object: currentObject,
                alpha: currentAlpha,
                scale: currentScaleInGrid
            });
            
            info.objects.push({
                object: targetObject,
                alpha: targetAlpha,
                scale: targetScaleInGrid
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
