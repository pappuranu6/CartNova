import asyncHandler from 'express-async-handler'
import crypto from 'crypto'
import generateToken from '../utils/generateToken.js'
import sendEmail from '../utils/sendEmail.js'
import User from '../models/userModel.js'

// ======================================================
// CONSTANTS
// ======================================================

const OTP_EXPIRY = 5 * 60 * 1000
const RESET_TOKEN_EXPIRY = 10 * 60 * 1000
const MAX_OTP_ATTEMPTS = 5
const OTP_RESEND_COOLDOWN = 60 * 1000

// ======================================================
// HELPERS
// ======================================================

const generateOtp = () => {
  return crypto.randomInt(100000, 1000000).toString()
}

const hashValue = (value) => {
  return crypto
    .createHash('sha256')
    .update(value.toString())
    .digest('hex')
}

const isOtpExpired = (expiresAt) => {
  return !expiresAt || expiresAt.getTime() < Date.now()
}

const isCooldownActive = (lastSentAt) => {
  if (!lastSentAt) return false

  return (
    Date.now() - lastSentAt.getTime() <
    OTP_RESEND_COOLDOWN
  )
}

// ======================================================
// LOGIN
// ======================================================

// POST /api/users/login
// Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error('Email and password are required')
  }

  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  })

  if (!user || !(await user.matchPassword(password))) {
    res.status(401)
    throw new Error('Invalid email or password')
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    isAdmin: user.isAdmin,
    isEmailVerified: user.isEmailVerified,
    isPhoneVerified: user.isPhoneVerified,
    token: generateToken(user._id),
  })
})

// ======================================================
// REGISTER USER
// ======================================================

// POST /api/users
// Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body

  if (!name || !email || !password || !phone) {
    res.status(400)
    throw new Error(
      'Name, email, password and mobile number are required'
    )
  }

  if (password.length < 6) {
    res.status(400)
    throw new Error(
      'Password must be at least 6 characters'
    )
  }

  const cleanEmail = email.toLowerCase().trim()
  const cleanPhone = phone.toString().trim()

  const emailExists = await User.findOne({
    email: cleanEmail,
  })

  if (emailExists) {
    res.status(400)
    throw new Error('Email already registered')
  }

  const phoneExists = await User.findOne({
    phone: cleanPhone,
  })

  if (phoneExists) {
    res.status(400)
    throw new Error('Mobile number already registered')
  }

  const emailOtp = generateOtp()

  const user = await User.create({
    name: name.trim(),
    email: cleanEmail,
    password,
    phone: cleanPhone,

    isEmailVerified: false,
    isPhoneVerified: true,

    emailVerificationOtp: hashValue(emailOtp),
    emailVerificationOtpExpires: new Date(
      Date.now() + OTP_EXPIRY
    ),
    emailVerificationOtpAttempts: 0,
    emailOtpLastSentAt: new Date(),


    passwordResetOtpAttempts: 0,
  })

  // ----------------------------------------------------
  // SEND EMAIL VERIFICATION OTP
  // ----------------------------------------------------

  try {
    await sendEmail({
      to: cleanEmail,
      subject: 'CartNova Email Verification OTP',
      text: `Your CartNova verification OTP is ${emailOtp}. This OTP is valid for 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>CartNova Email Verification</h2>

          <p>Your verification OTP is:</p>

          <h1 style="letter-spacing: 5px;">
            ${emailOtp}
          </h1>

          <p>This OTP is valid for 5 minutes.</p>

          <p>
            If you did not create this account,
            please ignore this email.
          </p>
        </div>
      `,
    })
  } catch (error) {
    await User.findByIdAndDelete(user._id)

    console.error('Email sending error:', error)

    res.status(500)
    throw new Error(
      'Unable to send verification email. Please try again.'
    )
  }

  res.status(201).json({
    message:
      'Registration successful. Please verify your email.',
    userId: user._id,
    email: cleanEmail,
    phone: cleanPhone,
  })
})

// ======================================================
// VERIFY EMAIL OTP
// ======================================================

