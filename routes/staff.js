const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', [auth, authorize('admin')], staffController.createStaffMember);
router.post('/assign-service', [auth, authorize('admin')], staffController.assignService);
router.put('/:id/availability', [auth, authorize(['admin', 'staff'])], staffController.updateStaffAvailability);
router.get('/:id/services', staffController.getStaffServices);

module.exports = router;
