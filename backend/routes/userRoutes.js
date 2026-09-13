import express from 'express'

const router = express.Router()

import {
  authUser,
  registerUser,

  // Verification
  verifyEmail,
  verifyPhone,
  resendEmailOtp,
  resendPhoneOtp,

  // Profile
  getUserProfile,
  updateUserProfile,

  // Profile Email Change
  sendEmailChangeOtp,
  verifyEmailChangeOtp,

  // Profile Phone Change
  sendPhoneChangeOtp,
  verifyPhoneChangeOtp,

  // Addresses
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,

  // Admin
  getUsers,
  deleteUser,
  getUserById,
  updateUser,

  // Forgot Password
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
} from '../controllers/userController.js'

import {
  protect,
  admin,
} from '../middleware/authMiddleware.js'

// ======================================================
// REGISTER & USERS
// ======================================================

// Register
router.post('/', registerUser)

// Get all users - Admin only
router.get('/', protect, admin, getUsers)

// ======================================================
// LOGIN
// ======================================================

router.post('/login', authUser)

// ======================================================
// EMAIL & PHONE VERIFICATION
// ======================================================

// Verify email OTP
router.post('/verify-email', verifyEmail)

// Verify phone OTP
router.post('/verify-phone', verifyPhone)

// Resend email OTP
router.post('/resend-email-otp', resendEmailOtp)

// Resend phone OTP
router.post('/resend-phone-otp', resendPhoneOtp)

// ======================================================
// PROFILE
// ======================================================

// Get profile
router.get(
  '/profile',
  protect,
  getUserProfile
)

// Update profile
router.put(
  '/profile',
  protect,
  updateUserProfile
)

// ======================================================
// PROFILE EMAIL CHANGE
// ======================================================

// Send OTP to new email
router.post(
  '/profile/change-email/send-otp',
  protect,
  sendEmailChangeOtp
)

// Verify new email OTP
router.post(
  '/profile/change-email/verify-otp',
  protect,
  verifyEmailChangeOtp
)

// ======================================================
// PROFILE PHONE CHANGE
// ======================================================

// Send OTP to new mobile number
router.post(
  '/profile/change-phone/send-otp',
  protect,
  sendPhoneChangeOtp
)

// Verify new mobile OTP
router.post(
  '/profile/change-phone/verify-otp',
  protect,
  verifyPhoneChangeOtp
)

// ======================================================
// SAVED ADDRESSES
// ======================================================

// Get all saved addresses
router.get(
  '/profile/addresses',
  protect,
  getAddresses
)

// Add new address
router.post(
  '/profile/addresses',
  protect,
  addAddress
)

// Update saved address
router.put(
  '/profile/addresses/:addressId',
  protect,
  updateAddress
)

// Delete saved address
router.delete(
  '/profile/addresses/:addressId',
  protect,
  deleteAddress
)

// Set default address
router.put(
  '/profile/addresses/:addressId/default',
  protect,
  setDefaultAddress
)

// ======================================================
// FORGOT PASSWORD
// ======================================================

// Send password reset OTP
router.post(
  '/forgot-password/send-otp',
  sendPasswordResetOtp
)

// Verify password reset OTP
router.post(
  '/forgot-password/verify-otp',
  verifyPasswordResetOtp
)

// Reset password
router.post(
  '/forgot-password/reset-password',
  resetPassword
)

// ======================================================
// ADMIN USER MANAGEMENT
// ======================================================

// Delete user
router.delete(
  '/:id',
  protect,
  admin,
  deleteUser
)

// Get user by ID
router.get(
  '/:id',
  protect,
  admin,
  getUserById
)

// Update user
router.put(
  '/:id',
  protect,
  admin,
  updateUser
)

export default router