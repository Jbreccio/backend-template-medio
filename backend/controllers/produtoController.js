const Produto = require('../models/Produto');

// GET /api/products
exports.getProdutos = async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.status(200).json(produtos);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao buscar produtos' });
  }
};

// POST /api/products
exports.createProduto = async (req, res) => {
  try {
    const novoProduto = new Produto(req.body);
    await novoProduto.save();
    res.status(201).json(novoProduto);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao criar produto' });
  }
};
