# Changelog - Cosmic Scales WebGL

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [Unreleased] - 2025-12-07

### Adicionado

**Sistema de Fallback de Modelos:**
- 🆚 Ponto de interrogação 3D em cor laranja (`models/question_mark.obj`)
- 🔄 Cadeia de fallback automática: original → _fallback → question_mark → procedural
- 📝 `ModelLoader.getFallbackPath()`: converte `galaxy.obj` → `galaxy_fallback.obj`
- 📊 Retorna tipo de fallback usado: `'none'`, `'question_mark'`, `'procedural'`
- 📋 Logs de diagnóstico em `console.warn()` para cada nível

**Janela de Log Melhorada:**
- 🎯 Botões +/- para colapsar/expandir janela de log
- 👁️ Transparência ajustada (background: rgba(0,0,0,0.7))
- 🖼️ Border definido (2px solid rgba(255,255,255,0.2))
- ✨ Transições suaves ao colapsar/expandir

**Validação Rigorosa de Modelos:**
- 🔍 Script `validate_models.py` para validação completa
- ✅ Validação de estrutura OBJ e GLTF com verificação de buffers
- 🔬 Validação GLB com verificação de chunks JSON/BIN

### Modificado

**Carregamento de Modelos:**
- `js/modelloader.js`: +42 linhas (novo método `getFallbackPath()`, fluxo de fallback)
- `js/scaleobject.js`: +27 linhas (cadeia de 3 fallbacks em `load()`)
- `config.json`: +1 entrada (escala "Ponto de Interrogação" para teste)

**Interface de Log:**
- Estado colapsado mantém apenas barra de título visível
- Melhor visualização do conteúdo por trás da janela

### Corrigido

**Modelos Inválidos:**
- ❌ Removido `h2o_molecule.gltf` (buffer externo `scene.bin` faltante)
- ✅ Todos os 13 modelos restantes validados e funcionais

### Técnico

**Validação de GLTF:**
```python
# Verifica buffers externos
if 'uri' in buffer:
    buffer_path = os.path.join(model_dir, uri)
    if not os.path.exists(buffer_path):
        return False  # Buffer faltante
```

**Validação de GLB:**
```python
# Verifica chunks binários
json_length = struct.unpack('<I', f.read(4))[0]
bin_length = struct.unpack('<I', f.read(4))[0]
# Valida integridade dos dados
```

## [Unreleased] - 2025-12-06

### Adicionado

**Suporte a Modelos GLTF/GLB:**
- ✨ Carregador GLTF/GLB completo (`gltfloader.js`)
- 🎨 Extração de cores de materiais GLTF (baseColorFactor)
- 🔄 Aplicação automática de transformações de nodes (scale, translation)
- 📐 Sistema de centralização automática de modelos multi-mesh
- 🎯 Suporte a múltiplos primitives e meshes por arquivo

**Sistema de Cores Avançado:**
- 🌈 Shader com suporte a cores por vértice
- 🎨 Toggle entre cor fixa (config.json) e cores do modelo
- 🎛️ Checkbox "Usar Cores do Modelo" na UI
- 📊 Atributo `aColor` e uniform `uUseVertexColors` nos shaders
- 🔧 Buffer de cores WebGL com fallback para branco

**Interface Melhorada:**
- 📋 Widget de lista de objetos (lado direito)
  - Scrollable com sticky header
  - Itens clicáveis para navegação direta
  - Destaque visual de objetos visíveis
  - Indicador de objeto principal (primary)
- 🪵 Janela de log arrastável
  - Sistema de logging com níveis (info/warn/error)
  - Cores diferenciadas por tipo de mensagem
  - Auto-scroll e limite de 200 entradas
  - Timestamps formatados
- 🖱️ Drag-and-drop para reposicionar log window

**Expansão de Conteúdo:**
- 📈 33 escalas (expandido de 12)
- 🔢 Fator de escala 10^1 entre objetos consecutivos (anteriormente 10^3)
- 🌌 Range completo: 10^-10m (átomo) até 10^22m (universo observável)

**Navegação Contínua:**
- 🎚️ Slider contínuo sem snap points
- 🔄 Transições automáticas através de escalas intermediárias
- ⏱️ Duração de transição configurável (0.3s por escala)
- 🎯 Sistema `setContinuousPosition()` com chamadas encadeadas

**Sistema de Logging:**
- 📝 Logs detalhados de carregamento de modelos
- ✅ Info com contagem de vértices quando carregamento bem-sucedido
- ⚠️ Warnings para fallback em geometria procedural
- ❌ Erros para falhas críticas
- 🎨 Estilos visuais diferenciados (verde/amarelo/vermelho)

