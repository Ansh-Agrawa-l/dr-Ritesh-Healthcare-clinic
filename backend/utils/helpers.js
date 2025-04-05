// utils/helpers.js
const jwt = require('jsonwebtoken');
const config = require('../config/default');

// Generate JWT token
exports.generateToken = (userId, role) => {
  const payload = {
    user: {
      id: userId,
      role: role
    }
  };

  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRE });
};

// Format date to YYYY-MM-DD
exports.formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Check if time slot is available
exports.isTimeSlotAvailable = async (doctorId, date, timeSlot) => {
  const Appointment = require('../models/Appointment');
  
  const appointment = await Appointment.findOne({
    doctor: doctorId,
    appointmentDate: date,
    timeSlot: timeSlot,
    status: { $in: ['scheduled', 'rescheduled'] }
  });

  return !appointment;
};

// Get available time slots for a doctor on a specific date
exports.getAvailableTimeSlots = async (doctorId, date) => {
  const User = require('../models/User');
  const Appointment = require('../models/Appointment');
  
  // Get doctor's availability settings
  const doctor = await User.findById(doctorId);
  if (!doctor || doctor.role !== 'doctor') {
    throw new Error('Doctor not found');
  }

  // Get day of week from date
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  
  // Find doctor's schedule for this day
  const daySchedule = doctor.availability.find(a => a.day === dayOfWeek);
  if (!daySchedule) {
    return [];
  }

  // Generate time slots (e.g. 30 min intervals)
  const slots = [];
  let currentTime = daySchedule.from;
  const endTime = daySchedule.to;
  
  while (currentTime < endTime) {
    slots.push(currentTime);
    
    // Add 30 minutes
    const [hours, minutes] = currentTime.split(':').map(Number);
    let newMinutes = minutes + 30;
    let newHours = hours;
    
    if (newMinutes >= 60) {
      newMinutes -= 60;
      newHours += 1;
    }
    
    currentTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  }

  // Get booked appointments for this date
  const bookedAppointments = await Appointment.find({
    doctor: doctorId,
    appointmentDate: new Date(date),
    status: { $in: ['scheduled', 'rescheduled'] }
  });

  // Filter out booked slots
  const bookedSlots = bookedAppointments.map(appt => appt.timeSlot);
  const availableSlots = slots.filter(slot => !bookedSlots.includes(slot));

  return availableSlots;
};