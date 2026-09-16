import React, { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listMyOrders } from '../actions/orderActions'
import jsPDF from 'jspdf'

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

  // =========================================================
  // DOWNLOAD INVOICE PDF
  // =========================================================

  const downloadInvoice = (order) => {
    if (!order) return

    // Invoice only after payment
    if (!order.isPaid) {
      alert('Invoice is available after successful payment.')
      return
    }

    const doc = new jsPDF()

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    const orderItems = Array.isArray(order.orderItems)
      ? order.orderItems
      : []

    // ---------------------------------------------------------
    // CALCULATE ITEMS PRICE
    // ---------------------------------------------------------

    const itemsPrice = orderItems.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.qty || 1),
      0
    )

    const shippingPrice = Number(
      order.shippingPrice || 0
    )

    const taxPrice = Number(
      order.taxPrice || 0
    )

    const totalPrice = Number(
      order.totalPrice ||
        itemsPrice +
          shippingPrice +
          taxPrice
    )

    // ---------------------------------------------------------
    // CUSTOMER DETAILS
    // ---------------------------------------------------------

    const customerName =
      order.user?.name ||
      userInfo?.name ||
      'Customer'

    const customerEmail =
      order.user?.email ||
      userInfo?.email ||
      ''

    // ---------------------------------------------------------
    // HEADER
    // ---------------------------------------------------------

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(24)
    doc.text('CartNova', 20, 25)

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(
      'Order Invoice',
      20,
      33
    )

    // Right side invoice information

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)

    doc.text(
      `Order #${String(
        order._id || ''
      ).slice(-8)}`,
      pageWidth - 20,
      24,
      { align: 'right' }
    )

    doc.setFont('helvetica', 'normal')

    doc.text(
      order.createdAt
        ? new Date(
            order.createdAt
          ).toLocaleDateString()
        : '-',
      pageWidth - 20,
      31,
      { align: 'right' }
    )

    // ---------------------------------------------------------
    // HEADER LINE
    // ---------------------------------------------------------

    doc.line(
      20,
      40,
      pageWidth - 20,
      40
    )

    // ---------------------------------------------------------
    // CUSTOMER / STATUS
    // ---------------------------------------------------------

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)

    doc.text(
      'Bill To',
      20,
      55
    )

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)

    doc.text(
      customerName,
      20,
      63
    )

    if (customerEmail) {
      doc.text(
        customerEmail,
        20,
        70
      )
    }

    // Payment status

    doc.setFont('helvetica', 'bold')

    doc.text(
      'Payment',
      pageWidth - 80,
      55
    )

    doc.setFont('helvetica', 'normal')

    doc.text(
      'Paid',
      pageWidth - 80,
      63
    )

    doc.setFont('helvetica', 'bold')

    doc.text(
      'Delivery',
      pageWidth - 80,
      72
    )

    doc.setFont('helvetica', 'normal')

    doc.text(
      order.isDelivered
        ? 'Delivered'
        : 'Processing',
      pageWidth - 80,
      80
    )

    // ---------------------------------------------------------
    // TABLE HEADER
    // ---------------------------------------------------------

    let y = 100

    doc.setFillColor(
      245,
      247,
      250
    )

    doc.rect(
      20,
      y - 7,
      pageWidth - 40,
      12,
      'F'
    )

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)

    doc.text(
      '#',
      23,
      y
    )

    doc.text(
      'Product',
      38,
      y
    )

    doc.text(
      'Qty',
      125,
      y
    )

    doc.text(
      'Price',
      145,
      y
    )

    doc.text(
      'Amount',
      175,
      y
    )

    y += 12

    // ---------------------------------------------------------
    // TABLE ITEMS
    // ---------------------------------------------------------

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)

    if (orderItems.length === 0) {

      doc.text(
        'No item details available',
        23,
        y
      )

      y += 12

    } else {

      orderItems.forEach(
        (item, index) => {

          // New page if required

          if (y > pageHeight - 40) {

            doc.addPage()

            y = 25

            doc.setFont(
              'helvetica',
              'bold'
            )

            doc.text(
              'CartNova - Order Invoice',
              20,
              y
            )

            y += 15

            doc.setFont(
              'helvetica',
              'normal'
            )
          }

          const name =
            item.name ||
            'Product'

          const qty =
            Number(item.qty || 1)

          const price =
            Number(item.price || 0)

          const amount =
            price * qty

          // Product name wrap

          const productLines =
            doc.splitTextToSize(
              name,
              78
            )

          doc.text(
            String(index + 1),
            23,
            y
          )

          doc.text(
            productLines,
            38,
            y
          )

          doc.text(
            String(qty),
            125,
            y
          )

          doc.text(
            `Rs. ${price.toFixed(2)}`,
            145,
            y
          )

          doc.text(
            `Rs. ${amount.toFixed(2)}`,
            175,
            y
          )

          y +=
            Math.max(
              10,
              productLines.length * 5
            )

          doc.line(
            20,
            y - 3,
            pageWidth - 20,
            y - 3
          )
        }
      )
    }

    // ---------------------------------------------------------
    // ORDER SUMMARY
    // ---------------------------------------------------------

    y += 12

    if (y > pageHeight - 80) {
      doc.addPage()
      y = 30
    }

    const summaryX = 135
    const valueX = pageWidth - 20

    doc.setFontSize(10)

    doc.setFont(
      'helvetica',
      'normal'
    )

    doc.text(
      'Items Price',
      summaryX,
      y
    )

    doc.text(
      `Rs. ${itemsPrice.toFixed(2)}`,
      valueX,
      y,
      { align: 'right' }
    )

    y += 8

    doc.text(
      'Shipping',
      summaryX,
      y
    )

    doc.text(
      `Rs. ${shippingPrice.toFixed(2)}`,
      valueX,
      y,
      { align: 'right' }
    )

    y += 8

    doc.text(
      'Tax',
      summaryX,
      y
    )

    doc.text(
      `Rs. ${taxPrice.toFixed(2)}`,
      valueX,
      y,
      { align: 'right' }
    )

    y += 6

    doc.line(
      summaryX,
      y,
      valueX,
      y
    )

    y += 10

    doc.setFont(
      'helvetica',
      'bold'
    )

    doc.setFontSize(13)

    doc.text(
      'Total',
      summaryX,
      y
    )

    doc.text(
      `Rs. ${totalPrice.toFixed(2)}`,
      valueX,
      y,
      { align: 'right' }
    )

    // ---------------------------------------------------------
    // FOOTER
    // ---------------------------------------------------------

    const footerY =
      pageHeight - 25

    doc.setFont(
      'helvetica',
      'normal'
    )

    doc.setFontSize(8)

    doc.text(
      'Thank you for shopping with CartNova.',
      pageWidth / 2,
      footerY,
      { align: 'center' }
    )

    doc.text(
      'Secure & trusted shopping experience.',
      pageWidth / 2,
      footerY + 6,
      { align: 'center' }
    )

    // ---------------------------------------------------------
    // SAVE PDF
    // ---------------------------------------------------------

    const shortOrderId =
      String(order._id || 'order')
        .slice(-8)

    doc.save(
      `CartNova-Invoice-${shortOrderId}.pdf`
    )
  }

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

          {/* ================= DESKTOP TABLE ================= */}

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
                          ? order.createdAt.substring(
                              0,
                              10
                            )
                          : '-'}

                      </span>

                    </td>

                    {/* TOTAL */}

                    <td>

                      <strong className='cartnova-my-order-total'>

                        ₹
                        {Number(
                          order.totalPrice || 0
                        ).toFixed(2)}

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

                    {/* ACTION */}

                    <td>

                      <div className='cartnova-my-order-actions'>

                        {/* DETAILS */}

                        <LinkContainer
                          to={`/order/${order._id}`}
                        >

                          <Button
                            type='button'
                            className='cartnova-my-order-details-btn'
                            title='View Order Details'
                          >

                            <i className='fas fa-eye'></i>

                            Details

                          </Button>

                        </LinkContainer>

                        {/* INVOICE */}

                        {order.isPaid && (

                          <Button
                            type='button'
                            className='cartnova-my-order-invoice-btn'
                            onClick={() =>
                              downloadInvoice(order)
                            }
                            title='Download Invoice'
                          >

                            <i className='fas fa-file-invoice'></i>

                            Invoice

                          </Button>

                        )}

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* ================= MOBILE ORDERS ================= */}

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

                    ₹
                    {Number(
                      order.totalPrice || 0
                    ).toFixed(2)}

                  </strong>

                </div>

                <div className='cartnova-mobile-order-date'>

                  <i className='far fa-calendar-alt'></i>

                  {order.createdAt
                    ? order.createdAt.substring(
                        0,
                        10
                      )
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

                {/* MOBILE ACTIONS */}

                <div className='cartnova-mobile-order-actions'>

                  <LinkContainer
                    to={`/order/${order._id}`}
                  >

                    <Button
                      type='button'
                      className='cartnova-mobile-order-details'
                    >

                      <i className='fas fa-eye'></i>

                      View Details

                    </Button>

                  </LinkContainer>

                  {order.isPaid && (

                    <Button
                      type='button'
                      className='cartnova-mobile-order-invoice'
                      onClick={() =>
                        downloadInvoice(order)
                      }
                    >

                      <i className='fas fa-file-invoice'></i>

                      Invoice

                    </Button>

                  )}

                </div>

              </div>

            ))}

          </div>

        </div>

      ) : (

        /* ================= EMPTY STATE ================= */

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