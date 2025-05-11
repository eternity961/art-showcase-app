const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/change-password', authController.changePassword);
router.post('/verify-otp', auth, authController.verifyOtp);
router.post('/resend-otp', auth, authController.resendOtp);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;
