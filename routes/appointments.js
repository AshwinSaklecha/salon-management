const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { auth, authorize } = require('../middleware/auth');

router.get('/availability', auth, appointmentController.checkAvailability);
router.post('/', auth, appointmentController.createAppointment);
router.put('/:id', auth, appointmentController.updateAppointment);
router.put('/:id/cancel', auth, appointmentController.cancelAppointment);

module.exports = router;
