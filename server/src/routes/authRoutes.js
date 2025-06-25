const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
// const authMiddleware = require('../middleware/authMiddleware'); // <-- DO NOT import/use here if you don't need it for login/register itself

// These routes DO NOT require an Authorization header to be present,
// as they are the entry points for authentication.

router.post("/register", authController.register);
router.post("/login", authController.login); // Frontend posts phone/email/password/role here
router.post("/verify-otp", authController.verifyOTP); // Frontend posts userId/otp here

module.exports = router;