// POST /api/users/verify-email
// Public
const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body

  if (!email || !otp) {
    res.status(400)
    throw new Error('Email and OTP are required')
  }

  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  })

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  if (user.isEmailVerified) {
    return res.json({
      message: 'Email is already verified',
      isEmailVerified: true,
      isPhoneVerified: user.isPhoneVerified,
    })
  }

  if (
    !user.emailVerificationOtp ||
    !user.emailVerificationOtpExpires
  ) {
    res.status(400)
    throw new Error(
      'Email OTP not found. Please request a new OTP.'
    )
  }

  if (
    user.emailVerificationOtpExpires.getTime() <
    Date.now()
  ) {
    user.emailVerificationOtp = null
    user.emailVerificationOtpExpires = null
    user.emailVerificationOtpAttempts = 0

    await user.save({
      validateBeforeSave: false,
    })

    res.status(400)
    throw new Error(
      'Email OTP has expired. Please request a new OTP.'
    )
  }

  const hashedOtp = hashValue(otp)

  if (hashedOtp !== user.emailVerificationOtp) {
    user.emailVerificationOtpAttempts =
      (user.emailVerificationOtpAttempts || 0) + 1

    if (
      user.emailVerificationOtpAttempts >=
      MAX_OTP_ATTEMPTS
    ) {
      user.emailVerificationOtp = null
      user.emailVerificationOtpExpires = null
      user.emailVerificationOtpAttempts = 0

      await user.save({
        validateBeforeSave: false,
      })

      res.status(400)
      throw new Error(
        'Too many incorrect attempts. Please request a new email OTP.'
      )
    }

    await user.save({
      validateBeforeSave: false,
    })

    res.status(400)
    throw new Error(
      `Invalid email OTP. ${
        MAX_OTP_ATTEMPTS -
        user.emailVerificationOtpAttempts
      } attempts remaining.`
    )
  }

  user.isEmailVerified = true
  user.emailVerificationOtp = null
  user.emailVerificationOtpExpires = null
  user.emailVerificationOtpAttempts = 0

  await user.save({
    validateBeforeSave: false,
  })

  res.json({
    message: 'Email verified successfully',
    isEmailVerified: true,
    isPhoneVerified: user.isPhoneVerified,
  })
})

// ======================================================
// VERIFY PHONE OTP
// ======================================================

// POST /api/users/verify-phone
// Public
const verifyPhone = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body

  if (!phone || !otp) {
    res.status(400)
    throw new Error(
      'Mobile number and OTP are required'
    )
  }

  const user = await User.findOne({
    phone: phone.toString().trim(),
  })

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  if (user.isPhoneVerified) {
    return res.json({
      message: 'Mobile number is already verified',
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: true,
    })
  }

  if (
    !user.phoneVerificationOtp ||
    !user.phoneVerificationOtpExpires
  ) {
    res.status(400)
    throw new Error(
      'Phone OTP not found. Please request a new OTP.'
    )
  }

  if (
    user.phoneVerificationOtpExpires.getTime() <
    Date.now()
  ) {
    user.phoneVerificationOtp = null
    user.phoneVerificationOtpExpires = null
    user.phoneVerificationOtpAttempts = 0

    await user.save({
      validateBeforeSave: false,
    })

    res.status(400)
    throw new Error(
      'Phone OTP has expired. Please request a new OTP.'
    )
  }

  const hashedOtp = hashValue(otp)

  if (hashedOtp !== user.phoneVerificationOtp) {
    user.phoneVerificationOtpAttempts =
      (user.phoneVerificationOtpAttempts || 0) + 1

    if (
      user.phoneVerificationOtpAttempts >=
      MAX_OTP_ATTEMPTS
    ) {
      user.phoneVerificationOtp = null
      user.phoneVerificationOtpExpires = null
      user.phoneVerificationOtpAttempts = 0

      await user.save({
        validateBeforeSave: false,
      })

      res.status(400)
      throw new Error(
        'Too many incorrect attempts. Please request a new phone OTP.'
      )
    }

    await user.save({
      validateBeforeSave: false,
    })

    res.status(400)
    throw new Error(
      `Invalid phone OTP. ${
        MAX_OTP_ATTEMPTS -
        user.phoneVerificationOtpAttempts
      } attempts remaining.`
    )
  }

  user.isPhoneVerified = true
  user.phoneVerificationOtp = null
  user.phoneVerificationOtpExpires = null
  user.phoneVerificationOtpAttempts = 0

  await user.save({
    validateBeforeSave: false,
  })

  res.json({
    message: 'Mobile number verified successfully',
    isEmailVerified: user.isEmailVerified,
    isPhoneVerified: true,
  })
})

// ======================================================
// RESEND EMAIL OTP
// ======================================================

