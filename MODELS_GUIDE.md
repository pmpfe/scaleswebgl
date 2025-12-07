# Guia de Modelos 3D para Cosmic Scales

## Fontes Recomendadas de Modelos Gratuitos

### Sites com Modelos Livres
- **Sketchfab** (sketchfab.com): Filtrar por "Downloadable" e "CC0 License"
- **Quaternius** (quaternius.com): Modelos low-poly de alta qualidade
- **CGTrader Free** (cgtrader.com/free-3d-models): Seção gratuita
- **TurboSquid Free** (turbosquid.com/Search/3D-Models/free)
- **Free3D** (free3d.com)

## Lista de Modelos por Escala

### 1. Átomo de Hidrogénio (1e-10m)
- **Tipo**: Esfera simples com núcleo
- **Recomendação**: Gerar proceduralmente ou esfera com coroa de elétrons
- **Ref Sketchfab**: "Hydrogen atom structure"

### 2. Molécula de Água (1e-9m)
- **Tipo**: Três esferas conectadas (ângulo 104°)
- **Recomendação**: Gerar proceduralmente com 3 esferas + linhas
- **Buscar**: "Water molecule H2O structure"

### 3. Molécula de DNA (1e-8m)
- **Tipo**: Dupla hélice
- **Recomendação**: Gerar proceduralmente (já existe em scaleobject.js)
- **Alternativa Sketchfab**: "DNA double helix model"

### 4. Vírus/Bacteriófago (1e-7m)
- **Tipo**: Estrutura poliédrica com cauda
- **Recomendação**: "Bacteriophage T4" ou icosaedro com cauda
- **Sketchfab**: Procurar "virus 3d model" ou "bacteriophage"
- **Gemini**: `virus_a.gltf`, `virus_b.gltf`

### 5. Bactéria (1e-6m)
- **Tipo**: Rod ou espiral (E. coli, vibrio)
- **Recomendação**: "Bacteria E. coli" cilindro arredondado
- **Sketchfab**: "Escherichia coli" ou "bacteria cell"
- **Gemini**: `bacteria_a.gltf`

### 6. Célula Humana (1e-5m)
- **Tipo**: Esfera com organelos
- **Recomendação**: "Human cell structure" com núcleo visível
- **Sketchfab**: "animal cell 3d model"
- **Gemini**: `cell_a.gltf`

### 7. Grão de Pólen (1e-4m)
- **Tipo**: Esfera espinhosa
- **Recomendação**: Esfera com bump/normal map ou triangulação
- **Sketchfab**: "pollen grain" ou "flower pollen"
- **Gemini**: `pollen_a.gltf`

### 8. Formiga (1e-3m)
- **Tipo**: Inseto com corpo segmentado
- **Recomendação**: Low-poly ant
- **Sketchfab**: "Ant 3D model" - Quaternius tem versão excelente
- **Gemini**: `ant_a.gltf`

### 9. Abelha (1e-2m)
- **Tipo**: Inseto com asas
- **Recomendação**: Low-poly bee
- **Sketchfab**: "Bee 3D model" ou "Honeybee"
- **Gemini**: `bee_a.gltf`

### 10. Bola de Ténis (1e-1m)
- **Tipo**: Esfera com padrão
- **Recomendação**: "Tennis ball" simples
- **Quaternius**: Tem modelo low-poly perfeito
- **Gemini**: `tennis_ball_a.gltf`

### 11. Pessoa (1e0m)
- **Tipo**: Figura humana
- **Recomendação**: Low-poly human model
- **Quaternius**: "Character" models
- **Gemini**: `person_a.gltf`

### 12. Árvore (1e1m)
- **Tipo**: Árvore simplificada
- **Recomendação**: Low-poly tree
- **Quaternius**: "Tree" model
- **Gemini**: `tree_a.gltf`

### 13. Baleia Azul (1e2m)
- **Tipo**: Baleia alongada
- **Recomendação**: "Blue whale" model
- **Sketchfab**: Filtrar por baixa poly
- **Gemini**: `whale_a.gltf`

