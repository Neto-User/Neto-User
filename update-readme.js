const fs = require('fs');
const path = require('path');

// Lê o arquivo heroes.json
const heroesPath = path.join(__dirname, 'images', 'heroes.json');
const heroesData = JSON.parse(fs.readFileSync(heroesPath, 'utf-8'));

// Seleciona uma imagem aleatória
const randomImage = heroesData.images[Math.floor(Math.random() * heroesData.images.length)];

console.log(`Imagem selecionada: ${randomImage.name}`);
console.log(`🔗 URL: ${randomImage.url}`);

// Lê o README atual
const readmePath = path.join(__dirname, 'README.md');
let readmeContent = fs.readFileSync(readmePath, 'utf-8');

// Cria o novo conteúdo do README com a imagem
const newReadmeContent = `# Neto-User 👋

![${randomImage.name}](${randomImage.url})

## Bem-vindo ao meu perfil! 🎨

Sou desenvolvedor apaixonado por tecnologia e inovação.

---

## 🛠️ Tecnologias

- Svelte
- JavaScript
- Node.js

---


`;

// Salva o novo README
fs.writeFileSync(readmePath, newReadmeContent);
console.log('✅ README atualizado com sucesso!');
