import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// ======================================================
// ADDRESS SCHEMA
// ======================================================

const addressSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    house: {
      type: String,
      required: true,
      trim: true,
    },

    area: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
    },

    addressType: {
      type: String,
      enum: ['Home', 'Work', 'Other'],
      default: 'Home',
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// ======================================================
// USER SCHEMA
// ======================================================

const userSchema = mongoose.Schema(
  {
    // ==================================================
    // BASIC USER INFORMATION
    // ==================================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },

    // ==================================================
    // PROFILE IMAGE
    // ==================================================

    profileImage: {
      type: String,
      default: '',
      trim: true,
    },

    // ==================================================
    // SAVED ADDRESSES
    // ==================================================

    addresses: {
      type: [addressSchema],
      default: [],
    },

    // ==================================================
    // EMAIL VERIFICATION
    // ==================================================

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationOtp: {
      type: String,
      default: null,
    },

    emailVerificationOtpExpires: {
      type: Date,
      default: null,
    },

    emailVerificationOtpAttempts: {
      type: Number,
      default: 0,
    },

    emailOtpLastSentAt: {
      type: Date,
      default: null,
    },

    // ==================================================
    // PHONE VERIFICATION
    // ==================================================

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    phoneVerificationOtp: {
      type: String,
      default: null,
    },

    phoneVerificationOtpExpires: {
      type: Date,
      default: null,
    },

    phoneVerificationOtpAttempts: {
      type: Number,
      default: 0,
    },

    phoneOtpLastSentAt: {
      type: Date,
      default: null,
    },

    // ==================================================
    // PROFILE EMAIL CHANGE VERIFICATION
    // ==================================================

    pendingEmail: {
      type: String,
      default: null,
      lowercase: true,
      trim: true,
    },

    pendingEmailOtp: {
      type: String,
      default: null,
    },

    pendingEmailOtpExpires: {
      type: Date,
      default: null,
    },

    pendingEmailOtpAttempts: {
      type: Number,
      default: 0,
    },

    pendingEmailOtpLastSentAt: {
      type: Date,
      default: null,
    },

    // ==================================================
    // PROFILE PHONE CHANGE VERIFICATION
    // ==================================================

    pendingPhone: {
      type: String,
      default: null,
      trim: true,
    },

    pendingPhoneOtp: {
      type: String,
      default: null,
    },

    pendingPhoneOtpExpires: {
      type: Date,
      default: null,
    },

    pendingPhoneOtpAttempts: {
      type: Number,
      default: 0,
    },

    pendingPhoneOtpLastSentAt: {
      type: Date,
      default: null,
    },

    // ==================================================
    // PASSWORD RESET OTP
    // ==================================================

    passwordResetOtp: {
      type: String,
      default: null,
    },

    passwordResetOtpExpires: {
      type: Date,
      default: null,
    },

    passwordResetOtpAttempts: {
      type: Number,
      default: 0,
    },

    passwordResetOtpLockedUntil: {
      type: Date,
      default: null,
    },

    passwordResetOtpLastSentAt: {
      type: Date,
      default: null,
    },

    // ==================================================
    // PASSWORD RESET TOKEN
    // ==================================================

    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetTokenExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

// ======================================================
// CHECK PASSWORD
// ======================================================

userSchema.methods.matchPassword = async function (
  enteredPassword
) {
  return await bcrypt.compare(
    enteredPassword,
    this.password
  )
}

// ======================================================
// HASH PASSWORD BEFORE SAVE
// ======================================================

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  const salt = await bcrypt.genSalt(10)

  this.password = await bcrypt.hash(
    this.password,
    salt
  )

  next()
})

// ======================================================
// USER MODEL
// ======================================================

const User = mongoose.model('User', userSchema)

export default User