// POST /api/users/resend-email-otp
// Public
const resendEmailOtp = asyncHandler(async (req, res) => {
  const { email } = req.body

  if (!email) {
    res.status(400)
    throw new Error('Email is required')
  }

  const cleanEmail = email.toLowerCase().trim()

  const user = await User.findOne({
    email: cleanEmail,
  })

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  if (user.isEmailVerified) {
    res.status(400)
    throw new Error('Email is already verified')
  }

  if (isCooldownActive(user.emailOtpLastSentAt)) {
    res.status(429)
    throw new Error(
      'Please wait before requesting another email OTP.'
    )
  }

  const otp = generateOtp()

  user.emailVerificationOtp = hashValue(otp)
  user.emailVerificationOtpExpires = new Date(
    Date.now() + OTP_EXPIRY
  )
  user.emailVerificationOtpAttempts = 0
  user.emailOtpLastSentAt = new Date()

  await user.save({
    validateBeforeSave: false,
  })

  try {
    await sendEmail({
      to: cleanEmail,
      subject: 'CartNova Email Verification OTP',
      text: `Your new CartNova verification OTP is ${otp}. It is valid for 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>CartNova Email Verification</h2>

          <p>Your new verification OTP is:</p>

          <h1 style="letter-spacing: 5px;">
            ${otp}
          </h1>

          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `,
    })
  } catch (error) {
    console.error('Email sending error:', error)

    res.status(500)
    throw new Error(
      'Unable to send verification email. Please try again.'
    )
  }

  res.json({
    message: 'Verification OTP sent successfully',
  })
})

// ======================================================
// RESEND PHONE OTP
// ======================================================

// POST /api/users/resend-phone-otp
// Public
const resendPhoneOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body

  if (!phone) {
    res.status(400)
    throw new Error('Mobile number is required')
  }

  const cleanPhone = phone.toString().trim()

  const user = await User.findOne({
    phone: cleanPhone,
  })

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  if (user.isPhoneVerified) {
    res.status(400)
    throw new Error(
      'Mobile number is already verified'
    )
  }

  if (isCooldownActive(user.phoneOtpLastSentAt)) {
    res.status(429)
    throw new Error(
      'Please wait before requesting another phone OTP.'
    )
  }

  const otp = generateOtp()

  user.phoneVerificationOtp = hashValue(otp)
  user.phoneVerificationOtpExpires = new Date(
    Date.now() + OTP_EXPIRY
  )
  user.phoneVerificationOtpAttempts = 0
  user.phoneOtpLastSentAt = new Date()

  await user.save({
    validateBeforeSave: false,
  })

  res.json({
    message:
      'Phone verification OTP generated successfully',

    ...(process.env.NODE_ENV === 'development' && {
      otp,
    }),
  })
})

// ======================================================
// GET USER PROFILE
// ======================================================

// POST/GET /api/users/profile
// Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    profileImage: user.profileImage || '',
    isAdmin: user.isAdmin,
    isEmailVerified: user.isEmailVerified,
    isPhoneVerified: user.isPhoneVerified,
    addresses: user.addresses || [],
  })
})

// ======================================================
// UPDATE USER PROFILE
// ======================================================

// PUT /api/users/profile
// Private
//
// IMPORTANT:
// Email/mobile are NOT changed directly here.
// They must first be verified through their dedicated
// request + OTP verification endpoints.
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  const newName =
    req.body.name !== undefined
      ? req.body.name.trim()
      : user.name

  const newEmail =
    req.body.email !== undefined
      ? req.body.email.toLowerCase().trim()
      : user.email

  const newPhone =
    req.body.phone !== undefined
      ? req.body.phone.toString().trim()
      : user.phone
      const newProfileImage =
    req.body.profileImage !== undefined
      ? req.body.profileImage
      : user.profileImage


     // ----------------------------------------------------
// PROFILE IMAGE
// ----------------------------------------------------

if (newProfileImage !== undefined) {
  user.profileImage = newProfileImage
} 

  // ----------------------------------------------------
  // NAME
  // ----------------------------------------------------

  if (!newName) {
    res.status(400)
    throw new Error('Name is required')
  }

  user.name = newName

  // ----------------------------------------------------
  // EMAIL
  // ----------------------------------------------------

  if (newEmail !== user.email) {
    res.status(400)
    throw new Error(
      'Email change requires OTP verification. Please request an email change OTP first.'
    )
  }

  // ----------------------------------------------------
  // PHONE
  // ----------------------------------------------------

  if (newPhone !== user.phone) {
    res.status(400)
    throw new Error(
      'Mobile number change requires OTP verification. Please request a mobile change OTP first.'
    )
  }

  // ----------------------------------------------------
  // PASSWORD
  // ----------------------------------------------------

  if (req.body.password) {
    if (req.body.password.length < 6) {
      res.status(400)
      throw new Error(
        'Password must be at least 6 characters'
      )
    }

    user.password = req.body.password
  }

  const updatedUser = await user.save()

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    profileImage: updatedUser.profileImage || '',
    isAdmin: updatedUser.isAdmin,
    isEmailVerified: updatedUser.isEmailVerified,
    isPhoneVerified: updatedUser.isPhoneVerified,
    addresses: updatedUser.addresses || [],
    token: generateToken(updatedUser._id),
  })
})

