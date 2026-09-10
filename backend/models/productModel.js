import mongoose from 'mongoose'

const reviewSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    reviews: [reviewSchema],

    rating: {
      type: Number,
      required: true,
      default: 0,
    },

    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },

    // ================================
    // TODAY'S DEAL
    // ================================

    isDealActive: {
      type: Boolean,
      default: false,
    },

    dealDiscount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    dealStartedAt: {
      type: Date,
      default: null,
    },

    dealExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

const Product = mongoose.model(
  'Product',
  productSchema
)

export default Product