**Documentação Expandida:**
- 📚 MODELS_GUIDE.md - Guia completo de recursos 3D
- 🗂️ 12 arquivos de documentação na pasta models/
- 📖 Links específicos para cada escala
- 🎯 Guias de download rápido
- 🔧 Tutoriais de geração procedural

### Modificado

**Animação:**
- 🔧 Corrigido cálculo de zoom para transições suaves
- 📐 Interpolação linear de escala: `currentScale = currentRelativeScale * (1-t) + (currentRelativeScale/targetRelativeScale) * t`
- 🎯 Método `jumpToScale()` para navegação multi-step
- ⚡ Transições mantêm proporções relativas corretas

**Renderização:**
- 🎨 Shaders atualizados com varying `vColor`
- 🔄 Modo wireframe preservado
- 📊 Suporte a modelos com e sem cores
- 🎯 Fallback inteligente para cor fixa quando modelo não tem cores

**Carregamento de Modelos:**
- 🚀 ModelLoader universal detecta extensão (.obj/.gltf/.glb)
- 📦 ScaleObject retorna objeto com status detalhado: `{success, usedFallback, verticesCount}`
- 🔄 OBJLoader atualizado para retornar `{vertices, indices, colors: null}`
- 🎯 GLTFLoader processa todos meshes e primitives

**Configuração:**
- 📝 config.json atualizado com 33 objetos
- 🔢 `scaleFactor: 10` (anteriormente 1000)
- ⏱️ `transitionDuration: 3.0` segundos
- 🎨 Modelo do átomo de hidrogénio: `models/hydrogen_no_bg.glb`

### Corrigido

**Bug de Zoom nas Transições:**
- ✅ Objetos agora mantêm tamanho relativo correto durante fade in/out
- 🎯 Eliminado "salto" visual entre escalas
- 📐 Zoom out/in sincronizado com alpha fade

**Renderização de Modelos Multi-Componente:**
- ✅ GLTFLoader agora extrai TODOS os primitives e meshes
- 🎨 Cores de materiais GLTF corretamente aplicadas por primitive
- 🔧 Transformações de nodes (scale/translation) aplicadas aos vértices
- 📐 Sistema de centralização remove offset global
- 🎯 Átomo de hidrogénio mostra 3 componentes:
  - Núcleo (azul, centrado)
  - Electrão (vermelho, pequeno, na órbita)
  - Órbita (cinzenta, torus)

**Sistema de Cores:**
- ✅ Materiais GLTF com diferentes cores por mesh funcionam corretamente
- 🎨 baseColorFactor extraído e convertido para cores por vértice
- 🔧 Buffer de cores criado apenas quando modelo tem cores
- 📊 Shader usa uniform boolean para alternar modos

**Navegação no Slider:**
- ✅ Movimento do slider atravessa escalas intermediárias
- 🔄 Transições suaves mesmo com grandes saltos
- ⏱️ Tempo total escalável baseado em distância

**Logging Preciso:**
- ✅ Logs mostram contagem real de vértices carregados
- ⚠️ Warnings aparecem apenas quando há fallback
- 📊 Status de carregamento reflete resultado real da operação

### Técnico

**Arquitetura de Shaders:**
```glsl
// Vertex Shader
attribute vec3 aPosition;
attribute vec3 aColor;
uniform bool uUseVertexColors;
uniform vec3 uColor;
varying vec3 vColor;

// Fragment Shader
varying vec3 vColor;
uniform float uAlpha;
gl_FragColor = vec4(vColor, uAlpha);
```

**GLTFLoader - Transformações:**
- Cálculo de translação média para centralização
- Aplicação de scale por vértice
- Translação relativa à média do modelo
- Suporte a quaternion rotation (preparado, não implementado)

**ScaleObject - Buffers:**
- `vertexBuffer`: posições XYZ
- `colorBuffer`: cores RGB (opcional)
- `indexBuffer`: índices para gl.drawElements
- Criação condicional de colorBuffer

**Performance:**
- Transformações aplicadas uma vez no load (baking)
- Sem overhead de cálculo por frame
- Buffers WebGL otimizados
- Concatenação eficiente de múltiplos meshes

### Commits

- `04b2e43` (2025-12-06 17:40) - Documentação de modelos expandida
- `0af4100` (2025-12-06) - Sistema de animação e UI melhorada
- `b3a8a27` (2025-11-12) - Commit inicial

## [1.0.0] - 2025-11-12

### Lançamento Inicial

#### Adicionado

