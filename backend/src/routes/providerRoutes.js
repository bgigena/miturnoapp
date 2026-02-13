const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');
const auth = require('../middleware/auth');

router.get('/', providerController.getAllProviders);
router.get('/:id', providerController.getProviderById);
router.post('/', auth, providerController.createProviderProfile);
router.put('/:id', auth, providerController.updateProviderProfile);

// Provider Services
router.get('/:id/services', providerController.getProviderServices);
router.post('/:id/services', auth, providerController.addServiceToProvider);
router.delete('/:id/services/:serviceId', auth, providerController.deleteServiceFromProvider);

module.exports = router;
