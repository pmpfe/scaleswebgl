# Guia de Criação de Modelos OBJ para Powers of Ten

## Introdução

Este guia explica como criar modelos OBJ personalizados para usar na aplicação Powers of Ten. Os modelos são renderizados em modo wireframe, portanto o foco é nas arestas e linhas, não em faces sólidas.

## Formato OBJ Básico

### Estrutura de um arquivo OBJ

```obj
# Comentários começam com #

# Vértices (v x y z)
v 0.0 0.0 0.0
v 1.0 0.0 0.0
v 0.0 1.0 0.0

# Linhas (l v1 v2)
l 1 2
l 2 3
l 3 1

# Faces (f v1 v2 v3)
# Faces são automaticamente convertidas em linhas
f 1 2 3
```

### Elementos Suportados

1. **Vértices (v)**: Definem pontos no espaço 3D
   ```obj
   v x y z
   ```

2. **Linhas (l)**: Conectam dois ou mais vértices
   ```obj
   l v1 v2
   l v1 v2 v3  # Múltiplos vértices criam linha contínua
   ```

3. **Faces (f)**: Polígonos que são convertidos em arestas
   ```obj
   f v1 v2 v3       # Triângulo
   f v1 v2 v3 v4    # Quadrilátero
   ```

## Melhores Práticas

### 1. Sistema de Coordenadas

- **Origem**: Centro do objeto em (0, 0, 0)
- **Escala**: Normalizada entre -1.0 e 1.0
- **Y-up**: Eixo Y aponta para cima

```obj
# Bom: objeto centrado e normalizado
v 0.0 0.0 0.0
v 1.0 0.0 0.0
v 0.0 1.0 0.0

# Evite: objeto descentrado
v 100.0 50.0 200.0
```

### 2. Simplicidade

- Mantenha o número de vértices baixo (< 1000 para performance)
- Use geometrias simples e reconhecíveis
- Foque nas características principais do objeto

### 3. Wireframe

Como a renderização é em wireframe:
- Use linhas para definir a estrutura
- Evite faces muito densas
- Pense em "esqueleto" do objeto

## Exemplos Práticos

### Exemplo 1: Cubo Simples

```obj
# Cubo.obj - Forma geométrica básica

# Vértices dos 8 cantos
v -1.0 -1.0  1.0
v  1.0 -1.0  1.0
v  1.0  1.0  1.0
v -1.0  1.0  1.0
v -1.0 -1.0 -1.0
v  1.0 -1.0 -1.0
v  1.0  1.0 -1.0
v -1.0  1.0 -1.0

# Arestas
l 1 2
l 2 3
l 3 4
l 4 1
l 5 6
l 6 7
l 7 8
l 8 5
l 1 5
l 2 6
l 3 7
l 4 8
```

### Exemplo 2: Pirâmide

```obj
# Piramide.obj

# Base quadrada
v -1.0 0.0 -1.0
v  1.0 0.0 -1.0
v  1.0 0.0  1.0
v -1.0 0.0  1.0

# Ápice
v  0.0 2.0  0.0

# Base
l 1 2
l 2 3
l 3 4
l 4 1

# Arestas laterais
l 1 5
l 2 5
l 3 5
l 4 5
```

### Exemplo 3: Torus (Dona)

```obj
# Torus.obj - Círculo rotacionado

# Círculo externo (8 pontos)
v 2.0 0.0 0.0
v 1.414 0.0 1.414
v 0.0 0.0 2.0
v -1.414 0.0 1.414
v -2.0 0.0 0.0
v -1.414 0.0 -1.414
v 0.0 0.0 -2.0
v 1.414 0.0 -1.414

# Círculo interno
v 1.0 0.0 0.0
v 0.707 0.0 0.707
v 0.0 0.0 1.0
v -0.707 0.0 0.707
v -1.0 0.0 0.0
v -0.707 0.0 -0.707
v 0.0 0.0 -1.0
v 0.707 0.0 -0.707

# Círculo superior
v 1.5 0.5 0.0
v 1.061 0.5 1.061
v 0.0 0.5 1.5
v -1.061 0.5 1.061
v -1.5 0.5 0.0
v -1.061 0.5 -1.061
v 0.0 0.5 -1.5
v 1.061 0.5 -1.061

# Círculo inferior
v 1.5 -0.5 0.0
v 1.061 -0.5 1.061
v 0.0 -0.5 1.5
v -1.061 -0.5 1.061
v -1.5 -0.5 0.0
v -1.061 -0.5 -1.061
v 0.0 -0.5 -1.5
v 1.061 -0.5 -1.061

# Conectar círculos
l 1 2
l 2 3
l 3 4
l 4 5
l 5 6
l 6 7
l 7 8
l 8 1

l 9 10
l 10 11
l 11 12
l 12 13
l 13 14
l 14 15
l 15 16
l 16 9

l 17 18
l 18 19
l 19 20
l 20 21
l 21 22
l 22 23
l 23 24
l 24 17

l 25 26
l 26 27
l 27 28
l 28 29
l 29 30
l 30 31
l 31 32
l 32 25

# Meridianos
l 1 17
l 3 19
l 5 21
l 7 23
```

