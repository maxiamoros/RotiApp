const express = require('express');
const router = express.Router();
const configController = require('../controllers/config.controller');

// Optional: You can add auth middleware here if you only want GERENTE/ADMIN to update
router.get('/', configController.getConfig);
router.put('/', configController.updateConfig);
router.post('/batch', configController.batchUpdateConfig);

module.exports = router;
