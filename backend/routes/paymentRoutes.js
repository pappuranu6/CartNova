import crypto from 'crypto'
import express from 'express'
import razorpay from '../config/razorpay.js'

const router = express.Router()

// Create Razorpay Order
router.post('/create', async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount) * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    }

    const order = await razorpay.orders.create(options)

    res.json(order)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Payment order creation failed',
    })
  }
})

// Verify Razorpay Payment
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body

    const body = razorpay_order_id + '|' + razorpay_payment_id

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex')

    if (expectedSignature === razorpay_signature) {
      res.json({
        success: true,
        message: 'Payment verified successfully',
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Payment verification error',
    })
  }
})

export default router