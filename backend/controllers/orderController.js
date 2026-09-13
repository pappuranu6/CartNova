import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'
import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'

// ======================================================
// CREATE NEW ORDER
// ======================================================

// @desc    Create new order
// @route   POST /api/orders
// @access  Private

const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
  } = req.body

  if (!orderItems || orderItems.length === 0) {
    res.status(400)
    throw new Error('No order items')
  }

  if (!shippingAddress) {
    res.status(400)
    throw new Error('Shipping address is required')
  }

  if (!paymentMethod) {
    res.status(400)
    throw new Error('Payment method is required')
  }

  /*
    ==================================================
    MONGODB TRANSACTION
    ==================================================

    Order create + stock deduction ek transaction
    ke andar hoga.

    Agar koi step fail hua:
    - Order create nahi hoga
    - Stock bhi rollback ho jayega
  */

  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const verifiedOrderItems = []

    /*
      ==================================================
      VERIFY PRODUCTS + ATOMIC STOCK DEDUCTION
      ==================================================
    */

    for (const item of orderItems) {
      if (!item.product) {
        res.status(400)
        throw new Error('Product ID is required')
      }

      const quantity = Number(item.qty)

      if (!Number.isInteger(quantity) || quantity < 1) {
        res.status(400)
        throw new Error(
          'Invalid product quantity'
        )
      }

      /*
        IMPORTANT:

        Stock ko atomically decrease kar rahe hain.

        Condition:
        countInStock >= quantity

        Iska matlab:
        Agar stock enough nahi hai,
        update nahi hoga.
      */

      const product =
        await Product.findOneAndUpdate(
          {
            _id: item.product,
            countInStock: {
              $gte: quantity,
            },
          },
          {
            $inc: {
              countInStock: -quantity,
            },
          },
          {
            new: true,
            session,
          }
        )

      if (!product) {
        /*
          Product exist karta hai lekin
          stock enough nahi hai,
          ya product exist hi nahi karta.
        */

        const existingProduct =
          await Product.findById(
            item.product
          ).session(session)

        if (!existingProduct) {
          res.status(404)
          throw new Error(
            `Product not found: ${item.product}`
          )
        }

        res.status(400)
        throw new Error(
          `${existingProduct.name} does not have enough stock`
        )
      }

      /*
        ==================================================
        TODAY'S DEAL
        ==================================================
      */

      const originalPrice = Number(
        product.price || 0
      )

      const discount = Number(
        product.dealDiscount || 0
      )

      const dealIsLive =
        Boolean(product.isDealActive) &&
        discount > 0 &&
        discount <= 100 &&
        product.dealExpiresAt &&
        new Date(
          product.dealExpiresAt
        ).getTime() > Date.now()

      /*
        ==================================================
        FINAL PRODUCT PRICE
        ==================================================
      */

      let finalPrice = originalPrice

      if (dealIsLive) {
        finalPrice = Math.round(
          originalPrice *
            (1 - discount / 100)
        )
      }

      /*
        IMPORTANT:

        Price frontend se nahi liya ja raha.
        Database product price use ho raha hai.
      */

      verifiedOrderItems.push({
        name: product.name,
        qty: quantity,
        image: product.image,
        price: finalPrice,
        product: product._id,
      })
    }

    /*
      ==================================================
      CALCULATE ITEMS PRICE
      ==================================================
    */

    const calculatedItemsPrice =
      verifiedOrderItems.reduce(
        (acc, item) =>
          acc +
          Number(item.price) *
            Number(item.qty),
        0
      )

    /*
      ==================================================
      TAX + SHIPPING
      ==================================================
    */

    const finalTaxPrice =
      Number(taxPrice || 0)

    const finalShippingPrice =
      Number(shippingPrice || 0)

    /*
      Basic protection against invalid
      negative tax/shipping values.
    */

    if (
      finalTaxPrice < 0 ||
      finalShippingPrice < 0
    ) {
      res.status(400)
      throw new Error(
        'Invalid tax or shipping price'
      )
    }

    /*
      ==================================================
      FINAL TOTAL
      ==================================================
    */

    const calculatedTotalPrice =
      calculatedItemsPrice +
      finalTaxPrice +
      finalShippingPrice

    /*
      ==================================================
      CREATE ORDER
      ==================================================
    */

    const order = new Order({
      orderItems: verifiedOrderItems,

      user: req.user._id,

      shippingAddress,
      paymentMethod,

      itemsPrice: calculatedItemsPrice,
      taxPrice: finalTaxPrice,
      shippingPrice: finalShippingPrice,
      totalPrice: calculatedTotalPrice,
    })

    /*
      Save order inside same transaction.
    */

    const createdOrder =
      await order.save({
        session,
      })

    /*
      ==================================================
      COMMIT TRANSACTION
      ==================================================
    */

    await session.commitTransaction()

    res.status(201).json(createdOrder)
  } catch (error) {
    /*
      ==================================================
      ROLLBACK
      ==================================================
    */

    await session.abortTransaction()

    throw error
  } finally {
    await session.endSession()
  }
})

