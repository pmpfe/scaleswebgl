# Arquitetura do Sistema - Powers of Ten

## Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                        POWERS OF TEN                            │
│                     Aplicação WebGL                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         index.html                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐    │
│  │   Canvas   │  │  Controles │  │  Display Informações   │    │
│  │   WebGL    │  │     UI     │  │   (Escala/Objeto)      │    │
│  └────────────┘  └────────────┘  └────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ main.js  │  │config.json│ │gl-matrix │
        │  (App)   │  │  (Data)  │  │  (Math)  │
        └──────────┘  └──────────┘  └──────────┘
                │
        ┌───────┼───────┬──────────┬──────────┐
        ▼       ▼       ▼          ▼          ▼
  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
  │renderer  │ │animation │ │scaleobj  │ │objloader │
  │.js       │ │.js       │ │.js       │ │.js       │
  └──────────┘ └──────────┘ └──────────┘ └──────────┘
        │           │           │           │
        ▼           ▼           ▼           ▼
  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
  │  WebGL   │ │ Easing   │ │Geometria │ │  Cache   │
  │ Shaders  │ │Transições│ │Procedural│ │  Modelos │
  └──────────┘ └──────────┘ └──────────┘ └──────────┘
                                              │
                                              ▼
                                        ┌──────────┐
                                        │ models/  │
                                        │ *.obj    │
                                        └──────────┘
```

## Fluxo de Dados

```
Início da Aplicação
        │
        ▼
┌───────────────────┐
│ PowersOfTenApp    │
│ .init()           │
└───────────────────┘
        │
        ├─► Carregar config.json
        │   └─► Parse JSON → Array de escalas
        │
        ├─► Criar Renderer
        │   └─► Inicializar WebGL
        │       └─► Compilar Shaders
        │
        ├─► Criar OBJLoader
        │
        ├─► Carregar ScaleObjects
        │   ├─► Para cada escala:
        │   │   ├─► Tentar carregar modelo OBJ
        │   │   │   ├─► Sucesso → Parse e criar buffers
        │   │   │   └─► Falha → Gerar geometria procedural
        │   │   └─► Criar buffers WebGL
        │   └─► Array de objetos carregados
        │
        ├─► Criar AnimationController
        │   └─► Estado inicial: escala 0
        │
        └─► Iniciar Loop de Renderização
            └─► requestAnimationFrame()
```

## Loop de Renderização

```
┌─────────────────────────────────────┐
│ Frame (requestAnimationFrame)       │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│ Calcular deltaTime                  │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│ AnimationController.update()        │
│ • Atualizar rotação                 │
│ • Processar transição               │
│ • Ajustar câmera                    │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│ Atualizar UI                        │
│ • Display de escala                 │
│ • Nome do objeto                    │
│ • Estado dos botões                 │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│ Renderer.clear()                    │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│ getRenderInfo()                     │
│ • Objeto(s) a renderizar            │
│ • Alpha (transparência)             │
│ • Escala (zoom)                     │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│ Para cada objeto:                   │
│ • Criar matriz modelo (rotação)     │
│ • Aplicar escala                    │
│ • Renderer.renderObject()           │
│   └─► WebGL drawElements()          │
└─────────────────────────────────────┘
                │
                ▼
        Próximo Frame
```

## Transição Entre Escalas

```
Estado: ESCALA_ATUAL
        │
        ▼
   [Evento: Next/Prev]
        │
        ▼
AnimationController.startTransition()
        │
        ├─► currentIndex = índice atual
        ├─► targetIndex = novo índice
        ├─► isTransitioning = true
        ├─► transitionProgress = 0.0
        └─► Calcular nova distância câmera
        │
        ▼
┌─────────────────────────────────────┐
│ Durante Transição (update):         │
│                                     │
│ progress += deltaTime/duration      │
│ t = easeInOutCubic(progress)        │
│                                     │
│ Objeto Atual:                       │
│   alpha = 1.0 - t                   │
│   scale = zoom out ou in            │
│                                     │
│ Objeto Alvo:                        │
│   alpha = t                         │
│   scale = zoom in ou out            │
│                                     │
│ if (progress >= 1.0):               │
│   isTransitioning = false           │
│   currentIndex = targetIndex        │
└─────────────────────────────────────┘
        │
        ▼
Estado: NOVA_ESCALA
```

## Carregamento de Modelo OBJ

```
ScaleObject.load()
        │
        ▼
┌─────────────────────────────────────┐
│ OBJLoader.load(path)                │
└─────────────────────────────────────┘
        │
        ├─── Sucesso ──────┐
        │                  │
        │                  ▼
        │          ┌─────────────────┐
        │          │ Parse OBJ       │
        │          │ • Vértices (v)  │
        │          │ • Linhas (l)    │
        │          │ • Faces (f)     │
        │          └─────────────────┘
        │                  │
        │                  ▼
        │          ┌─────────────────┐
        │          │ Converter faces │
        │          │ em linhas       │
        │          └─────────────────┘
        │                  │
        │                  └──────┐
        │                         │
        └─── Falha ────┐          │
                       │          │
                       ▼          │
              ┌─────────────┐    │
              │ Geometria   │    │
              │ Procedural  │    │
              └─────────────┘    │
                       │          │
                       └────┬─────┘
                            │
                            ▼
                ┌───────────────────────┐
                │ Criar Buffers WebGL   │
                │ • Vertex Buffer       │
                │ • Index Buffer        │
                └───────────────────────┘
                            │
                            ▼
                    Objeto Pronto
