// server/src/routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/summary", dashboardController.getDashboardSummary);
router.get("/top-selling", dashboardController.getTopSellingProducts);
router.get("/recent-orders", dashboardController.getRecentOrders);

module.exports = router;
