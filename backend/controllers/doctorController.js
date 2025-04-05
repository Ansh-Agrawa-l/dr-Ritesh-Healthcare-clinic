// controllers/doctorController.js
const { validationResult } = require('express-validator');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

// Get all doctors
exports.getAllDoctors = catchAsync(async (req, res) => {
  const doctors = await Doctor.find().select('-password');
  res.json(doctors);
});

// Get doctor by ID
exports.getDoctorById = catchAsync(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).select('-password');
  if (!doctor) {
    throw new ApiError(404, 'Doctor not found');
  }
  res.json(doctor);
});

// Get doctor profile
exports.getDoctorProfile = catchAsync(async (req, res) => {
  try {
    console.log('Getting profile for doctor ID:', req.user.id);
    
    if (!req.user || !req.user.id) {
      throw new ApiError(401, 'Authentication required');
    }

    const doctor = await Doctor.findById(req.user.id).select('-password');
    if (!doctor) {
      console.error('Doctor not found for ID:', req.user.id);
      throw new ApiError(404, 'Doctor not found');
    }
    
    console.log('Found doctor profile:', doctor);
    res.json(doctor);
  } catch (error) {
    console.error('Error in getDoctorProfile:', error);
    throw error;
  }
});
// Get doctor appointments
exports.getDoctorAppointments = catchAsync(async (req, res) => {
  try {
    console.log('Getting appointments for doctor ID:', req.user.id);
    
    if (!req.user || !req.user.id) {
      throw new ApiError(401, 'Authentication required');
    }

    // First verify the doctor exists
    const doctor = await Doctor.findById(req.user.id);
    if (!doctor) {
      console.error('Doctor not found for ID:', req.user.id);
      throw new ApiError(404, 'Doctor not found');
    }

    // Then get appointments
    const appointments = await Appointment.find({ doctor: req.user.id })
      .populate('patient', 'name email')
      .sort({ appointmentDate: -1 });

    console.log('Found appointments:', appointments);
    res.json(appointments || []);
  } catch (error) {
    console.error('Error in getDoctorAppointments:', error);
    throw error;
  }
});

// Update doctor profile
exports.updateDoctorProfile = catchAsync(async (req, res) => {
  try {
    const { name, email, specialization, qualification, experience, phone, address } = req.body;
    console.log('Updating profile for doctor ID:', req.user.id);

    if (!req.user || !req.user.id) {
      throw new ApiError(401, 'Authentication required');
    }

    const doctor = await Doctor.findById(req.user.id);
    if (!doctor) {
      console.error('Doctor not found for ID:', req.user.id);
      throw new ApiError(404, 'Doctor not found');
    }

    // Update fields
    doctor.name = name;
    doctor.email = email;
    doctor.specialization = specialization;
    doctor.qualification = qualification;
    doctor.experience = experience;
    doctor.phone = phone;
    doctor.address = address;

    await doctor.save();
    console.log('Updated doctor profile:', doctor);
    res.json(doctor);
  } catch (error) {
    console.error('Error in updateDoctorProfile:', error);
    throw error;
  }
});

// Update appointment status
exports.updateAppointmentStatus = catchAsync(async (req, res) => {
  try {
    const { status } = req.body;
    const appointmentId = req.params.id;
    const doctorId = req.user.id;

    console.log('Updating appointment status:', {
      appointmentId,
      doctorId,
      status
    });

    // Find the appointment
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: doctorId
    });

    if (!appointment) {
      console.error('Appointment not found or not authorized');
      throw new ApiError(404, 'Appointment not found or not authorized');
    }

    // Validate status
    const validStatuses = ['scheduled', 'completed', 'cancelled', 'rescheduled'];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, 'Invalid status value');
    }

    // Update the status
    appointment.status = status;
    await appointment.save();

    // Populate patient details
    await appointment.populate('patient', 'name email');

    console.log('Updated appointment:', appointment);
    res.json(appointment);
  } catch (error) {
    console.error('Error in updateAppointmentStatus:', error);
    throw error;
  }
});