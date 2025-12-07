# Modelos 3D - Cosmic Scales

## 📦 Modelos Atuais

### Modelos Incluídos (14 total)
- **12 OBJ**: building, cell, city, dna, earth, galaxy, hand, person, sand, solarsystem, supercluster, virus
- **1 GLB**: hydrogen_no_bg.glb (átomo de hidrogénio - 3 componentes)
- **1 OBJ Fallback**: question_mark.obj (54 vértices, cor laranja)

### Estado de Validação
✅ **Todos os 14 modelos válidos** (validado com `validate_models.py`)

## 🆘 Sistema de Fallback

**Cadeia de Carregamento para Cada Modelo:**
1. Ficheiro original (`galaxy.obj`)
2. Ficheiro fallback automático (`galaxy_fallback.obj`) ← Crie para versões simplificadas
3. Ponto de interrogação (`question_mark.obj`) ← Fallback visual (COR LARANJA)

**Ponto de Interrogação (Fallback Visual):**
- **Ficheiro**: `models/question_mark.obj`
- **Cor**: Laranja RGB(1.0, 0.647, 0.0)
- **Uso**: Quando modelo original e _fallback falham
- **Objetivo**: Sinalizar visualmente que um modelo não foi encontrado
- **Estrutura**: 54 vértices, 38 faces triangulares

**Criar Fallback Personalizado:**
Para otimização, crie versões simplificadas com sufixo `_fallback`:
```bash
# Exemplo: versão rápida de um modelo complexo
cp models/complex.obj models/complex_fallback.obj
# Edite complex_fallback.obj para remover ~80% das faces
# Sistema carregará automaticamente em caso de falha do original!
```

---

## 🎯 Estratégias de Obtenção de Modelos

### 1. Fontes Principais de Modelos Gratuitos

#### **Sketchfab** (https://sketchfab.com)
- **Vantagens**: Maior biblioteca (1M+ modelos), preview 3D, filtros avançados
- **Como usar**: 
  - Filtrar por "Downloadable"
  - Selecionar licenças CC (CC0, CC-BY recomendadas)
  - Verificar polycount (< 10K vértices ideal)
- **Formatos**: GLTF/GLB, OBJ, FBX
- **Exemplo de busca**: "DNA helix low poly"

#### **CGTrader Free** (https://cgtrader.com/free-3d-models)
- **Vantagens**: 150K+ modelos profissionais gratuitos
- **Como usar**: Categoria "Science" ou "Nature"
- **Formatos**: OBJ, FBX, GLTF, Blender
- **Buscar**: "molecule", "planet", "galaxy"

#### **Quaternius** (https://quaternius.com)
- **Vantagens**: Low-poly otimizado para jogos, CC0
- **Como usar**: Baixar packs completos
- **Formatos**: GLTF, OBJ
- **Ideal para**: Árvores, pessoas, animais, objetos simples

#### **Poly Haven** (https://polyhaven.com/models)
- **Vantagens**: CC0, alta qualidade, modelos realistas
- **Como usar**: Download direto, múltiplos níveis de LOD
- **Formatos**: GLTF, Blender, FBX
- **Ideal para**: Planetas, rochas, objetos naturais

#### **TurboSquid Free** (https://turbosquid.com/Search/3D-Models/free)
- **Vantagens**: Modelos profissionais gratuitos
- **Formatos**: Variados (OBJ, FBX, 3DS)

#### **Free3D** (https://free3d.com)
- **Vantagens**: Comunidade ativa, modelos variados
- **Formatos**: OBJ, 3DS, FBX

#### **Thingiverse** (https://thingiverse.com)
- **Vantagens**: Modelos para impressão 3D (fáceis de converter)
- **Formatos**: STL, OBJ (converter com Blender)
- **Ideal para**: Moléculas, células, objetos geométricos

---

### 2. Estratégias de Busca por Escala

#### **Escalas Moleculares (10^-10 a 10^-8)**
- **Átomo de Hidrogénio**: ✅ Incluído (hydrogen_no_bg.glb)
- **Molécula de Água (H2O)**: 
  - Sketchfab: "water molecule h2o structure"
  - CGTrader: "h2o molecular model"
  - **Alternativa**: Gerar proceduralmente (3 esferas + linhas)
- **DNA**: ✅ Incluído (dna.obj)
  - Sketchfab: "DNA double helix low poly"
  - **Procedural**: Já implementado em scaleobject.js

#### **Escalas Celulares (10^-7 a 10^-5)**
- **Vírus**: ✅ Incluído (virus.obj)
  - Sketchfab: "bacteriophage t4", "coronavirus model"
