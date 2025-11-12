# Powers of Ten - WebGL

Uma animação WebGL interativa inspirada no clássico filme "Powers of Ten" de Charles e Ray Eames, que permite explorar diferentes escalas do universo, desde o molecular até o intergaláctico.

## 🌟 Características

- **Transições suaves** entre diferentes escalas (configurável: 100x, 1000x, etc.)
- **Modelos 3D wireframe** para cada escala
- **Carregamento de modelos OBJ** personalizados
- **Geometria procedural** como fallback
- **Controles interativos** (play/pause, navegação, velocidade)
- **Configuração JSON** fácil de editar
- **12 escalas** pré-configuradas (do DNA ao superaglomerado galáctico)

## 🚀 Como Usar

### Início Rápido

1. Abra o arquivo `index.html` num servidor web local
2. A aplicação carrega automaticamente com geometrias procedurais
3. Use os controlos para navegar pelas escalas

### Servidor Local

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (com http-server)
npx http-server
```

Depois acesse: `http://localhost:8000`

## 🎮 Controlos

### Botões

- **▶ Play/Pause**: Inicia/pausa a animação automática
- **↻ Reset**: Volta para a primeira escala
- **← Anterior**: Vai para a escala anterior
- **Seguinte →**: Vai para a próxima escala

### Atalhos de Teclado

- **Espaço**: Play/Pause
- **Seta Esquerda**: Escala anterior
- **Seta Direita**: Próxima escala
- **R**: Reset

### Opções

- **Velocidade**: Controla a velocidade da animação (0.1x a 3.0x)
- **Rotação Automática**: Ativa/desativa a rotação dos objetos
- **Modo Wireframe**: Alterna entre wireframe e sólido

## 📐 Escalas Incluídas

1. **Molécula de DNA** (2 nm) - Dupla hélice
2. **Vírus** (100 nm) - Bacteriófago
3. **Célula** (10 μm) - Célula eucariota
4. **Grão de Areia** (1 mm) - Quartzo
5. **Mão Humana** (20 cm)
6. **Pessoa** (1.8 m)
7. **Edifício** (100 m)
8. **Cidade** (10 km)
9. **Terra** (12,742 km)
10. **Sistema Solar** (10 mil milhões de km)
11. **Via Láctea** (100,000 anos-luz)
12. **Superaglomerado** (500 milhões de anos-luz)

## 🔧 Personalização

### Adicionar/Modificar Objetos

Edite o arquivo `config.json`:

```json
{
  "scaleFactor": 1000,
  "transitionDuration": 3.0,
  "scales": [
    {
      "name": "Seu Objeto",
      "scale": 1.0,
      "size": "1 metro",
      "model": "models/seuobjeto.obj",
      "color": [1.0, 0.5, 0.2],
      "description": "Descrição do objeto"
    }
  ]
}
```

### Propriedades

- **scaleFactor**: Factor de multiplicação entre escalas (ex: 100, 1000)
- **transitionDuration**: Duração das transições em segundos
- **name**: Nome do objeto (exibido na UI)
- **scale**: Tamanho real do objeto em metros
- **size**: Descrição legível do tamanho
- **model**: Caminho para o arquivo OBJ (opcional)
- **color**: Cor RGB (valores de 0.0 a 1.0)
- **description**: Descrição do objeto

### Adicionar Modelos OBJ

1. Coloque seus arquivos `.obj` na pasta `models/`
2. Atualize o caminho no `config.json`
3. O sistema converte automaticamente faces em linhas para modo wireframe

Formato OBJ suportado:
```obj
# Vértices
v 0.0 0.0 0.0
v 1.0 0.0 0.0
v 0.5 1.0 0.0

# Faces (convertidas em linhas)
f 1 2 3

# Linhas diretas (opcional)
l 1 2
```

### Geometria Procedural

Se um modelo OBJ não estiver disponível, o sistema gera automaticamente geometria procedural baseada no nome do objeto:

- **DNA/Molécula**: Dupla hélice
- **Vírus**: Icosaedro
- **Célula/Grão**: Esfera
- **Edifício**: Cubo
- **Galáxia**: Espiral
- **Sistema**: Torus
- **Padrão**: Esfera

## 📁 Estrutura do Projeto

```
scaleswebgl/
├── index.html              # Página principal
├── config.json             # Configuração das escalas
├── README.md              # Este arquivo
├── js/
│   ├── main.js            # Aplicação principal
│   ├── renderer.js        # Renderizador WebGL
│   ├── animation.js       # Controle de animação
│   ├── scaleobject.js     # Classe de objetos
│   ├── objloader.js       # Carregador de OBJ
│   └── gl-matrix-min.js   # Biblioteca de matemática 3D
└── models/                # Modelos OBJ (opcional)
    ├── dna.obj
    ├── virus.obj
    └── ...
```

## 🛠️ Tecnologias

- **WebGL 1.0**: Renderização 3D
- **JavaScript ES6+**: Lógica da aplicação
- **gl-matrix**: Matemática 3D (vec3, mat4)
- **HTML5 Canvas**: Elemento de renderização

## 📝 Notas Técnicas

### Performance

- Geometrias otimizadas para modo wireframe
- Cache de modelos OBJ carregados
- Transições suaves com easing cúbico
- Renderização eficiente com buffers WebGL

### Compatibilidade

- Requer navegador com suporte a WebGL 1.0
- Testado em Chrome, Firefox, Safari, Edge
- Funciona em desktop e dispositivos móveis

### Limitações

- Modelos OBJ não suportam texturas (apenas wireframe)
- Máximo de ~65k vértices por modelo (Uint16Array)
- Apenas linhas são renderizadas (sem faces sólidas no modo wireframe)

## 🎨 Customização Visual

### Alterar Cores

No `config.json`, ajuste o array `color` (RGB de 0.0 a 1.0):

```json
"color": [1.0, 0.0, 0.0]  // Vermelho
"color": [0.0, 1.0, 0.0]  // Verde
"color": [0.0, 0.0, 1.0]  // Azul
```

### Alterar Velocidade Padrão

No HTML, encontre:
```html
<input type="range" id="speed" min="0.1" max="3" step="0.1" value="1.0">
```

### Alterar Duração das Transições

No `config.json`:
```json
"transitionDuration": 3.0  // segundos
```

## 🐛 Troubleshooting

**Tela preta ao carregar:**
- Verifique o console do navegador para erros
- Confirme que está usando um servidor web (não file://)
- Verifique se o navegador suporta WebGL

**Modelos OBJ não carregam:**
- Verifique o caminho no config.json
- Confirme que o arquivo existe na pasta models/
- O sistema usará geometria procedural como fallback

**Performance baixa:**
- Reduza a complexidade dos modelos OBJ
- Diminua o número de escalas
- Use geometria procedural em vez de OBJ

## 📄 Licença

Este projeto é fornecido como está, para fins educacionais e de demonstração.

## 🙏 Inspiração

Baseado no filme "Powers of Ten" (1977) de Charles e Ray Eames, que explorou a magnitude relativa do universo.

---

**Desenvolvido para demonstrar transições entre escalas usando WebGL**