```

## Pipeline WebGL

```
┌─────────────────────────────────────┐
│ JavaScript (Aplicação)              │
│ • Matrizes de transformação         │
│ • Dados de vértices                 │
│ • Cor e alpha                       │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│ WebGL API                           │
│ • gl.useProgram()                   │
│ • gl.uniformMatrix4fv()             │
│ • gl.vertexAttribPointer()          │
│ • gl.drawElements()                 │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│ GPU - Vertex Shader                 │
│                                     │
│ Input:                              │
│   • aPosition (vec3)                │
│   • uModelMatrix (mat4)             │
│   • uViewMatrix (mat4)              │
│   • uProjectionMatrix (mat4)        │
│                                     │
│ Output:                             │
│   • gl_Position (vec4)              │
│                                     │
│ gl_Position = projection *          │
│               view *                │
│               model *               │
│               vec4(position, 1.0)   │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│ Rasterização                        │
│ • Conversão de primitivas           │
│ • Interpolação                      │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│ GPU - Fragment Shader               │
│                                     │
│ Input:                              │
│   • uColor (vec3)                   │
│   • uAlpha (float)                  │
│                                     │
│ Output:                             │
│   • gl_FragColor (vec4)             │
│                                     │
│ gl_FragColor = vec4(color, alpha)   │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│ Framebuffer                         │
│ • Pixel final na tela               │
└─────────────────────────────────────┘
```

## Hierarquia de Classes

```
PowersOfTenApp
    ├── Renderer
    │   ├── gl (WebGL Context)
    │   └── shader
    │       ├── program
    │       ├── attribs
    │       └── uniforms
    │
    ├── OBJLoader
    │   └── cache (Map)
    │
    ├── AnimationController
    │   ├── objects[] (ScaleObject)
    │   ├── currentIndex
    │   ├── targetIndex
    │   ├── transitionProgress
    │   └── camera
    │       ├── distance
    │       └── targetDistance
    │
    └── objects[] (ScaleObject)
        ├── name
        ├── scale
        ├── vertices (Float32Array)
        ├── indices (Uint16Array)
        ├── vertexBuffer (WebGLBuffer)
        ├── indexBuffer (WebGLBuffer)
        └── color [r, g, b]
```

## Estado da Aplicação

```
┌─────────────────────────────────────┐
│ Estado Global                       │
├─────────────────────────────────────┤
│ • isRunning: boolean                │
│ • lastTime: number                  │
│ • config: Config                    │
│ • objects: ScaleObject[]            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Estado de Animação                  │
├─────────────────────────────────────┤
│ • currentIndex: number              │
│ • targetIndex: number               │
│ • isTransitioning: boolean          │
│ • transitionProgress: number (0-1)  │
│ • isPlaying: boolean                │
│ • speed: number (0.1-3.0)           │
│ • autoRotateEnabled: boolean        │
│ • rotationAngle: number             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Estado de Renderização              │
├─────────────────────────────────────┤
│ • wireframeMode: boolean            │
│ • cameraDistance: number            │
│ • currentObjects: RenderInfo[]      │
│   └── { object, alpha, scale }      │
└─────────────────────────────────────┘
```

## Eventos e Fluxo de Controle

```
User Input → Event Handler → State Update → Render

Exemplos:

[Click Play]
    → playPause.onclick()
    → animation.play()
    → isPlaying = true
    → Render loop continua

[Click Next]
    → nextScale.onclick()
    → animation.nextScale()
    → startTransition(targetIndex + 1)
    → isTransitioning = true
    → Transição animada

[Key Press Space]
    → window.onkeydown
    → playPause.click()
    → (veja acima)

[Range Input Speed]
    → speed.oninput
    → animation.setSpeed(value)
    → speed = value
    → Animação acelera/desacelera
```

## Otimizações Implementadas

```
1. Cache de Modelos OBJ
   ├─► Map<path, modelData>
   └─► Evita recarregar mesmo modelo

2. Buffers WebGL Reutilizáveis
   ├─► Criados uma vez
   └─► Reutilizados em cada frame

3. Geometria Procedural
   ├─► Gerada apenas quando necessário
   └─► Mais rápido que carregar OBJ

4. RequestAnimationFrame
   ├─► Sincronizado com refresh rate
   └─► Pausa quando tab inativa

5. Delta Time
   ├─► Animação independente de FPS
   └─► Suave em diferentes dispositivos
```

---

Esta arquitetura fornece:
- ✅ Separação clara de responsabilidades
- ✅ Fácil manutenção e extensão
- ✅ Performance otimizada
- ✅ Código modular e reutilizável
- ✅ Fluxo de dados previsível