// ======================================================
// GET ORDER BY ID
// ======================================================

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(
    req.params.id
  ).populate(
    'user',
    'name email'
  )

  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }

  /*
    ==================================================
    SECURITY CHECK
    ==================================================
  */

  const isOwner =
    order.user &&
    order.user._id.toString() ===
      req.user._id.toString()

  if (!isOwner && !req.user.isAdmin) {
    res.status(403)
    throw new Error(
      'Not authorized to view this order'
    )
  }

  res.json(order)
})

// ======================================================
// UPDATE ORDER TO PAID
// ======================================================

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private

const updateOrderToPaid = asyncHandler(
  async (req, res) => {
    const order = await Order.findById(
      req.params.id
    )

    if (!order) {
      res.status(404)
      throw new Error('Order not found')
    }

    /*
      ==================================================
      SECURITY CHECK
      ==================================================
    */

    const isOwner =
      order.user.toString() ===
      req.user._id.toString()

    if (!isOwner && !req.user.isAdmin) {
      res.status(403)
      throw new Error(
        'Not authorized to update this order'
      )
    }

    /*
      Already paid
    */

    if (order.isPaid) {
      return res.json(order)
    }

    order.isPaid = true
    order.paidAt = Date.now()

    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time:
        req.body.update_time,
      email_address:
        req.body.payer?.email_address,
    }

    const updatedOrder =
      await order.save()

    res.json(updatedOrder)
  }
)

// ======================================================
// UPDATE ORDER TO DELIVERED
// ======================================================

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin

const updateOrderToDelivered =
  asyncHandler(async (req, res) => {
    const order =
      await Order.findById(
        req.params.id
      )

    if (!order) {
      res.status(404)
      throw new Error(
        'Order not found'
      )
    }

    /*
      Extra admin protection.
    */

    if (!req.user.isAdmin) {
      res.status(403)
      throw new Error(
        'Admin access required'
      )
    }

    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder =
      await order.save()

    res.json(updatedOrder)
  })

// ======================================================
// GET MY ORDERS
// ======================================================

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private

const getMyOrders = asyncHandler(
  async (req, res) => {
    const orders =
      await Order.find({
        user: req.user._id,
      })
        .sort({
          createdAt: -1,
        })

    res.json(orders)
  }
)

// ======================================================
// GET ALL ORDERS
// ======================================================

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin

const getOrders = asyncHandler(
  async (req, res) => {
    if (!req.user.isAdmin) {
      res.status(403)
      throw new Error(
        'Admin access required'
      )
    }

    const orders =
      await Order.find({})
        .populate(
          'user',
          'id name email'
        )
        .sort({
          createdAt: -1,
        })

    res.json(orders)
  }
)

// ======================================================
// EXPORTS
// ======================================================

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
}