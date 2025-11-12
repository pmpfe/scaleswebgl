# Changelog - Powers of Ten WebGL

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

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

- Inspirado no filme "Powers of Ten" (1977) de Charles e Ray Eames
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