### 14. Montanha (1e3m)
- **Tipo**: Pico/cone montanhoso
- **Recomendação**: Cone procedural ou modelo simplificado
- **Buscar**: "Mountain terrain low poly"
- **Gemini**: `mountain_a.gltf`

### 15. Cidade Pequena (1e4m)
- **Tipo**: Cluster de edifícios
- **Recomendação**: "City buildings" low-poly
- **Sketchfab**: "Low poly city"
- **Gemini**: `city_a.gltf`

### 16. Grande Cidade (1e5m)
- **Tipo**: Skyline
- **Recomendação**: Simplificado com alguns edifícios altos
- **Buscar**: "City skyline low poly"
- **Gemini**: `city_b.gltf`

### 17. Portugal (1e6m)
- **Tipo**: Mapa ou silhueta
- **Recomendação**: Plano com contorno
- **Alternativa**: Usar shader para desenhar contorno

### 18. Terra (1e7m)
- **Tipo**: Planeta esférico
- **Recomendação**: Esfera com textura ou mapa
- **Quaternius**: "Planet Earth"

### 19. Júpiter (1e8m)
- **Tipo**: Planeta com bandas
- **Recomendação**: Esfera com shader procedural
- **Buscar**: "Jupiter planet 3d"
- **Gemini**: `jupiter_a.gltf`

### 20. Sol (1e9m)
- **Tipo**: Esfera brilhante
- **Recomendação**: Esfera simples com emissão
- **Buscar**: "Sun star 3d model"

### 21. Sistema Solar Interior (1e10m)
- **Tipo**: Órbitas e planetas
- **Recomendação**: Diagrama simplificado
- **Buscar**: "Solar system orrery"
- **Gemini**: `solarsystem_a.gltf`

### 22. Sistema Solar (1e11m)
- **Tipo**: Diagrama com órbitas
- **Recomendação**: Plano 2D ou anel de órbita

### 23. Órbita de Neptuno (1e12m)
- **Tipo**: Anel de órbita
- **Recomendação**: Toro/toroide

### 24. Cintura de Kuiper (1e13m)
- **Tipo**: Nuvem de asteroides
- **Recomendação**: Partículas ou nuvem procedural

### 25. Nuvem de Oort Interior (1e14m)
- **Tipo**: Nuvem de cometas
- **Recomendação**: Esfera com muitos pontos

### 26. Nuvem de Oort Exterior (1e15m)
- **Tipo**: Esfera maior de cometas
- **Recomendação**: Esfera com pontos dispersos

### 27. Aglomerado Estelar (1e17m)
- **Tipo**: Cluster de estrelas
- **Recomendação**: Nuvem de pontos/esferas pequenas

### 28. Nebulosa (1e18m)
- **Tipo**: Nuvem colorida
- **Recomendação**: Shader procedural ou mesh com texturas
- **Buscar**: "Nebula 3d model"

### 29. Via Láctea (1e20m)
- **Tipo**: Disco espiral
- **Recomendação**: Espiral procedural ou disco textured
- **Buscar**: "Milky way galaxy"

### 30. Grupo Local (1e21m)
- **Tipo**: Múltiplas galáxias
- **Recomendação**: 3-4 esferas representando galáxias

## Como Baixar e Integrar

1. **Baixar modelo OBJ** do site recomendado
2. **Colocar em** `models/[nome].obj`
3. **Testar no navegador** abrindo a escala correspondente
4. **Ajustar cor** no `config.json` se necessário

## Geração Procedural (Já Implementada)

Alguns modelos já têm geração procedural em `scaleobject.js`:
- DNA (helix)
- Icosaedro (vírus)
- Esfera (célula, grão, etc)
- Cubo
- Toro
- Espiral

## Dicas de Performance

- Manter menos de 5,000 vértices por modelo
- Usar low-poly quando possível
- Texturas são opcionais (cores sólidas funcionam bem)
- Modelos procedurais são mais rápidos que OBJ
