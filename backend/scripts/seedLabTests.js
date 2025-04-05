const mongoose = require('mongoose');
const LabTest = require('../models/LabTest');
const config = require('../config/default');

const labTests = [
  {
    name: 'Complete Blood Count (CBC)',
    description: 'A complete blood count (CBC) is a blood test that measures many different parts and features of your blood, including red blood cells, white blood cells, and platelets.',
    price: 500,
    duration: '1 day',
    category: 'Hematology',
    preparation: 'No special preparation required'
  },
  {
    name: 'Lipid Profile',
    description: 'A lipid panel is a blood test that measures lipids — fats and fatty substances used as a source of energy by your body. Lipids include cholesterol and triglycerides.',
    price: 800,
    duration: '1 day',
    category: 'Cardiology',
    preparation: 'Fasting for 12 hours required'
  },
  {
    name: 'Thyroid Function Test',
    description: 'A thyroid function test is used to check how well your thyroid is working and to help diagnose thyroid disorders.',
    price: 1200,
    duration: '1 day',
    category: 'Endocrinology',
    preparation: 'No special preparation required'
  },
  {
    name: 'Liver Function Test',
    description: 'Liver function tests are blood tests used to help diagnose and monitor liver disease or damage.',
    price: 1000,
    duration: '1 day',
    category: 'Gastroenterology',
    preparation: 'Fasting for 8 hours required'
  },
  {
    name: 'Kidney Function Test',
    description: 'Kidney function tests are simple blood and urine tests that can help identify problems with your kidneys.',
    price: 900,
    duration: '1 day',
    category: 'Nephrology',
    preparation: 'No special preparation required'
  }
];

const seedLabTests = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing lab tests
    await LabTest.deleteMany({});
    console.log('Cleared existing lab tests');

    // Insert new lab tests
    await LabTest.insertMany(labTests);
    console.log('Seeded lab tests successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding lab tests:', error);
    process.exit(1);
  }
};

seedLabTests(); 