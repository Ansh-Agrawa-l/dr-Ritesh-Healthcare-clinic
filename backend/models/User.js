const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient'
  },
  // Doctor specific fields
  specialization: {
    type: String,
    required: function() { return this.role === 'doctor'; }
  },
  qualification: {
    type: String,
    required: function() { return this.role === 'doctor'; }
  },
  experience: {
    type: Number,
    required: function() { return this.role === 'doctor'; }
  },
  // Patient specific fields
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  age: {
    type: Number
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  // Doctor availability (for appointments)
  availability: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    from: {
      type: String
    },
    to: {
      type: String
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);