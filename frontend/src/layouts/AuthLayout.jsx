import { Outlet } from 'react-router-dom';
import { Container, Box, Paper, Typography } from '@mui/material';
import { LocalHospital } from '@mui/icons-material';

const AuthLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <LocalHospital
            sx={{
              fontSize: 48,
              color: 'primary.main',
              mb: 2,
            }}
          />
          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            Healthcare Platform
          </Typography>
        </Box>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: '1rem',
            bgcolor: 'background.paper',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          }}
        >
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout; 