- **Bactéria (E. coli)**:
  - Sketchfab: "bacteria ecoli", "bacillus"
  - **Procedural**: Cápsula + flagelos
- **Célula**: ✅ Incluído (cell.obj)
  - Sketchfab: "animal cell biology", "human cell structure"

#### **Escalas Biológicas Pequenas (10^-4 a 10^-2)**
- **Grão de Pólen**:
  - Sketchfab: "pollen grain", "flower pollen"
  - **Procedural**: Esfera com bump mapping
- **Formiga**:
  - Sketchfab: "ant low poly", "insect model"
  - Quaternius: Insect pack
- **Abelha**:
  - Sketchfab: "bee 3d model", "honeybee"
  - Quaternius: Flying insect

#### **Escalas Humanas (10^-1 a 10^2)**
- **Bola de Ténis**:
  - Poly Haven: "sphere" com textura
  - **Procedural**: Esfera simples (já implementado)
- **Pessoa**: ✅ Incluído (person.obj)
  - Quaternius: "character low poly"
  - Sketchfab: "human figure low poly"
- **Mão**: ✅ Incluído (hand.obj)
- **Edifício**: ✅ Incluído (building.obj)
  - **Procedural**: Cubo já implementado

#### **Escalas Urbanas (10^3 a 10^5)**
- **Cidade Pequena**: ✅ Incluído (city.obj)
  - Sketchfab: "city low poly", "town buildings"
  - **Procedural**: Grid de cubos
- **Grande Cidade**:
  - Sketchfab: "city skyline", "urban environment"

