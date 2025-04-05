const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const patientController = require('../controllers/patientController');
const labTestController = require('../controllers/labTestController');

// @route   GET api/patients/profile
// @desc    Get patient profile
// @access  Private (Patient only)
router.get('/profile', [auth, roleCheck(['patient'])], patientController.getProfile);

// @route   PUT api/patients/profile
// @desc    Update patient profile
// @access  Private (Patient only)
router.put(
  '/profile',
  [
    auth,
    roleCheck(['patient']),
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('phone', 'Phone number is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty(),
    check('gender', 'Gender is required').isIn(['male', 'female', 'other']),
    check('dateOfBirth', 'Date of birth is required').isISO8601(),
    check('bloodGroup', 'Blood group is required').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
  ],
  patientController.updateProfile
);

// @route   GET api/patients/appointments
// @desc    Get patient appointments
// @access  Private (Patient only)
router.get('/appointments', [auth, roleCheck(['patient'])], patientController.getAppointments);

// @route   POST api/patients/appointments
// @desc    Book an appointment
// @access  Private (Patient only)
router.post(
  '/appointments',
  [
    auth,
    roleCheck(['patient']),
    check('doctorId', 'Doctor ID is required').not().isEmpty(),
    check('appointmentDate', 'Appointment date is required').isISO8601(),
    check('timeSlot', 'Time slot is required').not().isEmpty(),
    check('reason', 'Reason is required').not().isEmpty()
  ],
  patientController.bookAppointment
);

// @route   PATCH api/patients/appointments/:id/cancel
// @desc    Cancel appointment
// @access  Private (Patient only)
router.patch(
  '/appointments/:id/cancel',
  [auth, roleCheck(['patient'])],
  patientController.cancelAppointment
);

// @route   POST api/patients/lab-tests/book
// @desc    Book a lab test
// @access  Private (Patient only)
router.post(
  '/lab-tests/book',
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