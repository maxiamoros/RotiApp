const express = require('express');
const { getVentas, createVenta } = require('../controllers/ventas.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', verifyToken, getVentas); 
router.post('/', createVenta); // Se puede llamar desde Portal (sin token) o Caja (con token)

module.exports = router;