// ======================================================
// REQUEST EMAIL CHANGE OTP
// ======================================================

// POST /api/users/profile/change-email/send-otp
// Private
const sendEmailChangeOtp = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  const newEmail = req.body.email?.toLowerCase().trim()

  if (!newEmail) {
    res.status(400)
    throw new Error('New email is required')
  }

  if (newEmail === user.email) {
    res.status(400)
    throw new Error('This is already your current email')
  }

  const emailExists = await User.findOne({
    email: newEmail,
    _id: { $ne: user._id },
  })

  if (emailExists) {
    res.status(400)
    throw new Error('Email already in use')
  }

  if (isCooldownActive(user.pendingEmailOtpLastSentAt)) {
    res.status(429)
    throw new Error(
      'Please wait before requesting another email OTP.'
    )
  }

  const otp = generateOtp()

  user.pendingEmail = newEmail
  user.pendingEmailOtp = hashValue(otp)
  user.pendingEmailOtpExpires = new Date(
    Date.now() + OTP_EXPIRY
  )
  user.pendingEmailOtpAttempts = 0
  user.pendingEmailOtpLastSentAt = new Date()

  await user.save({
    validateBeforeSave: false,
  })

  try {
    await sendEmail({
      to: newEmail,
      subject: 'CartNova Email Change Verification OTP',
      text: `Your CartNova email change verification OTP is ${otp}. This OTP is valid for 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>CartNova Email Change</h2>

          <p>Your verification OTP is:</p>

          <h1 style="letter-spacing: 5px;">
            ${otp}
          </h1>

          <p>This OTP is valid for 5 minutes.</p>

          <p>
            If you did not request this email change,
            please secure your account.
          </p>
        </div>
      `,
    })
  } catch (error) {
    console.error(
      'Email change OTP sending error:',
      error
    )

    user.pendingEmail = null
    user.pendingEmailOtp = null
    user.pendingEmailOtpExpires = null
    user.pendingEmailOtpAttempts = 0
    user.pendingEmailOtpLastSentAt = null

    await user.save({
      validateBeforeSave: false,
    })

    res.status(500)
    throw new Error(
      'Unable to send email verification OTP. Please try again.'
    )
  }

  res.json({
    message:
      'Email verification OTP sent successfully',
    pendingEmail: newEmail,
  })
})

// ======================================================
// VERIFY EMAIL CHANGE OTP
// ======================================================

// POST /api/users/profile/change-email/verify-otp
// Private
const verifyEmailChangeOtp = asyncHandler(
  async (req, res) => {
    const { otp } = req.body

    if (!otp) {
      res.status(400)
      throw new Error('OTP is required')
    }

    const user = await User.findById(req.user._id)

    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }

    if (
      !user.pendingEmail ||
      !user.pendingEmailOtp ||
      !user.pendingEmailOtpExpires
    ) {
      res.status(400)
      throw new Error(
        'Email change request not found. Please request a new OTP.'
      )
    }

    if (isOtpExpired(user.pendingEmailOtpExpires)) {
      user.pendingEmail = null
      user.pendingEmailOtp = null
      user.pendingEmailOtpExpires = null
      user.pendingEmailOtpAttempts = 0
      user.pendingEmailOtpLastSentAt = null

      await user.save({
        validateBeforeSave: false,
      })

      res.status(400)
      throw new Error(
        'Email change OTP has expired. Please request a new OTP.'
      )
    }

    const hashedOtp = hashValue(otp)

    if (hashedOtp !== user.pendingEmailOtp) {
      user.pendingEmailOtpAttempts =
        (user.pendingEmailOtpAttempts || 0) + 1

      if (
        user.pendingEmailOtpAttempts >=
        MAX_OTP_ATTEMPTS
      ) {
        user.pendingEmail = null
        user.pendingEmailOtp = null
        user.pendingEmailOtpExpires = null
        user.pendingEmailOtpAttempts = 0
        user.pendingEmailOtpLastSentAt = null

        await user.save({
          validateBeforeSave: false,
        })

        res.status(400)
        throw new Error(
          'Too many incorrect attempts. Please request a new email OTP.'
        )
      }

      await user.save({
        validateBeforeSave: false,
      })

      res.status(400)
      throw new Error(
        `Invalid email OTP. ${
          MAX_OTP_ATTEMPTS -
          user.pendingEmailOtpAttempts
        } attempts remaining.`
      )
    }

    // Check again that nobody registered this email
    // while the OTP was pending.
    const emailExists = await User.findOne({
      email: user.pendingEmail,
      _id: { $ne: user._id },
    })

    if (emailExists) {
      user.pendingEmail = null
      user.pendingEmailOtp = null
      user.pendingEmailOtpExpires = null
      user.pendingEmailOtpAttempts = 0
      user.pendingEmailOtpLastSentAt = null

      await user.save({
        validateBeforeSave: false,
      })

      res.status(400)
      throw new Error(
        'This email is no longer available. Please choose another email.'
      )
    }

    user.email = user.pendingEmail
    user.isEmailVerified = true

    user.pendingEmail = null
    user.pendingEmailOtp = null
    user.pendingEmailOtpExpires = null
    user.pendingEmailOtpAttempts = 0
    user.pendingEmailOtpLastSentAt = null

    await user.save()

    res.json({
      message:
        'Email changed and verified successfully',
      email: user.email,
      isEmailVerified: user.isEmailVerified,
    })
  }
)

