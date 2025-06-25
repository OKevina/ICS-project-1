// src/components/farmer/Dashboard.js
import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  IconButton,
  Avatar,
  List, // Added for Top Selling Products
  ListItem, // Added for Top Selling Products
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  SwapHoriz as DispatchIcon,
  MailOutline as MailIcon,
  Analytics as AnalyticsIcon,
  WarningAmber as WarningAmberIcon,
} from "@mui/icons-material";
import FarmerLayout from "../../layouts/FarmerLayout"; // CORRECTED PATH

const Dashboard = () => {
  // Dummy Data (replace with actual data from your backend)
  const totalProducts = 24;
  const pendingOrders = 8;
  const monthlySales = 2340;
  const lowStockItems = 3;

  const productListings = [
    {
      id: 1,
      name: "Organic Tomatoes",
      price: 4.5,
      unit: "lb",
      inStock: 45,
      image: "https://via.placeholder.com/50",
    },
    {
      id: 2,
      name: "Fresh Carrots",
      price: 3.2,
      unit: "lb",
      inStock: 8,
      image: "https://via.placeholder.com/50",
    },
  ];

  const incomingOrders = [
    {
      id: 101,
      customerName: "Sarah Johnson",
      orderNumber: "#1234",
      quantity: 5,
      product: "Organic Tomatoes",
      amount: 22.5,
      date: "Jan 11, 2025",
      status: "Pending",
      avatar: "https://via.placeholder.com/40",
    },
    {
      id: 102,
      customerName: "Mike Chen",
      orderNumber: "#1235",
      quantity: 3,
      product: "Fresh Carrots",
      amount: 9.6,
      date: "Jan 14, 2025",
      status: "Prepared",
      avatar: "https://via.placeholder.com/40",
    },
  ];

  const topSellingProducts = [
    { name: "Organic Tomatoes", sales: 450 },
    { name: "Fresh Carrots", sales: 320 },
    { name: "Lettuce", sales: 280 },
  ];

  return (
    <FarmerLayout
      title="Dashboard"
      subtitle="Manage your farm products and orders"
    >
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              backgroundColor: "#FFFFFF",
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ color: "#212121" }}>
                Total Products
              </Typography>
              <IconButton size="small">
                <EditIcon sx={{ color: "#212121" }} />
              </IconButton>
            </Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#4CAF50" }}
            >
              {totalProducts}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              backgroundColor: "#FFFFFF",
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ color: "#212121" }}>
                Pending Orders
              </Typography>
              <IconButton size="small">
                <EditIcon sx={{ color: "#212121" }} />
              </IconButton>
            </Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#E53935" }}
            >
              {pendingOrders}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              backgroundColor: "#FFFFFF",
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ color: "#212121" }}>
                Monthly Sales
              </Typography>
              <IconButton size="small">
                <AnalyticsIcon sx={{ color: "#212121" }} />
              </IconButton>
            </Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#4CAF50" }}
            >
              ${monthlySales}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              backgroundColor: "#FFFFFF",
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ color: "#212121" }}>
                Low Stock Items
              </Typography>
              <IconButton size="small">
                <WarningAmberIcon sx={{ color: "#E53935" }} />
              </IconButton>
            </Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#E53935" }}
            >
              {lowStockItems}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Product Listings & Incoming Orders */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              backgroundColor: "#FFFFFF",
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#212121", mb: 2 }}
            >
              Product Listings
            </Typography>
            <Box>
              {productListings.map((product) => (
                <Box
                  key={product.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    p: 2,
                    border: "1px solid #E0E0E0",
                    borderRadius: 1,
                  }}
                >
                  <Avatar
                    src={product.image}
                    variant="rounded"
                    sx={{ width: 60, height: 60, mr: 2 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", color: "#212121" }}
                    >
                      {product.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#212121" }}>
                      ${product.price}/{product.unit}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: product.inStock < 10 ? "#E53935" : "#212121",
                      }}
                    >
                      In Stock: {product.inStock} {product.unit}s
                    </Typography>
                  </Box>
                  <IconButton size="small" sx={{ mr: 1 }}>
                    <EditIcon sx={{ color: "#0288D1" }} />
                  </IconButton>
                  <IconButton size="small">
                    <DeleteIcon sx={{ color: "#E53935" }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              backgroundColor: "#FFFFFF",
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#212121", mb: 2 }}
            >
              Incoming Orders
            </Typography>
            <Box>
              {incomingOrders.map((order) => (
                <Box
                  key={order.id}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    mb: 2,
                    p: 2,
                    border: "1px solid #E0E0E0",
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={order.avatar}
                        sx={{ width: 40, height: 40, mr: 1 }}
                      />
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold", color: "#212121" }}
                      >
                        {order.customerName}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          order.status === "Pending" ? "#E53935" : "#43A047",
                      }}
                    >
                      {order.status}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#212121", mb: 0.5 }}
                  >
                    {order.quantity} {order.product} - $
                    {order.amount.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#212121", fontSize: "0.8rem" }}
                  >
                    Ordered on {order.date}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {order.status === "Pending" ? (
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          bgcolor: "#4CAF50",
                          "&:hover": { bgcolor: "#388E3C" },
                          mr: 1,
                        }}
                      >
                        Mark Prepared
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<DispatchIcon />}
                        sx={{
                          bgcolor: "#0288D1",
                          "&:hover": { bgcolor: "#0277BD" },
                          mr: 1,
                        }}
                      >
                        Dispatch
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<MailIcon />}
                      sx={{
                        color: "#0288D1",
                        borderColor: "#0288D1",
                        "&:hover": {
                          borderColor: "#0277BD",
                          color: "#0277BD",
                        },
                      }}
                    >
                      Contact Buyer
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Sales Analytics */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              backgroundColor: "#FFFFFF",
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#212121", mb: 2 }}
            >
              Sales Analytics
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#212121", mb: 2 }}>
              Monthly Sales Trend
            </Typography>
            <Box
              sx={{
                height: 250,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#F5F5F5",
                borderRadius: 1,
              }}
            >
              <Typography variant="body1" sx={{ color: "#212121" }}>
                Sales Chart Visualization
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              backgroundColor: "#FFFFFF",
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#212121", mb: 2 }}
            >
              Top Selling Products
            </Typography>
            <List>
              {topSellingProducts.map((product, index) => (
                <ListItem
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 0.5,
                  }}
                >
                  <Typography variant="body1" sx={{ color: "#212121" }}>
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", color: "#212121" }}
                  >
                    ${product.sales}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </FarmerLayout>
  );
};

export default Dashboard;
