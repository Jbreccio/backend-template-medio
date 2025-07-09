const mongoose = require('mongoose')
const ProdutoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  imagem: { type: String },
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' }
})
module.exports = mongoose.model('Produto', ProdutoSchema)
