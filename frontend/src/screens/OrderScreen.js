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

const OrderScreen = ({ match, history, location }) => {
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

  // =========================================================
  // LOAD ORDER DETAILS
  // =========================================================
  // Always fetch when orderId changes so Admin Details buttons
  // open the correct order instead of the previously loaded one.
  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
      return
    }

    dispatch({
      type: ORDER_PAY_RESET,
    })

    dispatch({
      type: ORDER_DELIVER_RESET,
    })

    dispatch(getOrderDetails(orderId))
  }, [
    dispatch,
    orderId,
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
                    order.user?.email || '',
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
            order.user?.name || 'Unknown Customer',

          email:
            order.user?.email || '',
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


  // =========================================================
  // PROFESSIONAL INVOICE
  // =========================================================
  const printInvoice = () => {
    if (!order || !order.orderItems) return

    const money = (value) =>
      `₹${Number(value || 0).toFixed(2)}`

    const itemsPrice = order.orderItems.reduce(
      (total, item) =>
        total + Number(item.price || 0) * Number(item.qty || 0),
      0
    )

    const shippingPrice = Number(order.shippingPrice || 0)
    const taxPrice = Number(order.taxPrice || 0)
    const totalPrice = Number(
      order.totalPrice || itemsPrice + shippingPrice + taxPrice
    )

    const safe = (value) =>
      String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')

    const invoiceWindow = window.open('', '_blank', 'width=900,height=900')

    if (!invoiceWindow) {
      alert('Please allow pop-ups to print the invoice.')
      return
    }

    const rows = order.orderItems
      .map(
        (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${safe(item.name)}</td>
            <td class="center">${Number(item.qty || 0)}</td>
            <td class="right">${money(item.price)}</td>
            <td class="right">${money(
          Number(item.price || 0) * Number(item.qty || 0)
        )}</td>
          </tr>
        `
      )
      .join('')

    const paidStatus = order.isPaid ? 'PAID' : 'UNPAID'
    const deliveryStatus = order.isDelivered ? 'DELIVERED' : 'PENDING'

    invoiceWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>CartNova Invoice - ${safe(order._id)}</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 30px;
            background: #f3f6fa;
            color: #172033;
            font-family: Arial, Helvetica, sans-serif;
          }
          .invoice {
            max-width: 850px;
            margin: 0 auto;
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(20, 35, 60, .08);
          }
          .top {
            padding: 28px 30px 22px;
            display: flex;
            justify-content: space-between;
            gap: 25px;
            border-bottom: 1px solid #e5eaf0;
          }
          .brand {
            font-size: 28px;
            font-weight: 800;
            color: #1677c8;
            margin: 0;
          }
          .subtitle {
            margin: 5px 0 0;
            color: #64748b;
            font-size: 13px;
          }
          .invoice-title {
            text-align: right;
          }
          .invoice-title h2 {
            margin: 0;
            font-size: 20px;
            color: #172033;
          }
          .invoice-title p {
            margin: 5px 0 0;
            font-size: 12px;
            color: #64748b;
            word-break: break-all;
          }
          .section {
            padding: 22px 30px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .label {
            display: block;
            margin-bottom: 7px;
            color: #64748b;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: .8px;
          }
          .value {
            font-size: 14px;
            font-weight: 700;
            line-height: 1.5;
          }
          .muted {
            color: #64748b;
            font-size: 12px;
            line-height: 1.5;
          }
          .badges {
            display: flex;
            gap: 8px;
            margin-top: 12px;
          }
          .badge {
            display: inline-block;
            padding: 6px 10px;
            border-radius: 999px;
            font-size: 10px;
            font-weight: 800;
          }
          .paid { background: #e9f8ef; color: #16834a; }
          .unpaid { background: #fff1f1; color: #c62828; }
          .delivered { background: #eaf4ff; color: #1677c8; }
          .pending { background: #fff7e6; color: #a66a00; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 4px;
          }
          th {
            padding: 11px 10px;
            background: #f5f7fa;
            border-top: 1px solid #e2e8f0;
            border-bottom: 1px solid #e2e8f0;
            color: #475569;
            font-size: 11px;
            text-align: left;
          }
          td {
            padding: 13px 10px;
            border-bottom: 1px solid #edf1f5;
            font-size: 12px;
          }
          .center { text-align: center; }
          .right { text-align: right; }
          .summary {
            width: 310px;
            margin-left: auto;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            padding: 7px 0;
            color: #475569;
            font-size: 12px;
          }
          .summary-row strong {
            color: #172033;
          }
          .total {
            margin-top: 7px;
            padding-top: 12px;
            border-top: 2px solid #172033;
            font-size: 16px;
            font-weight: 800;
          }
          .total strong {
            color: #1677c8;
          }
          .footer {
            padding: 20px 30px 25px;
            background: #f8fafc;
            text-align: center;
            color: #64748b;
            font-size: 11px;
            border-top: 1px solid #e5eaf0;
          }
          .secure {
            margin-top: 7px;
            color: #16834a;
            font-weight: 700;
          }
          .actions {
            position: fixed;
            top: 18px;
            right: 18px;
          }
          .print-btn {
            border: 0;
            border-radius: 8px;
            background: #1677c8;
            color: white;
            padding: 10px 16px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
          }
          @media (max-width: 650px) {
            body { padding: 10px; }
            .top { padding: 20px; flex-direction: column; }
            .invoice-title { text-align: left; }
            .section { padding: 18px 20px; }
            .info-grid { grid-template-columns: 1fr; gap: 15px; }
            .summary { width: 100%; }
            table { min-width: 600px; }
            .table-wrap { overflow-x: auto; }
            .footer { padding: 18px 20px; }
            .actions { position: static; margin: 0 0 10px; }
          }
          @media print {
            body { padding: 0; background: #fff; }
            .invoice { max-width: none; border: 0; box-shadow: none; }
            .actions { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="actions">
          <button class="print-btn" onclick="window.print()">Print Invoice</button>
        </div>

        <div class="invoice">
          <div class="top">
            <div>
              <h1 class="brand">CartNova</h1>
              <p class="subtitle">Order Invoice</p>
            </div>
            <div class="invoice-title">
              <h2>INVOICE</h2>
              <p>Order #${safe(order._id)}</p>
              <p>${new Date().toLocaleDateString('en-IN')}</p>
            </div>
          </div>

          <div class="section">
            <div class="info-grid">
              <div>
                <span class="label">BILL TO</span>
                <div class="value">${safe(
      order.user?.name || 'Customer'
    )}</div>
                <div class="muted">${safe(
      order.user?.email || 'Email not available'
    )}</div>
              </div>

              <div>
                <span class="label">DELIVERY ADDRESS</span>
                <div class="muted">
                  ${safe(order.shippingAddress?.address || '')}<br />
                  ${safe(order.shippingAddress?.city || '')}
                  ${safe(order.shippingAddress?.postalCode || '')}<br />
                  ${safe(order.shippingAddress?.country || '')}
                </div>
              </div>
            </div>

            <div class="badges">
              <span class="badge ${order.isPaid ? 'paid' : 'unpaid'}">
                PAYMENT: ${paidStatus}
              </span>
              <span class="badge ${order.isDelivered ? 'delivered' : 'pending'
      }">
                DELIVERY: ${deliveryStatus}
              </span>
            </div>
          </div>

          <div class="section">
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th class="center">Qty</th>
                    <th class="right">Price</th>
                    <th class="right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows}
                </tbody>
              </table>
            </div>
          </div>

          <div class="section">
            <div class="summary">
              <div class="summary-row">
                <span>Items Price</span>
                <strong>${money(itemsPrice)}</strong>
              </div>
              <div class="summary-row">
                <span>Shipping</span>
                <strong>${shippingPrice === 0 ? 'FREE' : money(shippingPrice)
      }</strong>
              </div>
              <div class="summary-row">
                <span>Tax</span>
                <strong>${money(taxPrice)}</strong>
              </div>
              <div class="summary-row total">
                <span>Total</span>
                <strong>${money(totalPrice)}</strong>
              </div>
            </div>
          </div>

          <div class="footer">
            Thank you for shopping with CartNova.
            <div class="secure">Secure &amp; protected transaction</div>
          </div>
        </div>

        <script>
          window.onload = function () {
            setTimeout(function () {
              window.focus()
            }, 200)
          }
        </script>
      </body>
      </html>
    `)

    invoiceWindow.document.close()
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

          <button
            type='button'
            className='cartnova-order-back'
            onClick={() => {
              const fromOrder = location?.state?.fromOrder

              if (fromOrder) {
                history.replace({
                  pathname: '/placeorder',
                  state: { fromOrder: true },
                })
              } else {
                history.replace('/myorders')
              }
            }}
            aria-label='Go back'
          >
            <i className='fas fa-arrow-left'></i>
            Back
          </button>

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
                    {order.user?.name || 'Unknown Customer'}
                  </strong>
                </div>

                <div>
                  <span>
                    EMAIL
                  </span>

                  <a
                    href={`mailto:${order.user?.email || ''}`}
                  >
                    {order.user?.email || 'Email not available'}
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
                  ₹{order.orderItems
                    .reduce(
                      (acc, item) =>
                        acc +
                        Number(item.price || 0) *
                        Number(item.qty || 0),
                      0
                    )
                    .toFixed(2)}
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

            {/* INVOICE */}
            {/* INVOICE */}
            {order.isPaid && (
              <div className='cartnova-order-invoice-action'>
                <Button
                  type='button'
                  className='cartnova-invoice-button'
                  onClick={printInvoice}
                >
                  <i className='fas fa-file-invoice'></i>
                  Download Invoice
                </Button>
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