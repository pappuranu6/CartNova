import React, { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listMyOrders } from '../actions/orderActions'

const MyOrdersScreen = ({ history }) => {
  const dispatch = useDispatch()

  const orderListMy = useSelector(
    (state) => state.orderListMy
  )

  const {
    loading,
    error,
    orders,
  } = orderListMy

  const userLogin = useSelector(
    (state) => state.userLogin
  )

  const { userInfo } = userLogin

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    } else {
      dispatch(listMyOrders())
    }
  }, [dispatch, history, userInfo])

  return (
    <div className='cartnova-my-orders-page'>

      {/* ================= HEADER ================= */}

      <div className='cartnova-my-orders-header'>

        <div>
          <span className='cartnova-my-orders-label'>
            ACCOUNT
          </span>

          <h1>
            My Orders
          </h1>

          <p>
            Track and view all your CartNova orders.
          </p>
        </div>

        <div className='cartnova-my-orders-header-icon'>
          <i className='fas fa-shopping-bag'></i>
        </div>

      </div>

      {/* ================= CONTENT ================= */}

      {loading ? (

        <div className='cartnova-my-orders-loader'>
          <Loader />
        </div>

      ) : error ? (

        <div className='cartnova-my-orders-message'>
          <Message variant='danger'>
            {error}
          </Message>
        </div>

      ) : orders && orders.length > 0 ? (

        <div className='cartnova-my-orders-card'>

          {/* CARD HEADER */}

          <div className='cartnova-my-orders-card-header'>

            <div>
              <h2>
                Order History
              </h2>

              <span>
                {orders.length} order
                {orders.length !== 1
                  ? 's'
                  : ''} found
              </span>
            </div>

            <div className='cartnova-order-history-icon'>
              <i className='fas fa-receipt'></i>
            </div>

          </div>

          {/* DESKTOP TABLE */}

          <div className='cartnova-my-orders-table-wrapper'>

            <table className='cartnova-my-orders-table'>

              <thead>
                <tr>
                  <th>
                    ORDER ID
                  </th>

                  <th>
                    DATE
                  </th>

                  <th>
                    TOTAL
                  </th>

                  <th>
                    PAYMENT
                  </th>

                  <th>
                    DELIVERY
                  </th>

                  <th>
                    ACTION
                  </th>
                </tr>
              </thead>

              <tbody>

                {orders.map((order) => (

                  <tr key={order._id}>

                    {/* ORDER ID */}

                    <td>
                      <span className='cartnova-my-order-id'>
                        #{order._id.slice(-8)}
                      </span>
                    </td>

                    {/* DATE */}

                    <td>
                      <span className='cartnova-my-order-date'>
                        {order.createdAt
                          ? order.createdAt.substring(0, 10)
                          : '-'}
                      </span>
                    </td>

                    {/* TOTAL */}

                    <td>
                      <strong className='cartnova-my-order-total'>
                        ₹{order.totalPrice}
                      </strong>
                    </td>

                    {/* PAYMENT */}

                    <td>

                      {order.isPaid ? (

                        <span className='cartnova-my-order-status paid'>
                          <i className='fas fa-check-circle'></i>
                          Paid
                        </span>

                      ) : (

                        <span className='cartnova-my-order-status unpaid'>
                          <i className='fas fa-clock'></i>
                          Not Paid
                        </span>

                      )}

                    </td>

                    {/* DELIVERY */}

                    <td>

                      {order.isDelivered ? (

                        <span className='cartnova-my-order-status delivered'>
                          <i className='fas fa-check-circle'></i>
                          Delivered
                        </span>

                      ) : (

                        <span className='cartnova-my-order-status pending'>
                          <i className='fas fa-truck'></i>
                          Pending
                        </span>

                      )}

                    </td>

                    {/* DETAILS */}

                    <td>

                      <LinkContainer
                        to={`/order/${order._id}`}
                      >

                        <Button
                          className='cartnova-my-order-details-btn'
                        >
                          <i className='fas fa-eye'></i>
                          Details
                        </Button>

                      </LinkContainer>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* MOBILE ORDERS */}

          <div className='cartnova-mobile-orders'>

            {orders.map((order) => (

              <div
                className='cartnova-mobile-order-card'
                key={order._id}
              >

                <div className='cartnova-mobile-order-top'>

                  <div>
                    <span>
                      ORDER ID
                    </span>

                    <strong>
                      #{order._id.slice(-8)}
                    </strong>
                  </div>

                  <strong className='cartnova-mobile-order-price'>
                    ₹{order.totalPrice}
                  </strong>

                </div>

                <div className='cartnova-mobile-order-date'>
                  <i className='far fa-calendar-alt'></i>

                  {order.createdAt
                    ? order.createdAt.substring(0, 10)
                    : '-'}
                </div>

                <div className='cartnova-mobile-order-statuses'>

                  {order.isPaid ? (

                    <span className='cartnova-my-order-status paid'>
                      <i className='fas fa-check-circle'></i>
                      Paid
                    </span>

                  ) : (

                    <span className='cartnova-my-order-status unpaid'>
                      <i className='fas fa-clock'></i>
                      Not Paid
                    </span>

                  )}

                  {order.isDelivered ? (

                    <span className='cartnova-my-order-status delivered'>
                      <i className='fas fa-check-circle'></i>
                      Delivered
                    </span>

                  ) : (

                    <span className='cartnova-my-order-status pending'>
                      <i className='fas fa-truck'></i>
                      Pending
                    </span>

                  )}

                </div>

                <LinkContainer
                  to={`/order/${order._id}`}
                >

                  <Button
                    className='cartnova-mobile-order-details'
                  >
                    <i className='fas fa-eye'></i>
                    View Order Details
                  </Button>

                </LinkContainer>

              </div>

            ))}

          </div>

        </div>

      ) : (

        /* EMPTY STATE */

        <div className='cartnova-no-orders'>

          <div className='cartnova-no-orders-icon'>
            <i className='fas fa-shopping-bag'></i>
          </div>

          <h2>
            No Orders Yet
          </h2>

          <p>
            You haven't placed any orders yet.
            Start shopping and your orders will
            appear here.
          </p>

          <LinkContainer to='/'>
            <Button className='cartnova-start-shopping-btn'>
              <i className='fas fa-shopping-cart'></i>
              Start Shopping
            </Button>
          </LinkContainer>

        </div>

      )}

    </div>
  )
}

export default MyOrdersScreen