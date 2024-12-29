const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth, reviewController.createReview);
router.post('/:id/response', [auth, authorize('staff')], reviewController.addStaffResponse);

module.exports = router;
