// routes/doctorDashboard.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const doctorController = require('../controllers/doctorController');
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   GET api/doctor/appointments
// @desc    Get doctor appointments
// @access  Private (Doctor only)
router.get(
  '/appointments',
  [auth, roleCheck(['doctor'])],
  appointmentController.getDoctorAppointments
);

// @route   PATCH api/doctor/appointments/:id
// @desc    Update appointment (reschedule/cancel)
// @access  Private (Doctor only)
router.patch(
  '/appointments/:id',
  [
    auth,
    roleCheck(['doctor']),
    check('status', 'Status is required').isIn(['scheduled', 'completed', 'cancelled', 'rescheduled'])
  ],
  appointmentController.updateAppointment
);

// @route   GET api/doctor/profile
// @desc    Get doctor profile
// @access  Private (Doctor only)
router.get(
  '/profile',
  [auth, roleCheck(['doctor'])],
  doctorController.getDoctorById
);

// @route   PUT api/doctor/profile
// @desc    Update doctor profile
// @access  Private (Doctor only)
router.put(
  '/profile',
  [
    auth,
    roleCheck(['doctor']),
    check('name', 'Name is required').optional(),
    check('specialization', 'Specialization is required').optional()
  ],
  doctorController.updateDoctorProfile
);

module.exports = router; 