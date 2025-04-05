// controllers/labTestController.js
const { validationResult } = require('express-validator');
const LabTest = require('../models/LabTest');
const LabTestBooking = require('../models/LabTestBooking');

// Get all lab tests
exports.getAllLabTests = async (req, res) => {
  try {
    const labTests = await LabTest.find().sort({ name: 1 });
    res.json(labTests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get lab test by ID
exports.getLabTestById = async (req, res) => {
  try {
    const labTest = await LabTest.findById(req.params.id);

    if (!labTest) {
      return res.status(404).json({ message: 'Lab test not found' });
    }

    res.json(labTest);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Lab test not found' });
    }
    res.status(500).send('Server error');
  }
};

// Book a lab test
exports.bookLabTest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { testId, date, time, prescription, paymentMethod } = req.body;

  try {
    // Find lab test
    const labTest = await LabTest.findById(testId);
    if (!labTest) {
      return res.status(404).json({ message: 'Lab test not found' });
    }

    // Create lab test booking
    const booking = new LabTestBooking({
      patient: req.user.id,
      labTest: testId,
      date: new Date(`${date}T${time}`),
      prescription,
      paymentMethod,
      price: labTest.price,
      status: 'pending'
    });

    await booking.save();

    // Populate the booking with lab test details
    const populatedBooking = await LabTestBooking.findById(booking._id)
      .populate('labTest', 'name price');

    res.json(populatedBooking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get lab test history for patient
exports.getLabTestHistory = async (req, res) => {
  try {
    const bookings = await LabTestBooking.find({ patient: req.user.id })
      .populate('labTest', 'name price')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};