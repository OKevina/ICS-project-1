// src/App.js
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import axios from "axios";

// Authentication Components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// General Home Page
import Home from "./components/Home";

// Farmer Portal Components
import Dashboard from "./components/farmer/Dashboard";
import AddProductForm from "./components/farmer/AddProductForm";
import EditProductForm from "./components/farmer/EditProductForm"; // Import the new EditProductForm
import Products from "./components/farmer/Products";
import Inventory from "./components/farmer/Inventory";
import Orders from "./components/farmer/Orders";
import Analytics from "./components/farmer/Analytics";

// Consumer Portal Components
import ConsumerDashboard from "./components/consumer/Dashboard";

// Admin Portal Components
import AdminDashboard from "./components/admin/Dashboard";

// Define your Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#4CAF50", // Green
    },
    secondary: {
      main: "#FFEB3B", // Yellow
    },
    error: {
      main: "#E53935", // Red
    },
    background: {
      default: "#FAFAFA", // Light Grey
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif", // Use Inter font
  },
});

// AXIOS INTERCEPTOR CONFIGURATION
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ProtectedRoute Component for authorization based on token and role
const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    if (userRole === "FARMER") {
      return <Navigate to="/farmer/dashboard" />;
    }
    if (userRole === "CONSUMER") {
      return <Navigate to="/consumer/dashboard" />;
    }
    if (userRole === "ADMIN") {
      return <Navigate to="/admin/dashboard" />;
    }
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  // useEffect for global setup or debugging, if needed.
  useEffect(() => {
    console.log("App component mounted. Axios interceptor should be active.");
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Redirect for generic /dashboard to prevent direct access without role */}
          <Route path="/dashboard" element={<Navigate to="/login" replace />} />

          {/* Farmer Portal Protected Routes */}
          <Route
            path="/farmer/dashboard"
            element={
              <ProtectedRoute requiredRole="FARMER">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/products/add" // Route for adding a new product
            element={
              <ProtectedRoute requiredRole="FARMER">
                <AddProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/products/edit/:productId" // Route for editing an existing product
            element={
              <ProtectedRoute requiredRole="FARMER">
                <EditProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/products"
            element={
              <ProtectedRoute requiredRole="FARMER">
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/inventory"
            element={
              <ProtectedRoute requiredRole="FARMER">
                <Inventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/orders"
            element={
              <ProtectedRoute requiredRole="FARMER">
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/analytics"
            element={
              <ProtectedRoute requiredRole="FARMER">
                <Analytics />
              </ProtectedRoute>
            }
          />

          {/* Consumer Portal Protected Routes */}
          <Route
            path="/consumer/dashboard"
            element={
              <ProtectedRoute requiredRole="CONSUMER">
                <ConsumerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Portal Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route for any unhandled paths (404 Not Found) */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
