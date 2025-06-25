// src/components/farmer/AddProductForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  CircularProgress,
  IconButton,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import FarmerLayout from "../../layouts/FarmerLayout";

const AddProductForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        setError(""); // Clear previous errors
        const token = localStorage.getItem("token"); // Fetch the token from local storage

        const response = await axios.get(
          "http://localhost:5000/api/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the Authorization header
            },
          }
        );
        setCategories(response.data);
        if (response.data.length > 0) {
          setSelectedCategory(response.data[0].id); // Select first category by default
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories. Please try again."); // Use the general error state for categories
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!name || !description || !price || !stock || !selectedCategory) {
      setError(
        "Please fill in all required fields (Name, Description, Price, Stock, Category)."
      );
      setLoading(false);
      return;
    }
    if (isNaN(price) || parseFloat(price) <= 0) {
      setError("Price must be a positive number.");
      setLoading(false);
      return;
    }
    if (isNaN(stock) || parseInt(stock) < 0) {
      setError("Stock must be a non-negative integer.");
      setLoading(false);
      return;
    }

    const productData = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      imageUrl,
      categoryId: selectedCategory,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/products", productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess("Product added successfully!");
      // Clear form
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setImageUrl("");
      setSelectedCategory(categories.length > 0 ? categories[0].id : "");
      setTimeout(() => navigate("/farmer/dashboard"), 2000);
    } catch (err) {
      console.error(
        "Error adding product:",
        err.response ? err.response.data : err
      );
      setError(
        err.response?.data?.message ||
          "Failed to add product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FarmerLayout
      title="Add New Product"
      subtitle="Register a new product for sale"
      showAddProduct={false}
    >
      <Paper
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 600,
          backgroundColor: "#FFFFFF",
          boxShadow: 3,
          borderRadius: 2,
          mx: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#212121" }}
          >
            Product Details
          </Typography>
          <IconButton
            onClick={() => navigate("/farmer/dashboard")}
            sx={{ color: "#212121" }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price ($)"
                variant="outlined"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                inputProps={{ step: "0.01" }}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock Quantity"
                variant="outlined"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL (Optional)"
                variant="outlined"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Category"
                variant="outlined"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
                sx={{ mb: 2 }}
                disabled={categoriesLoading || categories.length === 0}
              >
                {categoriesLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} /> Loading
                    Categories...
                  </MenuItem>
                ) : categories.length === 0 ? (
                  <MenuItem disabled>No Categories Available</MenuItem>
                ) : (
                  categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<AddIcon />}
                fullWidth
                sx={{
                  bgcolor: "#4CAF50",
                  "&:hover": { bgcolor: "#388E3C" },
                  py: 1.5,
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Add Product"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </FarmerLayout>
  );
};

export default AddProductForm;
