const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/auth');

router.get('/', auth, appointmentController.getAppointments);
router.post('/', auth, appointmentController.createAppointment);
router.put('/:id/status', auth, appointmentController.updateAppointmentStatus);

module.exports = router;
