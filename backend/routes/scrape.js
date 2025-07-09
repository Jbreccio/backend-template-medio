const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { data } = await axios.get('https://pani-di-grano.goomer.app/');
    const $ = cheerio.load(data);
    const produtos = [];

    $('.product-card').each((i, el) => {
      const nome = $(el).find('.product-name-selector').text().trim();
      const preco = parseFloat($(el).find('.price-selector').text().replace('R$', '').replace(',', '.'));
      const imagem = $(el).find('img').attr('src');

      produtos.push({ id: i + 1, nome, preco, imagem });
    });

    res.json(produtos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Falha ao extrair dados' });
  }
});

module.exports = router;
