import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder } from '../actions/orderActions'

const PlaceOrderScreen = ({ history, location }) => {
  const dispatch = useDispatch()

  // Track only a NEW Place Order click.
  // This prevents an old Redux success state from redirecting again
  // when returning from Order Details.
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const cart = useSelector((state) => state.cart)

  // =========================
  // PRICE CALCULATION
  // =========================

  const addDecimals = (num) => {
    return (
      Math.round(Number(num || 0) * 100) / 100
    ).toFixed(2)
  }

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
    Number(itemsPrice) > 100 ? 0 : 100
  )

  const taxPrice = addDecimals(
    Number(
      (0.08 * Number(itemsPrice)).toFixed(2)
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
    if (isPlacingOrder && success && order) {
      history.replace({
        pathname: `/order/${order._id}`,
        state: { fromOrder: true },
      })
    }
  }, [history, success, order, isPlacingOrder])

  // =========================
  // PLACE ORDER
  // =========================

  const placeOrderHandler = () => {
    setIsPlacingOrder(true)

    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    )
  }

  return (
    <div className='cartnova-place-order-page'>

      {/* CHECKOUT STEPS */}
      <div className='cartnova-checkout-steps-wrapper'>
        <CheckoutSteps
          step1
          step2
          step3
          step4
        />
      </div>

      {/* PAGE HEADER */}
      <div className='cartnova-place-order-header'>

        <div>
          <span>FINAL STEP</span>

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

      {/* MAIN CONTENT */}
      <div className='cartnova-place-order-layout'>

        {/* LEFT CONTENT */}
        <div className='cartnova-place-order-main'>

          {/* SHIPPING */}
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

            </div>

            <div className='cartnova-review-content'>

              <strong>
                {cart.shippingAddress?.address ||
                  'Address not available'}
              </strong>

              <p>
                {cart.shippingAddress?.city || ''}
                {cart.shippingAddress?.city &&
                  cart.shippingAddress?.state
                  ? ', '
                  : ''}
                {cart.shippingAddress?.state || ''}
              </p>

              <p>
                {cart.shippingAddress?.postalCode ||
                  cart.shippingAddress?.pincode ||
                  ''}
              </p>

              <p>
                Phone:{' '}
                {cart.shippingAddress?.phone ||
                  cart.shippingAddress?.phoneNumber ||
                  cart.shippingAddress?.mobile ||
                  cart.shippingAddress?.mobileNumber ||
                  'Not provided'}
              </p>
            </div>

          </div>

          {/* PAYMENT METHOD */}
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

            </div>

            <div className='cartnova-review-content'>

              <strong>
                {cart.paymentMethod || 'Not selected'}
              </strong>

            </div>

          </div>

          {/* ORDER ITEMS */}
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
                    Products in your order
                  </span>
                </div>

              </div>

            </div>

            <div className='cartnova-order-items-list'>

              {cart.cartItems.length === 0 ? (

                <Message variant='danger'>
                  Your cart is empty.
                </Message>

              ) : (

                cart.cartItems.map((item) => (

                  <div
                    className='cartnova-place-order-item'
                    key={item.product}
                  >

                    <Link
                      to={`/product/${item.product}`}
                    >
                      <Image
                        src={
                          item.image?.startsWith('http')
                            ? item.image
                            : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${item.image}`
                        }
                        alt={item.name}
                        className='cartnova-place-order-item-image'
                      />
                    </Link>

                    <div className='cartnova-place-order-item-info'>

                      <Link
                        to={`/product/${item.product}`}
                        className='cartnova-place-order-item-name'
                      >
                        {item.name}
                      </Link>

                      <span>
                        {item.qty} × ₹
                        {Number(item.price).toFixed(2)}
                      </span>

                    </div>

                    <strong className='cartnova-place-order-item-total'>
                      ₹
                      {(
                        Number(item.price || 0) *
                        Number(item.qty || 0)
                      ).toFixed(2)}
                    </strong>

                  </div>

                ))

              )}

            </div>

          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <div className='cartnova-place-order-sidebar'>

          <div className='cartnova-order-summary-card'>

            <div className='cartnova-order-summary-header'>

              <h2>
                Order Summary
              </h2>

            </div>

            <div className='cartnova-order-summary-row'>
              <span>
                Items
              </span>

              <strong>
                ₹{itemsPrice}
              </strong>
            </div>

            <div className='cartnova-order-summary-row'>
              <span>
                Shipping
              </span>

              <strong>
                ₹{shippingPrice}
              </strong>
            </div>

            <div className='cartnova-order-summary-row'>
              <span>
                Tax
              </span>

              <strong>
                ₹{taxPrice}
              </strong>
            </div>

            <div className='cartnova-order-summary-total'>

              <span>
                Total
              </span>

              <strong>
                ₹{totalPrice}
              </strong>

            </div>

            {error && (
              <div className='cartnova-place-order-error'>
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
              onClick={placeOrderHandler}
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

          {/* TRUST BOX */}
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