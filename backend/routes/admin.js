// routes/admin.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  getAllDoctors,
  addDoctor,
  updateDoctor,
  deleteDoctor,
  getAllMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getAllLabTests,
  addLabTest,
  updateLabTest,
  deleteLabTest,
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  getStats,
  updateLabTestBookingStatus,
  getLabTestBookings
} = require('../controllers/adminController');
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/doctors';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Admin doctor routes
// @route   GET api/admin/doctors
// @desc    Get all doctors
// @access  Private (Admin only)
router.get('/doctors', auth, roleCheck(['admin']), getAllDoctors);

// @route   POST api/admin/doctors
// @desc    Add doctor
// @access  Private (Admin only)
router.post('/doctors', [
  auth,
  roleCheck(['admin']),
  upload.single('photo'),
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('specialization', 'Specialization is required').not().isEmpty(),
    check('qualification', 'Qualification is required').not().isEmpty(),
    check('experience', 'Experience is required').not().isEmpty(),
    check('phone', 'Phone number is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty()
  ]
], addDoctor);

// @route   PUT api/admin/doctors/:id
// @desc    Update doctor
// @access  Private (Admin only)
router.put('/doctors/:id', [
  auth,
  roleCheck(['admin']),
  upload.single('photo'),
  [
    check('name', 'Name is required').not().isEmpty(),
    check('specialization', 'Specialization is required').not().isEmpty(),
    check('qualification', 'Qualification is required').not().isEmpty(),
    check('experience', 'Experience is required').not().isEmpty(),
    check('phone', 'Phone number is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty()
  ]
], updateDoctor);

// @route   DELETE api/admin/doctors/:id
// @desc    Delete doctor
// @access  Private (Admin only)
router.delete('/doctors/:id', auth, roleCheck(['admin']), deleteDoctor);

// Admin medicine routes
// @route   GET api/admin/medicines
// @desc    Get all medicines
// @access  Private (Admin only)
router.get('/medicines', auth, roleCheck(['admin']), getAllMedicines);

// @route   POST api/admin/medicines
// @desc    Add medicine
// @access  Private (Admin only)
router.post(
  '/medicines',
  [
    auth,
    roleCheck(['admin']),
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('price', 'Price is required').isNumeric(),
    check('quantity', 'Quantity is required').isInt({ min: 0 }),
    check('manufacturer', 'Manufacturer is required').not().isEmpty(),
    check('expiryDate', 'Expiry date is required').isISO8601(),
    check('dosage', 'Dosage is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty()
  ],
  addMedicine
);

// @route   PUT api/admin/medicines/:id
// @desc    Update medicine
// @access  Private (Admin only)
router.put('/medicines/:id', auth, roleCheck(['admin']), updateMedicine);

// @route   DELETE api/admin/medicines/:id
// @desc    Delete medicine
// @access  Private (Admin only)
router.delete('/medicines/:id', auth, roleCheck(['admin']), deleteMedicine);

// Admin lab test routes
// @route   GET api/admin/lab-tests
// @desc    Get all lab tests
// @access  Private (Admin only)
router.get('/lab-tests', auth, roleCheck(['admin']), getAllLabTests);

// @route   POST api/admin/lab-tests
// @desc    Add lab test
// @access  Private (Admin only)
router.post(
  '/lab-tests',
  [
    auth,
    roleCheck(['admin']),
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('price', 'Price is required').isNumeric(),
    check('duration', 'Duration is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty()
  ],
  addLabTest
);

// @route   PUT api/admin/lab-tests/:id
// @desc    Update lab test
// @access  Private (Admin only)
router.put('/lab-tests/:id', auth, roleCheck(['admin']), updateLabTest);

// @route   DELETE api/admin/lab-tests/:id
// @desc    Delete lab test
// @access  Private (Admin only)
router.delete('/lab-tests/:id', auth, roleCheck(['admin']), deleteLabTest);

// @route   PATCH api/admin/lab-tests/bookings/:id/status
// @desc    Update lab test booking status
// @access  Private (Admin only)
router.patch(
  '/lab-tests/bookings/:id/status',
  [auth, roleCheck(['admin'])],
  updateLabTestBookingStatus
);

// @route   GET api/admin/lab-tests/bookings
// @desc    Get all lab test bookings
// @access  Private (Admin only)
router.get('/lab-tests/bookings', [auth, roleCheck(['admin'])], getLabTestBookings);

// Admin user routes
// @route   GET api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', auth, roleCheck(['admin']), getAllUsers);

// @route   POST api/admin/users
// @desc    Add user
// @access  Private (Admin only)
router.post('/users', auth, roleCheck(['admin']), addUser);

// @route   PUT api/admin/users/:id
// @desc    Update user
// @access  Private (Admin only)
router.put('/users/:id', auth, roleCheck(['admin']), updateUser);

// @route   DELETE api/admin/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/users/:id', auth, roleCheck(['admin']), deleteUser);

// Admin appointment routes
// @route   GET api/admin/appointments
// @desc    Get all appointments
// @access  Private (Admin only)
router.get('/appointments', auth, roleCheck(['admin']), appointmentController.getAllAppointments);

// Admin stats route
// @route   GET api/admin/stats
// @desc    Get admin dashboard stats
// @access  Private (Admin only)
router.get('/stats', auth, roleCheck(['admin']), getStats);

module.exports = router;