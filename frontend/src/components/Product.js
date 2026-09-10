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
  Random MRP hata diya gaya hai.
*/
function getMrp(price) {
  const currentPrice = Number(price || 0)

  if (currentPrice <= 0) {
    return 0
  }

  return Math.round(currentPrice * 1.25)
}

/*
  Stable offer:
  ₹0 product par NaN nahi aayega.
*/
function getOffer(price) {
  const currentPrice = Number(price || 0)

  if (currentPrice <= 0) {
    return 0
  }

  const mrpPrice = getMrp(currentPrice)

  return Math.round(
    ((mrpPrice - currentPrice) / mrpPrice) * 100
  )
}

const Product = ({ product }) => {
  const currentPrice = Number(product.price || 0)
  const mrpPrice = getMrp(currentPrice)
  const offerPercent = getOffer(currentPrice)

  // Live backend image URL
  const imageUrl = product.image?.startsWith('http')
    ? product.image
    : `https://cartnova-5dvn.onrender.com${product.image}`

  return (
    <Card className='cartnova-product-card'>

      {/* ================= IMAGE ================= */}

      <Link
        to={`/product/${product._id}`}
        className='cartnova-product-image-link'
      >
        <div className='cartnova-product-image-wrapper'>

          <span className='cartnova-deal-badge'>
            <i className='fas fa-bolt'></i>
            Today's Deal
          </span>

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

        {/* OFFER */}

        {offerPercent > 0 && (
          <div className='cartnova-offer'>

            <span>
              <i className='fas fa-fire'></i>
              Today's Deal
            </span>

            <strong>
              {offerPercent}% OFF
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
