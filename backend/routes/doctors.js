// routes/doctors.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const doctorController = require('../controllers/doctorController');

// Protected routes (doctor only) - must come before /:id route
router.get('/profile', auth, doctorController.getDoctorProfile);
router.get('/appointments', auth, doctorController.getDoctorAppointments);
router.patch('/appointments/:id', [
  auth,
  [
    check('status', 'Status is required').not().isEmpty(),
    check('status', 'Invalid status').isIn(['scheduled', 'completed', 'cancelled', 'rescheduled'])
  ]
], doctorController.updateAppointmentStatus);
router.put('/profile', [
  auth,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('specialization', 'Specialization is required').not().isEmpty(),
    check('qualification', 'Qualification is required').not().isEmpty(),
    check('experience', 'Experience is required').isNumeric(),
    check('phone', 'Phone number is required').not().isEmpty()
  ]
], doctorController.updateDoctorProfile);

// Public routes
router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);

module.exports = router;