**Core Features:**
- ✨ Sistema de animação WebGL com transições suaves entre escalas
- 🎨 Renderização wireframe de objetos 3D
- 🔄 Sistema de transição com easing cúbico
- 📐 12 escalas pré-configuradas (do molecular ao intergaláctico)
- ⚙️ Configuração JSON para fácil personalização

**Modelos 3D:**
- Carregador de arquivos OBJ com cache
- 12 modelos OBJ de exemplo incluídos:
  - `dna.obj` - Dupla hélice
  - `virus.obj` - Icosaedro
  - `cell.obj` - Célula com núcleo
  - `sand.obj` - Grão de areia (cristal)
  - `hand.obj` - Mão humana
  - `person.obj` - Pessoa (stick figure)
  - `building.obj` - Edifício
  - `city.obj` - Layout urbano
  - `earth.obj` - Planeta Terra
  - `solarsystem.obj` - Sistema Solar
  - `galaxy.obj` - Galáxia espiral
  - `supercluster.obj` - Superaglomerado

**Geometria Procedural:**
- Geração automática de formas quando modelos OBJ não disponíveis:
  - Hélice dupla (DNA)
  - Icosaedro (vírus)
  - Esfera (padrão)
  - Cubo
  - Torus
  - Espiral galáctica

**Interface de Usuário:**
- 🎮 Controles interativos:
  - Play/Pause
  - Reset
  - Navegação entre escalas
  - Ajuste de velocidade (0.1x - 3.0x)
  - Rotação automática
  - Toggle wireframe
- ⌨️ Atalhos de teclado:
  - Espaço: Play/Pause
  - Setas: Navegação
  - R: Reset
- 📊 Display de informações em tempo real:
  - Escala atual
  - Nome do objeto
  - Tamanho

**Documentação:**
- 📖 README.md completo
- 📝 Guia de instruções HTML interativo
- 🎨 Guia de criação de modelos OBJ (MODELGUIDE.md)
- 💬 Comentários detalhados no código

**Sistema de Câmera:**
- Ajuste automático de distância baseado no tamanho do objeto
- Transições suaves de zoom
- Rotação automática configurável

**Performance:**
- Cache de modelos OBJ carregados
- Buffers WebGL otimizados
- Renderização eficiente de linhas
- Suporte para até ~65k vértices por modelo

**Configuração:**
- `config.json` para customização:
  - Factor de escala configurável (100x, 1000x, etc.)
  - Duração de transição ajustável
  - Cores RGB por objeto
  - Descrições e metadados

**Compatibilidade:**
- WebGL 1.0
- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- Funciona em desktop e mobile

#### Tecnologias Utilizadas

- WebGL 1.0 para renderização 3D
- JavaScript ES6+
- gl-matrix (versão minificada customizada)
- HTML5 Canvas
- CSS3 para UI

#### Estrutura do Projeto

```
scaleswebgl/
├── index.html              # Aplicação principal
├── instructions.html       # Guia interativo
├── config.json            # Configuração
├── README.md              # Documentação
├── MODELGUIDE.md          # Guia de modelos
├── CHANGELOG.md           # Este arquivo
├── js/
│   ├── main.js            # App principal
│   ├── renderer.js        # WebGL renderer
│   ├── animation.js       # Sistema de animação
│   ├── scaleobject.js     # Classe de objetos
│   ├── objloader.js       # Carregador OBJ
│   └── gl-matrix-min.js   # Biblioteca matemática
└── models/                # Modelos OBJ
    └── [12 arquivos .obj]
```

#### Conhecidos Issues

Nenhum no momento.

#### Notas de Desenvolvimento

- Inspirado no filme "Cosmic Scales" (1977) de Charles e Ray Eames
- Desenvolvido para fins educacionais e de demonstração
- Foco em performance e facilidade de uso
- Arquitetura modular para fácil extensão

---

## Formato

O formato baseia-se em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

### Tipos de Mudanças

- **Adicionado** para novas funcionalidades
- **Modificado** para mudanças em funcionalidades existentes
- **Depreciado** para funcionalidades que serão removidas
- **Removido** para funcionalidades removidas
- **Corrigido** para correção de bugs
- **Segurança** para vulnerabilidades

---

**Para versões futuras, considere:**

- [ ] Suporte a múltiplas câmeras/perspectivas
- [ ] Modo VR/AR
- [ ] Exportação de animações
- [ ] Mais opções de customização visual
- [ ] Editor visual de configuração
- [ ] Suporte a texturas (modo não-wireframe)
- [ ] Física/colisões entre objetos
- [ ] Timeline de eventos
- [ ] Narração/áudio
- [ ] Modo apresentação fullscreen
- [ ] Compartilhamento de configurações
- [ ] Galeria de modelos da comunidade
