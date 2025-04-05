// routes/labTests.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const labTestController = require('../controllers/labTestController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   GET api/lab-tests
// @desc    Get all lab tests
// @access  Public
router.get('/', labTestController.getAllLabTests);

// @route   GET api/lab-tests/history
// @desc    Get lab test history
// @access  Private (Patient only)
router.get(
  '/history',
  [auth, roleCheck(['patient'])],
  labTestController.getLabTestHistory
);

// @route   GET api/lab-tests/:id
// @desc    Get lab test by ID
// @access  Public
router.get('/:id', labTestController.getLabTestById);

// @route   POST api/lab-tests/book
// @desc    Book a lab test
// @access  Private (Patient only)
router.post(
  '/book',
  [
    auth,
    roleCheck(['patient']),
    check('testId', 'Test ID is required').not().isEmpty(),
    check('date', 'Date is required').isISO8601(),
    check('time', 'Time is required').not().isEmpty(),
    check('prescription', 'Prescription is required').not().isEmpty(),
    check('paymentMethod', 'Payment method is required').isIn(['cash', 'card', 'upi', 'netbanking'])
  ],
  labTestController.bookLabTest
);

module.exports = router;