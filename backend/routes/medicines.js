// routes/medicines.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const medicineController = require('../controllers/medicineController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Patient routes (must come before /:id route)
router.get('/patient/orders', auth, medicineController.getPatientOrders);
router.post('/patient/purchase', [
  auth,
  check('items', 'Items are required').isArray(),
  check('items.*.medicineId', 'Medicine ID is required').not().isEmpty(),
  check('items.*.quantity', 'Quantity is required').isInt({ min: 1 }),
  check('deliveryAddress', 'Delivery address is required').not().isEmpty()
], medicineController.purchaseMedicine);

// Admin routes (must come before /:id route)
router.post('/admin', [auth, (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
}], upload.single('photo'), medicineController.createMedicine);
router.put('/admin/:id', [auth, (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
}], upload.single('photo'), medicineController.updateMedicine);
router.delete('/admin/:id', [auth, (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
}], medicineController.deleteMedicine);

// Public routes (must come last)
router.get('/', medicineController.getAllMedicines);
router.get('/:id', medicineController.getMedicineById);

module.exports = router;