import express from 'express'

const router = express.Router()

import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
} from '../controllers/userController.js'

import {
  protect,
  admin,
} from '../middleware/authMiddleware.js'

// ================= USER ROUTES =================

router
  .route('/')
  .post(registerUser)
  .get(protect, admin, getUsers)

router.post('/login', authUser)

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)

// ================= FORGOT PASSWORD =================

// Send OTP
router.post(
  '/forgot-password/send-otp',
  sendPasswordResetOtp
)

// Verify OTP
router.post(
  '/forgot-password/verify-otp',
  verifyPasswordResetOtp
)

// Reset Password
router.post(
  '/forgot-password/reset-password',
  resetPassword
)

// ================= ADMIN USER ROUTES =================

router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)

export default router