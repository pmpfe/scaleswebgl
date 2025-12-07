# Cosmic Scales - Projeto e Arquitetura

## 🌌 Resumo do Projeto

Animação WebGL interativa inspirada no clássico filme "Powers of Ten" de Charles e Ray Eames, que permite explorar diferentes escalas do universo desde o nível atómico (10^-10m) até o universo observável (10^22m).

## 🎯 Características Principais

### Core Features
- **33 escalas** com fator 10^1 entre consecutivas
- **Transições suaves** com easing cúbico e zoom sincronizado
- **Modelos 3D wireframe** com suporte OBJ, GLTF e GLB
- **Sistema de cores avançado** - cores fixas ou extraídas de materiais GLTF
- **Fallback visual**: ponto de interrogação laranja quando modelos não encontrados
- **Navegação contínua** via slider sem snap points

### Interface do Utilizador
- Controles play/pause, navegação (anterior/seguinte), reset
- Slider contínuo com transições automáticas entre escalas intermediárias
- Widget de lista de objetos (lado direito) - clicável, com destaque visual
- Janela de log arrastável e colapsável (botões +/-)
- Toggle "Usar Cores do Modelo" para alternar entre cores fixas e GLTF
- Ajuste de velocidade (0.1x a 3.0x)
- Rotação automática configurável
- Atalhos de teclado (Espaço, setas, R)

### Sistema de Renderização
- WebGL com shaders customizados
- Suporte a cores por vértice (aColor attribute)
- Modo wireframe preservado
- Renderização multi-componente (múltiplos meshes/primitives)
- Sistema de câmera adaptativo

### Sistema de Fallback de Modelos
- **Cadeia de 3 níveis**: original → _fallback → question_mark.obj
- **Ponto de interrogação laranja**: fallback visual quando ficheiros não encontrados (54 vértices)
- **Fallback automático**: cria path `_fallback` em caso de falha
- **Sem geometria procedural**: Sempre usa ficheiros OBJ/GLTF/GLB
- **Logs de diagnóstico**: console mostra qual nível foi usado

---

## 📦 Estrutura do Projeto

### Arquivos Principais

```
/
├── index.html              # Aplicação WebGL principal
├── config.json             # Configuração: 33 escalas, cores, modelos
├── welcome.html            # Página de boas-vindas
├── instructions.html       # Guia interativo
│
├── /js/
│   ├── main.js            # App principal, UI, loop de renderização
│   ├── renderer.js        # Sistema WebGL, shaders, renderização
│   ├── animation.js       # Controle de transições e animação
│   ├── scaleobject.js     # Classe de objetos em escala, buffers WebGL
│   ├── objloader.js       # Carregador de arquivos OBJ
│   ├── gltfloader.js      # Carregador GLTF/GLB com materiais
│   ├── modelloader.js     # Wrapper universal (detecta extensão)
│   └── gl-matrix-min.js   # Biblioteca de matemática 3D
│
├── /models/
│   ├── *.obj              # 12 modelos OBJ (DNA, vírus, célula, etc.)
│   └── hydrogen_no_bg.glb # Átomo de hidrogénio (3 componentes)
│
└── /python/
    ├── validate_models.py # Validação rigorosa OBJ/GLTF/GLB
    └── validate_obj.py    # Validação e normalização OBJ
```

### Ficheiros de Configuração

**config.json** - Define todas as escalas:
```json
{
  "scaleFactor": 10,
  "transitionDuration": 3.0,
  "scales": [
    {
      "name": "Átomo de Hidrogénio",
      "scale": 1e-10,
      "size": "0.1 nm",
      "model": "models/hydrogen_no_bg.glb",
      "color": [0.3, 0.6, 1.0],
      "description": "O menor átomo"
    }
    // ... 32 mais escalas
  ]
}
```

---

## 🏗️ Arquitetura do Sistema

### Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────┐
│                   Cosmic Scales WebGL                   │
└─────────────────────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
    ┌─────────┐    ┌─────────┐    ┌─────────┐
    │index.html│   │config.json│  │gl-matrix│
    │  (UI)   │   │  (Data)  │   │  (Math) │
    └─────────┘    └─────────┘    └─────────┘
         │
    ┌────┼────┬─────────┬─────────┬──────────┐
    ▼    ▼    ▼         ▼         ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│main.js │ │renderer│ │animation│ │scaleobj│ │loaders │
│  (App) │ │ (WebGL)│ │(Transit)│ │(Buffers)│ │(OBJ/GLB)│
└────────┘ └────────┘ └────────┘ └────────┘ └────────┘
```

### Fluxo de Dados

```
1. INICIALIZAÇÃO
   ├─► Carregar config.json → Array de 33 escalas
   ├─► Criar Renderer → Inicializar WebGL → Compilar Shaders
   ├─► Criar Loaders (OBJ, GLTF, universal)
   ├─► Carregar ScaleObjects
   │   ├─► Para cada escala:
   │   │   ├─► Tentar carregar modelo (OBJ/GLTF/GLB)
   │   │   ├─► Se falhar → Gerar geometria procedural
   │   │   └─► Criar buffers WebGL (vertices, indices, colors)
   │   └─► Log: sucesso (vértices) ou warning (fallback)
   ├─► Criar AnimationController (estado inicial: escala 0)
   └─► Iniciar Loop: requestAnimationFrame()

