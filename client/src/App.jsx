import { Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Movies from './pages/Movies';
import Admin from './pages/Admin';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#f50057' },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: '#181A20', width: '100vw', display: 'flex', flexDirection: 'column',  background: 'linear-gradient(to bottom, #181A20 0%, #23242a 100%)' }}>
        <Header />
        <Box sx={{ height: { xs: 56, md: 64 } }} />
        <Box component="main" sx={{ flex: 1, width: '100%' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
      <ScrollToTop />
    </ThemeProvider>
  );
}

export default App;
