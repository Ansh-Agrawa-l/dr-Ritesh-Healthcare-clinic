import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { store } from './store';
import { theme } from './utils/theme';
import AppRoutes from './routes';
import AuthInitializer from './components/AuthInitializer';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          <AuthInitializer>
            <AppRoutes />
          </AuthInitializer>
          <ToastContainer position="top-right" autoClose={3000} />
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;