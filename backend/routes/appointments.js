// routes/appointments.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   POST api/appointments
// @desc    Book an appointment
// @access  Private (Patient only)
router.post(
  '/',
  [
    auth,
    roleCheck(['patient']),
    check('doctorId', 'Doctor ID is required').not().isEmpty(),
    check('appointmentDate', 'Appointment date is required').isISO8601(),
    check('timeSlot', 'Time slot is required').not().isEmpty(),
    check('reason', 'Reason is required').not().isEmpty()
  ],
  appointmentController.bookAppointment
);

// @route   GET api/appointments
// @desc    Get appointments (for both patients and doctors)
// @access  Private
router.get(
  '/',
  auth,
  appointmentController.getAppointments
);

// @route   PATCH api/appointments/:id/cancel
// @desc    Cancel appointment
// @access  Private (Patient only)
router.patch(
  '/:id/cancel',
  [auth, roleCheck(['patient'])],
  appointmentController.cancelAppointment
);

// @route   PATCH api/appointments/:id/status
// @desc    Update appointment status (Doctor only)
// @access  Private (Doctor only)
router.patch(
  '/:id/status',
  [
    auth,
    roleCheck(['doctor']),
    check('status', 'Status is required').not().isEmpty(),
    check('status', 'Invalid status').isIn(['scheduled', 'completed', 'cancelled', 'rescheduled'])
  ],
  appointmentController.updateAppointmentStatus
);

module.exports = router;