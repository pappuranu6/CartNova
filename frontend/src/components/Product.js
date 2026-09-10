import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Rating from './Rating'

function numberWithCommas(price) {
  return Number(price || 0)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/*
  Stable MRP:
  Existing product pricing logic preserved.
*/
function getMrp(price) {
  const currentPrice = Number(price || 0)

  if (currentPrice <= 0) {
    return 0
  }

  return Math.round(currentPrice * 1.25)
}

/*
  Check whether Today's Deal is still live.
  Deal automatically becomes inactive after 24 hours.
*/
function isDealLive(product) {
  if (!product?.isDealActive) {
    return false
  }

  const discount = Number(product?.dealDiscount || 0)

  if (discount <= 0 || discount > 100) {
    return false
  }

  if (!product?.dealExpiresAt) {
    return false
  }

  return new Date(product.dealExpiresAt).getTime() > Date.now()
}

/*
  ================= IMAGE URL =================

  Local VS Code:
  http://localhost:5000/uploads/...

  Live Render:
  https://cartnova-5dvn.onrender.com/uploads/...

  If product.image is already a complete URL,
  use it directly.
*/
function getImageUrl(image) {
  if (!image) {
    return ''
  }

  // Already a complete URL
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image
  }

  // Use Render backend when REACT_APP_API_URL is available.
  // Otherwise use local backend.
  const backendUrl =
    process.env.REACT_APP_API_URL || 'http://localhost:5000'

  const cleanBackendUrl = backendUrl.replace(/\/$/, '')
  const cleanImagePath = image.startsWith('/')
    ? image
    : `/${image}`

  return `${cleanBackendUrl}${cleanImagePath}`
}

const Product = ({ product }) => {
  const currentPrice = Number(product.price || 0)
  const mrpPrice = getMrp(currentPrice)

  const dealLive = isDealLive(product)

  const dealDiscount = Number(
    product?.dealDiscount || 0
  )

  const imageUrl = getImageUrl(product.image)

  return (
    <Card className='cartnova-product-card'>

      {/* ================= IMAGE ================= */}

      <Link
        to={`/product/${product._id}`}
        className='cartnova-product-image-link'
      >
        <div className='cartnova-product-image-wrapper'>

          {/* TODAY'S DEAL BADGE */}

          {dealLive && (
            <span className='cartnova-deal-badge'>
              <i className='fas fa-bolt'></i>
              Today's Deal
            </span>
          )}

          {product.image ? (
            <Card.Img
              src={imageUrl}
              alt={product.name}
              className='cartnova-product-image'
            />
          ) : (
            <div className='cartnova-no-image'>
              <i className='fas fa-image'></i>
              <span>No Image</span>
            </div>
          )}

        </div>
      </Link>

      {/* ================= DETAILS ================= */}

      <Card.Body className='cartnova-product-body'>

        {/* PRODUCT NAME */}

        <Link
          to={`/product/${product._id}`}
          className='cartnova-product-title-link'
        >
          <Card.Title
            as='div'
            className='cartnova-product-title'
          >
            {product.name}
          </Card.Title>
        </Link>

        {/* RATING */}

        <Card.Text
          as='div'
          className='cartnova-product-rating'
        >
          <Rating
            value={product.rating || 0}
            text={`${product.numReviews || 0} reviews`}
          />
        </Card.Text>

        {/* PRICE */}

        <div className='cartnova-price-row'>

          <span className='cartnova-current-price'>
            ₹{numberWithCommas(currentPrice)}
          </span>

          {mrpPrice > currentPrice && (
            <span className='cartnova-mrp'>
              ₹{numberWithCommas(mrpPrice)}
            </span>
          )}

        </div>

        {/* TODAY'S DEAL */}

        {dealLive && (
          <div className='cartnova-offer'>

            <span>
              <i className='fas fa-fire'></i>
              Today's Deal
            </span>

            <strong>
              {dealDiscount}% OFF
            </strong>

          </div>
        )}

        {/* VIEW PRODUCT */}

        <Link
          to={`/product/${product._id}`}
          className='cartnova-product-btn'
        >
          View Product
          <i className='fas fa-arrow-right'></i>
        </Link>

      </Card.Body>

    </Card>
  )
}

export default Product