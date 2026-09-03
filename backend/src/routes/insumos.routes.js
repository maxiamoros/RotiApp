const express = require('express');
const { getInsumos, createInsumo, updateInsumo, deleteInsumo } = require('../controllers/insumos.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', verifyToken, getInsumos);
router.post('/', verifyToken, requireAdmin, createInsumo);
router.put('/:id', verifyToken, requireAdmin, updateInsumo);
router.delete('/:id', verifyToken, requireAdmin, deleteInsumo);

module.exports = router;
