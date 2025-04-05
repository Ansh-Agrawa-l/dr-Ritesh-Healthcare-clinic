// utils/validation.js
const { body } = require('express-validator');

// User validation rules
exports.userValidationRules = [
  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
];

// Doctor validation rules
exports.doctorValidationRules = [
  ...this.userValidationRules,
  body('specialization', 'Specialization is required').not().isEmpty(),
  body('qualification', 'Qualification is required').not().isEmpty(),
  body('experience', 'Experience is required').isInt({ min: 0 })
];

// Appointment validation rules
exports.appointmentValidationRules = [
  body('doctorId', 'Doctor ID is required').not().isEmpty(),
  body('appointmentDate', 'Appointment date is required').isISO8601(),
  body('timeSlot', 'Time slot is required').not().isEmpty(),
  body('reason', 'Reason is required').not().isEmpty()
];

// Medicine validation rules
exports.medicineValidationRules = [
  body('name', 'Name is required').not().isEmpty(),
  body('description', 'Description is required').not().isEmpty(),
  body('price', 'Price is required').isNumeric(),
  body('quantity', 'Quantity is required').isInt({ min: 0 }),
  body('manufacturer', 'Manufacturer is required').not().isEmpty(),
  body('expiryDate', 'Expiry date is required').isISO8601(),
  body('dosage', 'Dosage is required').not().isEmpty(),
  body('category', 'Category is required').not().isEmpty()
];

// Lab test validation rules
exports.labTestValidationRules = [
  body('name', 'Name is required').not().isEmpty(),
  body('description', 'Description is required').not().isEmpty(),
  body('price', 'Price is required').isNumeric(),
  body('duration', 'Duration is required').not().isEmpty(),
  body('category', 'Category is required').not().isEmpty()
];