// ======================================================
// REQUEST PHONE CHANGE OTP
// ======================================================

// POST /api/users/profile/change-phone/send-otp
// Private
const sendPhoneChangeOtp = asyncHandler(
  async (req, res) => {
    const user = await User.findById(req.user._id)

    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }

    const newPhone =
      req.body.phone?.toString().trim()

    if (!newPhone) {
      res.status(400)
      throw new Error('New mobile number is required')
    }

    if (newPhone === user.phone) {
      res.status(400)
      throw new Error(
        'This is already your current mobile number'
      )
    }

    const phoneExists = await User.findOne({
      phone: newPhone,
      _id: { $ne: user._id },
    })

    if (phoneExists) {
      res.status(400)
      throw new Error(
        'Mobile number already in use'
      )
    }

    if (isCooldownActive(user.pendingPhoneOtpLastSentAt)) {
      res.status(429)
      throw new Error(
        'Please wait before requesting another mobile OTP.'
      )
    }

    const otp = generateOtp()

    user.pendingPhone = newPhone
    user.pendingPhoneOtp = hashValue(otp)
    user.pendingPhoneOtpExpires = new Date(
      Date.now() + OTP_EXPIRY
    )
    user.pendingPhoneOtpAttempts = 0
    user.pendingPhoneOtpLastSentAt = new Date()

    await user.save({
      validateBeforeSave: false,
    })

    // --------------------------------------------------
    // SMS PROVIDER
    // --------------------------------------------------
    // Actual SMS provider is not configured here.
    // Development mode returns the OTP for testing.
    // Production SMS integration can be added later.

    res.json({
      message:
        'Mobile verification OTP generated successfully',
      pendingPhone: newPhone,

      ...(process.env.NODE_ENV === 'development' && {
        otp,
      }),
    })
  }
)

// ======================================================
// VERIFY PHONE CHANGE OTP
// ======================================================

// POST /api/users/profile/change-phone/verify-otp
// Private
const verifyPhoneChangeOtp = asyncHandler(
  async (req, res) => {
    const { otp } = req.body

    if (!otp) {
      res.status(400)
      throw new Error('OTP is required')
    }

    const user = await User.findById(req.user._id)

    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }

    if (
      !user.pendingPhone ||
      !user.pendingPhoneOtp ||
      !user.pendingPhoneOtpExpires
    ) {
      res.status(400)
      throw new Error(
        'Mobile change request not found. Please request a new OTP.'
      )
    }

    if (isOtpExpired(user.pendingPhoneOtpExpires)) {
      user.pendingPhone = null
      user.pendingPhoneOtp = null
      user.pendingPhoneOtpExpires = null
      user.pendingPhoneOtpAttempts = 0
      user.pendingPhoneOtpLastSentAt = null

      await user.save({
        validateBeforeSave: false,
      })

      res.status(400)
      throw new Error(
        'Mobile change OTP has expired. Please request a new OTP.'
      )
    }

    const hashedOtp = hashValue(otp)

    if (hashedOtp !== user.pendingPhoneOtp) {
      user.pendingPhoneOtpAttempts =
        (user.pendingPhoneOtpAttempts || 0) + 1

      if (
        user.pendingPhoneOtpAttempts >=
        MAX_OTP_ATTEMPTS
      ) {
        user.pendingPhone = null
        user.pendingPhoneOtp = null
        user.pendingPhoneOtpExpires = null
        user.pendingPhoneOtpAttempts = 0
        user.pendingPhoneOtpLastSentAt = null

        await user.save({
          validateBeforeSave: false,
        })

        res.status(400)
        throw new Error(
          'Too many incorrect attempts. Please request a new mobile OTP.'
        )
      }

      await user.save({
        validateBeforeSave: false,
      })

      res.status(400)
      throw new Error(
        `Invalid mobile OTP. ${
          MAX_OTP_ATTEMPTS -
          user.pendingPhoneOtpAttempts
        } attempts remaining.`
      )
    }

    // Check again that nobody registered this phone
    // while the OTP was pending.
    const phoneExists = await User.findOne({
      phone: user.pendingPhone,
      _id: { $ne: user._id },
    })

    if (phoneExists) {
      user.pendingPhone = null
      user.pendingPhoneOtp = null
      user.pendingPhoneOtpExpires = null
      user.pendingPhoneOtpAttempts = 0
      user.pendingPhoneOtpLastSentAt = null

      await user.save({
        validateBeforeSave: false,
      })

      res.status(400)
      throw new Error(
        'This mobile number is no longer available. Please choose another number.'
      )
    }

    user.phone = user.pendingPhone
    user.isPhoneVerified = true

    user.pendingPhone = null
    user.pendingPhoneOtp = null
    user.pendingPhoneOtpExpires = null
    user.pendingPhoneOtpAttempts = 0
    user.pendingPhoneOtpLastSentAt = null

    await user.save()

    res.json({
      message:
        'Mobile number changed and verified successfully',
      phone: user.phone,
      isPhoneVerified: user.isPhoneVerified,
    })
  }
)

