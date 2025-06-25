// src/components/auth/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Link,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [userId, setUserId] = useState(null); // This userId is used for OTP verification
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Helper function to navigate based on role
  const redirectToDashboard = (userRole) => {
    switch (userRole) {
      case "FARMER":
        navigate("/farmer/dashboard");
        break;
      case "CONSUMER":
        navigate("/consumer/dashboard");
        break;
      case "ADMIN":
        navigate("/admin/dashboard");
        break;
      default:
        navigate("/"); // Fallback to home or a generic logged-in page
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (role === "ADMIN") {
        const response = await axios.post("http://localhost:5000/api/login", {
          email,
          password,
          role, // Send role for admin login as well, helps backend differentiate
        });
        // Assuming backend response for admin login includes { token, user: { role } }
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userRole", response.data.user.role); // Store the user's role

        redirectToDashboard(response.data.user.role); // Redirect based on the actual role
      } else {
        // For FARMER/CONSUMER, initiating OTP flow
        const response = await axios.post("http://localhost:5000/api/login", {
          phone,
          role, // Send role with phone to help backend filter users by role for OTP
        });
        setUserId(response.data.userId); // Store userId for subsequent OTP verification
        // Backend should ideally also send back the role here or store it with userId temporarily
        // For now, we'll rely on the `role` state for the OTP verification step's redirect.
        // It's safer if backend confirms the role in OTP verify response.
        setShowOtpInput(true);
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error); // Log full error for debugging
      setError(
        error.response?.data?.message ||
          "An error occurred during login. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/verify-otp",
        {
          userId, // The userId received from the first login step
          otp,
          // It's good practice to also send the role here if the backend needs it for verification context
          role, // The role selected initially by the user
        }
      );

      // Assuming backend response for OTP verification includes { token, user: { role } }
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", response.data.user.role); // Store the user's role

      redirectToDashboard(response.data.user.role); // Redirect based on the actual role
    } catch (error) {
      console.error("OTP verification error:", error.response?.data || error); // Log full error for debugging
      setError(
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#F9FBE7", // Overall background color
        display: "flex",
        flexDirection: "column", // Stack content vertically
        minHeight: "100vh", // Ensure it covers the full viewport height
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
        <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 4, // Padding top/bottom
              maxWidth: { xs: "100%", md: "80%" }, // Responsive width for content
              mx: "auto", // Center content in the grid item
            }}
          >
            <CheckCircle sx={{ fontSize: 80, color: "#4CAF50", mb: 2 }} />
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: "bold", color: "#4CAF50", mb: 1 }}
            >
              FarmDirect
            </Typography>
            <Typography variant="h6" sx={{ color: "#212121" }}>
              Connecting Farmers, Empowering Communities.
            </Typography>
          </Box>
        </Grid>

        {/* Right Section - Login Form Card */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#FFFFFF", // Form card background
              padding: 4,
              borderRadius: 2,
              boxShadow: 3, // Soft shadow (MUI's default shadow is subtle)
              maxWidth: 450, // Limit width of the form card
              mx: "auto", // Center the box horizontally within its grid item
            }}
          >
            <Typography
              component="h1"
              variant="h5"
              sx={{ mb: 3, color: "#4CAF50", fontWeight: "bold" }}
            >
              Welcome Back!
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: "#212121" }}>
              Login or create an account to get started.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                {error}
              </Alert>
            )}

            {!showOtpInput ? (
              <Box
                component="form"
                onSubmit={handleLogin}
                sx={{ width: "100%" }}
              >
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel sx={{ color: "#212121" }}>Role</InputLabel>
                  <Select
                    value={role}
                    label="Role"
                    onChange={(e) => {
                      setRole(e.target.value);
                      setError(""); // Clear error when role changes
                    }}
                    required
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#E0E0E0",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#4CAF50",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#4CAF50",
                      },
                      color: "#212121",
                    }}
                  >
                    <MenuItem value="">Select Role</MenuItem>{" "}
                    {/* Added a placeholder option */}
                    <MenuItem value="FARMER">Farmer</MenuItem>
                    <MenuItem value="CONSUMER">Consumer</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                  </Select>
                </FormControl>

                {role === "ADMIN" ? (
                  <>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      InputLabelProps={{ sx: { color: "#212121" } }}
                      InputProps={{
                        sx: {
                          "& fieldset": { borderColor: "#E0E0E0" },
                          "&:hover fieldset": { borderColor: "#4CAF50" },
                          "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
                          color: "#212121",
                        },
                      }}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      InputLabelProps={{ sx: { color: "#212121" } }}
                      InputProps={{
                        sx: {
                          "& fieldset": { borderColor: "#E0E0E0" },
                          "&:hover fieldset": { borderColor: "#4CAF50" },
                          "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
                          color: "#212121",
                        },
                      }}
                    />
                  </>
                ) : (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    InputLabelProps={{ sx: { color: "#212121" } }}
                    InputProps={{
                      sx: {
                        "& fieldset": { borderColor: "#E0E0E0" },
                        "&:hover fieldset": { borderColor: "#4CAF50" },
                        "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
                        color: "#212121",
                      },
                    }}
                  />
                )}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                    mb: 2,
                  }}
                >
                  <Link href="#" variant="body2" sx={{ color: "#0288D1" }}>
                    Forgot Password?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    bgcolor: "#4CAF50",
                    "&:hover": { bgcolor: "#388E3C" },
                  }}
                  disabled={
                    loading ||
                    !role ||
                    (role === "ADMIN" && (!email || !password)) ||
                    (role !== "ADMIN" && !phone)
                  } // Disable if role not selected or fields missing
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Login"
                  )}
                </Button>

                <Button
                  fullWidth
                  variant="text"
                  onClick={() => navigate("/register")}
                  sx={{ color: "#0288D1" }}
                >
                  Don't have an account? Register
                </Button>
              </Box>
            ) : (
              <Box
                component="form"
                onSubmit={handleOtpVerification}
                sx={{ width: "100%" }}
              >
                <Typography variant="body1" sx={{ mb: 2, color: "#212121" }}>
                  Enter the OTP sent to your phone
                </Typography>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  InputLabelProps={{ sx: { color: "#212121" } }}
                  InputProps={{
                    sx: {
                      "& fieldset": { borderColor: "#E0E0E0" },
                      "&:hover fieldset": { borderColor: "#4CAF50" },
                      "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
                      color: "#212121",
                    },
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    bgcolor: "#4CAF50",
                    "&:hover": { bgcolor: "#388E3C" },
                  }}
                  disabled={loading || !otp}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
                <Button
                  fullWidth
                  variant="text"
                  onClick={() => {
                    setShowOtpInput(false);
                    setOtp(""); // Clear OTP when going back
                    setError(""); // Clear error when going back
                  }}
                  sx={{ color: "#0288D1" }}
                >
                  Back to Login
                </Button>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
      {/* Footer */}
      <Box
        sx={{ p: 2, textAlign: "center", color: "#212121", fontSize: "0.8rem" }}
      >
        <Typography variant="body2" sx={{ color: "#212121" }}>
          © 2025 AgriConnect Inc. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
