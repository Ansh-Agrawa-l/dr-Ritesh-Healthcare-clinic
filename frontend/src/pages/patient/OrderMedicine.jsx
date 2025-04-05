import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Badge,
  Paper,
  InputBase,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Delete as DeleteIcon, ShoppingCart as ShoppingCartIcon, Search as SearchIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { patientsApi } from '../../services/api';

const OrderMedicine = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await patientsApi.getMedicines();
      setMedicines(response.data);
    } catch (error) {
      toast.error('Failed to fetch medicines');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (medicine) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === medicine._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === medicine._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...medicine, quantity: 1 }];
    });
    toast.success('Added to cart');
  };

  const handleRemoveFromCart = (medicineId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== medicineId));
    toast.success('Removed from cart');
  };

  const handleUpdateQuantity = (medicineId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === medicineId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handlePlaceOrder = async () => {
    try {
      const orderItems = cart.map((item) => ({
        medicineId: item._id,
        quantity: item.quantity,
      }));
      await patientsApi.orderMedicine({ items: orderItems });
      toast.success('Order placed successfully!');
      setCart([]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Cart Sidebar */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 320,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 320,
            boxSizing: 'border-box',
            p: 2,
            bgcolor: '#f5f5f5',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ShoppingCartIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Shopping Cart</Typography>
          <Badge badgeContent={cart.length} color="primary" sx={{ ml: 2 }} />
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        {cart.length === 0 ? (
          <Typography color="text.secondary" align="center">
            Your cart is empty
      </Typography>
        ) : (
          <>
            <List>
              {cart.map((item) => (
                <ListItem 
                  key={item._id} 
                  divider
                  sx={{ 
                    bgcolor: 'white',
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': {
                      boxShadow: 1,
                    },
                  }}
                >
                  <ListItemText
                    primary={item.name}
                    secondary={`₹${item.price} × ${item.quantity}`}
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveFromCart(item._id)}
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Paper elevation={3} sx={{ p: 2, bgcolor: 'white' }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" align="right">
                  Total: ₹{getTotalPrice()}
                </Typography>
              </Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                onClick={handlePlaceOrder}
                disabled={cart.length === 0}
                  size="large"
                >
                  Place Order
                </Button>
            </Paper>
          </>
        )}
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3, ml: '320px' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Available Medicines
          </Typography>
          <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, mb: 2 }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <IconButton type="button" sx={{ p: '10px' }}>
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>

        <Grid container spacing={3}>
          {filteredMedicines.map((medicine) => (
            <Grid item key={medicine._id} xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {medicine.name}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {medicine.description}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    ₹{medicine.price}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleAddToCart(medicine)}
                    sx={{ mt: 'auto' }}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
          </Box>
  );
};

export default OrderMedicine; 