2. LOOP DE RENDERIZAÇÃO (60 FPS)
   ├─► Calcular deltaTime
   ├─► AnimationController.update()
   │   ├─► Atualizar rotação
   │   ├─► Processar transição (interpolação, easing)
   │   └─► Ajustar zoom/câmera
   ├─► Renderer.render()
   │   ├─► Clear screen
   │   ├─► Para cada objeto visível:
   │   │   ├─► Aplicar transformações (model matrix)
   │   │   ├─► Bind buffers (vertices, indices, colors)
   │   │   └─► gl.drawElements() em wireframe
   │   └─► Atualizar display (escala atual, info)
   └─► requestAnimationFrame() → próximo frame

3. TRANSIÇÃO ENTRE ESCALAS
   ├─► Usuário move slider ou clica "Seguinte"
   ├─► setContinuousPosition(targetIndex)
   │   ├─► Se distância > 1: transição multi-step
   │   │   ├─► Fade out objeto atual
   │   │   ├─► Zoom out (escala relativa)
   │   │   ├─► jumpToScale(intermediário)
   │   │   ├─► Zoom in
   │   │   └─► Fade in → Repetir até targetIndex
   │   └─► Se distância = 1: transição direta
   ├─► Interpolação durante 0.3s por step
   │   ├─► Alpha: fade in/out
   │   ├─► Scale: zoom sincronizado
   │   └─► Easing: cubic in-out
   └─► onComplete: atualizar UI, log
```

### Sistema de Carregamento de Modelos com Fallback

```
ModelLoader (Universal) - com cadeia de fallback automática
    │
    ├─► NÍVEL 1: Detecta extensão (.obj, .gltf, .glb)
    │   ├─► .obj → OBJLoader
    │   ├─► .gltf/.glb → GLTFLoader
    │   └─► Sucesso → retorna dados
    │
    ├─► NÍVEL 2: Se falhar, tenta FALLBACK AUTOMÁTICO
    │   │   ├─► galaxy.obj → galaxy_fallback.obj
    │   │   ├─► h2o_molecule.glb → h2o_molecule_fallback.glb
    │   │   └─► Método: getFallbackPath() (descrito em MODELS.md)
    │   └─► Sucesso → retorna dados + log aviso
    │
    └─► NÍVEL 3: Se ambos falham → PONTO DE INTERROGAÇÃO
        │   ├─► models/question_mark.obj (54 vértices, cor laranja)
        │   └─► Sinaliza visualmente: "Modelo indisponível"
        └─► Renderiza com cor laranja (SEMPRE funciona - ficheiro garantido)

Retorno: {success, usedFallback, fallbackType: 'none'/'question_mark'}
```

---

## 🎨 Sistema de Renderização WebGL

### Shaders

**Vertex Shader:**
```glsl
attribute vec3 aPosition;
attribute vec3 aColor;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
varying vec3 vColor;

void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
    vColor = aColor;
}
```

**Fragment Shader:**
```glsl
precision mediump float;
uniform vec3 uColor;
uniform int uUseVertexColors;
varying vec3 vColor;

