import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import { listTopProducts } from '../../actions/productActions'

const HeroSection = () => {
  const dispatch = useDispatch()

  const productTopRated = useSelector(
    (state) => state.productTopRated
  )

  const { loading, error, products } = productTopRated

  useEffect(() => {
    dispatch(listTopProducts())
  }, [dispatch])

  if (loading) {
    return <Loader />
  }

  if (error) {
    return <Message variant='danger'>{error}</Message>
  }

  return (
    <section className='cartnova-hero'>

      {/* LEFT CONTENT */}
      <div className='cartnova-hero-content'>

        <span className='cartnova-hero-label'>
          LIMITED TIME OFFER
        </span>

        <h1>
          Big Sale is <span>Live!</span>
        </h1>

        <h2>
          Up to <strong>50% OFF</strong> on Electronics
        </h2>

        <p>
          Top brands. Best prices. Shop now and save big!
        </p>

        <Link
          to='/search/electronics'
          className='cartnova-btn'
        >
          Shop Now →
        </Link>

      </div>

      {/* RIGHT PRODUCTS */}
      <div className='cartnova-hero-products'>

        {/* DISCOUNT BADGE */}
        <div className='cartnova-discount-badge'>
          <small>UP TO</small>
          <strong>50%</strong>
          <span>OFF</span>
        </div>

        {products && products.length > 0 ? (

          <Carousel
            controls={true}
            indicators={true}
            interval={4000}
            pause='hover'
            className='cartnova-hero-carousel'
          >

            {products.slice(0, 3).map((product) => (

              <Carousel.Item key={product._id}>

                <Link to={`/product/${product._id}`}>

                  <Image
                    src={
                      product.image?.startsWith('http')
                        ? product.image
                        : `https://cartnova-5dvn.onrender.com${product.image}`
                    }
                    alt={product.name}
                    className='cartnova-hero-image'
                  />

                </Link>

              </Carousel.Item>

            ))}

          </Carousel>

        ) : (

          <div className='cartnova-hero-empty'>
            No products available
          </div>

        )}

      </div>

    </section>
  )
}

export default HeroSection