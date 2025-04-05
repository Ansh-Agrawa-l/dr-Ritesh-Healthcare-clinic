import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  LocalHospital as LocalHospitalIcon,
  Science as ScienceIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  CalendarToday as CalendarIcon,
  ShoppingCart as ShoppingCartIcon,
  AdminPanelSettings as AdminIcon,
  ManageAccounts as ManageAccountsIcon,
  Medication as MedicationIcon,
  EventNote as EventNoteIcon,
  LocalPharmacy as LocalPharmacyIcon,
  Event as EventIcon,
  ExitToApp as ExitToAppIcon,
  Assessment as AssessmentIcon,
  MedicalServices as MedicalServicesIcon,
  CalendarMonth as CalendarMonthIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleProfileClick = () => {
    handleMenuClose();
    if (user?.role === 'doctor') {
      navigate('/doctor/profile');
    } else if (user?.role === 'patient') {
      navigate('/patient/profile');
    }
  };

  const menuItems = [
    {
      text: 'Home',
      icon: <HomeIcon />,
      path: '/',
      show: true
    },
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: user?.role === 'doctor' ? '/doctor/dashboard' : user?.role === 'admin' ? '/admin/dashboard' : '/patient/dashboard',
      show: isAuthenticated
    },
    {
      text: 'Manage Appointments',
      icon: <EventIcon />,
      path: '/doctor/appointments',
      show: isAuthenticated && user?.role === 'doctor'
    },
    {
      text: 'My Appointments',
      icon: <EventIcon />,
      path: '/patient/appointments',
      show: isAuthenticated && user?.role === 'patient'
    },
    {
      text: 'My Orders',
      icon: <ShoppingCartIcon />,
      path: '/patient/orders',
      show: isAuthenticated && user?.role === 'patient'
    },
    {
      text: 'My Lab Tests',
      icon: <ScienceIcon />,
      path: '/patient/my-lab-tests',
      show: isAuthenticated && user?.role === 'patient'
    },
    // Admin routes
    {
      text: 'Manage Doctors',
      icon: <PeopleIcon />,
      path: '/admin/doctors',
      show: isAuthenticated && user?.role === 'admin'
    },
    {
      text: 'Manage Medicines',
      icon: <LocalPharmacyIcon />,
      path: '/admin/medicines',
      show: isAuthenticated && user?.role === 'admin'
    },
    {
      text: 'Manage Lab Tests',
      icon: <ScienceIcon />,
      path: '/admin/lab-tests',
      show: isAuthenticated && user?.role === 'admin'
    }
  ];

  const userMenuItems = [
    {
      text: 'My Profile',
      icon: <AccountCircleIcon />,
      path: user?.role === 'patient' ? '/patient/profile' : 
            user?.role === 'doctor' ? '/doctor/profile' : 
            '/admin/profile',
    },
    {
      text: 'Logout',
      icon: <LogoutIcon />,
      onClick: handleLogout,
    },
  ];

  const adminMenuItems = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: <DashboardIcon />
    },
    {
      title: 'Manage Doctors',
      path: '/admin/doctors',
      icon: <MedicalServicesIcon />
    },
    {
      title: 'Manage Medicines',
      path: '/admin/medicines',
      icon: <MedicationIcon />
    },
    {
      title: 'Manage Lab Tests',
      path: '/admin/lab-tests',
      icon: <ScienceIcon />
    },
    {
      title: 'Manage Lab Test Bookings',
      path: '/admin/lab-test-bookings',
      icon: <AssessmentIcon />
    }
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Healthcare App
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {user?.role === 'admin' ? (
          adminMenuItems.map((item) => (
            <ListItem
              button
              key={item.title}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          ))
        ) : (
          menuItems.map((item) => (
            item.show && (
          <ListItem
            button
            key={item.text}
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
            )
          ))
        )}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: '100%',
          ml: { sm: mobileOpen ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find((item) => item.path === location.pathname)?.text || 'Home'}
          </Typography>
          {user?.role === 'patient' && (
            <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
              <Button
                color="inherit"
                startIcon={<PeopleIcon />}
                onClick={() => navigate('/doctors')}
                sx={{ 
                  color: location.pathname === '/doctors' ? 'secondary.main' : 'inherit',
                  '&:hover': {
                    color: 'secondary.main',
                  }
                }}
              >
                Doctors
              </Button>
              <Button
                color="inherit"
                startIcon={<LocalHospitalIcon />}
                onClick={() => navigate('/medicines')}
                sx={{ 
                  color: location.pathname === '/medicines' ? 'secondary.main' : 'inherit',
                  '&:hover': {
                    color: 'secondary.main',
                  }
                }}
              >
                Medicines
              </Button>
              <Button
                color="inherit"
                startIcon={<ScienceIcon />}
                onClick={() => navigate('/lab-tests')}
                sx={{ 
                  color: location.pathname === '/lab-tests' ? 'secondary.main' : 'inherit',
                  '&:hover': {
                    color: 'secondary.main',
                  }
                }}
              >
                Lab Tests
              </Button>
            </Box>
          )}
          {user ? (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {userMenuItems.map((item) => (
                  <MenuItem
                    key={item.text}
                    onClick={() => {
                      if (item.onClick) {
                        item.onClick();
                      } else {
                        navigate(item.path);
                      }
                      handleMenuClose();
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
              sx={{ 
                '&:hover': {
                  color: 'secondary.main',
                }
              }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: { sm: mobileOpen ? `${drawerWidth}px` : 0 },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout; 