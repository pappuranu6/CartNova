import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'

import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import HeroSection from './home/HeroSection'
import CategorySection from './home/CategorySection'
import Meta from '../components/Meta'

import { listProducts } from '../actions/productActions'

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword
  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  const productList = useSelector(
    (state) => state.productList
  )

  const {
    loading,
    error,
    products,
    page,
    pages,
  } = productList

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber))
  }, [dispatch, keyword, pageNumber])

  return (
    <>
      <Meta />

      {/* ================= HERO + CATEGORY ================= */}

      {!keyword ? (
        <>
          <HeroSection />
          <CategorySection />
        </>
      ) : (
        <div className='cartnova-search-header'>
          <Link
            to='/'
            className='cartnova-search-back'
          >
            <i className='fas fa-arrow-left'></i>
            Back to Home
          </Link>

          <div className='cartnova-search-title'>
            <i className='fas fa-search'></i>

            <div>
              <h1>
                Search Results
              </h1>

              <p>
                Showing products for{' '}
                <strong>
                  "{keyword}"
                </strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= PRODUCTS HEADER ================= */}

      <div className='cartnova-products-heading'>
        <div>
          <span className='cartnova-section-label'>
            CARTNOVA STORE
          </span>

          <h1>
            Today's Deals
          </h1>

          <p>
            Discover amazing products at great prices.
          </p>
        </div>

        {!loading &&
          !error &&
          products &&
          products.length > 0 && (
            <div className='cartnova-product-count'>
              <i className='fas fa-box-open'></i>

              {products.length} Products
            </div>
          )}
      </div>

      {/* ================= PRODUCTS ================= */}

      {loading ? (
        <div className='cartnova-home-loader'>
          <Loader />
        </div>
      ) : error ? (
        <Message variant='danger'>
          {error}
        </Message>
      ) : products &&
        products.length > 0 ? (
        <>
         <Row className="cartnova-product-grid g-4">
            {products.map((product) => (
              <Col
                key={product._id}
                xs={12}
                sm={6}
                lg={4}
                xl={3}
              >
                <Product product={product} />
              </Col>
            ))}

          </Row>

          {/* ================= PAGINATION ================= */}

          <div className='cartnova-home-pagination'>
            <Paginate
              pages={pages}
              page={page}
              keyword={
                keyword
                  ? keyword
                  : ''
              }
            />
          </div>
        </>
      ) : (
        <div className='cartnova-no-products-home'>

          <div className='cartnova-no-products-icon'>
            <i className='fas fa-search'></i>
          </div>

          <h3>
            No Products Found
          </h3>

          <p>
            We couldn't find any products
            matching your search.
          </p>

          <Link
            to='/'
            className='cartnova-browse-products-btn'
          >
            <i className='fas fa-shopping-bag'></i>
            Browse Products
          </Link>

        </div>
      )}
    </>
  )
}

export default HomeScreen