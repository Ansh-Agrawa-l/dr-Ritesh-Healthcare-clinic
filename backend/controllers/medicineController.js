// controllers/medicineController.js
const { validationResult } = require('express-validator');
const Medicine = require('../models/Medicine');
const Order = require('../models/Order');
const ApiError = require('../utils/ApiError');
const path = require('path');
const fs = require('fs');

// Get all medicines
exports.getAllMedicines = async (req, res, next) => {
  try {
    console.log('Fetching all medicines...');
    const medicines = await Medicine.find({});
    console.log('Found medicines:', medicines.length);
    
    // Add full URL to photo paths
    const medicinesWithUrls = medicines.map(medicine => {
      const medicineObj = medicine.toObject();
      console.log('Processing medicine:', {
        id: medicineObj._id,
        name: medicineObj.name,
        photo: medicineObj.photo
      });
      
      if (medicineObj.photo) {
        // Remove any leading slash to avoid double slashes
        medicineObj.photo = medicineObj.photo.replace(/^\/+/, '');
        console.log('Medicine photo path:', medicineObj.photo);
      } else {
        console.log('No photo found for medicine:', medicineObj.name);
      }
      return medicineObj;
    });
    
    console.log('Sending medicines with URLs:', medicinesWithUrls);
    res.json(medicinesWithUrls);
  } catch (error) {
    console.error('Error fetching medicines:', error);
    next(error);
  }
};

// Get medicine by ID
exports.getMedicineById = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      throw new ApiError(404, 'Medicine not found');
    }
    const medicineObj = medicine.toObject();
    if (medicineObj.photo) {
      medicineObj.photo = `/uploads/medicines/${medicineObj.photo}`;
    }
    res.json(medicineObj);
  } catch (error) {
    next(error);
  }
};

// Get patient orders
exports.getPatientOrders = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      throw new ApiError(401, 'User not authenticated');
    }

    const orders = await Order.find({
      patient: req.user.id,
      orderType: 'medicine'
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// Purchase medicine
exports.purchaseMedicine = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, errors.array());
    }

    const { items, deliveryAddress, paymentMethod } = req.body;

    // Validate medicines and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const medicine = await Medicine.findById(item.medicineId);
      if (!medicine) {
        throw new ApiError(404, `Medicine with ID ${item.medicineId} not found`);
      }

      // Check if enough quantity is available
      if (medicine.quantity < item.quantity) {
        throw new ApiError(400, `Not enough quantity available for ${medicine.name}`);
      }

      // Update medicine quantity
      medicine.quantity -= item.quantity;
      await medicine.save();

      // Add to order items
      orderItems.push({
        item: medicine._id,
        name: medicine.name,
        price: medicine.price,
        quantity: item.quantity
      });

      totalAmount += medicine.price * item.quantity;
    }

    // Create order
    const order = new Order({
      patient: req.user.id,
      orderType: 'medicine',
      items: orderItems,
      totalAmount,
      deliveryAddress,
      paymentMethod
    });

    await order.save();

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// Create medicine (admin only)
exports.createMedicine = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, errors.array());
    }

    console.log('Creating medicine with data:', req.body);
    console.log('File:', req.file);

    const medicineData = { ...req.body };
    if (req.file) {
      medicineData.photo = req.file.filename;
      console.log('Photo filename:', medicineData.photo);
    } else {
      console.log('No photo file uploaded');
    }

    const medicine = new Medicine(medicineData);
    await medicine.save();

    console.log('Medicine created:', medicine);

    // Return the medicine with the photo path
    const medicineResponse = medicine.toObject();
    if (medicineResponse.photo) {
      medicineResponse.photo = medicineResponse.photo;
    }
    res.status(201).json(medicineResponse);
  } catch (error) {
    console.error('Error creating medicine:', error);
    next(error);
  }
};

// Update medicine (admin only)
exports.updateMedicine = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, errors.array());
    }

    console.log('Updating medicine:', req.params.id);
    console.log('Update data:', req.body);
    console.log('File:', req.file);

    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      throw new ApiError(404, 'Medicine not found');
    }

    // Delete old photo if new one is uploaded
    if (req.file) {
      if (medicine.photo) {
        const oldPhotoPath = path.join(__dirname, '../uploads/medicines', medicine.photo);
        console.log('Deleting old photo:', oldPhotoPath);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
      req.body.photo = req.file.filename;
      console.log('New photo filename:', req.body.photo);
    }

    Object.assign(medicine, req.body);
    await medicine.save();

    console.log('Medicine updated:', medicine);

    // Return the medicine with the photo path
    const medicineResponse = medicine.toObject();
    if (medicineResponse.photo) {
      medicineResponse.photo = medicineResponse.photo;
    }
    res.json(medicineResponse);
  } catch (error) {
    console.error('Error updating medicine:', error);
    next(error);
  }
};

// Delete medicine (admin only)
exports.deleteMedicine = async (req, res, next) => {
  try {
    console.log('Deleting medicine:', req.params.id);

    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      throw new ApiError(404, 'Medicine not found');
    }

    // Delete photo file if exists
    if (medicine.photo) {
      const photoPath = path.join(__dirname, '../uploads/medicines', medicine.photo);
      console.log('Deleting photo:', photoPath);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    // Use findByIdAndDelete instead of remove
    await Medicine.findByIdAndDelete(req.params.id);
    console.log('Medicine deleted successfully');

    res.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    console.error('Error deleting medicine:', error);
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, 'Failed to delete medicine'));
    }
  }
};