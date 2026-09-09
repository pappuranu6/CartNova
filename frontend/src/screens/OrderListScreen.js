import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import Message from '../components/Message'
import Loader from '../components/Loader'
import { listOrders } from '../actions/orderActions'

const OrderListScreen = ({ history }) => {
  const dispatch = useDispatch()

  const orderList = useSelector((state) => state.orderList)
  const { loading, error, orders } = orderList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders())
    } else {
      history.push('/login')
    }
  }, [dispatch, history, userInfo])

  return (
    <div className='cartnova-admin-orders-page'>

      {/* PAGE HEADER */}
      <div className='cartnova-admin-page-header'>
        <div>
          <h1>
            <i className='fas fa-shopping-bag'></i>{' '}
            Orders
          </h1>
          <p>Manage and track all customer orders.</p>
        </div>

        {orders && (
          <div className='cartnova-order-count'>
            <i className='fas fa-receipt'></i>
            <span>{orders.length}</span>
            Orders
          </div>
        )}
      </div>

      {loading ? (
        <div className='cartnova-admin-loader'>
          <Loader />
        </div>
      ) : error ? (
        <Message variant='danger'>
          {error}
        </Message>
      ) : (
        <div className='cartnova-orders-card'>

          {/* TABLE HEADER */}
          <div className='cartnova-orders-card-header'>
            <div>
              <h3>
                <i className='fas fa-list'></i>{' '}
                Order List
              </h3>
              <span>
                All orders placed by customers
              </span>
            </div>
          </div>

          {/* TABLE */}
          <div className='cartnova-orders-table-wrapper'>
            <table className='cartnova-orders-table'>

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
                {orders && orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id}>

                      {/* ID */}
                      <td>
                        <span className='cartnova-order-id'>
                          #{order._id.slice(-8)}
                        </span>
                      </td>

                      {/* USER */}
                      <td>
                        <div className='cartnova-order-user'>
                          <div className='cartnova-order-user-icon'>
                            <i className='fas fa-user'></i>
                          </div>

                          <span>
                            {order.user && order.user.name}
                          </span>
                        </div>
                      </td>

                      {/* DATE */}
                      <td>
                        <div className='cartnova-order-date'>
                          <i className='far fa-calendar-alt'></i>
                          {order.createdAt.substring(0, 10)}
                        </div>
                      </td>

                      {/* TOTAL */}
                      <td>
                        <span className='cartnova-order-total'>
                          ₹{order.totalPrice}
                        </span>
                      </td>

                      {/* PAID */}
                      <td>
                        {order.isPaid ? (
                          <span className='cartnova-order-status paid'>
                            <i className='fas fa-check-circle'></i>
                            Paid
                          </span>
                        ) : (
                          <span className='cartnova-order-status unpaid'>
                            <i className='fas fa-times-circle'></i>
                            Unpaid
                          </span>
                        )}
                      </td>

                      {/* DELIVERED */}
                      <td>
                        {order.isDelivered ? (
                          <span className='cartnova-order-status delivered'>
                            <i className='fas fa-truck'></i>
                            Delivered
                          </span>
                        ) : (
                          <span className='cartnova-order-status pending'>
                            <i className='fas fa-clock'></i>
                            Pending
                          </span>
                        )}
                      </td>

                      {/* ACTION */}
                      <td>
                        <LinkContainer
                          to={`/order/${order._id}`}
                        >
                          <Button className='cartnova-order-details-btn'>
                            <i className='fas fa-eye'></i>
                            Details
                          </Button>
                        </LinkContainer>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan='7'
                      className='cartnova-no-orders'
                    >
                      <i className='fas fa-shopping-bag'></i>
                      <h4>No Orders Found</h4>
                      <p>
                        There are currently no customer
                        orders.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>

        </div>
      )}
    </div>
  )
}

export default OrderListScreen