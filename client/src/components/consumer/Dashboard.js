import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ConsumerDashboard = () => {
  const navigate = useNavigate();
  const [categoryFilters, setCategoryFilters] = useState({
    vegetables: false,
    fruits: false,
    grains: false,
    dairy: false,
  });
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('Featured');

  const handleCategoryChange = (event) => {
    setCategoryFilters({
      ...categoryFilters,
      [event.target.name]: event.target.checked,
    });
  };

  const handlePriceChange = (event) => {
    setPriceRange(event.target.value);
  };

  const handleApplyFilters = () => {
    // Logic to apply filters
    console.log('Applying Filters:', { categoryFilters, priceRange });
  };

  // Dummy Data (replace with actual product data from your backend)
  const products = [
    {
      id: 1,
      name: 'Organic Tomatoes',
      description: 'Fresh, juicy organic tomatoes from local farms',
      price: 4.99,
      unit: 'lb',
      image: 'https://via.placeholder.com/180x180?text=Fresh+Tomatoes'
    },
    {
      id: 2,
      name: 'Baby Carrots',
      description: 'Sweet and crunchy baby carrots, perfect for snacking',
      price: 2.99,
      unit: 'lb',
      image: 'https://via.placeholder.com/180x180?text=Fresh+Carrots'
    },
    {
      id: 3,
      name: 'Honeycrisp Apples',
      description: 'Crisp and sweet apples, perfect for eating fresh',
      price: 3.49,
      unit: 'lb',
      image: 'https://via.placeholder.com/180x180?text=Fresh+Apples'
    },
    {
      id: 4,
      name: 'Romaine Lettuce',
      description: 'Fresh romaine lettuce heads, perfect for salads and cooking',
      price: 1.99,
      unit: 'head',
      image: 'https://via.placeholder.com/180x180?text=Fresh+Lettuce'
    },
    {
      id: 5,
      name: 'Organic Bananas',
      description: 'Ripe organic bananas, naturally sweet and nutritious',
      price: 1.29,
      unit: 'lb',
      image: 'https://via.placeholder.com/180x180?text=Fresh+Bananas'
    },
    {
      id: 6,
      name: 'Baby Spinach',
      description: 'Tender baby spinach leaves, great for salads and cooking',
      price: 3.99,
      unit: 'bag',
      image: 'https://via.placeholder.com/180x180?text=Fresh+Spinach'
    },
  ];

  return (
    <Box sx={{ backgroundColor: '#F9FBE7', minHeight: '100vh' }}>
      {/* Top Navbar */}
      <AppBar position="static" sx={{ backgroundColor: '#FFFFFF', boxShadow: 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 30, color: '#4CAF50', mr: 1 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
              FarmDirect
            </Typography>
          </Box>
          <TextField
            variant="outlined"
            placeholder="Search fresh produce..."
            size="small"
            sx={{
              width: '40%',
              backgroundColor: '#F5F5F5',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'transparent' },
                '&.Mui-focused fieldset': { borderColor: '#4CAF50' },
                color: '#212121',
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#757575', // Adjust placeholder color
                opacity: 1,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#757575' }} />
                </InputAdornment>
              ),
            }}
          />
          <Box>
            <IconButton sx={{ color: '#212121', mr: 1 }}>
              <ShoppingCartIcon />
            </IconButton>
            <IconButton sx={{ color: '#212121' }}>
              <PersonIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Grid container spacing={3} sx={{ p: 3 }}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, backgroundColor: '#FFFFFF', boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#212121', mb: 2 }}>Filters</Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#212121', mt: 3, mb: 1 }}>Categories</Typography>
            <FormControlLabel
              control={<Checkbox name="vegetables" checked={categoryFilters.vegetables} onChange={handleCategoryChange} sx={{ color: '#4CAF50', '&.Mui-checked': { color: '#4CAF50' } }} />}
              label={<Typography variant="body2" sx={{ color: '#212121' }}>Vegetables</Typography>}
            />
            <FormControlLabel
              control={<Checkbox name="fruits" checked={categoryFilters.fruits} onChange={handleCategoryChange} sx={{ color: '#4CAF50', '&.Mui-checked': { color: '#4CAF50' } }} />}
              label={<Typography variant="body2" sx={{ color: '#212121' }}>Fruits</Typography>}
            />
            <FormControlLabel
              control={<Checkbox name="grains" checked={categoryFilters.grains} onChange={handleCategoryChange} sx={{ color: '#4CAF50', '&.Mui-checked': { color: '#4CAF50' } }} />}
              label={<Typography variant="body2" sx={{ color: '#212121' }}>Grains</Typography>}
            />
            <FormControlLabel
              control={<Checkbox name="dairy" checked={categoryFilters.dairy} onChange={handleCategoryChange} sx={{ color: '#4CAF50', '&.Mui-checked': { color: '#4CAF50' } }} />}
              label={<Typography variant="body2" sx={{ color: '#212121' }}>Dairy</Typography>}
            />

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#212121', mt: 3, mb: 1 }}>Price Range</Typography>
            <RadioGroup value={priceRange} onChange={handlePriceChange}>
              <FormControlLabel
                value="under10"
                control={<Radio size="small" sx={{ color: '#4CAF50', '&.Mui-checked': { color: '#4CAF50' } }} />}
                label={<Typography variant="body2" sx={{ color: '#212121' }}>Under $10</Typography>}
              />
              <FormControlLabel
                value="10to25"
                control={<Radio size="small" sx={{ color: '#4CAF50', '&.Mui-checked': { color: '#4CAF50' } }} />}
                label={<Typography variant="body2" sx={{ color: '#212121' }}>$10 - $25</Typography>}
              />
              <FormControlLabel
                value="25to50"
                control={<Radio size="small" sx={{ color: '#4CAF50', '&.Mui-checked': { color: '#4CAF50' } }} />}
                label={<Typography variant="body2" sx={{ color: '#212121' }}>$25 - $50</Typography>}
              />
              <FormControlLabel
                value="over50"
                control={<Radio size="small" sx={{ color: '#4CAF50', '&.Mui-checked': { color: '#4CAF50' } }} />}
                label={<Typography variant="body2" sx={{ color: '#212121' }}>Over $50</Typography>}
              />
            </RadioGroup>

            <Button
              fullWidth
              variant="contained"
              onClick={handleApplyFilters}
              sx={{
                mt: 3,
                bgcolor: '#212121',
                color: '#FFFFFF',
                '&:hover': { bgcolor: '#4CAF50' }
              }}
            >
              Apply Filters
            </Button>
          </Paper>
        </Grid>

        {/* Products Grid */}
        <Grid item xs={12} md={9}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#212121' }}>Fresh Produce</Typography>
            <FormControl variant="outlined" size="small">
              <InputLabel sx={{ color: '#212121' }}>Sort by</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort by"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E0E0E0' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#4CAF50' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4CAF50' },
                  color: '#212121',
                  minWidth: 120
                }}
              >
                <MenuItem value="Featured">Featured</MenuItem>
                <MenuItem value="Price: Low to High">Price: Low to High</MenuItem>
                <MenuItem value="Price: High to Low">Price: High to Low</MenuItem>
                <MenuItem value="Newest">Newest</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} lg={4}>
                <Paper sx={{ p: 2, backgroundColor: '#FFFFFF', boxShadow: 3, borderRadius: 2 }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: 180,
                      backgroundColor: '#E0E0E0', // Placeholder for image
                      borderRadius: 1,
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#757575'
                    }}
                  >
                    <img src={product.image} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 'inherit' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#212121', mb: 0.5 }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#757575', mb: 1 }}>
                    {product.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                      ${product.price.toFixed(2)}/{product.unit}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      sx={{
                        bgcolor: '#212121',
                        color: '#FFFFFF',
                        '&:hover': { bgcolor: '#4CAF50' }
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ConsumerDashboard; 