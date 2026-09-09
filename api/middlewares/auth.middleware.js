const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token.replace('Bearer ', ''), JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });
    req.userId = decoded.id;
    req.userRol = decoded.rol;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.userRol !== 'ADMIN' && req.userRol !== 'GERENTE') {
    return res.status(403).json({ error: 'Require Admin Role' });
  }
  next();
};

module.exports = {
  verifyToken,
  requireAdmin
};
