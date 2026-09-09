const express = require('express');
const { getUsuarios, createUsuario, updateUsuario } = require('../controllers/usuarios.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(verifyToken);
router.use(requireAdmin);

router.get('/', getUsuarios);
router.post('/', createUsuario);
router.put('/:id', updateUsuario);

module.exports = router;