// ======================================================
// ADD SAVED ADDRESS
// ======================================================

// POST /api/users/profile/addresses
// Private
const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  const {
    fullName,
    phone,
    house,
    area,
    city,
    state,
    pincode,
    addressType,
    isDefault,
  } = req.body

  if (
    !fullName ||
    !phone ||
    !house ||
    !area ||
    !city ||
    !state ||
    !pincode
  ) {
    res.status(400)
    throw new Error(
      'Please provide all required address details'
    )
  }

  // If this is the first address, automatically
  // make it default.
  const shouldBeDefault =
    user.addresses.length === 0 ||
    isDefault === true

  if (shouldBeDefault) {
    user.addresses.forEach((address) => {
      address.isDefault = false
    })
  }

  user.addresses.push({
    fullName: fullName.trim(),
    phone: phone.toString().trim(),
    house: house.trim(),
    area: area.trim(),
    city: city.trim(),
    state: state.trim(),
    pincode: pincode.toString().trim(),
    addressType: addressType || 'Home',
    isDefault: shouldBeDefault,
  })

  await user.save()

  res.status(201).json({
    message: 'Address added successfully',
    addresses: user.addresses,
  })
})

// ======================================================
// UPDATE SAVED ADDRESS
// ======================================================

// PUT /api/users/profile/addresses/:addressId
// Private
const updateAddress = asyncHandler(
  async (req, res) => {
    const user = await User.findById(req.user._id)

    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }

    const address = user.addresses.id(
      req.params.addressId
    )

    if (!address) {
      res.status(404)
      throw new Error('Address not found')
    }

    const {
      fullName,
      phone,
      house,
      area,
      city,
      state,
      pincode,
      addressType,
      isDefault,
    } = req.body

    if (fullName !== undefined) {
      address.fullName = fullName.trim()
    }

    if (phone !== undefined) {
      address.phone = phone.toString().trim()
    }

    if (house !== undefined) {
      address.house = house.trim()
    }

    if (area !== undefined) {
      address.area = area.trim()
    }

    if (city !== undefined) {
      address.city = city.trim()
    }

    if (state !== undefined) {
      address.state = state.trim()
    }

    if (pincode !== undefined) {
      address.pincode = pincode.toString().trim()
    }

    if (addressType !== undefined) {
      address.addressType = addressType
    }

    if (isDefault === true) {
      user.addresses.forEach((item) => {
        item.isDefault = false
      })

      address.isDefault = true
    }

    await user.save()

    res.json({
      message: 'Address updated successfully',
      addresses: user.addresses,
    })
  }
)

// ======================================================
// DELETE SAVED ADDRESS
// ======================================================

// DELETE /api/users/profile/addresses/:addressId
// Private
const deleteAddress = asyncHandler(
  async (req, res) => {
    const user = await User.findById(req.user._id)

    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }

    const address = user.addresses.id(
      req.params.addressId
    )

    if (!address) {
      res.status(404)
      throw new Error('Address not found')
    }

    const wasDefault = address.isDefault

    address.deleteOne()

    // If deleted address was default, make the first
    // remaining address default.
    if (
      wasDefault &&
      user.addresses.length > 0
    ) {
      user.addresses[0].isDefault = true
    }

    await user.save()

    res.json({
      message: 'Address deleted successfully',
      addresses: user.addresses,
    })
  }
)

