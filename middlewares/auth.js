// middlewares/auth.js
const jwt = require('jsonwebtoken');

module.exports = (rolesPermitidos = []) => {
  return (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'Token não fornecido' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Verifica se o usuário tem a role necessária
      if (rolesPermitidos.length && !rolesPermitidos.includes(decoded.role)) {
        return res.status(403).json({ msg: 'Acesso negado (sem permissão)' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ msg: 'Token inválido' });
    }
  };
};
