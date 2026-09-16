import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import Message from '../components/Message'
import Loader from '../components/Loader'

import {
  listProductDetails,
  updateProduct,
} from '../actions/productActions'

import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)

  // Today's Deal
  const [isDealActive, setIsDealActive] = useState(false)
  const [dealDiscount, setDealDiscount] = useState(0)

  const dispatch = useDispatch()

  const productDetails = useSelector(
    (state) => state.productDetails
  )

  const {
    loading,
    error,
    product,
  } = productDetails

  const productUpdate = useSelector(
    (state) => state.productUpdate
  )

  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate

  // =========================
  // LOAD PRODUCT
  // =========================
  useEffect(() => {
    if (successUpdate) {
      dispatch({
        type: PRODUCT_UPDATE_RESET,
      })

      history.push('/admin/productlist')
    } else {
      if (
        !product ||
        !product.name ||
        product._id !== productId
      ) {
        dispatch(listProductDetails(productId))
      } else {
        setName(product.name)
        setPrice(product.price)
        setImage(product.image)
        setBrand(product.brand)
        setCategory(product.category)
        setCountInStock(product.countInStock)
        setDescription(product.description)

        // Today's Deal data
        const dealStillActive =
          Boolean(product.isDealActive) &&
          Number(product.dealDiscount) > 0 &&
          product.dealExpiresAt &&
          new Date(product.dealExpiresAt).getTime() > Date.now()

        setIsDealActive(dealStillActive)
        setDealDiscount(
          dealStillActive
            ? Number(product.dealDiscount)
            : 0
        )
      }
    }
  }, [
    dispatch,
    history,
    productId,
    product,
    successUpdate,
  ])

  // =========================
  // IMAGE UPLOAD
  // =========================
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]

    if (!file) {
      return
    }

    const formData = new FormData()
    formData.append('image', file)

    try {
      setUploading(true)

      const { data } = await axios.post(
        '/api/upload',
        formData
      )

      if (data.image) {
        setImage(data.image)
      } else {
        alert('Image upload failed')
      }

      setUploading(false)
    } catch (error) {
      console.error('UPLOAD ERROR:', error)

      alert(
        error.response?.data?.message ||
          'Image upload failed'
      )

      setUploading(false)
    }
  }

  // =========================
  // SUBMIT
  // =========================
  const submitHandler = (e) => {
    e.preventDefault()

    if (!image) {
      alert('Please upload an image first')
      return
    }

    if (!category) {
      alert('Please select a category')
      return
    }

    // Deal validation
    if (isDealActive) {
      const discount = Number(dealDiscount)

      if (
        !discount ||
        discount <= 0 ||
        discount > 100
      ) {
        alert(
          'Please enter a discount between 1% and 100%'
        )
        return
      }
    }

    /*
      IMPORTANT:
      Agar existing deal abhi live hai,
      to product edit karne par uska 24-hour timer
      reset nahi hoga.

      Agar deal OFF se ON ho raha hai,
      to new 24-hour timer start hoga.
    */

    const existingDealStillActive =
      Boolean(product?.isDealActive) &&
      Number(product?.dealDiscount) > 0 &&
      product?.dealExpiresAt &&
      new Date(product.dealExpiresAt).getTime() > Date.now()

    let finalDealStartedAt = null
    let finalDealExpiresAt = null
    let finalDealDiscount = 0

    if (isDealActive) {
      finalDealDiscount = Number(dealDiscount)

      if (
        existingDealStillActive &&
        product?.dealStartedAt &&
        product?.dealExpiresAt
      ) {
        // Existing timer continue
        finalDealStartedAt = product.dealStartedAt
        finalDealExpiresAt = product.dealExpiresAt
      } else {
        // New 24-hour deal
        finalDealStartedAt =
          new Date().toISOString()

        finalDealExpiresAt =
          new Date(
            Date.now() + 24 * 60 * 60 * 1000
          ).toISOString()
      }
    }

    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,

        // Today's Deal
        isDealActive,
        dealDiscount: finalDealDiscount,
        dealStartedAt: finalDealStartedAt,
        dealExpiresAt: finalDealExpiresAt,
      })
    )
  }

  return (
    <div className='cartnova-admin-product-edit-page'>

      {/* =========================
          BACK BUTTON
      ========================= */}

      <Link
        to='/admin/productlist'
        className='cartnova-product-edit-back'
      >
        <i className='fas fa-arrow-left'></i>{' '}
        Back to Products
      </Link>

      {/* =========================
          MAIN CARD
      ========================= */}

      <div className='cartnova-product-edit-card'>

        {/* =========================
            LEFT SIDE
        ========================= */}

        <div className='cartnova-product-edit-left'>

          <div className='cartnova-product-edit-icon'>
            <i className='fas fa-box-open'></i>
          </div>

          <h1>Edit Product</h1>

          <p>
            Update your product information,
            <br />
            pricing and inventory details.
          </p>

          {/* PRODUCT PREVIEW */}

          {image && (
            <div className='cartnova-product-preview'>
              <img
                src={
                  image?.startsWith('http')
                    ? image
                    : `https://cartnova-5dvn.onrender.com${image}`
                }
                alt={name || 'Product'}
              />

              <div className='cartnova-product-preview-info'>
                <strong>
                  {name || 'Product Preview'}
                </strong>

                {price > 0 && (
                  <span>
                    ₹{Number(price).toLocaleString('en-IN')}
                  </span>
                )}

                {isDealActive &&
                  Number(dealDiscount) > 0 && (
                    <small>
                      Today's Deal - {dealDiscount}% OFF
                    </small>
                  )}
              </div>
            </div>
          )}

          <div className='cartnova-product-edit-features'>

            <div>
              <i className='fas fa-image'></i>
              Product Image
            </div>

            <div>
              <i className='fas fa-tags'></i>
              Pricing & Category
            </div>

            <div>
              <i className='fas fa-boxes'></i>
              Inventory Management
            </div>

          </div>

        </div>

        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className='cartnova-product-edit-right'>

          <div className='cartnova-product-edit-heading'>

            <h2>
              Product Information
            </h2>

            <p>
              Update the details of this product.
            </p>

          </div>

          {loadingUpdate && <Loader />}

          {errorUpdate && (
            <Message variant='danger'>
              {errorUpdate}
            </Message>
          )}

          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>
              {error}
            </Message>
          ) : (
            <Form onSubmit={submitHandler}>

              {/* =========================
                  PRODUCT NAME
              ========================= */}

              <Form.Group
                controlId='name'
                className='cartnova-product-edit-form-group'
              >
                <Form.Label>
                  <i className='fas fa-box'></i>{' '}
                  Product Name
                </Form.Label>

                <Form.Control
                  type='text'
                  placeholder='Enter product name'
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                />
              </Form.Group>

              {/* =========================
                  PRICE + STOCK
              ========================= */}

              <div className='cartnova-product-edit-row'>

                <Form.Group
                  controlId='price'
                  className='cartnova-product-edit-form-group'
                >
                  <Form.Label>
                    <i className='fas fa-rupee-sign'></i>{' '}
                    Price
                  </Form.Label>

                  <Form.Control
                    type='number'
                    placeholder='Enter price'
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value)
                    }
                    min='0'
                    required
                  />
                </Form.Group>

                <Form.Group
                  controlId='countInStock'
                  className='cartnova-product-edit-form-group'
                >
                  <Form.Label>
                    <i className='fas fa-cubes'></i>{' '}
                    Stock
                  </Form.Label>

                  <Form.Control
                    type='number'
                    placeholder='Enter stock'
                    value={countInStock}
                    onChange={(e) =>
                      setCountInStock(
                        e.target.value
                      )
                    }
                    min='0'
                    required
                  />
                </Form.Group>

              </div>

              {/* =========================
                  TODAY'S DEAL
              ========================= */}

              <div
                className='cartnova-deal-admin-box'
                style={{
                  marginBottom: '20px',
                  padding: '20px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '14px',
                  background: '#f8fafc',
                }}
              >

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '15px',
                    marginBottom: isDealActive
                      ? '18px'
                      : '0',
                  }}
                >

                  <div>
                    <h4
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        fontSize: '17px',
                      }}
                    >
                      <i
                        className='fas fa-bolt'
                        style={{
                          marginRight: '8px',
                        }}
                      ></i>
                      Today's Deal
                    </h4>

                    <small
                      style={{
                        color: '#6b7280',
                      }}
                    >
                      Activate a special discount
                      for this product
                    </small>
                  </div>

                  <Form.Check
                    type='switch'
                    id='deal-switch'
                    checked={isDealActive}
                    onChange={(e) =>
                      setIsDealActive(
                        e.target.checked
                      )
                    }
                    style={{
                      transform: 'scale(1.25)',
                    }}
                  />

                </div>

                {isDealActive && (
                  <div>

                    <Form.Group
                      controlId='dealDiscount'
                      style={{ marginBottom: 0 }}
                    >

                      <Form.Label
                        style={{
                          fontWeight: 600,
                        }}
                      >
                        <i className='fas fa-percent'></i>{' '}
                        Discount Percentage
                      </Form.Label>

                      <Form.Control
                        type='number'
                        placeholder='Example: 20'
                        value={dealDiscount}
                        onChange={(e) =>
                          setDealDiscount(
                            e.target.value
                          )
                        }
                        min='1'
                        max='100'
                        step='1'
                        required={isDealActive}
                      />

                      <small
                        style={{
                          display: 'block',
                          marginTop: '7px',
                          color: '#6b7280',
                        }}
                      >
                        Enter any discount from 1% to
                        100%. The deal will automatically
                        expire after 24 hours.
                      </small>

                    </Form.Group>

                    {Number(dealDiscount) > 0 && (
                      <div
                        style={{
                          marginTop: '15px',
                          padding: '12px 14px',
                          borderRadius: '10px',
                          background: '#ecfdf5',
                          color: '#047857',
                          fontWeight: 600,
                        }}
                      >
                        <i className='fas fa-bolt'></i>{' '}
                        Today's Deal -{' '}
                        {dealDiscount}% OFF
                      </div>
                    )}

                  </div>
                )}

              </div>

              {/* =========================
                  IMAGE
              ========================= */}

              <Form.Group
                controlId='image'
                className='cartnova-product-edit-form-group'
              >
                <Form.Label>
                  <i className='fas fa-image'></i>{' '}
                  Product Image
                </Form.Label>

                <Form.Control
                  type='text'
                  placeholder='Enter image URL'
                  value={image}
                  onChange={(e) =>
                    setImage(e.target.value)
                  }
                />

                <div className='cartnova-upload-divider'>
                  <span>OR</span>
                </div>

                <div className='cartnova-file-upload'>
                  <i className='fas fa-cloud-upload-alt'></i>

                  <div>
                    <strong>
                      Upload New Image
                    </strong>

                    <small>
                      Select an image from your computer
                    </small>
                  </div>

                  <Form.Control
                    type='file'
                    id='image-file'
                    onChange={
                      uploadFileHandler
                    }
                  />
                </div>

                {uploading && (
                  <div className='cartnova-uploading'>
                    <Loader />

                    <span>
                      Uploading image...
                    </span>
                  </div>
                )}

              </Form.Group>

              {/* =========================
                  BRAND
              ========================= */}

              <Form.Group
                controlId='brand'
                className='cartnova-product-edit-form-group'
              >
                <Form.Label>
                  <i className='fas fa-copyright'></i>{' '}
                  Brand
                </Form.Label>

                <Form.Control
                  type='text'
                  placeholder='Enter brand'
                  value={brand}
                  onChange={(e) =>
                    setBrand(e.target.value)
                  }
                  required
                />
              </Form.Group>

              {/* =========================
                  CATEGORY
              ========================= */}

              <Form.Group
                controlId='category'
                className='cartnova-product-edit-form-group'
              >
                <Form.Label>
                  <i className='fas fa-tag'></i>{' '}
                  Category
                </Form.Label>

                <Form.Control
                  as='select'
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  required
                >
                  <option value=''>
                    Select Category
                  </option>

                  <option value='Electronics'>
                    Electronics
                  </option>

                  <option value='Fashion'>
                    Fashion
                  </option>

                  <option value='Laptops'>
                    Laptops
                  </option>

                  <option value='Home & Living'>
                    Home & Living
                  </option>

                  <option value='Shoes'>
                    Shoes
                  </option>


                  <option value='Books'>
                    Books
                  </option>
                </Form.Control>
              </Form.Group>

              {/* =========================
                  DESCRIPTION
              ========================= */}

              <Form.Group
                controlId='description'
                className='cartnova-product-edit-form-group'
              >
                <Form.Label>
                  <i className='fas fa-align-left'></i>{' '}
                  Description
                </Form.Label>

                <Form.Control
                  as='textarea'
                  rows='4'
                  placeholder='Enter product description'
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  required
                />
              </Form.Group>

              {/* =========================
                  UPDATE BUTTON
              ========================= */}

              <Button
                type='submit'
                className='cartnova-product-update-button'
                disabled={
                  loadingUpdate ||
                  uploading
                }
              >
                <i className='fas fa-save'></i>{' '}

                {loadingUpdate
                  ? 'Updating Product...'
                  : 'Update Product'}
              </Button>

            </Form>
          )}

        </div>

      </div>

    </div>
  )
}

export default ProductEditScreen