void main() {
    vec3 color = (uUseVertexColors == 1) ? vColor : uColor;
    gl_FragColor = vec4(color, 1.0);
}
```

### Buffers WebGL

Cada `ScaleObject` mantém:
- **vertexBuffer**: Float32Array de posições (x, y, z)
- **indexBuffer**: Uint16Array de índices (limitado a 65535 vértices)
- **colorBuffer**: Float32Array de cores RGB (opcional)

---

## 🔧 Funcionalidades Avançadas

### 1. Sistema de Cores Dual
- **Modo Fixo**: Usa `color` do config.json
- **Modo Modelo**: Usa cores extraídas de materiais GLTF
- Toggle via checkbox "Usar Cores do Modelo"
- Shader decide via uniform `uUseVertexColors`

### 2. Centralização Automática de Modelos
Para modelos GLTF multi-mesh (ex: átomo de hidrogénio):
1. Extrai transformações de todos nodes
2. Calcula translação média
3. Aplica translação relativa a cada vértice
4. Resultado: modelo centrado em (0,0,0)

### 3. Navegação Contínua
- Slider HTML sem `step` attribute
- Movimento ativa `setContinuousPosition()`
- Transições encadeadas através de escalas intermediárias
- Duração: 0.3s por escala intermediária
- Evita saltos visuais, mantém fluência

### 4. Logging Inteligente
- **Info** (verde): Modelo carregado com X vértices
- **Warn** (amarelo): Fallback para geometria procedural
- **Error** (vermelho): Falha crítica de carregamento
- Janela arrastável, colapsável (+/-), transparente
- Auto-scroll, limite 200 entradas

---

## 🚀 Performance e Otimização

### Boas Práticas Implementadas
- **Wireframe rendering**: Menos polígonos que sólido
- **Limite de vértices**: Validador rejeita > 65535 vértices
- **Cache de modelos**: OBJLoader não recarrega arquivos
- **Geometria procedural**: Mais rápida que parsing OBJ
- **RequestAnimationFrame**: Sincronizado com refresh da tela

### Otimizações para Modelos
- Manter < 10000 vértices para performance
- Normalizar coordenadas entre -1 e 1
- Centrar em (0, 0, 0)
- Usar Blender Decimate Modifier se necessário

---

## 📐 Escalas Incluídas (33 Total)

| # | Nome | Escala (m) | Modelo |
|---|------|-----------|--------|
| 1 | Átomo de Hidrogénio | 10^-10 | hydrogen_no_bg.glb |
| 2 | Molécula de Água | 10^-9 | Procedural |
| 3 | DNA | 10^-8 | dna.obj |
| 4 | Vírus | 10^-7 | virus.obj |
| 5 | Bactéria | 10^-6 | Procedural |
| 6 | Célula | 10^-5 | cell.obj |
| 7 | Grão de Pólen | 10^-4 | Procedural |
| ... | ... | ... | ... |
| 18 | Terra | 10^7 | earth.obj |
| ... | ... | ... | ... |
| 33 | Universo Observável | 10^22 | Procedural |

---

## 🎮 Controlos e Atalhos

### Botões UI
- **▶ Play/Pause**: Animação automática
- **↻ Reset**: Volta à primeira escala
- **← →**: Navegação entre escalas
- **Slider**: Navegação contínua com transições

### Atalhos de Teclado
- **Espaço**: Play/Pause
- **Seta Esquerda**: Escala anterior
- **Seta Direita**: Próxima escala
- **R**: Reset

### Opções
- **Velocidade**: 0.1x - 3.0x (controla velocidade de animação)
- **Rotação Automática**: Toggle on/off
- **Usar Cores do Modelo**: Toggle cores fixas/GLTF
- **Logs**: Botão +/- para colapsar/expandir

---

## 🛠️ Ferramentas de Validação

### validate_models.py
Validação rigorosa de todos os modelos:
- **OBJ**: Verifica vértices, faces, linhas, bounding box, normalização
- **GLTF**: Verifica estrutura JSON, buffers externos (scene.bin)
- **GLB**: Verifica magic number, chunks JSON/BIN, integridade
- **Output**: Relatório detalhado com warnings e erros

### validate_obj.py
Utilitário para normalização:
- Calcula bounding box
- Normaliza coordenadas (-1 a 1)
- Centra objetos em origem
- Exporta versão normalizada

---

## 🔄 Workflow de Desenvolvimento

### Adicionar Nova Escala
1. Editar `config.json` → adicionar objeto no array `scales`
2. Colocar modelo 3D em `models/` (OBJ/GLTF/GLB)
3. Validar: `python3 validate_models.py`
4. Testar no navegador
5. Ajustar cores/escala se necessário

### Criar Modelo Procedural
1. Editar `js/scaleobject.js`
2. Adicionar caso em `generateProceduralGeometry()`
3. Retornar `{vertices, indices}`
4. Testar no navegador

### Debugging
1. Abrir console do navegador (F12)
2. Verificar janela de Logs na aplicação
3. Procurar por warnings (fallback) ou errors
4. Validar modelo com `validate_models.py`

---

## 📚 Tecnologias Utilizadas

- **WebGL 1.0**: Renderização 3D
- **gl-matrix**: Matemática 3D (matrizes, vetores)
- **Vanilla JavaScript**: Sem frameworks externos
- **HTML5 Canvas**: Elemento de renderização
- **Python 3**: Ferramentas de validação
- **JSON**: Configuração e dados GLTF

---

## 🎓 Arquitetura de Classes Principais

### PowersOfTenApp (main.js)
```javascript
class PowersOfTenApp {
    init()              // Inicialização
    loadConfig()        // Carregar config.json
    loadScaleObjects()  // Carregar todos os modelos
    render(time)        // Loop principal 60 FPS
    initLogger()        // Sistema de logging
    log(level, msg)     // Info/Warn/Error
}
```

### Renderer (renderer.js)
```javascript
class Renderer {
    constructor(canvas)
    initWebGL()         // Contexto GL
    createShaders()     // Compilar vertex/fragment
    renderObject(obj)   // Desenhar um objeto
    setCamera(pos)      // Posicionar câmera
}
```

### AnimationController (animation.js)
```javascript
class AnimationController {
    update(deltaTime)
    transitionTo(idx)
    setContinuousPosition(idx)
    jumpToScale(idx)
    nextScale()
    previousScale()
}
```

### ScaleObject (scaleobject.js)
```javascript
class ScaleObject {
    constructor(config, gl)
    load(loader)        // Carregar modelo
    generateProceduralGeometry()
    createBuffers()
    render(renderer)
}
```

### GLTFLoader (gltfloader.js)
```javascript
class GLTFLoader {
    load(url)
    parseGLTF(data)
    extractMeshes()
    applyNodeTransforms()
    centerModel()
}
```

---

Este documento serve como referência central para compreender a estrutura, arquitetura e funcionamento do projeto Cosmic Scales WebGL.
