import { Router } from 'express';
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.middleware.js';


const authRoutes = Router();

authRoutes.post('/register',register);
authRoutes.post('/login',login);
authRoutes.post('/logout',logout);
authRoutes.post('/send-verify-otp',authMiddleware, sendVerifyOtp);
authRoutes.post('/verify-account',authMiddleware,verifyEmail);
authRoutes.get('/is-auth',authMiddleware,isAuthenticated);
authRoutes.post('/send-reset-otp',sendResetOtp);
authRoutes.post('/reset-password',resetPassword);

export default authRoutes;