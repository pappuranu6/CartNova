import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Row,
  Col,
  Image,
  Form,
  Button,
} from 'react-bootstrap'

import Message from '../components/Message'
import {
  addToCart,
  removeFromCart,
} from '../actions/cartActions'

function commas(price) {
  return Number(price || 0).toLocaleString('en-IN')
}

const CartScreen = ({
  match,
  location,
  history,
}) => {
  const productId = match.params.id

  const qty = location.search
    ? Number(
        location.search.split('=')[1]
      )
    : 1

  const dispatch = useDispatch()

  const cart = useSelector(
    (state) => state.cart
  )

  const { cartItems } = cart

  useEffect(() => {
    if (productId) {
      dispatch(
        addToCart(productId, qty)
      )
    }
  }, [
    dispatch,
    productId,
    qty,
  ])

  const removeFromCartHandler = (id) => {
    dispatch(
      removeFromCart(id)
    )
  }

  const checkoutHandler = () => {
    history.push(
      '/login?redirect=shipping'
    )
  }

  const totalItems = cartItems.reduce(
    (acc, item) =>
      acc + item.qty,
    0
  )

  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc + item.qty * item.price,
    0
  )

  return (
    <div className='cartnova-cart-page'>

      {/* ================= HEADER ================= */}

      <div className='cartnova-cart-header'>

        <div>
          <span className='cartnova-cart-label'>
            CARTNOVA
          </span>

          <h1>
            Shopping Cart
          </h1>

          <p>
            Review your items before checkout.
          </p>
        </div>

        <div className='cartnova-cart-count'>
          <i className='fas fa-shopping-cart'></i>
          {totalItems} Items
        </div>

      </div>

      {cartItems.length === 0 ? (

        /* ================= EMPTY CART ================= */

        <div className='cartnova-empty-cart'>

          <div className='cartnova-empty-cart-icon'>
            <i className='fas fa-shopping-cart'></i>
          </div>

          <h2>
            Your Cart is Empty
          </h2>

          <p>
            Looks like you haven't added
            anything to your cart yet.
          </p>

          <Link
            to='/'
            className='cartnova-shop-now-btn'
          >
            <i className='fas fa-shopping-bag'></i>
            Continue Shopping
          </Link>

        </div>

      ) : (

        /* ================= CART CONTENT ================= */

        <Row className='cartnova-cart-layout'>

          {/* ================= ITEMS ================= */}

          <Col
            lg={8}
            className='mb-4'
          >

            <div className='cartnova-cart-items-card'>

              <div className='cartnova-cart-items-header'>

                <h3>
                  <i className='fas fa-box-open'></i>
                  Cart Items
                </h3>

                <span>
                  {totalItems}{' '}
                  {totalItems === 1
                    ? 'item'
                    : 'items'}
                </span>

              </div>

              <div className='cartnova-cart-items'>

                {cartItems.map(
                  (item) => (
                    <div
                      key={item.product}
                      className='cartnova-cart-item'
                    >

                      {/* IMAGE */}

                      <Link
                        to={`/product/${item.product}`}
                        className='cartnova-cart-image'
                      >
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                          />
                        ) : (
                          <div>
                            <i className='fas fa-image'></i>
                          </div>
                        )}
                      </Link>

                      {/* PRODUCT INFO */}

                      <div className='cartnova-cart-product'>

                        <Link
                          to={`/product/${item.product}`}
                          className='cartnova-cart-product-name'
                        >
                          {item.name}
                        </Link>

                        <span className='cartnova-cart-unit-price'>
                          ₹
                          {commas(
                            item.price
                          )}{' '}
                          / item
                        </span>

                        <div className='cartnova-cart-mobile-actions'>

                          <div className='cartnova-cart-quantity'>
                            <label>
                              Qty
                            </label>

                            <Form.Control
                              as='select'
                              value={item.qty}
                              onChange={(e) =>
                                dispatch(
                                  addToCart(
                                    item.product,
                                    Number(
                                      e.target.value
                                    )
                                  )
                                )
                              }
                            >
                              {[
                                ...Array(
                                  item.countInStock
                                ).keys(),
                              ].map((x) => (
                                <option
                                  key={x + 1}
                                  value={x + 1}
                                >
                                  {x + 1}
                                </option>
                              ))}
                            </Form.Control>
                          </div>

                          <button
                            type='button'
                            className='cartnova-remove-btn'
                            onClick={() =>
                              removeFromCartHandler(
                                item.product
                              )
                            }
                            title='Remove item'
                          >
                            <i className='fas fa-trash-alt'></i>
                          </button>

                        </div>

                      </div>

                      {/* DESKTOP QUANTITY */}

                      <div className='cartnova-cart-desktop-qty'>

                        <label>
                          Quantity
                        </label>

                        <Form.Control
                          as='select'
                          value={item.qty}
                          onChange={(e) =>
                            dispatch(
                              addToCart(
                                item.product,
                                Number(
                                  e.target.value
                                )
                              )
                            )
                          }
                        >
                          {[
                            ...Array(
                              item.countInStock
                            ).keys(),
                          ].map((x) => (
                            <option
                              key={x + 1}
                              value={x + 1}
                            >
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>

                      </div>

                      {/* SUBTOTAL */}

                      <div className='cartnova-item-subtotal'>

                        <span>
                          Subtotal
                        </span>

                        <strong>
                          ₹
                          {commas(
                            item.qty *
                              item.price
                          )}
                        </strong>

                      </div>

                      {/* DESKTOP REMOVE */}

                      <button
                        type='button'
                        className='cartnova-remove-desktop'
                        onClick={() =>
                          removeFromCartHandler(
                            item.product
                          )
                        }
                        title='Remove item'
                      >
                        <i className='fas fa-trash-alt'></i>
                      </button>

                    </div>
                  )
                )}

              </div>

            </div>

            <Link
              to='/'
              className='cartnova-continue-shopping'
            >
              <i className='fas fa-arrow-left'></i>
              Continue Shopping
            </Link>

          </Col>

          {/* ================= SUMMARY ================= */}

          <Col
            lg={4}
            className='mb-4'
          >

            <div className='cartnova-cart-summary'>

              <div className='cartnova-summary-header'>

                <div>
                  <i className='fas fa-receipt'></i>
                </div>

                <div>
                  <h3>
                    Order Summary
                  </h3>

                  <span>
                    Your cart total
                  </span>
                </div>

              </div>

              <div className='cartnova-summary-row'>
                <span>
                  Items
                </span>

                <strong>
                  {totalItems}
                </strong>
              </div>

              <div className='cartnova-summary-row'>
                <span>
                  Subtotal
                </span>

                <strong>
                  ₹
                  {commas(
                    subtotal
                  )}
                </strong>
              </div>

              <div className='cartnova-summary-divider'></div>

              <div className='cartnova-summary-total'>
                <span>
                  Total
                </span>

                <strong>
                  ₹
                  {commas(
                    subtotal
                  )}
                </strong>
              </div>

              <Button
                type='button'
                className='cartnova-checkout-btn'
                disabled={
                  cartItems.length === 0
                }
                onClick={
                  checkoutHandler
                }
              >
                Proceed to Checkout
                <i className='fas fa-arrow-right'></i>
              </Button>

              <div className='cartnova-checkout-note'>
                <i className='fas fa-lock'></i>
                Secure checkout
              </div>

            </div>

            {/* TRUST BOX */}

            <div className='cartnova-cart-trust'>

              <div>
                <i className='fas fa-shield-alt'></i>

                <span>
                  Secure Payment
                </span>
              </div>

              <div>
                <i className='fas fa-truck'></i>

                <span>
                  Fast Delivery
                </span>
              </div>

              <div>
                <i className='fas fa-headset'></i>

                <span>
                  Customer Support
                </span>
              </div>

            </div>

          </Col>

        </Row>
      )}

    </div>
  )
}

export default CartScreen