## Criando Modelos com Software 3D

### Blender (Recomendado)

1. **Criar o modelo**
   - File → New → General
   - Modele o objeto (mantenha simples)
   - Aplique modificadores se necessário

2. **Preparar para exportação**
   - Selecione o objeto
   - Object → Apply → All Transforms
   - Centre o objeto (Shift + Ctrl + Alt + C → Origin to Geometry)

3. **Exportar**
   - File → Export → Wavefront (.obj)
   - Configurações recomendadas:
     - ✓ Selection Only
     - ✓ Apply Modifiers
     - ✓ Write Normals (opcional)
     - ✗ Write Materials (não necessário)
     - ✗ Write UVs (não necessário)
     - Scale: 1.00

4. **Otimizar**
   - Use Decimate modifier para reduzir polígonos
   - Remova faces internas invisíveis
   - Mantenha apenas a estrutura essencial

### SketchUp

1. Modele o objeto
2. Plugins → Export → OBJ
3. Certifique-se de que as unidades estão corretas

### Online: Tinkercad

1. Crie o modelo em tinkercad.com
2. Export → .OBJ
3. Baixe e coloque na pasta models/

## Dicas de Modelagem por Escala

### Molecular (nm - μm)

- Formas geométricas simples
- Estruturas em hélice ou cristalinas
- Exemplos: DNA (hélice), vírus (icosaedro)

```obj
# DNA - Hélice dupla
# Use círculos conectados em espiral
```

### Microscópico (μm - mm)

- Esferas, elipsoides
- Estruturas orgânicas suaves
- Exemplos: células, grãos

### Humano (cm - m)

- Formas reconhecíveis
- Silhuetas simples
- Exemplos: mão, pessoa

### Arquitetônico (m - km)

- Geometrias rígidas
- Cubos, cilindros
- Exemplos: edifícios, cidades

### Planetário (km - milhões de km)

- Esferas
- Órbitas circulares
- Exemplos: Terra, Sistema Solar

### Galáctico (anos-luz)

- Espirais
- Pontos conectados
- Exemplos: galáxias, aglomerados

## Testando Seus Modelos

1. **Coloque o arquivo na pasta models/**
   ```
   models/
   └── meuobjeto.obj
   ```

2. **Adicione ao config.json**
   ```json
   {
     "name": "Meu Objeto",
     "scale": 1.0,
     "size": "1 metro",
     "model": "models/meuobjeto.obj",
     "color": [1.0, 0.5, 0.2],
     "description": "Descrição"
   }
   ```

3. **Recarregue a aplicação**
   - Pressione F5 no navegador
   - Verifique o console para erros

## Solução de Problemas

### Modelo não aparece

- Verifique se o caminho está correto
- Confirme que os vértices estão centrados em (0,0,0)
- Verifique se há erros no console

### Modelo muito pequeno/grande

- Ajuste a escala dos vértices
- Normalize entre -1.0 e 1.0
- Use o fator de escala no config.json

### Modelo aparece distorcido

- Verifique a ordem dos vértices
- Certifique-se de que não há duplicatas
- Use coordenadas precisas

### Performance baixa

- Reduza o número de vértices
- Simplifique a geometria
- Use menos linhas

## Ferramentas Úteis

### Validadores OBJ Online

- [OBJ Viewer Online](http://3dviewer.net/)
- [Clara.io](https://clara.io/)

### Conversores

- [MeshLab](https://www.meshlab.net/) - Limpeza e otimização
- [Assimp](https://www.assimp.org/) - Conversão de formatos

### Geradores Procedurais

Para formas matemáticas complexas, considere usar Python:

```python
import math

# Gerar esfera
with open('sphere.obj', 'w') as f:
    # Vértices
    for lat in range(0, 181, 20):
        for lon in range(0, 360, 20):
            x = math.sin(math.radians(lat)) * math.cos(math.radians(lon))
            y = math.cos(math.radians(lat))
            z = math.sin(math.radians(lat)) * math.sin(math.radians(lon))
            f.write(f"v {x} {y} {z}\n")
```

## Recursos Adicionais

- [Wavefront OBJ Specification](https://en.wikipedia.org/wiki/Wavefront_.obj_file)
- [Blender Documentation](https://docs.blender.org/)
- [OBJ File Format Guide](http://paulbourke.net/dataformats/obj/)

## Exemplos Incluídos

A aplicação inclui estes modelos de exemplo:

1. `dna.obj` - Dupla hélice
2. `virus.obj` - Icosaedro
3. `cell.obj` - Esfera com núcleo
4. `sand.obj` - Cristal irregular
5. `hand.obj` - Mão simplificada
6. `person.obj` - Figura humana (stick figure)
7. `building.obj` - Cubo (arranha-céus)
8. `city.obj` - Grade de edifícios
9. `earth.obj` - Esfera com meridianos
10. `solarsystem.obj` - Sol com órbitas
11. `galaxy.obj` - Espiral
12. `supercluster.obj` - Rede de filamentos

Use-os como referência para criar seus próprios modelos!

---

**Boa modelagem! 🎨**
