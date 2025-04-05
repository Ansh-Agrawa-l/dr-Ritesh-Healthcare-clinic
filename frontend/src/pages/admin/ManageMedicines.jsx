import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { adminApi } from '../../services/api';
import config from '../../config';
import { UPLOADS_URL } from '../../config';

const ManageMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    manufacturer: '',
    expiryDate: '',
    photo: null
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const getImageUrl = (photo) => {
    console.log('Getting image URL for photo:', photo);
    if (!photo) {
      console.log('No photo provided, using placeholder');
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU1RTUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSIgZm9udC1zaXplPSIxNiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
    }
    const cleanPhotoPath = photo.replace(/^\/+/, '');
    const url = `${UPLOADS_URL}/medicines/${cleanPhotoPath}`;
    console.log('Generated image URL:', url);
    return url;
  };

  const handleImageError = (e) => {
    console.log('Image load error for:', e.target.src);
    console.log('Current image URL:', e.target.src);
    console.log('UPLOADS_URL:', UPLOADS_URL);
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU1RTUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSIgZm9udC1zaXplPSIxNiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
    e.target.onerror = null;
  };

  const fetchMedicines = async () => {
    try {
      const response = await adminApi.getMedicines();
      console.log('Received medicines:', response.data);
      setMedicines(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      toast.error('Failed to fetch medicines');
      setLoading(false);
    }
  };

  const handleOpen = (medicine = null) => {
    if (medicine) {
      setSelectedMedicine(medicine);
      setFormData({
        name: medicine.name,
        description: medicine.description,
        price: medicine.price,
        stock: medicine.stock,
        category: medicine.category,
        manufacturer: medicine.manufacturer,
        expiryDate: medicine.expiryDate,
        photo: null
      });
    } else {
      setSelectedMedicine(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        manufacturer: '',
        expiryDate: '',
        photo: null
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMedicine(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      manufacturer: '',
      expiryDate: '',
      photo: null
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Photo selected:', file.name, 'Type:', file.type, 'Size:', file.size);
      setFormData({ ...formData, photo: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'price', 'stock', 'category', 'manufacturer', 'expiryDate'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && key !== 'photo') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add photo if it exists
      if (formData.photo instanceof File) {
        formDataToSend.append('photo', formData.photo);
        console.log('Appending photo file:', formData.photo.name);
      }

      console.log('Submitting form data:', {
        name: formData.name,
        hasPhoto: !!formData.photo,
        photoType: formData.photo instanceof File ? 'File' : typeof formData.photo
      });

      let response;
      if (selectedMedicine) {
        response = await adminApi.updateMedicine(selectedMedicine._id, formDataToSend);
        toast.success('Medicine updated successfully');
      } else {
        response = await adminApi.createMedicine(formDataToSend);
        toast.success('Medicine added successfully');
      }

      console.log('Server response:', response.data);
      handleClose();
      fetchMedicines();
    } catch (error) {
      console.error('Error saving medicine:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save medicine';
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await adminApi.deleteMedicine(id);
        toast.success('Medicine deleted successfully');
        fetchMedicines();
      } catch (error) {
        console.error('Error deleting medicine:', error);
        const errorMessage = error.response?.data?.message || 'Failed to delete medicine';
        toast.error(errorMessage);
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Manage Medicines
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Add Medicine
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {medicines.map((medicine) => (
              <Grid item xs={12} sm={6} md={4} key={medicine._id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={getImageUrl(medicine.photo)}
                    alt={medicine.name}
                    sx={{ objectFit: 'cover' }}
                    onError={handleImageError}
                    loading="lazy"
                  />
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {medicine.name}
                    </Typography>
                    <Typography color="text.secondary">
                      Price: ₹{medicine.price}
                    </Typography>
                    <Typography color="text.secondary">
                      Stock: {medicine.stock}
                    </Typography>
                    <Typography color="text.secondary">
                      Category: {medicine.category}
                    </Typography>
                  </CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                    <IconButton onClick={() => handleOpen(medicine)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(medicine._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <form onSubmit={handleSubmit} noValidate>
            <DialogTitle>
              {selectedMedicine ? 'Edit Medicine' : 'Add New Medicine'}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <TextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={3}
                  required
                />
                <TextField
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Category"
                  >
                    <MenuItem value="Tablet">Tablet</MenuItem>
                    <MenuItem value="Capsule">Capsule</MenuItem>
                    <MenuItem value="Syrup">Syrup</MenuItem>
                    <MenuItem value="Injection">Injection</MenuItem>
                    <MenuItem value="Cream">Cream</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Manufacturer"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Expiry Date"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
                <Box>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{ display: 'none' }}
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                    >
                      {formData.photo ? 'Change Photo' : 'Upload Photo'}
                    </Button>
                  </label>
                  {formData.photo && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Selected file: {formData.photo.name}
                    </Typography>
                  )}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button type="button" onClick={handleClose}>Cancel</Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSubmit(e);
                }}
              >
                {selectedMedicine ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Container>
  );
};

export default ManageMedicines; 