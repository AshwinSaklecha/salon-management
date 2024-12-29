const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', [auth, authorize('admin')], serviceController.createService);
router.get('/', serviceController.getAllServices);
router.put('/:id', [auth, authorize('admin')], serviceController.updateService);

module.exports = router;
