import asyncHandler from 'express-async-handler'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
  } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.phone = req.body.phone || user.phone

    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    '-password'
  )

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// ======================================================
// FORGOT PASSWORD - SEND OTP
// ======================================================

// @desc    Send password reset OTP
// @route   POST /api/users/forgot-password/send-otp
// @access  Public
const sendPasswordResetOtp = asyncHandler(
  async (req, res) => {
    const { phone } = req.body

    if (!phone) {
      res.status(400)
      throw new Error(
        'Please enter your mobile number'
      )
    }

    const user = await User.findOne({
      phone: phone.toString(),
    })

    if (!user) {
      res.status(404)
      throw new Error(
        'No account found with this mobile number'
      )
    }

    // Generate exactly 6-digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString()

    // Hash OTP before storing
    user.passwordResetOtp = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex')

    // OTP valid for 5 minutes
    user.passwordResetOtpExpires = new Date(
      Date.now() + 5 * 60 * 1000
    )

    await user.save({
      validateBeforeSave: false,
    })

    // Development testing only
    if (process.env.NODE_ENV === 'Development') {
      res.json({
        message:
          'OTP generated successfully. This OTP is for development testing.',
        otp: otp,
      })
    } else {
      res.json({
        message: 'OTP sent successfully',
      })
    }
  }
)

// ======================================================
// FORGOT PASSWORD - VERIFY OTP
// ======================================================

// @desc    Verify password reset OTP
// @route   POST /api/users/forgot-password/verify-otp
// @access  Public
const verifyPasswordResetOtp = asyncHandler(
  async (req, res) => {
    const { phone, otp } = req.body

    if (!phone || otp === undefined || otp === null) {
      res.status(400)
      throw new Error(
        'Mobile number and OTP are required'
      )
    }

    const otpString = otp.toString()

    const user = await User.findOne({
      phone: phone.toString(),
    })

    if (!user) {
      res.status(404)
      throw new Error(
        'No account found with this mobile number'
      )
    }

    if (
      !user.passwordResetOtp ||
      !user.passwordResetOtpExpires
    ) {
      res.status(400)
      throw new Error(
        'OTP not found. Please request a new OTP'
      )
    }

    if (
      user.passwordResetOtpExpires.getTime() <
      Date.now()
    ) {
      user.passwordResetOtp = null
      user.passwordResetOtpExpires = null

      await user.save({
        validateBeforeSave: false,
      })

      res.status(400)
      throw new Error(
        'OTP has expired. Please request a new OTP'
      )
    }

    const hashedOtp = crypto
      .createHash('sha256')
      .update(otpString)
      .digest('hex')

    if (hashedOtp !== user.passwordResetOtp) {
      res.status(400)
      throw new Error('Invalid OTP')
    }

    // Generate password reset token
    const resetToken = crypto
      .randomBytes(32)
      .toString('hex')

    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    // Reset token valid for 10 minutes
    user.passwordResetTokenExpires = new Date(
      Date.now() + 10 * 60 * 1000
    )

    // OTP can no longer be reused
    user.passwordResetOtp = null
    user.passwordResetOtpExpires = null

    await user.save({
      validateBeforeSave: false,
    })

    res.json({
      message: 'OTP verified successfully',
      resetToken,
    })
  }
)

// ======================================================
// FORGOT PASSWORD - RESET PASSWORD
// ======================================================

// @desc    Reset password
// @route   POST /api/users/forgot-password/reset-password
// @access  Public
const resetPassword = asyncHandler(
  async (req, res) => {
    const {
      phone,
      resetToken,
      password,
    } = req.body

    if (!phone || !resetToken || !password) {
      res.status(400)
      throw new Error(
        'Mobile number, reset token and password are required'
      )
    }

    if (password.length < 6) {
      res.status(400)
      throw new Error(
        'Password must be at least 6 characters'
      )
    }

    // Hash reset token
    const hashedResetToken = crypto
      .createHash('sha256')
      .update(resetToken.toString())
      .digest('hex')

    // Find user
    const user = await User.findOne({
      phone: phone.toString(),
      passwordResetToken: hashedResetToken,
      passwordResetTokenExpires: {
        $gt: new Date(),
      },
    })

    if (!user) {
      res.status(400)
      throw new Error(
        'Invalid or expired reset token'
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    )

    // Update password in database
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetTokenExpires: null,
        },
      }
    )

    res.json({
      message:
        'Password reset successfully. You can now login.',
    })
  }
)

// ======================================================
// EXPORTS
// ======================================================

export {
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
}