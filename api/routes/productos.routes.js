const express = require('express');
const { getProductos, createProducto, updateProducto, deleteProducto } = require('../controllers/productos.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', getProductos); // Abierto o verificarToken dependiendo (para portal clientes debe ser abierto)
router.post('/', verifyToken, requireAdmin, createProducto);
router.put('/:id', verifyToken, requireAdmin, updateProducto);
router.delete('/:id', verifyToken, requireAdmin, deleteProducto);

module.exports = router;
