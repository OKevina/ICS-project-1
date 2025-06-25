import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Grid,
  Link
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: '',
    farmName: '',
    location: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/register', formData);
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: '',
      farmName: '',
      location: '',
      address: ''
    });
  };

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case 'FARMER':
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Farm Name"
              name="farmName"
              value={formData.farmName}
              onChange={handleChange}
              InputLabelProps={{ sx: { color: '#212121' } }}
              InputProps={{
                sx: {
                  '& fieldset': { borderColor: '#E0E0E0' },
                  '&:hover fieldset': { borderColor: '#4CAF50' },
                  '&.Mui-focused fieldset': { borderColor: '#4CAF50' },
                  color: '#212121'
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              InputLabelProps={{ sx: { color: '#212121' } }}
              InputProps={{
                sx: {
                  '& fieldset': { borderColor: '#E0E0E0' },
                  '&:hover fieldset': { borderColor: '#4CAF50' },
                  '&.Mui-focused fieldset': { borderColor: '#4CAF50' },
                  color: '#212121'
                }
              }}
            />
          </>
        );
      case 'CONSUMER':
        return (
          <TextField
            margin="normal"
            required
            fullWidth
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            InputLabelProps={{ sx: { color: '#212121' } }}
            InputProps={{
              sx: {
                '& fieldset': { borderColor: '#E0E0E0' },
                '&:hover fieldset': { borderColor: '#4CAF50' },
                '&.Mui-focused fieldset': { borderColor: '#4CAF50' },
                color: '#212121'
              }
            }}
          />
        );
      case 'ADMIN':
        return (
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            InputLabelProps={{ sx: { color: '#212121' } }}
            InputProps={{
              sx: {
                '& fieldset': { borderColor: '#E0E0E0' },
                '&:hover fieldset': { borderColor: '#4CAF50' },
                '&.Mui-focused fieldset': { borderColor: '#4CAF50' },
                color: '#212121'
              }
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#F9FBE7', // Overall background color
        display: 'flex',
        flexDirection: 'column', // Stack content vertically
        minHeight: '100vh', // Ensure it covers the full viewport height
      }}
    >
      <Grid
        container
        spacing={4}
        alignItems="center"
        justifyContent="center"
        sx={{ flexGrow: 1, p: 2 }} // Allow grid to grow and take available space, padding for content
      >
        {/* Left Section - Branding */}
        <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4, // Padding top/bottom
              maxWidth: { xs: '100%', md: '80%' }, // Responsive width for content
              mx: 'auto' // Center content in the grid item
            }}
          >
            <CheckCircle sx={{ fontSize: 80, color: '#4CAF50', mb: 2 }} />
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: '#4CAF50', mb: 1 }}>
              FarmDirect
            </Typography>
            <Typography variant="h6" sx={{ color: '#212121' }}>
              Connecting Farmers, Empowering Communities.
            </Typography>
          </Box>
        </Grid>

        {/* Right Section - Registration Form Card */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#FFFFFF', // Form card background
              padding: 4,
              borderRadius: 2,
              boxShadow: 3, // Soft shadow (MUI's default shadow is subtle)
              maxWidth: 450, // Limit width of the form card
              mx: 'auto' // Center the box horizontally within its grid item
            }}
          >
            <Typography component="h1" variant="h5" sx={{ mb: 3, color: '#4CAF50', fontWeight: 'bold' }}>
              Register for FarmDirect
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: '#212121' }}>
              Create an account to get started.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel sx={{ color: '#212121' }}>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  label="Role"
                  onChange={handleChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E0E0E0' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#4CAF50' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4CAF50' },
                    color: '#212121'
                  }}
                >
                  <MenuItem value="FARMER">Farmer</MenuItem>
                  <MenuItem value="CONSUMER">Consumer</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                </Select>
              </FormControl>

              <TextField
                margin="normal"
                required
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                InputLabelProps={{ sx: { color: '#212121' } }}
                InputProps={{
                  sx: {
                    '& fieldset': { borderColor: '#E0E0E0' },
                    '&:hover fieldset': { borderColor: '#4CAF50' },
                    '&.Mui-focused fieldset': { borderColor: '#4CAF50' },
                    color: '#212121'
                  }
                }}
              />

              {formData.role !== 'ADMIN' && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  InputLabelProps={{ sx: { color: '#212121' } }}
                  InputProps={{
                    sx: {
                      '& fieldset': { borderColor: '#E0E0E0' },
                      '&:hover fieldset': { borderColor: '#4CAF50' },
                      '&.Mui-focused fieldset': { borderColor: '#4CAF50' },
                      color: '#212121'
                    }
                  }}
                />
              )}

              {formData.role !== 'CONSUMER' && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  InputLabelProps={{ sx: { color: '#212121' } }}
                  InputProps={{
                    sx: {
                      '& fieldset': { borderColor: '#E0E0E0' },
                      '&:hover fieldset': { borderColor: '#4CAF50' },
                      '&.Mui-focused fieldset': { borderColor: '#4CAF50' },
                      color: '#212121'
                    }
                  }}
                />
              )}

              {renderRoleSpecificFields()}

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleClear}
                    sx={{ color: '#E53935', borderColor: '#E53935', '&:hover': { borderColor: '#D32F2F' } }}
                  >
                    Clear
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      bgcolor: '#4CAF50',
                      '&:hover': { bgcolor: '#388E3C' }
                    }}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Register'}
                  </Button>
                </Grid>
              </Grid>

              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
                sx={{ mt: 2, color: '#0288D1', cursor: 'pointer' }}
              >
                Already have an account? Login
              </Link>
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/* Footer */}
      <Box sx={{ p: 2, textAlign: 'center', color: '#212121', fontSize: '0.8rem' }}>
        <Typography variant="body2" sx={{ color: '#212121' }}>
          © 2025 AgriConnect Inc. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Register; 