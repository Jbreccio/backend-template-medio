#!/bin/bash

echo "🚀 Iniciando estrutura backend da Padaria..."

# Criar pastas
mkdir -p backend/{admin,config,controllers,db/models,routes,public/admin,uploads,tests}
touch backend/{server.js,.env,seed.js}
touch backend/db/{connect.js,seed.js}
touch backend/models/{Produto.js,Categoria.js}
touch backend/routes/{products.js,categorias.js,scrape.js}
touch backend/admin/painelAdmin.js
touch backend/public/admin/{admin.js,index.html,styles.css}

echo "✅ Estrutura de pastas e arquivos criada!"

# Ir para a pasta backend
cd backend

# Criar package.json automático
npm init -y

# Instalar dependências
npm install express cors dotenv mongoose adminjs @adminjs/express bcryptjs express-formidable

# (Opcional) Instalar pacotes de segurança
npm install express-rate-limit helmet

echo "✅ Dependências instaladas!"

# Criar conteúdo básico do .env
cat <<EOT > .env
PORT=5000
MONGO_URI=mongodb+srv://USUARIO:SENHA@firstproject.xdgfcnc.mongodb.net/?retryWrites=true&w=majority
SECRET=padariasecreta
EOT

echo "✅ Arquivo .env criado (⚠️ lembre-se de ajustar os dados de conexão)"

# Criar script de start
npx npm-add-script -k "start" -v "node server.js"

echo "🚀 Projeto pronto para rodar com: npm start"
