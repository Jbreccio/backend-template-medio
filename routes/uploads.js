const express = require('express')
const multer = require('multer')
const path = require('path')

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({ storage })

router.post('/', upload.single('imagem'), (req, res) => {
  if (!req.file) return res.status(400).json({ erro: 'Nenhum arquivo enviado' })
  res.status(200).json({ imagem: `/uploads/${req.file.filename}` })
})

module.exports = router // <== FUNDAMENTAL!
