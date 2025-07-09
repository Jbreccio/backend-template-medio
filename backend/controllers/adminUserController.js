const AdminUser = require('../models/AdminUser');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const sendEmailCode = require('../utils/sendEmailCode');

const registerAdmin = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const existe = await AdminUser.findOne({ email });
    if (existe) return res.status(400).json({ msg: 'Email já registrado' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await sendEmailCode(email, code);

    const hashedPassword = await bcrypt.hash(senha, 10);
    const secret2FA = speakeasy.generateSecret({ name: `PadariaApp (${email})` });

    const novoAdmin = new AdminUser({
      nome,
      email,
      senhaHash: hashedPassword,
      role: 'admin',
      ativo: true,
      twoFactorSecret: secret2FA.base32,
      codigoConfirmacao: code,
      emailConfirmado: false
    });

    await novoAdmin.save();

    return res.status(201).json({
      msg: 'Admin registrado com sucesso. Código enviado para o e-mail.',
      twoFactorSecret: secret2FA.otpauth_url
    });

  } catch (error) {
    console.error('Erro no registro de admin:', error);
    return res.status(500).json({ msg: 'Erro no servidor' });
  }
};

module.exports = { registerAdmin };
