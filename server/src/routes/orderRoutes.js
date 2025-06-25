// server/src/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController"); // Path adjusted
const authMiddleware = require("../middleware/authMiddleware"); // Path adjusted

router.use(authMiddleware);

router.get("/orders", orderController.getOrders);
router.patch("/orders/:id/status", orderController.updateOrderStatus);

module.exports = router;