// ======================================================
// SET DEFAULT ADDRESS
// ======================================================

// PUT /api/users/profile/addresses/:addressId/default
// Private
const setDefaultAddress = asyncHandler(
  async (req, res) => {
    const user = await User.findById(req.user._id)

    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }

    const address = user.addresses.id(
      req.params.addressId
    )

    if (!address) {
      res.status(404)
      throw new Error('Address not found')
    }

    user.addresses.forEach((item) => {
      item.isDefault = false
    })

    address.isDefault = true

    await user.save()

    res.json({
      message: 'Default address updated successfully',
      addresses: user.addresses,
    })
  }
)

// ======================================================
// GET SAVED ADDRESSES
// ======================================================

// GET /api/users/profile/addresses
// Private
const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  res.json(user.addresses || [])
})


// ======================================================
// GET ALL USERS
// ======================================================

// GET /api/users
// Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password')

  res.json(users)
})

// ======================================================
// DELETE USER
// ======================================================

// DELETE /api/users/:id
// Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  await user.deleteOne()

  res.json({
    message: 'User removed',
  })
})

// ======================================================
// GET USER BY ID
// ======================================================

// GET /api/users/:id
// Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(
    req.params.id
  ).select('-password')

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  res.json(user)
})

// ======================================================
// UPDATE USER - ADMIN
// ======================================================

// PUT /api/users/:id
// Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  user.name = req.body.name || user.name
  user.email = req.body.email || user.email

  if (req.body.isAdmin !== undefined) {
    user.isAdmin = req.body.isAdmin
  }

  const updatedUser = await user.save()

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    profileImage: updatedUser.profileImage || '',
    isAdmin: updatedUser.isAdmin,
  })
})

// ======================================================
// FORGOT PASSWORD - SEND OTP
// ======================================================

// POST /api/users/forgot-password/send-otp
// Public
const sendPasswordResetOtp = asyncHandler(
  async (req, res) => {
    const { email } = req.body

    if (!email) {
      res.status(400)
      throw new Error(
        'Please enter your email address'
      )
    }

    const cleanEmail = email.toLowerCase().trim()

    const user = await User.findOne({
      email: cleanEmail,
    })

    if (!user) {
      res.status(404)
      throw new Error(
        'No account found with this email address'
      )
    }

    if (!user.isEmailVerified) {
      res.status(403)
      throw new Error(
        'Email address is not verified'
      )
    }

    if (
      isCooldownActive(
        user.passwordResetOtpLastSentAt
      )
    ) {
      res.status(429)
      throw new Error(
        'Please wait before requesting another OTP.'
      )
    }

    const otp = generateOtp()

    user.passwordResetOtp = hashValue(otp)
    user.passwordResetOtpExpires = new Date(
      Date.now() + OTP_EXPIRY
    )
    user.passwordResetOtpAttempts = 0
    user.passwordResetOtpLockedUntil = null
    user.passwordResetOtpLastSentAt = new Date()

    await user.save({
      validateBeforeSave: false,
    })

    try {
      await sendEmail({
        to: cleanEmail,
        subject: 'CartNova Password Reset OTP',
        text: `Your CartNova password reset OTP is ${otp}. This OTP is valid for 5 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h2>CartNova Password Reset</h2>

            <p>Your password reset OTP is:</p>

            <h1 style="letter-spacing: 5px;">
              ${otp}
            </h1>

            <p>This OTP is valid for 5 minutes.</p>

            <p>
              If you did not request a password reset,
              please ignore this email.
            </p>
          </div>
        `,
      })
    } catch (error) {
      user.passwordResetOtp = null
      user.passwordResetOtpExpires = null
      user.passwordResetOtpAttempts = 0
      user.passwordResetOtpLastSentAt = null

      await user.save({
        validateBeforeSave: false,
      })

      console.error('Password reset email error:', error)

      res.status(500)
      throw new Error(
        'Unable to send password reset email. Please try again.'
      )
    }

    if (
      process.env.NODE_ENV === 'development'
    ) {
      return res.json({
        message:
          'OTP generated successfully. Development testing only.',
        otp,
      })
    }

    res.json({
      message: 'OTP sent successfully',
    })
  }
)

// ======================================================
// FORGOT PASSWORD - VERIFY OTP
// ======================================================

