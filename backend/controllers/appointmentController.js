// controllers/appointmentController.js
const { validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

// Get appointments (for both patients and doctors)
exports.getAppointments = catchAsync(async (req, res) => {
  try {
    console.log('Getting appointments for user:', req.user);
    
    let appointments;
    if (req.user.role === 'patient') {
      // Get patient's appointments
      appointments = await Appointment.find({ patient: req.user.id })
        .populate('doctor', 'name specialization')
        .sort({ appointmentDate: -1 });
    } else if (req.user.role === 'doctor') {
      // Get doctor's appointments
      appointments = await Appointment.find({ doctor: req.user.id })
        .populate('patient', 'name email')
        .sort({ appointmentDate: -1 });
    } else {
      throw new ApiError(403, 'Access denied');
    }

    console.log('Found appointments:', appointments);
    res.json(appointments || []);
  } catch (error) {
    console.error('Error in getAppointments:', error);
    throw error;
  }
});

// Book appointment
exports.bookAppointment = catchAsync(async (req, res) => {
  const { doctorId, appointmentDate, timeSlot, reason } = req.body;

  try {
    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      throw new ApiError(404, 'Doctor not found');
    }

    // Create new appointment
    const appointment = new Appointment({
      patient: req.user.id,
      doctor: doctorId,
      appointmentDate,
      timeSlot,
      reason,
      status: 'scheduled'
    });

    await appointment.save();

    // Populate doctor details
    await appointment.populate('doctor', 'name specialization');

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error in bookAppointment:', error);
    throw error;
  }
});

// Cancel appointment
exports.cancelAppointment = catchAsync(async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: req.user.id
    });

    if (!appointment) {
      throw new ApiError(404, 'Appointment not found');
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    console.error('Error in cancelAppointment:', error);
    throw error;
  }
});

// Update appointment status
exports.updateAppointmentStatus = catchAsync(async (req, res) => {
  try {
    const { status } = req.body;
    const appointmentId = req.params.id;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: req.user.id
    });

    if (!appointment) {
      throw new ApiError(404, 'Appointment not found');
    }

    appointment.status = status;
    await appointment.save();

    // Populate patient details
    await appointment.populate('patient', 'name email');

    res.json(appointment);
  } catch (error) {
    console.error('Error in updateAppointmentStatus:', error);
    throw error;
  }
});

// Get all appointments - for admin
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('doctor', 'name specialization')
      .populate('patient', 'name')
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
