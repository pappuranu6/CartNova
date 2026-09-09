import React, { useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Button, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from '../actions/orderActions'
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from '../constants/orderConstants'

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id

  const dispatch = useDispatch()

  const orderDetails = useSelector(
    (state) => state.orderDetails
  )

  const {
    order,
    loading,
    error,
  } = orderDetails

  const orderPay = useSelector(
    (state) => state.orderPay
  )

  const {
    loading: loadingPay,
    success: successPay,
  } = orderPay

  const orderDeliver = useSelector(
    (state) => state.orderDeliver
  )

  const {
    loading: loadingDeliver,
    success: successDeliver,
  } = orderDeliver

  const userLogin = useSelector(
    (state) => state.userLogin
  )

  const { userInfo } = userLogin

  if (!loading && order) {
    const addDecimals = (num) => {
      return (
        Math.round(num * 100) / 100
      ).toFixed(2)
    }

    order.itemsPrice = addDecimals(
      order.orderItems.reduce(
        (acc, item) =>
          acc + item.price * item.qty,
        0
      )
    )
  }

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
      return
    }

    if (
      !order ||
      successPay ||
      successDeliver
    ) {
      dispatch({
        type: ORDER_PAY_RESET,
      })

      dispatch({
        type: ORDER_DELIVER_RESET,
      })

      dispatch(
        getOrderDetails(orderId)
      )
    }
  }, [
    dispatch,
    orderId,
    successPay,
    successDeliver,
    order,
    userInfo,
    history,
  ])

  const paymentHandler = async () => {
    try {
      const { data: razorpayOrder } =
        await axios.post(
          '/api/payment/create',
          {
            amount: order.totalPrice,
          }
        )

      const options = {
        key:
          process.env
            .REACT_APP_RAZORPAY_KEY_ID,

        amount:
          razorpayOrder.amount,

        currency:
          razorpayOrder.currency,

        name: 'CartNova',

        description:
          `Order ${order._id}`,

        order_id:
          razorpayOrder.id,

        handler: async function (
          response
        ) {
          try {
            const { data } =
              await axios.post(
                '/api/payment/verify',
                {
                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,
                }
              )

            if (data.success) {
              const paymentResult = {
                id:
                  response.razorpay_payment_id,

                status:
                  'COMPLETED',

                update_time:
                  new Date().toISOString(),

                payer: {
                  email_address:
                    order.user.email,
                },
              }

              dispatch(
                payOrder(
                  orderId,
                  paymentResult
                )
              )
            }
          } catch (error) {
            alert(
              error.response?.data
                ?.message ||
                'Payment verification failed'
            )
          }
        },

        prefill: {
          name:
            order.user.name,

          email:
            order.user.email,
        },

        theme: {
          color: '#1677c8',
        },
      }

      const razorpay =
        new window.Razorpay(
          options
        )

      razorpay.open()
    } catch (error) {
      alert(
        error.response?.data
          ?.message ||
          'Unable to create payment order'
      )
    }
  }

  const deliverHandler = () => {
    dispatch(
      deliverOrder(order)
    )
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <div className='cartnova-order-page-message'>
      <Message variant='danger'>
        {error}
      </Message>
    </div>
  ) : (
    <div className='cartnova-order-page'>

      {/* ================= HEADER ================= */}

      <div className='cartnova-order-page-header'>

        <div>

          <Link
            to='/myorders'
            className='cartnova-order-back'
          >
            <i className='fas fa-arrow-left'></i>
            My Orders
          </Link>

          <span className='cartnova-order-label'>
            ORDER DETAILS
          </span>

          <h1>
            Order #{order._id.slice(-8)}
          </h1>

          <p>
            Complete details of your
            CartNova order.
          </p>

        </div>

        <div className='cartnova-order-header-icon'>
          <i className='fas fa-box-open'></i>
        </div>

      </div>

      {/* ================= STATUS ================= */}

      <div className='cartnova-order-status-bar'>

        <div className='cartnova-order-status-item'>

          <div className='cartnova-order-status-icon'>
            <i className='fas fa-credit-card'></i>
          </div>

          <div>
            <span>
              PAYMENT
            </span>

            <strong
              className={
                order.isPaid
                  ? 'success'
                  : 'danger'
              }
            >
              {order.isPaid
                ? 'Paid'
                : 'Not Paid'}
            </strong>
          </div>

        </div>

        <div className='cartnova-order-status-divider'></div>

        <div className='cartnova-order-status-item'>

          <div className='cartnova-order-status-icon'>
            <i className='fas fa-truck'></i>
          </div>

          <div>
            <span>
              DELIVERY
            </span>

            <strong
              className={
                order.isDelivered
                  ? 'success'
                  : 'danger'
              }
            >
              {order.isDelivered
                ? 'Delivered'
                : 'Pending'}
            </strong>
          </div>

        </div>

        <div className='cartnova-order-status-total'>

          <span>
            ORDER TOTAL
          </span>

          <strong>
            ₹{order.totalPrice}
          </strong>

        </div>

      </div>

      {/* ================= MAIN LAYOUT ================= */}

      <div className='cartnova-order-layout'>

        {/* LEFT */}

        <div className='cartnova-order-main'>

          {/* SHIPPING */}

          <div className='cartnova-order-card'>

            <div className='cartnova-order-card-header'>

              <div className='cartnova-order-card-title'>

                <div className='cartnova-order-card-icon'>
                  <i className='fas fa-map-marker-alt'></i>
                </div>

                <div>
                  <h2>
                    Shipping Information
                  </h2>

                  <span>
                    Delivery details
                  </span>
                </div>

              </div>

            </div>

            <div className='cartnova-order-card-content'>

              <div className='cartnova-customer-info'>

                <div>
                  <span>
                    CUSTOMER
                  </span>

                  <strong>
                    {order.user.name}
                  </strong>
                </div>

                <div>
                  <span>
                    EMAIL
                  </span>

                  <a
                    href={`mailto:${order.user.email}`}
                  >
                    {order.user.email}
                  </a>
                </div>

              </div>

              <div className='cartnova-order-address'>

                <span>
                  DELIVERY ADDRESS
                </span>

                <p>
                  {order.shippingAddress.address},{' '}
                  {order.shippingAddress.city}{' '}
                  {order.shippingAddress.postalCode},{' '}
                  {order.shippingAddress.country}
                </p>

              </div>

              <div
                className={
                  order.isDelivered
                    ? 'cartnova-order-alert success'
                    : 'cartnova-order-alert danger'
                }
              >
                <i
                  className={
                    order.isDelivered
                      ? 'fas fa-check-circle'
                      : 'fas fa-clock'
                  }
                ></i>

                <span>
                  {order.isDelivered
                    ? `Delivered on ${order.deliveredAt}`
                    : 'Your order has not been delivered yet.'}
                </span>
              </div>

            </div>

          </div>

          {/* PAYMENT */}

          <div className='cartnova-order-card'>

            <div className='cartnova-order-card-header'>

              <div className='cartnova-order-card-title'>

                <div className='cartnova-order-card-icon'>
                  <i className='fas fa-credit-card'></i>
                </div>

                <div>
                  <h2>
                    Payment Information
                  </h2>

                  <span>
                    Payment method & status
                  </span>
                </div>

              </div>

            </div>

            <div className='cartnova-order-card-content'>

              <div className='cartnova-payment-method-display'>

                <div className='cartnova-payment-method-icon'>
                  <i className='fas fa-credit-card'></i>
                </div>

                <div>
                  <strong>
                    {order.paymentMethod}
                  </strong>

                  <span>
                    CartNova secure payment
                  </span>
                </div>

                <span
                  className={
                    order.isPaid
                      ? 'cartnova-paid-badge'
                      : 'cartnova-unpaid-badge'
                  }
                >
                  {order.isPaid
                    ? 'PAID'
                    : 'UNPAID'}
                </span>

              </div>

              {order.isPaid ? (
                <div className='cartnova-order-alert success'>
                  <i className='fas fa-check-circle'></i>

                  <span>
                    Paid on {order.paidAt}
                  </span>
                </div>
              ) : (
                <div className='cartnova-order-alert danger'>
                  <i className='fas fa-exclamation-circle'></i>

                  <span>
                    Payment is pending for
                    this order.
                  </span>
                </div>
              )}

            </div>

          </div>

          {/* ORDER ITEMS */}

          <div className='cartnova-order-card'>

            <div className='cartnova-order-card-header'>

              <div className='cartnova-order-card-title'>

                <div className='cartnova-order-card-icon'>
                  <i className='fas fa-shopping-bag'></i>
                </div>

                <div>
                  <h2>
                    Order Items
                  </h2>

                  <span>
                    {order.orderItems.length} item
                    {order.orderItems.length !== 1
                      ? 's'
                      : ''}
                  </span>
                </div>

              </div>

            </div>

            <div className='cartnova-order-items'>

              {order.orderItems.length === 0 ? (

                <Message>
                  Order is empty
                </Message>

              ) : (

                order.orderItems.map(
                  (item, index) => (

                    <div
                      className='cartnova-order-item'
                      key={index}
                    >

                      <Link
                        to={`/product/${item.product}`}
                        className='cartnova-order-item-image'
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                        />
                      </Link>

                      <div className='cartnova-order-item-info'>

                        <Link
                          to={`/product/${item.product}`}
                          className='cartnova-order-item-name'
                        >
                          {item.name}
                        </Link>

                        <span>
                          ₹{item.price} × {item.qty}
                        </span>

                      </div>

                      <strong className='cartnova-order-item-total'>
                        ₹{(
                          item.qty *
                          item.price
                        ).toFixed(2)}
                      </strong>

                    </div>

                  )
                )

              )}

            </div>

          </div>

        </div>

        {/* RIGHT SIDEBAR */}

        <div className='cartnova-order-sidebar'>

          <div className='cartnova-order-summary'>

            <div className='cartnova-order-summary-header'>

              <div>
                <span>
                  PAYMENT SUMMARY
                </span>

                <h2>
                  Order Summary
                </h2>
              </div>

              <i className='fas fa-receipt'></i>

            </div>

            <div className='cartnova-order-summary-lines'>

              <div>
                <span>
                  Items
                </span>

                <strong>
                  ₹{order.itemsPrice}
                </strong>
              </div>

              <div>
                <span>
                  Shipping
                </span>

                <strong>
                  {Number(
                    order.shippingPrice
                  ) === 0
                    ? 'FREE'
                    : `₹${order.shippingPrice}`}
                </strong>
              </div>

              <div>
                <span>
                  Tax
                </span>

                <strong>
                  ₹{order.taxPrice}
                </strong>
              </div>

            </div>

            <div className='cartnova-order-summary-divider'></div>

            <div className='cartnova-order-grand-total'>

              <span>
                Total
              </span>

              <strong>
                ₹{order.totalPrice}
              </strong>

            </div>

            {/* PAY BUTTON */}

            {!order.isPaid && (

              <div className='cartnova-order-payment-action'>

                {loadingPay ? (

                  <Loader />

                ) : (

                  <Button
                    type='button'
                    className='cartnova-razorpay-button'
                    onClick={paymentHandler}
                  >
                    <i className='fas fa-credit-card'></i>
                    Pay with Razorpay
                  </Button>

                )}

              </div>

            )}

            {/* ADMIN DELIVERY */}

            {loadingDeliver && (
              <div className='cartnova-delivery-loader'>
                <Loader />
              </div>
            )}

            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (

                <div className='cartnova-admin-delivery-action'>

                  <div className='cartnova-admin-delivery-label'>
                    <i className='fas fa-user-shield'></i>

                    <span>
                      Admin Action
                    </span>
                  </div>

                  <Button
                    type='button'
                    className='cartnova-delivery-button'
                    onClick={deliverHandler}
                  >
                    <i className='fas fa-truck'></i>
                    Mark As Delivered
                  </Button>

                </div>

              )}

            {/* PAID COMPLETE */}

            {order.isPaid &&
              order.isDelivered && (

                <div className='cartnova-order-complete'>
                  <i className='fas fa-check-circle'></i>

                  <strong>
                    Order Complete
                  </strong>

                  <span>
                    Payment received and
                    order delivered.
                  </span>
                </div>

              )}

            <div className='cartnova-order-secure-note'>

              <i className='fas fa-shield-alt'></i>

              <span>
                Secure & protected CartNova
                transaction
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default OrderScreen