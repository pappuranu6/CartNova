import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder } from '../actions/orderActions'

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch()

  const cart = useSelector(
    (state) => state.cart
  )

  // =========================
  // PRICE CALCULATION
  // =========================

  const addDecimals = (num) => {
    return (
      Math.round(
        Number(num || 0) * 100
      ) / 100
    ).toFixed(2)
  }

  /*
    Cart mein item.price already final
    customer price hai.

    Example:
    Original = ₹1000
    Deal 20%
    item.price = ₹800
  */

  const itemsPrice = addDecimals(
    cart.cartItems.reduce(
      (acc, item) =>
        acc +
        Number(item.price || 0) *
          Number(item.qty || 0),
      0
    )
  )

  const shippingPrice = addDecimals(
    Number(itemsPrice) > 100
      ? 0
      : 100
  )

  const taxPrice = addDecimals(
    Number(
      (
        0.08 *
        Number(itemsPrice)
      ).toFixed(2)
    )
  )

  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2)

  // =========================
  // ORDER CREATE
  // =========================

  const orderCreate = useSelector(
    (state) => state.orderCreate
  )

  const {
    order,
    success,
    error,
  } = orderCreate

  useEffect(() => {
    if (success) {
      history.push(
        `/order/${order._id}`
      )
    }

    // eslint-disable-next-line
  }, [history, success])

  // =========================
  // PLACE ORDER
  // =========================

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress:
          cart.shippingAddress,
        paymentMethod:
          cart.paymentMethod,

        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    )
  }

  return (
    <div className='cartnova-place-order-page'>

      {/* =========================
          CHECKOUT STEPS
      ========================= */}

      <div className='cartnova-checkout-steps-wrapper'>
        <CheckoutSteps
          step1
          step2
          step3
          step4
        />
      </div>

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className='cartnova-place-order-header'>

        <div>
          <span>
            FINAL STEP
          </span>

          <h1>
            Review & Place Order
          </h1>

          <p>
            Please review your order details
            before placing your order.
          </p>
        </div>

        <div className='cartnova-place-order-header-icon'>
          <i className='fas fa-clipboard-check'></i>
        </div>

      </div>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <div className='cartnova-place-order-layout'>

        {/* =========================
            LEFT CONTENT
        ========================= */}

        <div className='cartnova-place-order-main'>

          {/* =========================
              SHIPPING
          ========================= */}

          <div className='cartnova-review-card'>

            <div className='cartnova-review-card-header'>

              <div className='cartnova-review-title'>

                <div className='cartnova-review-icon'>
                  <i className='fas fa-map-marker-alt'></i>
                </div>

                <div>
                  <h2>
                    Shipping Address
                  </h2>

                  <span>
                    Delivery information
                  </span>
                </div>

              </div>

              <Link
                to='/shipping'
                className='cartnova-review-edit'
              >
                <i className='fas fa-pen'></i>
                Edit
              </Link>

            </div>

            <div className='cartnova-review-content'>

              <p>
                <strong>
                  Address
                </strong>
              </p>

              <p className='cartnova-address-text'>
                {cart.shippingAddress.address},{' '}
                {cart.shippingAddress.city}{' '}
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </p>

            </div>

          </div>

          {/* =========================
              PAYMENT METHOD
          ========================= */}

          <div className='cartnova-review-card'>

            <div className='cartnova-review-card-header'>

              <div className='cartnova-review-title'>

                <div className='cartnova-review-icon'>
                  <i className='fas fa-credit-card'></i>
                </div>

                <div>
                  <h2>
                    Payment Method
                  </h2>

                  <span>
                    Selected payment option
                  </span>
                </div>

              </div>

              <Link
                to='/payment'
                className='cartnova-review-edit'
              >
                <i className='fas fa-pen'></i>
                Edit
              </Link>

            </div>

            <div className='cartnova-review-content'>

              <div className='cartnova-payment-method-display'>

                <div className='cartnova-payment-method-icon'>
                  <i className='fas fa-credit-card'></i>
                </div>

                <div>
                  <strong>
                    {cart.paymentMethod}
                  </strong>

                  <span>
                    Secure payment via Razorpay
                  </span>
                </div>

                <i className='fas fa-check-circle'></i>

              </div>

            </div>

          </div>

          {/* =========================
              ORDER ITEMS
          ========================= */}

          <div className='cartnova-review-card'>

            <div className='cartnova-review-card-header'>

              <div className='cartnova-review-title'>

                <div className='cartnova-review-icon'>
                  <i className='fas fa-shopping-bag'></i>
                </div>

                <div>
                  <h2>
                    Order Items
                  </h2>

                  <span>
                    {cart.cartItems.length} item
                    {cart.cartItems.length !== 1
                      ? 's'
                      : ''}
                  </span>
                </div>

              </div>

              <Link
                to='/cart'
                className='cartnova-review-edit'
              >
                <i className='fas fa-shopping-cart'></i>
                Cart
              </Link>

            </div>

            <div className='cartnova-order-items-list'>

              {cart.cartItems.length === 0 ? (

                <Message>
                  Your cart is empty
                </Message>

              ) : (

                cart.cartItems.map(
                  (item, index) => {

                    const dealLive =
                      Boolean(
                        item.isDealActive
                      ) &&
                      Number(
                        item.dealDiscount || 0
                      ) > 0 &&
                      item.dealExpiresAt &&
                      new Date(
                        item.dealExpiresAt
                      ).getTime() >
                        Date.now()

                    const originalPrice =
                      Number(
                        item.originalPrice ??
                          item.price ??
                          0
                      )

                    const finalPrice =
                      Number(
                        item.price || 0
                      )

                    const itemTotal =
                      finalPrice *
                      Number(item.qty || 0)

                    return (
                      <div
                        className='cartnova-place-order-item'
                        key={index}
                      >

                        {/* IMAGE */}

                        <Link
                          to={`/product/${item.product}`}
                          className='cartnova-place-order-item-image'
                        >
                          <Image
                            src={
                              item.image?.startsWith(
                                'http'
                              )
                                ? item.image
                                : `https://cartnova-5dvn.onrender.com${item.image}`
                            }
                            alt={item.name}
                          />
                        </Link>

                        {/* PRODUCT INFO */}

                        <div className='cartnova-place-order-item-info'>

                          <Link
                            to={`/product/${item.product}`}
                            className='cartnova-place-order-item-name'
                          >
                            {item.name}
                          </Link>

                          {/* PRICE */}

                          <span>
                            ₹{finalPrice.toLocaleString('en-IN')}
                            {' × '}
                            {item.qty}
                          </span>

                          {/* DEAL */}

                          {dealLive && (
                            <small
                              style={{
                                display: 'block',
                                marginTop: '5px',
                                color: '#047857',
                                fontWeight: 600,
                              }}
                            >
                              <i className='fas fa-bolt'></i>{' '}
                              {item.dealDiscount}% OFF
                            </small>
                          )}

                          {/* ORIGINAL PRICE */}

                          {dealLive &&
                            originalPrice >
                              finalPrice && (
                              <small
                                style={{
                                  display: 'block',
                                  color: '#6b7280',
                                  textDecoration:
                                    'line-through',
                                  marginTop: '2px',
                                }}
                              >
                                ₹
                                {originalPrice.toLocaleString(
                                  'en-IN'
                                )}
                              </small>
                            )}

                        </div>

                        {/* ITEM TOTAL */}

                        <div className='cartnova-place-order-item-total'>
                          ₹
                          {itemTotal.toLocaleString(
                            'en-IN',
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </div>

                      </div>
                    )
                  }
                )

              )}

            </div>

          </div>

        </div>

        {/* =========================
            RIGHT SUMMARY
        ========================= */}

        <div className='cartnova-place-order-sidebar'>

          <div className='cartnova-order-summary-card'>

            <div className='cartnova-summary-header'>

              <div>
                <span>
                  YOUR ORDER
                </span>

                <h2>
                  Order Summary
                </h2>
              </div>

              <i className='fas fa-receipt'></i>

            </div>

            <div className='cartnova-summary-lines'>

              {/* ITEMS */}

              <div>
                <span>
                  Items
                </span>

                <strong>
                  ₹{itemsPrice}
                </strong>
              </div>

              {/* SHIPPING */}

              <div>
                <span>
                  Shipping
                </span>

                <strong>
                  {Number(shippingPrice) === 0
                    ? 'FREE'
                    : `₹${shippingPrice}`}
                </strong>
              </div>

              {/* TAX */}

              <div>
                <span>
                  Tax
                </span>

                <strong>
                  ₹{taxPrice}
                </strong>
              </div>

            </div>

            <div className='cartnova-summary-divider'></div>

            {/* TOTAL */}

            <div className='cartnova-summary-total'>

              <span>
                Total
              </span>

              <strong>
                ₹{totalPrice}
              </strong>

            </div>

            {/* ERROR */}

            {error && (
              <div className='cartnova-order-error'>
                <Message variant='danger'>
                  {error}
                </Message>
              </div>
            )}

            {/* PLACE ORDER */}

            <Button
              type='button'
              className='cartnova-place-order-button'
              disabled={
                cart.cartItems.length === 0
              }
              onClick={
                placeOrderHandler
              }
            >
              <i className='fas fa-lock'></i>
              Place Order
              <i className='fas fa-arrow-right'></i>
            </Button>

            <div className='cartnova-order-secure'>

              <i className='fas fa-shield-alt'></i>

              <span>
                Secure checkout with
                protected payment
              </span>

            </div>

          </div>

          {/* =========================
              TRUST BOX
          ========================= */}

          <div className='cartnova-order-trust-box'>

            <div>
              <i className='fas fa-check-circle'></i>

              <span>
                Verified & Secure
              </span>
            </div>

            <div>
              <i className='fas fa-truck'></i>

              <span>
                Reliable Delivery
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default PlaceOrderScreen