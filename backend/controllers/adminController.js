// Delete lab test
exports.deleteLabTest = async (req, res) => {
  try {
    const labTest = await LabTest.findByIdAndDelete(req.params.id);
    if (!labTest) {
      return res.status(404).json({ message: 'Lab test not found' });
    }
    res.json({ message: 'Lab test removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Medicine = require('../models/Medicine');
const LabTest = require('../models/LabTest');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Order = require('../models/Order');
const LabTestBooking = require('../models/LabTestBooking');
const catchAsync = require('../utils/catchAsync');

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

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select('-password');
    res.json(doctors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Add doctor
exports.addDoctor = async (req, res) => {
  try {
    // Check if doctor exists
    let doctor = await Doctor.findOne({ email: req.body.email });
    if (doctor) {
      return res.status(400).json({ message: 'Doctor already exists' });
    }

    // Validate required fields
    const requiredFields = ['name', 'email', 'password', 'specialization', 'qualification', 'experience', 'phone', 'address'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        fields: missingFields 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create doctor
    doctor = new Doctor({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      specialization: req.body.specialization,
      qualification: req.body.qualification,
      experience: req.body.experience,
      phone: req.body.phone,
      address: req.body.address,
      isAvailable: true
    });

    // Handle photo upload
    if (req.file) {
      doctor.photo = req.file.filename;
    }

    await doctor.save();

    // Remove password from response
    const doctorResponse = doctor.toObject();
    delete doctorResponse.password;

    res.json(doctorResponse);
  } catch (err) {
    console.error('Error adding doctor:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Update doctor
exports.updateDoctor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Update fields
    doctor.name = req.body.name || doctor.name;
    doctor.specialization = req.body.specialization || doctor.specialization;
    doctor.qualification = req.body.qualification || doctor.qualification;
    doctor.experience = req.body.experience || doctor.experience;
    doctor.phone = req.body.phone || doctor.phone;
    doctor.address = req.body.address || doctor.address;
    doctor.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : doctor.isAvailable;

    // Handle photo upload
    if (req.file) {
      // Delete old photo if exists
      if (doctor.photo) {
        const oldPhotoPath = path.join('uploads/doctors', doctor.photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
      doctor.photo = req.file.filename;
    }

    await doctor.save();

    // Remove password from response
    const doctorResponse = doctor.toObject();
    delete doctorResponse.password;

    res.json(doctorResponse);
  } catch (err) {
    console.error('Error updating doctor:', err);
    res.status(500).send('Server Error');
  }
};

// Delete doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ message: 'Doctor removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all medicines
exports.getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Add medicine
exports.addMedicine = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const medicine = new Medicine(req.body);
    await medicine.save();
    res.json(medicine);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update medicine
exports.updateMedicine = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.json(medicine);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete medicine
exports.deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.json({ message: 'Medicine removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all lab tests
exports.getAllLabTests = async (req, res) => {
  try {
    const labTests = await LabTest.find();
    const bookings = await LabTestBooking.find()
      .populate('patient', 'name email')
      .populate('labTest', 'name price');
    
    // Combine lab tests with their bookings
    const labTestsWithBookings = labTests.map(test => {
      const testBookings = bookings.filter(booking => 
        booking.labTest._id.toString() === test._id.toString()
      );
      return {
        ...test.toObject(),
        bookings: testBookings
      };
    });

    res.json(labTestsWithBookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Add lab test
exports.addLabTest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const labTest = new LabTest(req.body);
    await labTest.save();
    res.json(labTest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update lab test
exports.updateLabTest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const labTest = await LabTest.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!labTest) {
      return res.status(404).json({ message: 'Lab test not found' });
    }
    res.json(labTest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Add user
exports.addUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update user
exports.updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, role } = req.body;

  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get admin dashboard stats
exports.getStats = async (req, res) => {
  try {
    const stats = {
      totalDoctors: await Doctor.countDocuments(),
      totalPatients: await User.countDocuments({ role: 'patient' }),
      totalAppointments: await Appointment.countDocuments(),
      totalMedicines: await Medicine.countDocuments(),
      totalLabTests: await LabTest.countDocuments()
    };
    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update lab test booking status
// @route   PATCH /api/admin/lab-tests/bookings/:id/status
// @access  Private (Admin only)
exports.updateLabTestBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await LabTestBooking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Lab test booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    console.error('Error updating lab test booking status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get lab test bookings
exports.getLabTestBookings = async (req, res) => {
  try {
    console.log('Fetching lab test bookings...');
    
    const bookings = await LabTestBooking.find()
      .populate('patient', 'name email')
      .populate('labTest', 'name price duration')
      .sort({ createdAt: -1 });

    console.log(`Found ${bookings.length} bookings`);
    if (bookings.length > 0) {
      console.log('Sample booking:', bookings[0]);
    }

    res.json(bookings);
  } catch (err) {
    console.error('Error fetching lab test bookings:', err);
    res.status(500).send('Server Error');
  }
}; 