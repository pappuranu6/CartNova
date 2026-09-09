import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'

import {
  listProducts,
  deleteProduct,
  createProduct,
} from '../actions/productActions'

import { PRODUCT_CREATE_RESET } from '../constants/productConstants'

const ProductListScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const {
    loading,
    error,
    products,
    page,
    pages,
  } = productList

  const productDelete = useSelector(
    (state) => state.productDelete
  )

  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete

  const productCreate = useSelector(
    (state) => state.productCreate
  )

  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate

  const userLogin = useSelector(
    (state) => state.userLogin
  )

  const { userInfo } = userLogin

  useEffect(() => {
    dispatch({
      type: PRODUCT_CREATE_RESET,
    })

    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login')
    }

    if (successCreate) {
      history.push(
        `/admin/product/${createdProduct._id}/edit`
      )
    } else {
      dispatch(
        listProducts('', pageNumber)
      )
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber,
  ])

  const deleteHandler = (id) => {
    if (
      window.confirm(
        'Are you sure you want to delete this product?'
      )
    ) {
      dispatch(deleteProduct(id))
    }
  }

  const createProductHandler = () => {
    dispatch(createProduct())
  }

  return (
    <div className='cartnova-admin-products-page'>

      {/* PAGE HEADER */}
      <div className='cartnova-admin-page-header'>

        <div>
          <h1>
            <i className='fas fa-box'></i>{' '}
            Products
          </h1>

          <p>
            Manage your CartNova product catalog.
          </p>
        </div>

        <Button
          className='cartnova-create-product-btn'
          onClick={createProductHandler}
          disabled={loadingCreate}
        >
          <i className='fas fa-plus'></i>{' '}
          {loadingCreate
            ? 'Creating...'
            : 'Create Product'}
        </Button>

      </div>

      {/* MESSAGES */}

      {loadingDelete && <Loader />}

      {errorDelete && (
        <Message variant='danger'>
          {errorDelete}
        </Message>
      )}

      {loadingCreate && <Loader />}

      {errorCreate && (
        <Message variant='danger'>
          {errorCreate}
        </Message>
      )}

      {/* PRODUCT LIST */}

      {loading ? (
        <div className='cartnova-admin-loader'>
          <Loader />
        </div>
      ) : error ? (
        <Message variant='danger'>
          {error}
        </Message>
      ) : (
        <div className='cartnova-products-card'>

          {/* CARD HEADER */}

          <div className='cartnova-products-card-header'>

            <div>
              <h3>
                <i className='fas fa-list'></i>{' '}
                Product List
              </h3>

              <span>
                Manage products, pricing and categories
              </span>
            </div>

            {products && (
              <div className='cartnova-product-count'>
                <i className='fas fa-boxes'></i>
                {products.length}
              </div>
            )}

          </div>

          {/* TABLE */}

          <div className='cartnova-products-table-wrapper'>

            <table className='cartnova-products-table'>

              <thead>
                <tr>
                  <th>ID</th>
                  <th>PRODUCT</th>
                  <th>PRICE</th>
                  <th>CATEGORY</th>
                  <th>BRAND</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>

                {products && products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product._id}>

                      {/* ID */}

                      <td>
                        <span className='cartnova-product-id'>
                          #{product._id.slice(-8)}
                        </span>
                      </td>

                      {/* PRODUCT */}

                      <td>
                        <div className='cartnova-product-info'>

                          <div className='cartnova-product-icon'>
                            <i className='fas fa-box'></i>
                          </div>

                          <span>
                            {product.name}
                          </span>

                        </div>
                      </td>

                      {/* PRICE */}

                      <td>
                        <span className='cartnova-product-price'>
                          ₹{product.price}
                        </span>
                      </td>

                      {/* CATEGORY */}

                      <td>
                        <span className='cartnova-product-category'>
                          <i className='fas fa-tag'></i>
                          {product.category}
                        </span>
                      </td>

                      {/* BRAND */}

                      <td>
                        <span className='cartnova-product-brand'>
                          {product.brand}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td>
                        <div className='cartnova-product-actions'>

                          <LinkContainer
                            to={`/admin/product/${product._id}/edit`}
                          >
                            <Button
                              className='cartnova-product-edit-btn'
                              title='Edit Product'
                            >
                              <i className='fas fa-edit'></i>
                            </Button>
                          </LinkContainer>

                          <Button
                            className='cartnova-product-delete-btn'
                            onClick={() =>
                              deleteHandler(product._id)
                            }
                            title='Delete Product'
                          >
                            <i className='fas fa-trash'></i>
                          </Button>

                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan='6'
                      className='cartnova-no-products'
                    >
                      <i className='fas fa-box-open'></i>

                      <h4>
                        No Products Found
                      </h4>

                      <p>
                        There are currently no products
                        in your catalog.
                      </p>
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

          {/* PAGINATION */}

          <div className='cartnova-products-pagination'>
            <Paginate
              pages={pages}
              page={page}
              isAdmin={true}
            />
          </div>

        </div>
      )}

    </div>
  )
}

export default ProductListScreen