import asyncHandler from 'express-async-handler'

import Product from '../models/productModel.js'
import User from '../models/userModel.js'
import Order from '../models/orderModel.js'

const getDashboardStats = asyncHandler(async (req, res) => {
  const totalProducts = await Product.countDocuments()

  const totalUsers = await User.countDocuments()

  const totalOrders = await Order.countDocuments()

  const paidOrders = await Order.countDocuments({
    isPaid: true,
  })

  const deliveredOrders = await Order.countDocuments({
    isDelivered: true,
  })

  // ================= LOW STOCK PRODUCTS =================

  const lowStockProducts = await Product.countDocuments({
    countInStock: { $lte: 5 },
  })

  // ================= TOTAL SALES =================

  const salesResult = await Order.aggregate([
    {
      $match: {
        isPaid: true,
      },
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: '$totalPrice',
        },
      },
    },
  ])

  const totalSales =
    salesResult.length > 0
      ? salesResult[0].totalSales
      : 0

  // ================= RECENT ORDERS =================

  const recentOrders = await Order.find({})
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .limit(5)

  // ================= MONTHLY CHART DATA =================

  const monthlySales = await Order.aggregate([
    {
      $match: {
        isPaid: true,
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        sales: {
          $sum: '$totalPrice',
        },
        orders: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        '_id.year': 1,
        '_id.month': 1,
      },
    },
  ])

  const chartData = monthlySales.map((item) => ({
    month: `${item._id.year}-${String(
      item._id.month
    ).padStart(2, '0')}`,
    sales: item.sales,
    orders: item.orders,
  }))

  // ================= RESPONSE =================

  res.json({
    totalProducts,
    totalUsers,
    totalOrders,
    totalSales,
    paidOrders,
    deliveredOrders,
    lowStockProducts,
    recentOrders,
    chartData,
  })
})

export { getDashboardStats }