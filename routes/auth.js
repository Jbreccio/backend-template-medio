const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const sendEmailCode = require('../utils/sendEmailCode');
const speakeasy = require('speakeasy');
const auth = require('../middlewares/auth');
const QRCode = require('qrcode');
const { registerAdmin } = require('../controllers/adminUserController');

// Verificar se JWT_SECRET está definido
if (!process.env.JWT_SECRET) {
  console.error('ERRO: JWT_SECRET não está definido no arquivo .env');
  process.exit(1);
}

// Rota de registro
router.post('/register', registerAdmin);

// Rota para confirmação de e-mail
router.post('/confirm-email', async (req, res) => {
  try {
    console.log('Email confirmation attempt:', req.body);
    
    const { email, codigo } = req.body;
    
    if (!email || !codigo) {
      return res.status(400).json({ msg: 'Email e código são obrigatórios' });
    }
    
    const user = await AdminUser.findOne({ email });
    console.log('User found for email confirmation:', !!user);
    
    if (!user || user.codigoConfirmacao !== codigo) {
      return res.status(400).json({ msg: 'Código inválido' });
    }

    user.emailConfirmado = true;
    user.codigoConfirmacao = null;
    await user.save();
    
    console.log('Email confirmed successfully');
    res.json({ msg: 'E-mail confirmado. Você pode fazer login.' });
  } catch (error) {
    console.error('Email confirmation error:', error);
    res.status(500).json({ msg: 'Erro interno no servidor', error: error.message });
  }
});

// Login com verificação 2FA
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', { email: req.body.email, has2FA: !!req.body.token2FA });
    
    const { email, senha, token2FA } = req.body;
    
    if (!email || !senha) {
      return res.status(400).json({ msg: 'Email e senha são obrigatórios' });
    }
    
    const user = await AdminUser.findOne({ email });
    console.log('User found:', !!user, user ? { emailConfirmado: user.emailConfirmado, twoFactorEnabled: user.twoFactorEnabled } : null);
    
    if (!user || !user.emailConfirmado) {
      return res.status(400).json({ msg: 'Usuário inválido ou e-mail não confirmado' });
    }

    const senhaOk = await bcrypt.compare(senha, user.senhaHash);
    console.log('Password check:', senhaOk);
    
    if (!senhaOk) return res.status(400).json({ msg: 'Senha inválida' });

    if (user.twoFactorEnabled) {
      console.log('2FA required');
      if (!token2FA) return res.status(401).json({ msg: 'Token 2FA necessário' });
      
      // Verificar o token 2FA
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: token2FA,
        window: 2
      });
      
      console.log('2FA verification:', verified);
      if (!verified) return res.status(401).json({ msg: 'Token 2FA inválido' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful');
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ msg: 'Erro interno no servidor', error: error.message });
  }
});

// Rota para configurar 2FA
router.post('/2fa/setup', auth(), async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({ name: `PadariaPaniDigrano (${req.user.email})` });
    const user = await AdminUser.findById(req.user.id);
    user.twoFactorSecret = secret.base32;
    user.twoFactorEnabled = false;
    await user.save();

    QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err) return res.status(500).json({ msg: 'Erro ao gerar QR Code' });
      res.json({ qrCode: data_url, secret: secret.base32 });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro interno no servidor' });
  }
});

// Rota para verificar e ativar 2FA
router.post('/2fa/verify', auth(), async (req, res) => {
  try {
    const { token2FA } = req.body;
    const user = await AdminUser.findById(req.user.id);
    
    if (!user.twoFactorSecret) {
      return res.status(400).json({ msg: '2FA não foi configurado' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token2FA,
      window: 2
    });

    if (!verified) {
      return res.status(401).json({ msg: 'Token 2FA inválido' });
    }

    user.twoFactorEnabled = true;
    await user.save();
    
    res.json({ msg: '2FA ativado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro interno no servidor' });
  }
});

// Rota para desativar 2FA
router.post('/2fa/disable', auth(), async (req, res) => {
  try {
    const { senha } = req.body;
    const user = await AdminUser.findById(req.user.id);
    
    const senhaOk = await bcrypt.compare(senha, user.senhaHash);
    if (!senhaOk) {
      return res.status(400).json({ msg: 'Senha inválida' });
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;
    await user.save();
    
    res.json({ msg: '2FA desativado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro interno no servidor' });
  }
});
console.log('Auth rotas carregadas')

// FORA de qualquer função:
router.get('/dashboard/overview', auth(['admin']), (req, res) => {
  res.json({ msg: 'Resumo do dashboard' });
});
{ module.exports = router;} 
