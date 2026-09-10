import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from 'react-bootstrap'

import Rating from '../components/Rating'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Meta from '../components/Meta'

import {
  listProductDetails,
  createProductReview,
} from '../actions/productActions'

import {
  PRODUCT_CREATE_REVIEW_RESET,
} from '../constants/productConstants'

const ProductScreen = ({ history, match }) => {
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const dispatch = useDispatch()

  const productDetails = useSelector(
    (state) => state.productDetails
  )

  const {
    loading,
    error,
    product,
  } = productDetails

  const userLogin = useSelector(
    (state) => state.userLogin
  )

  const { userInfo } = userLogin

  const productReviewCreate = useSelector(
    (state) => state.productReviewCreate
  )

  const {
    success: successProductReview,
    error: errorProductReview,
  } = productReviewCreate

  // =========================
  // LOAD PRODUCT
  // =========================

  useEffect(() => {
    if (successProductReview) {
      alert('Review Submitted!')

      setRating(0)
      setComment('')

      dispatch({
        type: PRODUCT_CREATE_REVIEW_RESET,
      })
    }

    dispatch(
      listProductDetails(match.params.id)
    )
  }, [
    dispatch,
    match,
    successProductReview,
  ])

  // =========================
  // ADD TO CART
  // =========================

  const addToCartHandler = () => {
    history.push(
      `/cart/${match.params.id}?qty=${qty}`
    )
  }

  // =========================
  // REVIEW
  // =========================

  const submitHandler = (e) => {
    e.preventDefault()

    dispatch(
      createProductReview(
        match.params.id,
        {
          rating,
          comment,
        }
      )
    )
  }

  // =========================
  // PRICE
  // =========================

  const numberWithCommas = (price) => {
    return Number(price || 0)
      .toLocaleString('en-IN')
  }

  const currentPrice = Number(
    product?.price || 0
  )

  const mrpPrice =
    currentPrice > 0
      ? Math.round(currentPrice * 1.3)
      : 0

  /*
    Today's Deal check.

    Deal will only show when:
    1. Admin has turned it ON
    2. Discount is between 1 and 100
    3. dealExpiresAt exists
    4. Current time is before expiry
  */

  const dealDiscount = Number(
    product?.dealDiscount || 0
  )

  const isDealLive =
    Boolean(product?.isDealActive) &&
    dealDiscount > 0 &&
    dealDiscount <= 100 &&
    product?.dealExpiresAt &&
    new Date(product.dealExpiresAt).getTime() >
      Date.now()

  /*
    =========================
    IMAGE URL
    =========================

    Local VS Code:
    http://localhost:5000/uploads/...

    Live Render:
    https://cartnova-5dvn.onrender.com/uploads/...

    If image is already a complete URL,
    it will be used directly.
  */

  const getImageUrl = (image) => {
    if (!image) {
      return ''
    }

    if (
      image.startsWith('http://') ||
      image.startsWith('https://')
    ) {
      return image
    }

    const backendUrl =
      process.env.REACT_APP_API_URL ||
      'http://localhost:5000'

    const cleanBackendUrl =
      backendUrl.replace(/\/$/, '')

    const cleanImagePath =
      image.startsWith('/')
        ? image
        : `/${image}`

    return `${cleanBackendUrl}${cleanImagePath}`
  }

  const imageUrl = getImageUrl(product?.image)

  return (
    <>
      {loading ? (
        <div className='cartnova-product-loader'>
          <Loader />
        </div>
      ) : error ? (
        <Message variant='danger'>
          {error}
        </Message>
      ) : (
        <>
          <Meta title={product.name} />

          {/* ================= BACK BUTTON ================= */}

          <Link
            className='cartnova-product-back'
            to='/'
          >
            <i className='fas fa-arrow-left'></i>
            Back to Products
          </Link>

          {/* ================= PRODUCT DETAILS ================= */}

          <div className='cartnova-product-details'>

            {/* IMAGE */}

            <div className='cartnova-product-details-image'>

              {/* TODAY'S DEAL BADGE */}

              {isDealLive && (
                <div className='cartnova-details-deal'>
                  <i className='fas fa-bolt'></i>
                  Today's Deal
                </div>
              )}

              {product.image ? (
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fluid
                />
              ) : (
                <div className='cartnova-details-no-image'>
                  <i className='fas fa-image'></i>
                  <span>No Image Available</span>
                </div>
              )}

            </div>

            {/* INFORMATION */}

            <div className='cartnova-product-details-info'>

              <div className='cartnova-details-category'>
                <i className='fas fa-tag'></i>
                CartNova Product
              </div>

              <h1>
                {product.name}
              </h1>

              {/* RATING */}

              <div className='cartnova-details-rating'>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </div>

              {/* PRICE */}

              <div className='cartnova-details-price-box'>

                <div className='cartnova-details-price'>
                  ₹
                  {numberWithCommas(
                    currentPrice
                  )}
                </div>

                {mrpPrice >
                  currentPrice && (
                  <div className='cartnova-details-mrp'>
                    MRP:
                    <span>
                      ₹
                      {numberWithCommas(
                        mrpPrice
                      )}
                    </span>
                  </div>
                )}

                {/* ADMIN SELECTED DEAL */}

                {isDealLive && (
                  <span className='cartnova-details-offer'>
                    {dealDiscount}% OFF
                  </span>
                )}

              </div>

              {/* DESCRIPTION */}

              <div className='cartnova-details-description'>

                <h4>
                  <i className='fas fa-info-circle'></i>
                  Product Description
                </h4>

                <p>
                  {product.description}
                </p>

              </div>

              {/* FEATURES */}

              <div className='cartnova-details-features'>

                <div>
                  <i className='fas fa-shield-alt'></i>
                  <span>
                    Secure Shopping
                  </span>
                </div>

                <div>
                  <i className='fas fa-truck'></i>
                  <span>
                    Fast Delivery
                  </span>
                </div>

                <div>
                  <i className='fas fa-check-circle'></i>
                  <span>
                    Quality Product
                  </span>
                </div>

              </div>

            </div>

            {/* PURCHASE CARD */}

            <div className='cartnova-product-purchase'>

              <div className='cartnova-purchase-price'>
                <span>
                  Price
                </span>

                <strong>
                  ₹
                  {numberWithCommas(
                    currentPrice
                  )}
                </strong>
              </div>

              {/* DEAL INFO */}

              {isDealLive && (
                <div
                  style={{
                    marginTop: '10px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: '#ecfdf5',
                    color: '#047857',
                    fontWeight: 600,
                    fontSize: '14px',
                  }}
                >
                  <i className='fas fa-bolt'></i>{' '}
                  Today's Deal - {dealDiscount}% OFF
                </div>
              )}

              <div className='cartnova-purchase-divider'></div>

              {/* STOCK */}

              <div className='cartnova-purchase-stock'>

                <span>
                  Availability
                </span>

                {product.countInStock > 0 ? (
                  <strong className='in-stock'>
                    <i className='fas fa-check-circle'></i>
                    In Stock
                  </strong>
                ) : (
                  <strong className='out-stock'>
                    <i className='fas fa-times-circle'></i>
                    Out of Stock
                  </strong>
                )}

              </div>

              {/* QUANTITY */}

              {product.countInStock > 0 && (
                <div className='cartnova-purchase-qty'>

                  <label>
                    Quantity
                  </label>

                  <Form.Control
                    as='select'
                    value={qty}
                    onChange={(e) =>
                      setQty(
                        Number(
                          e.target.value
                        )
                      )
                    }
                  >
                    {[
                      ...Array(
                        product.countInStock
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
              )}

              {/* ADD TO CART */}

              <Button
                onClick={
                  addToCartHandler
                }
                className='cartnova-add-cart-btn'
                type='button'
                disabled={
                  product.countInStock === 0
                }
              >
                <i className='fas fa-shopping-cart'></i>

                {product.countInStock > 0
                  ? 'Add To Cart'
                  : 'Out of Stock'}
              </Button>

              <div className='cartnova-secure-note'>
                <i className='fas fa-lock'></i>
                Secure & Safe Checkout
              </div>

            </div>

          </div>

          {/* ================= REVIEWS ================= */}

          <div className='cartnova-reviews-section'>

            <div className='cartnova-reviews-header'>

              <div>
                <span>
                  CUSTOMER FEEDBACK
                </span>

                <h2>
                  Reviews
                </h2>
              </div>

              <div className='cartnova-review-count'>
                <i className='fas fa-star'></i>
                {product.numReviews || 0}
                {' '}
                Reviews
              </div>

            </div>

            <div className='cartnova-reviews-content'>

              {/* REVIEW LIST */}

              <div className='cartnova-review-list'>

                {product.reviews.length === 0 ? (
                  <div className='cartnova-no-reviews'>

                    <div>
                      <i className='far fa-comment-dots'></i>
                    </div>

                    <h4>
                      No Reviews Yet
                    </h4>

                    <p>
                      Be the first customer
                      to share your experience.
                    </p>

                  </div>
                ) : (
                  <ListGroup variant='flush'>

                    {product.reviews.map(
                      (review) => (
                        <ListGroup.Item
                          key={review._id}
                          className='cartnova-review-item'
                        >

                          <div className='cartnova-review-user'>

                            <div className='cartnova-review-avatar'>
                              <i className='fas fa-user'></i>
                            </div>

                            <div>
                              <strong>
                                {review.name}
                              </strong>

                              <span>
                                {new Date(
                                  review.createdAt
                                ).toLocaleDateString(
                                  'en-IN'
                                )}
                              </span>
                            </div>

                          </div>

                          <Rating
                            value={
                              review.rating
                            }
                          />

                          <p>
                            {review.comment}
                          </p>

                        </ListGroup.Item>
                      )
                    )}

                  </ListGroup>
                )}

              </div>

              {/* WRITE REVIEW */}

              <div className='cartnova-write-review'>

                <div className='cartnova-write-review-heading'>

                  <div>
                    <i className='fas fa-pen'></i>
                  </div>

                  <div>
                    <h3>
                      Share Your Feedback
                    </h3>

                    <p>
                      Your feedback helps
                      other customers.
                    </p>
                  </div>

                </div>

                {errorProductReview && (
                  <Message variant='danger'>
                    {errorProductReview}
                  </Message>
                )}

                {userInfo ? (
                  <Form
                    onSubmit={submitHandler}
                  >

                    <Form.Group
                      controlId='rating'
                      className='cartnova-review-form-group'
                    >
                      <Form.Label>
                        Rating
                      </Form.Label>

                      <Form.Control
                        as='select'
                        value={rating}
                        onChange={(e) =>
                          setRating(
                            Number(
                              e.target.value
                            )
                          )
                        }
                        required
                      >
                        <option value=''>
                          Select Rating...
                        </option>

                        <option value='1'>
                          1 - Poor
                        </option>

                        <option value='2'>
                          2 - Fair
                        </option>

                        <option value='3'>
                          3 - Good
                        </option>

                        <option value='4'>
                          4 - Very Good
                        </option>

                        <option value='5'>
                          5 - Excellent
                        </option>

                      </Form.Control>

                    </Form.Group>

                    <Form.Group
                      controlId='comment'
                      className='cartnova-review-form-group'
                    >
                      <Form.Label>
                        Your Comment
                      </Form.Label>

                      <Form.Control
                        as='textarea'
                        rows='4'
                        placeholder='Share your experience with this product...'
                        value={comment}
                        onChange={(e) =>
                          setComment(
                            e.target.value
                          )
                        }
                        required
                      />

                    </Form.Group>

                    <Button
                      type='submit'
                      className='cartnova-review-submit'
                    >
                      <i className='fas fa-paper-plane'></i>
                      Submit Review
                    </Button>

                  </Form>
                ) : (
                  <Message>
                    Please{' '}
                    <Link to='/login'>
                      sign in
                    </Link>{' '}
                    to write a review.
                  </Message>
                )}

              </div>

            </div>

          </div>

        </>
      )}
    </>
  )
}

export default ProductScreen