// src/App.js
import React, { useEffect } from "react"; // Import useEffect
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import axios from "axios"; // Import axios here

// Authentication Components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// General Home Page
import Home from "./components/Home";

// Farmer Portal Components (all located in src/components/farmer/)
import Dashboard from "./components/farmer/Dashboard";
import AddProductForm from "./components/farmer/AddProductForm";
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

// --- AXIOS INTERCEPTOR CONFIGURATION ---
// This will run once when the module is loaded.
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    // If a token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);
// --- END AXIOS INTERCEPTOR CONFIGURATION ---


// ProtectedRoute Component for authorization based on token and role
const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole"); // Retrieve user's role from localStorage

  if (!token) {
    // If no token, redirect to login page
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // If token exists but user's role doesn't match the required role
    // Redirect to a dashboard based on their actual role, or a generic home/unauthorized page
    if (userRole === "FARMER") {
      return <Navigate to="/farmer/dashboard" />;
    }
    if (userRole === "CONSUMER") {
      return <Navigate to="/consumer/dashboard" />;
    }
    if (userRole === "ADMIN") {
      return <Navigate to="/admin/dashboard" />;
    }
    // Fallback if role is unknown or doesn't match any specific dashboard
    return <Navigate to="/" />;
  }

  // If authenticated and authorized, render the children components
  return children;
};

function App() {
  // useEffect is not strictly needed for the interceptor here, as it's outside the component
  // but it can be used for debugging or other global setup if required.
  // For instance, you could log when the interceptor is set up:
  useEffect(() => {
    console.log('App component mounted. Axios interceptor should be active.');
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />{" "}
      {/* Provides a consistent baseline for CSS across browsers */}
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
            path="/farmer/add-product"
            element={
              <ProtectedRoute requiredRole="FARMER">
                <AddProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/products"
            element={
              <ProtectedRoute requiredRole="FARMER">
                <Products /> {/* This will render the new Products page */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/inventory"
            element={
              <ProtectedRoute requiredRole="FARMER">
                <Inventory /> {/* This will render the new Inventory page */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/orders"
            element={
              <ProtectedRoute requiredRole="FARMER">
                <Orders /> {/* This will render the new Orders page */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/analytics"
            element={
              <ProtectedRoute requiredRole="FARMER">
                <Analytics /> {/* This will render the new Analytics page */}
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