// server/src/routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware"); // Categories might also be protected

// Protect category routes
router.use(authMiddleware);

// GET all categories
router.get("/categories", categoryController.getCategories);

module.exports = router;
