🟨 # Backend Template Médio (Node.js)

Template voltado para aplicações de porte médio com mais recursos de segurança e autenticação robusta usando Node.js, Express e JWT.

## ✨ Funcionalidades
- Estrutura modular com separação clara por responsabilidades
- Autenticação com JWT e refresh token
- Criação de múltiplos usuários (admin, user)
- Upload de arquivos com `multer`
- Middlewares customizados
- Conexão com MongoDB via Mongoose

## 🚀 Como usar

```bash
cp .env.example .env
npm install
npm start
📁 Estrutura
bash
Copy
Edit
controllers/     # Lógica de negócios (usuários, uploads etc.)
routes/          # Rotas protegidas e públicas
models/          # Esquemas do MongoDB
middlewares/     # Autenticação, verificação de token, logs
uploads/         # Pasta para arquivos temporários (não vai para o Git)
🧰 Tecnologias
Node.js

Express

MongoDB + Mongoose

JWT

Multer

👤 Autor
José Roberto Breccio - @Jbreccio