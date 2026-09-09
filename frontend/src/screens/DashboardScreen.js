import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

import Loader from '../components/Loader'
import Message from '../components/Message'

const DashboardScreen = ({ history }) => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const userLogin = useSelector(
    (state) => state.userLogin
  )

  const { userInfo } = userLogin

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login')
      return
    }

    const fetchDashboardStats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }

        const { data } = await axios.get(
          '/api/admin/dashboard',
          config
        )

        setStats(data)
        setLoading(false)
      } catch (error) {
        setError(
          error.response?.data?.message ||
            'Failed to load dashboard data'
        )

        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [history, userInfo])

  return (
    <div className='cartnova-admin-dashboard-page'>

      {loading ? (
        <div className='cartnova-dashboard-loader'>
          <Loader />
        </div>
      ) : error ? (
        <Message variant='danger'>
          {error}
        </Message>
      ) : (
        <>
          {/* ================= HEADER ================= */}

          <div className='cartnova-dashboard-header'>

            <div>
              <div className='cartnova-dashboard-title'>
                <div className='cartnova-dashboard-title-icon'>
                  <i className='fas fa-chart-line'></i>
                </div>

                <div>
                  <h1>Admin Dashboard</h1>
                  <p>
                    Welcome back! Here's what's happening
                    with your store.
                  </p>
                </div>
              </div>
            </div>

            <div className='cartnova-dashboard-admin-badge'>
              <i className='fas fa-user-shield'></i>
              Admin Panel
            </div>

          </div>

          {/* ================= STAT CARDS ================= */}

          <div className='cartnova-dashboard-stats'>

            {/* PRODUCTS */}

            <div className='cartnova-stat-card products'>
              <div className='cartnova-stat-icon'>
                <i className='fas fa-box'></i>
              </div>

              <div className='cartnova-stat-content'>
                <span>Total Products</span>
                <strong>
                  {stats.totalProducts}
                </strong>
              </div>

              <div className='cartnova-stat-decoration'>
                <i className='fas fa-box'></i>
              </div>
            </div>

            {/* USERS */}

            <div className='cartnova-stat-card users'>
              <div className='cartnova-stat-icon'>
                <i className='fas fa-users'></i>
              </div>

              <div className='cartnova-stat-content'>
                <span>Total Users</span>
                <strong>
                  {stats.totalUsers}
                </strong>
              </div>

              <div className='cartnova-stat-decoration'>
                <i className='fas fa-users'></i>
              </div>
            </div>

            {/* ORDERS */}

            <div className='cartnova-stat-card orders'>
              <div className='cartnova-stat-icon'>
                <i className='fas fa-shopping-bag'></i>
              </div>

              <div className='cartnova-stat-content'>
                <span>Total Orders</span>
                <strong>
                  {stats.totalOrders}
                </strong>
              </div>

              <div className='cartnova-stat-decoration'>
                <i className='fas fa-shopping-bag'></i>
              </div>
            </div>

            {/* SALES */}

            <div className='cartnova-stat-card sales'>
              <div className='cartnova-stat-icon'>
                <i className='fas fa-rupee-sign'></i>
              </div>

              <div className='cartnova-stat-content'>
                <span>Total Sales</span>
                <strong>
                  ₹
                  {Number(
                    stats.totalSales
                  ).toLocaleString('en-IN')}
                </strong>
              </div>

              <div className='cartnova-stat-decoration'>
                <i className='fas fa-chart-line'></i>
              </div>
            </div>

            {/* PAID */}

            <div className='cartnova-stat-card paid'>
              <div className='cartnova-stat-icon'>
                <i className='fas fa-check-circle'></i>
              </div>

              <div className='cartnova-stat-content'>
                <span>Paid Orders</span>
                <strong>
                  {stats.paidOrders}
                </strong>
              </div>

              <div className='cartnova-stat-decoration'>
                <i className='fas fa-check-circle'></i>
              </div>
            </div>

            {/* DELIVERED */}

            <div className='cartnova-stat-card delivered'>
              <div className='cartnova-stat-icon'>
                <i className='fas fa-truck'></i>
              </div>

              <div className='cartnova-stat-content'>
                <span>Delivered Orders</span>
                <strong>
                  {stats.deliveredOrders}
                </strong>
              </div>

              <div className='cartnova-stat-decoration'>
                <i className='fas fa-truck'></i>
              </div>
            </div>

          </div>

          {/* ================= SALES CHART ================= */}

          <div className='cartnova-dashboard-card'>

            <div className='cartnova-dashboard-card-header'>

              <div>
                <h3>
                  <i className='fas fa-chart-line'></i>{' '}
                  Sales & Orders Overview
                </h3>

                <span>
                  Monthly sales and order performance
                </span>
              </div>

            </div>

            <div className='cartnova-chart-container'>

              {stats.chartData &&
              stats.chartData.length > 0 ? (
                <ResponsiveContainer
                  width='100%'
                  height={350}
                >
                  <LineChart
                    data={stats.chartData}
                    margin={{
                      top: 20,
                      right: 25,
                      left: 10,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray='3 3'
                    />

                    <XAxis
                      dataKey='month'
                    />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Line
                      type='monotone'
                      dataKey='sales'
                      name='Sales'
                      stroke='#1677c8'
                      strokeWidth={3}
                      activeDot={{ r: 7 }}
                    />

                    <Line
                      type='monotone'
                      dataKey='orders'
                      name='Orders'
                      stroke='#0f4c81'
                      strokeWidth={3}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Message>
                  No paid orders available for chart
                </Message>
              )}

            </div>

          </div>

          {/* ================= RECENT ORDERS ================= */}

          <div className='cartnova-dashboard-card'>

            <div className='cartnova-dashboard-card-header'>

              <div>
                <h3>
                  <i className='fas fa-shopping-bag'></i>{' '}
                  Recent Orders
                </h3>

                <span>
                  Latest customer orders
                </span>
              </div>

              <Link
                to='/admin/orderlist'
                className='cartnova-view-all-link'
              >
                View All
                <i className='fas fa-arrow-right'></i>
              </Link>

            </div>

            <div className='cartnova-dashboard-table-wrapper'>

              {stats.recentOrders &&
              stats.recentOrders.length > 0 ? (
                <table className='cartnova-dashboard-table'>

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>USER</th>
                      <th>DATE</th>
                      <th>TOTAL</th>
                      <th>PAID</th>
                      <th>DELIVERED</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>

                  <tbody>

                    {stats.recentOrders.map(
                      (order) => (
                        <tr key={order._id}>

                          <td>
                            <span className='cartnova-dashboard-order-id'>
                              #{order._id.slice(-8)}
                            </span>
                          </td>

                          <td>
                            <div className='cartnova-dashboard-user'>
                              <div>
                                <i className='fas fa-user'></i>
                              </div>

                              <span>
                                {order.user
                                  ? order.user.name
                                  : 'Unknown'}
                              </span>
                            </div>
                          </td>

                          <td>
                            <span className='cartnova-dashboard-date'>
                              <i className='far fa-calendar-alt'></i>
                              {new Date(
                                order.createdAt
                              ).toLocaleDateString(
                                'en-IN'
                              )}
                            </span>
                          </td>

                          <td>
                            <strong className='cartnova-dashboard-total'>
                              ₹
                              {Number(
                                order.totalPrice
                              ).toLocaleString(
                                'en-IN'
                              )}
                            </strong>
                          </td>

                          <td>
                            {order.isPaid ? (
                              <span className='cartnova-dashboard-status paid'>
                                <i className='fas fa-check-circle'></i>
                                Paid
                              </span>
                            ) : (
                              <span className='cartnova-dashboard-status unpaid'>
                                <i className='fas fa-times-circle'></i>
                                Unpaid
                              </span>
                            )}
                          </td>

                          <td>
                            {order.isDelivered ? (
                              <span className='cartnova-dashboard-status delivered'>
                                <i className='fas fa-truck'></i>
                                Delivered
                              </span>
                            ) : (
                              <span className='cartnova-dashboard-status pending'>
                                <i className='fas fa-clock'></i>
                                Pending
                              </span>
                            )}
                          </td>

                          <td>
                            <Link
                              to={`/order/${order._id}`}
                              className='cartnova-dashboard-view-btn'
                            >
                              <i className='fas fa-eye'></i>
                              View
                            </Link>
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>
              ) : (
                <Message>
                  No recent orders found
                </Message>
              )}

            </div>

          </div>

          {/* ================= QUICK ACTIONS ================= */}

          <div className='cartnova-quick-actions'>

            <div className='cartnova-quick-actions-heading'>
              <h3>
                <i className='fas fa-bolt'></i>{' '}
                Quick Actions
              </h3>

              <span>
                Quickly manage your store
              </span>
            </div>

            <div className='cartnova-quick-actions-grid'>

              <Link
                to='/admin/userlist'
                className='cartnova-quick-action users'
              >
                <div>
                  <i className='fas fa-users'></i>
                </div>

                <span>
                  Manage Users
                </span>

                <i className='fas fa-arrow-right'></i>
              </Link>

              <Link
                to='/admin/productlist'
                className='cartnova-quick-action products'
              >
                <div>
                  <i className='fas fa-box'></i>
                </div>

                <span>
                  Manage Products
                </span>

                <i className='fas fa-arrow-right'></i>
              </Link>

              <Link
                to='/admin/orderlist'
                className='cartnova-quick-action orders'
              >
                <div>
                  <i className='fas fa-shopping-bag'></i>
                </div>

                <span>
                  Manage Orders
                </span>

                <i className='fas fa-arrow-right'></i>
              </Link>

            </div>

          </div>

        </>
      )}

    </div>
  )
}

export default DashboardScreen