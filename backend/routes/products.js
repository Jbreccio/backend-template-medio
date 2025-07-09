const express = require('express');
const routes = express.Routes();
const produtoController = require('../controllers/produtoController');
// Simulando produtos (depois vamos puxar do banco ou via scraping)
const produtos = [
  { id: 1, nome: "Pão francês", preco: 0.50 },
  { id: 2, nome: "Bolo de cenoura", preco: 10.00 }
];

// Rota GET para listar produtos
routes.get('/', (req, res) => {
  res.json(produtos);
});
const express = require('express');
const Routes = express.Routes();
const upload = require('../middlewares/uploadSeguro');
router.get('/', produtoController.getProdutos);
router.post('/', produtoController.createProduto);
// Upload de imagem do produto
routes.post('/upload', upload.single('imagem'), (req, res) => {
  res.json({ mensagem: 'Upload feito com sucesso', caminho: req.file.path });
});

module.exports = routes
;
