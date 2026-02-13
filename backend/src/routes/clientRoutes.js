const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const auth = require('../middleware/auth');

router.post('/', auth, clientController.createClientProfile);
router.get('/me', auth, clientController.getClientProfile);

module.exports = router;