#### **Escalas Geográficas (10^6)**
- **Portugal/Mapa de País**:
  - Natural Earth Data (https://naturalearthdata.com)
  - Converter shapefile → OBJ com QGIS + Blender
  - **Procedural**: Extrusão de contorno 2D

#### **Escalas Planetárias (10^7 a 10^9)**
- **Terra**: ✅ Incluído (earth.obj)
  - Quaternius: "planet earth"
  - Poly Haven: "earth globe"
- **Júpiter**:
  - Sketchfab: "jupiter planet"
  - **Procedural**: Esfera com shader de bandas
- **Sol**:
  - Sketchfab: "sun star model"
  - **Procedural**: Esfera com emissão

#### **Escalas Espaciais (10^10 a 10^15)**
- **Sistema Solar**: ✅ Incluído (solarsystem.obj)
  - Sketchfab: "solar system orrery"
  - **Procedural**: Torus (órbitas) já implementado
- **Cintura de Kuiper**:
  - **Procedural**: Torus de partículas
- **Nuvem de Oort**:
  - **Procedural**: Esfera de pontos dispersos

#### **Escalas Galácticas (10^17 a 10^24)**
- **Aglomerado Estelar**:
  - **Procedural**: Nuvem de pontos/esferas pequenas
- **Nebulosa**:
  - Sketchfab: "nebula space cloud"
  - **Procedural**: Shader volumétrico
- **Galáxia**: ✅ Incluído (galaxy.obj)
  - Sketchfab: "milky way galaxy spiral"
  - **Procedural**: Espiral já implementado
- **Superaglomerado**: ✅ Incluído (supercluster.obj)
  - **Procedural**: Cluster de galáxias

---

## 🔧 Geração Procedural (Fallback Automático)

### Geometrias Implementadas em `scaleobject.js`

#### 1. **DNA (Helix Dupla)**
```javascript
// Dupla hélice paramétrica
for (let i = 0; i < segments; i++) {
    const t = i / segments;
    const angle = t * turns * Math.PI * 2;
    // Hélice 1
    vertices.push(
        Math.cos(angle) * radius,
        t * height - height/2,
        Math.sin(angle) * radius
    );
    // Hélice 2 (oposta)
    vertices.push(
        -Math.cos(angle) * radius,
        t * height - height/2,
        -Math.sin(angle) * radius
    );
}
```

#### 2. **Icosaedro (Vírus)**
```javascript
// 12 vértices em proporção áurea
const phi = (1 + Math.sqrt(5)) / 2;
vertices = [
    [-1, phi, 0], [1, phi, 0], [-1, -phi, 0],
    // ... 9 mais vértices
];
// 20 faces triangulares
```

#### 3. **Esfera (Células, Planetas)**
```javascript
// Subdivisão por latitude/longitude
for (lat = 0; lat <= latBands; lat++) {
    const theta = lat * Math.PI / latBands;
    for (lon = 0; lon <= lonBands; lon++) {
        const phi = lon * 2 * Math.PI / lonBands;
        vertices.push(
            radius * Math.sin(theta) * Math.cos(phi),
            radius * Math.cos(theta),
            radius * Math.sin(theta) * Math.sin(phi)
        );
    }
}
```

#### 4. **Cubo (Edifícios)**
```javascript
// 8 vértices, 12 arestas
vertices = [
    [-1,-1,1], [1,-1,1], [1,1,1], [-1,1,1],
    [-1,-1,-1], [1,-1,-1], [1,1,-1], [-1,1,-1]
];
```

#### 5. **Torus (Sistema Solar, Órbitas)**
```javascript
// Círculo rotacionado ao redor de eixo
for (i = 0; i < segments; i++) {
    const u = i * 2 * Math.PI / segments;
    for (j = 0; j < tubes; j++) {
        const v = j * 2 * Math.PI / tubes;
        x = (majorRadius + minorRadius * Math.cos(v)) * Math.cos(u);
        y = minorRadius * Math.sin(v);
        z = (majorRadius + minorRadius * Math.cos(v)) * Math.sin(u);
    }
}
```

#### 6. **Espiral (Galáxia)**
```javascript
// Espiral logarítmica 3D
for (i = 0; i < segments; i++) {
    const t = i / segments;
    const angle = t * turns * Math.PI * 2;
    const r = startRadius + t * (endRadius - startRadius);
    vertices.push(
        Math.cos(angle) * r,
        (t - 0.5) * height,
        Math.sin(angle) * r
    );
}
```

### Quando Usar Procedural vs. Download

| Tipo | Usar Procedural Se... | Baixar Modelo Se... |
|------|----------------------|---------------------|
| Átomo | Sempre (mais simples) | Quer detalhes orbitais específicos |
| Molécula | Estrutura simples (H2O, CO2) | Molécula complexa (proteína) |
| DNA | Aceita helix padrão | Quer bases nitrogenadas visíveis |
| Vírus | Forma geométrica básica | Quer detalhes de capsídeo |
| Célula | Forma esférica simples | Quer organelos detalhados |
| Planeta | Esfera com shader | Quer topografia realista |
| Galáxia | Espiral simples | Quer braços e núcleo definidos |
| Nebulosa | Sempre (shader volumétrico) | N/A (muito complexo) |

---

## 🛠️ Ferramentas e Workflow

### Validação de Modelos

#### **validate_models.py** (Validação Completa)
```bash
python3 validate_models.py
```
**Verifica**:
- OBJ: Vértices, linhas, faces, bounding box, normalização
- GLTF: Estrutura JSON, buffers externos (scene.bin, etc.)
- GLB: Magic number, chunks JSON/BIN, integridade binária
- **Output**: Relatório com modelos válidos/inválidos + recomendações

**Exemplo de Output**:
```
📊 Analisando GLB: models/hydrogen_no_bg.glb
✓ Versão GLB: 2
✓ Chunk JSON: 3180 bytes
✓ Chunk BIN: 64352 bytes
✓ Versão GLTF interna: 2.0
✓ Malhas: 3
✓ Primitivas totais: 3
✓ Buffer 0: 64352 bytes
  ✓ Estrutura GLB válida e dados binários verificados
```

#### **validate_obj.py** (Normalização OBJ)
```bash
python3 validate_obj.py models/dna.obj --normalize
```
**Funções**:
- Calcula bounding box
- Normaliza coordenadas entre -1 e 1
- Centra objeto em (0, 0, 0)
- Exporta versão normalizada (`dna_normalized.obj`)

### Conversão de Formatos

#### **Blender** (Converter FBX/STL → OBJ/GLTF)
```python
# Script Blender Python
import bpy
bpy.ops.import_scene.fbx(filepath="modelo.fbx")
bpy.ops.export_scene.obj(filepath="modelo.obj")
# ou
bpy.ops.export_scene.gltf(filepath="modelo.glb", export_format='GLB')
```

#### **gltf-pipeline** (Otimizar GLTF/GLB)
```bash
npm install gltf-pipeline
npx gltf-pipeline -i modelo.gltf -o modelo_otimizado.glb
```

### Otimização de Modelos

#### **Blender Decimate Modifier**
1. Selecionar objeto → Modifiers → Decimate
2. Ratio: 0.5 (reduz 50% dos polígonos)
3. Apply → Export

#### **MeshLab** (Simplificação Automática)
```bash
# Reduzir para 5000 faces
meshlabserver -i modelo.obj -o modelo_low.obj -s simplify.mlx
```

---

## 📥 Download e Integração

### Workflow Recomendado

#### **Fase 1: Modelos Essenciais (8 modelos, ~1 hora)**
Prioridade: Modelos facilmente disponíveis

1. **Terra** → Sketchfab "earth planet low poly" → GLB
2. **Sol** → Sketchfab "sun star" → GLB
3. **Júpiter** → Sketchfab "jupiter planet" → GLB
4. **Pessoa** → ✅ Já incluído (person.obj)
5. **Árvore** → Quaternius "tree low poly" → OBJ
6. **Formiga** → Quaternius insect pack → GLTF
7. **Abelha** → Sketchfab "bee model" → GLB
8. **Bola** → Procedural (esfera já implementada)

#### **Fase 2: Modelos Complementares (6 modelos, ~2-3 horas)**
Prioridade: Modelos com disponibilidade média

9. **Montanha** → Poly Haven "rock cliff" (converter) → OBJ
10. **Baleia** → Sketchfab "blue whale low poly" → GLB
11. **Cidade Grande** → Sketchfab "city skyline" → OBJ
12. **Galáxia** → ✅ Já incluído (galaxy.obj) ou melhorar
13. **Sistema Solar** → ✅ Já incluído (solarsystem.obj)
14. **DNA** → ✅ Já incluído (dna.obj)

#### **Fase 3: Modelos Avançados (14 modelos, ~4-6 horas)**
Prioridade: Procedural ou modelos complexos

15-28. **Escalas Cósmicas** → Gerar proceduralmente (já implementado)

### Checklist de Integração

Para cada modelo baixado:

- [ ] Baixar em formato OBJ, GLTF ou GLB
- [ ] Colocar em `/models/`
- [ ] Validar: `python3 validate_models.py`
- [ ] Se > 10K vértices: Simplificar com Blender Decimate
- [ ] Testar no navegador
- [ ] Ajustar `config.json`:
  - Atualizar campo `"model"`
  - Ajustar `"color"` se necessário
- [ ] Verificar centralização e escala
- [ ] Commit no git

---

## 🎨 Cores e Materiais

### Cores Fixas (config.json)
```json
"color": [R, G, B]  // Valores 0.0 - 1.0
```

**Paleta Recomendada**:
- Molecular: `[0.2, 0.8, 0.2]` (verde fosforescente)
- Celular: `[0.9, 0.2, 0.2]` (vermelho vivo)
- Biológico: `[1.0, 0.5, 0.0]` (laranja)
- Terrestre: `[0.2, 0.4, 0.8]` (azul oceano)
- Espacial: `[0.8, 0.8, 0.9]` (branco azulado)
- Galáctico: `[0.5, 0.0, 0.5]` (roxo)

### Cores de Materiais GLTF
Extraídas automaticamente de `material.pbrMetallicRoughness.baseColorFactor`:
```json
"baseColorFactor": [0.3, 0.6, 1.0, 1.0]  // RGBA
```

Toggle "Usar Cores do Modelo" na UI para alternar.

---

## 🚨 Problemas Comuns e Soluções

### Modelo não carrega
1. Verificar console do navegador (F12)
2. Verificar janela de Logs (warnings/errors)
3. Validar com `python3 validate_models.py`
4. Problemas comuns:
   - GLTF com buffer externo faltante → Converter para GLB
   - Mais de 65535 vértices → Simplificar
   - Arquivo corrompido → Re-baixar

### Modelo aparece descentrado
1. Usar `validate_obj.py --normalize`
2. Ou ajustar manualmente no Blender:
   - Object → Set Origin → Geometry to Origin
   - Object → Transform → Location (0, 0, 0)

### Modelo muito grande/pequeno
1. Ajustar escala no Blender:
   - Object → Transform → Scale (S, 0.5, Enter)
2. Ou normalizar com `validate_obj.py --normalize`

### Performance ruim
1. Verificar polycount: < 10K vértices ideal
2. Usar Blender Decimate Modifier
3. Considerar usar geometria procedural
4. Reduzir número de escalas ativas

---

## 📚 Recursos Adicionais

### Tutoriais
- **Blender OBJ Export**: https://docs.blender.org/manual/en/latest/files/import_export/obj.html
- **GLTF Specification**: https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html
- **Three.js Examples**: https://threejs.org/examples/

### Licenciamento
- **CC0 (Public Domain)**: Uso livre sem atribuição
- **CC-BY**: Uso livre com atribuição ao autor
- **CC-BY-SA**: Uso livre com atribuição e share-alike
- **Evitar**: Licenças comerciais ou sem permissão de redistribuição

### Comunidades
- **Sketchfab Forum**: https://forum.sketchfab.com
- **Blender Artists**: https://blenderartists.org
- **Reddit r/gamedev**: https://reddit.com/r/gamedev

---

Este documento serve como referência completa para obtenção, validação e integração de modelos 3D no projeto Cosmic Scales WebGL.
