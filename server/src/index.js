// server/src/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Import all route modules
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes"); // Add this line

dotenv.config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files (for product images)
const path = require("path"); // Import path module
app.use(express.static(path.join(__dirname, "public"))); // Serve 'public' directory

// Auth routes
app.use("/api/auth", authRoutes);

// General API routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);

// Farmer Dashboard specific routes
// These are prefixed with /api/farmer/dashboard as per frontend calls
app.use("/api/farmer/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("FarmDirect Backend API is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
