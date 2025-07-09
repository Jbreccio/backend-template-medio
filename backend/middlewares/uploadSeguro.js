const multer = require('multer');
const path = require('path');

// Extensões permitidas
const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];

// Filtro de arquivos
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido'));
  }
};

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/produtos'); // sua pasta
  },
  filename: (req, file, cb) => {
    const nomeSeguro = `${Date.now()}-${file.originalname}`;
    cb(null, nomeSeguro);
  }
});

module.exports = multer({ storage, fileFilter });
