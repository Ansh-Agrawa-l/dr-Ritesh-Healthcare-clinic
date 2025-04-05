const { validationResult } = require('express-validator');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Medicine = require('../models/Medicine');
const LabTest = require('../models/LabTest');
const Doctor = require('../models/Doctor');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');
const LabTestBooking = require('../models/LabTestBooking');

// Get all available doctors
exports.getDoctors = catchAsync(async (req, res, next) => {
    const doctors = await Doctor.find({ isActive: true })
        .select('name specialization experience rating');
    res.status(200).json({
        status: 'success',
        data: doctors
    });
});

// Get patient profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update patient profile
exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, address, gender, dateOfBirth, bloodGroup } = req.body;

  try {
    let patient = await Patient.findById(req.user.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Update fields
    patient.name = name || patient.name;
    patient.email = email || patient.email;
    patient.phone = phone || patient.phone;
    patient.address = address || patient.address;
    patient.gender = gender || patient.gender;
    patient.dateOfBirth = dateOfBirth || patient.dateOfBirth;
    patient.bloodGroup = bloodGroup || patient.bloodGroup;

    await patient.save();

    res.json(patient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get patient appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate('doctor', 'name specialization')
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Book an appointment
exports.bookAppointment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { doctorId, appointmentDate, timeSlot, reason } = req.body;

  try {
    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if the time slot is available
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate,
      timeSlot,
      status: { $in: ['scheduled', 'rescheduled'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot is not available' });
    }

    // Create appointment
    const appointment = new Appointment({
      patient: req.user.id,
      doctor: doctorId,
      appointmentDate,
      timeSlot,
      reason,
      status: 'scheduled'
    });

    await appointment.save();

    res.json(appointment);
  } catch (err) {
    console.error('Error booking appointment:', err);
    res.status(500).send('Server error');
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if the patient owns this appointment
    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update status to cancelled
    appointment.status = 'cancelled';
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get available medicines
exports.getMedicines = catchAsync(async (req, res, next) => {
    const medicines = await Medicine.find({ isAvailable: true })
        .select('name price description');
    
    res.status(200).json({
        status: 'success',
        data: medicines
    });
});

// Purchase medicines
exports.purchaseMedicines = catchAsync(async (req, res, next) => {
    const { medicines } = req.body;
    
    if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
        return next(new ApiError('Please provide valid medicines to purchase', 400));
    }

    // Validate each medicine exists and is available
    for (const medicine of medicines) {
        const medicineDoc = await Medicine.findById(medicine.id);
        if (!medicineDoc || !medicineDoc.isAvailable) {
            return next(new ApiError(`Medicine ${medicine.id} is not available`, 400));
        }
    }

    // Create order (you might want to create an Order model for this)
    const order = {
        patient: req.user._id,
        medicines,
        status: 'pending',
        createdAt: new Date()
    };

    // Here you would typically save the order to a database
    // await Order.create(order);

    res.status(201).json({
        status: 'success',
        message: 'Order placed successfully',
        data: order
    });
});

// Get available lab tests
exports.getLabTests = catchAsync(async (req, res, next) => {
    const labTests = await LabTest.find({ isAvailable: true })
        .select('name price description');
    
    res.status(200).json({
        status: 'success',
        data: labTests
    });
});

// Get lab test history
exports.getLabTestHistory = catchAsync(async (req, res, next) => {
    const bookings = await LabTestBooking.find({ patient: req.user._id })
        .populate('labTest', 'name price')
        .sort({ createdAt: -1 });

    res.status(200).json({
        status: 'success',
        data: bookings
    });
});

