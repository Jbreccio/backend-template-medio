// backend/routes/categorias.js
const express = require('express');
const router = express.Router();

const categorias = [
  "Bolos caseiros", "Pães caseiros", "Baguetes Recheadas", "Focaccias",
  "Sobremesas", "Pães Doces", "Tortas e Quiches", "Aperitivos e Antepastos",
  "Doces", "Geleias Caseiras", "Bolachinhas e torradas", "Pani Festa",
  "Bebidas", "Pães Delícia", "Salgados Individuais"
];

router.get('/', (req, res) => {
  res.json(categorias);
});

module.exports = router;
