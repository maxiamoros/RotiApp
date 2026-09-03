const express = require('express');
const { getCategorias, createCategoria, updateCategoria, deleteCategoria } = require('../controllers/categorias.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', verifyToken, getCategorias); // Cajero y cocinero pueden necesitar ver categorias
router.post('/', verifyToken, requireAdmin, createCategoria);
router.put('/:id', verifyToken, requireAdmin, updateCategoria);
router.delete('/:id', verifyToken, requireAdmin, deleteCategoria);

module.exports = router;