// POST /api/users/forgot-password/verify-otp
// Public
const verifyPasswordResetOtp = asyncHandler(
  async (req, res) => {
    const { email, otp } = req.body

    if (
      !email ||
      otp === undefined ||
      otp === null
    ) {
      res.status(400)
      throw new Error(
        'Email address and OTP are required'
      )
    }

    const cleanEmail = email.toLowerCase().trim()

    const user = await User.findOne({
      email: cleanEmail,
    })

    if (!user) {
      res.status(404)
      throw new Error(
        'No account found with this email address'
      )
    }

    if (!user.isEmailVerified) {
      res.status(403)
      throw new Error(
        'Email address is not verified'
      )
    }

    // --------------------------------------------------
    // CHECK TEMPORARY LOCK
    // --------------------------------------------------

    if (
      user.passwordResetOtpLockedUntil &&
      user.passwordResetOtpLockedUntil.getTime() >
        Date.now()
    ) {
      res.status(429)
      throw new Error(
        'Too many incorrect attempts. Please request a new OTP.'
      )
    }

    // --------------------------------------------------
    // CHECK OTP EXISTS
    // --------------------------------------------------

    if (
      !user.passwordResetOtp ||
      !user.passwordResetOtpExpires
    ) {
      res.status(400)
      throw new Error(
        'OTP not found. Please request a new OTP'
      )
    }

    // --------------------------------------------------
    // CHECK EXPIRY
    // --------------------------------------------------

    if (
      user.passwordResetOtpExpires.getTime() <
      Date.now()
    ) {
      user.passwordResetOtp = null
      user.passwordResetOtpExpires = null
      user.passwordResetOtpAttempts = 0

      await user.save({
        validateBeforeSave: false,
      })

      res.status(400)
      throw new Error(
        'OTP has expired. Please request a new OTP'
      )
    }

    const hashedOtp = hashValue(otp)

    // --------------------------------------------------
    // WRONG OTP
    // --------------------------------------------------

    if (
      hashedOtp !== user.passwordResetOtp
    ) {
      user.passwordResetOtpAttempts =
        (user.passwordResetOtpAttempts || 0) + 1

      if (
        user.passwordResetOtpAttempts >=
        MAX_OTP_ATTEMPTS
      ) {
        user.passwordResetOtp = null
        user.passwordResetOtpExpires = null
        user.passwordResetOtpAttempts = 0

        // Temporary 10-minute lock
        user.passwordResetOtpLockedUntil =
          new Date(
            Date.now() + 10 * 60 * 1000
          )

        await user.save({
          validateBeforeSave: false,
        })

        res.status(429)
        throw new Error(
          'Too many incorrect attempts. Please request a new OTP.'
        )
      }

      await user.save({
        validateBeforeSave: false,
      })

      res.status(400)
      throw new Error(
        `Invalid OTP. ${
          MAX_OTP_ATTEMPTS -
          user.passwordResetOtpAttempts
        } attempts remaining.`
      )
    }

    // --------------------------------------------------
    // CORRECT OTP
    // --------------------------------------------------

    const resetToken = crypto
      .randomBytes(32)
      .toString('hex')

    user.passwordResetToken =
      hashValue(resetToken)

    user.passwordResetTokenExpires =
      new Date(
        Date.now() + RESET_TOKEN_EXPIRY
      )

    user.passwordResetOtp = null
    user.passwordResetOtpExpires = null
    user.passwordResetOtpAttempts = 0
    user.passwordResetOtpLockedUntil = null
    user.passwordResetOtpLastSentAt = null

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

// POST /api/users/forgot-password/reset-password
// Public
const resetPassword = asyncHandler(
  async (req, res) => {
    const {
      email,
      resetToken,
      password,
    } = req.body

    if (
      !email ||
      !resetToken ||
      !password
    ) {
      res.status(400)
      throw new Error(
        'Email address, reset token and password are required'
      )
    }

    if (password.length < 6) {
      res.status(400)
      throw new Error(
        'Password must be at least 6 characters'
      )
    }

    const hashedResetToken =
      hashValue(resetToken)

    const user = await User.findOne({
      email: email.toLowerCase().trim(),

      passwordResetToken:
        hashedResetToken,

      passwordResetTokenExpires: {
        $gt: new Date(),
      },

      isEmailVerified: true,
    })

    if (!user) {
      res.status(400)
      throw new Error(
        'Invalid or expired reset token'
      )
    }

    // userModel pre-save hook hashes password
    user.password = password

    // Reset token is one-time use
    user.passwordResetToken = null
    user.passwordResetTokenExpires = null

    await user.save()

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

  verifyEmail,
  verifyPhone,

  resendEmailOtp,
  resendPhoneOtp,

  getUserProfile,
  updateUserProfile,

  sendEmailChangeOtp,
  verifyEmailChangeOtp,

  sendPhoneChangeOtp,
  verifyPhoneChangeOtp,

  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,

  getUsers,
  deleteUser,
  getUserById,
  updateUser,

  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
}


