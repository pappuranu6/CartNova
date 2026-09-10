import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'

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

  /*
    ==================================================
    SECURE PRODUCT PRICE + TODAY'S DEAL CALCULATION
    ==================================================

    Price frontend se trust nahi karenge.

    Backend database se:
    - Product price
    - Deal ON/OFF
    - Deal discount
    - Deal expiry

    verify karega.
  */

  const verifiedOrderItems = []

  for (const item of orderItems) {
    const product = await Product.findById(item.product)

    if (!product) {
      res.status(404)
      throw new Error(
        `Product not found: ${item.product}`
      )
    }

    const quantity = Number(item.qty)

    if (!quantity || quantity < 1) {
      res.status(400)
      throw new Error(
        `Invalid quantity for ${product.name}`
      )
    }

    if (quantity > product.countInStock) {
      res.status(400)
      throw new Error(
        `${product.name} has only ${product.countInStock} item(s) in stock`
      )
    }

    // Original database price
    const originalPrice = Number(
      product.price || 0
    )

    /*
      Check whether Today's Deal is currently live.
    */

    const discount = Number(
      product.dealDiscount || 0
    )

    const dealIsLive =
      Boolean(product.isDealActive) &&
      discount > 0 &&
      discount <= 100 &&
      product.dealExpiresAt &&
      new Date(product.dealExpiresAt).getTime() >
        Date.now()

    /*
      Calculate actual price.

      Example:
      Product price = ₹1000
      Deal = 20%

      Customer price = ₹800
    */

    let finalPrice = originalPrice

    if (dealIsLive) {
      finalPrice =
        Math.round(
          originalPrice *
            (1 - discount / 100)
        )
    }

    verifiedOrderItems.push({
      name: product.name,
      qty: quantity,
      image: product.image,
      price: finalPrice,
      product: product._id,
    })
  }

  /*
    =========================
    CALCULATE ITEM TOTAL
    =========================
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
    =========================
    TAX + SHIPPING
    =========================

    Existing frontend tax/shipping
    functionality is preserved.
  */

  const finalTaxPrice =
    Number(taxPrice || 0)

  const finalShippingPrice =
    Number(shippingPrice || 0)

  /*
    =========================
    FINAL TOTAL
    =========================
  */

  const calculatedTotalPrice =
    calculatedItemsPrice +
    finalTaxPrice +
    finalShippingPrice

  /*
    =========================
    CREATE ORDER
    =========================
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

  const createdOrder = await order.save()

  res.status(201).json(createdOrder)
})

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

  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(
  async (req, res) => {
    const order = await Order.findById(
      req.params.id
    )

    if (order) {
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
    } else {
      res.status(404)
      throw new Error(
        'Order not found'
      )
    }
  }
)

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered =
  asyncHandler(async (req, res) => {
    const order =
      await Order.findById(
        req.params.id
      )

    if (order) {
      order.isDelivered = true
      order.deliveredAt = Date.now()

      const updatedOrder =
        await order.save()

      res.json(updatedOrder)
    } else {
      res.status(404)
      throw new Error(
        'Order not found'
      )
    }
  })

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(
  async (req, res) => {
    const orders =
      await Order.find({
        user: req.user._id,
      })

    res.json(orders)
  }
)

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(
  async (req, res) => {
    const orders =
      await Order.find({})
        .populate(
          'user',
          'id name'
        )

    res.json(orders)
  }
)

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
}