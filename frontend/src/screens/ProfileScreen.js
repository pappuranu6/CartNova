import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  getUserDetails,
  updateUserProfile,
} from '../actions/userActions'
import { listMyOrders } from '../actions/orderActions'

const ProfileScreen = ({ history }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()

  const userDetails = useSelector(
    (state) => state.userDetails
  )

  const {
    loading,
    error,
    user,
  } = userDetails

  const userLogin = useSelector(
    (state) => state.userLogin
  )

  const { userInfo } = userLogin

  const userUpdateProfile = useSelector(
    (state) => state.userUpdateProfile
  )

  const { success } = userUpdateProfile

  const orderListMy = useSelector(
    (state) => state.orderListMy
  )

  const {
    loading: loadingOrders,
    error: errorOrders,
    orders,
  } = orderListMy

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    } else {
      if (!user || !user.name) {
        dispatch(getUserDetails('profile'))
        dispatch(listMyOrders())
      } else {
        setName(user.name)
        setEmail(user.email)
      }
    }
  }, [
    dispatch,
    history,
    userInfo,
    user,
  ])

  const submitHandler = (e) => {
    e.preventDefault()

    if (!user) {
      setMessage(
        'User details not loaded'
      )
    } else {
      dispatch(
        updateUserProfile({
          id: user._id,
          name,
          email,
        })
      )
    }
  }

  return (
    <div className='cartnova-profile-page'>

      {/* ================= PAGE HEADER ================= */}

      <div className='cartnova-profile-header'>

        <div>
          <span>
            ACCOUNT
          </span>

          <h1>
            My Profile
          </h1>

          <p>
            Manage your account information
            and view your recent orders.
          </p>
        </div>

        <div className='cartnova-profile-header-icon'>
          <i className='fas fa-user'></i>
        </div>

      </div>

      {/* ================= PROFILE LAYOUT ================= */}

      <div className='cartnova-profile-layout'>

        {/* ================= PROFILE CARD ================= */}

        <div className='cartnova-profile-card'>

          <div className='cartnova-profile-card-top'>

            <div className='cartnova-profile-avatar'>
              <i className='fas fa-user'></i>
            </div>

            <div className='cartnova-profile-user-info'>

              <h2>
                {name || 'Your Profile'}
              </h2>

              <span>
                {email || 'Account information'}
              </span>

            </div>

          </div>

          {/* MESSAGES */}

          {message && (
            <div className='cartnova-profile-message'>
              <Message variant='danger'>
                {message}
              </Message>
            </div>
          )}

          {error && (
            <div className='cartnova-profile-message'>
              <Message variant='danger'>
                {error}
              </Message>
            </div>
          )}

          {success && (
            <div className='cartnova-profile-message'>
              <Message variant='success'>
                Profile Updated
              </Message>
            </div>
          )}

          {/* LOADER */}

          {loading ? (

            <div className='cartnova-profile-loader'>
              <Loader />
            </div>

          ) : (

            <Form
              onSubmit={submitHandler}
              className='cartnova-profile-form'
            >

              {/* NAME */}

              <Form.Group
                controlId='name'
                className='cartnova-profile-form-group'
              >
                <Form.Label>
                  <i className='fas fa-user'></i>
                  Full Name
                </Form.Label>

                <Form.Control
                  type='text'
                  placeholder='Enter your name'
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                />
              </Form.Group>

              {/* EMAIL */}

              <Form.Group
                controlId='email'
                className='cartnova-profile-form-group'
              >
                <Form.Label>
                  <i className='fas fa-envelope'></i>
                  Email Address
                </Form.Label>

                <Form.Control
                  type='email'
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                />
              </Form.Group>

              {/* UPDATE BUTTON */}

              <Button
                type='submit'
                className='cartnova-profile-update-button'
              >
                <i className='fas fa-save'></i>
                Update Profile
              </Button>

            </Form>

          )}

          {/* PASSWORD */}

          <div className='cartnova-profile-password'>

            <div className='cartnova-profile-password-icon'>
              <i className='fas fa-lock'></i>
            </div>

            <div>
              <strong>
                Password & Security
              </strong>

              <span>
                Reset your password securely
                using OTP verification.
              </span>
            </div>

            <Link
              to='/forgotpassword'
              className='cartnova-profile-password-link'
            >
              Reset
              <i className='fas fa-arrow-right'></i>
            </Link>

          </div>

        </div>

        {/* ================= ORDERS CARD ================= */}

        <div className='cartnova-profile-orders-card'>

          <div className='cartnova-profile-orders-header'>

            <div className='cartnova-profile-orders-title'>

              <div className='cartnova-profile-orders-icon'>
                <i className='fas fa-shopping-bag'></i>
              </div>

              <div>
                <h2>
                  My Orders
                </h2>

                <span>
                  Your recent order history
                </span>
              </div>

            </div>

            <Link
              to='/myorders'
              className='cartnova-profile-view-all'
            >
              View All
              <i className='fas fa-arrow-right'></i>
            </Link>

          </div>

          {loadingOrders ? (

            <div className='cartnova-profile-orders-loader'>
              <Loader />
            </div>

          ) : errorOrders ? (

            <div className='cartnova-profile-orders-message'>
              <Message variant='danger'>
                {errorOrders}
              </Message>
            </div>

          ) : orders && orders.length > 0 ? (

            <div className='cartnova-profile-orders-list'>

              {orders.slice(0, 5).map(
                (order) => (

                  <div
                    className='cartnova-profile-order-row'
                    key={order._id}
                  >

                    {/* ID */}

                    <div className='cartnova-profile-order-id-box'>

                      <span>
                        ORDER
                      </span>

                      <strong>
                        #{order._id.slice(-8)}
                      </strong>

                    </div>

                    {/* DATE */}

                    <div className='cartnova-profile-order-date'>

                      <span>
                        DATE
                      </span>

                      <strong>
                        {order.createdAt
                          ? order.createdAt.substring(
                              0,
                              10
                            )
                          : '-'}
                      </strong>

                    </div>

                    {/* TOTAL */}

                    <div className='cartnova-profile-order-total'>

                      <span>
                        TOTAL
                      </span>

                      <strong>
                        ₹{order.totalPrice}
                      </strong>

                    </div>

                    {/* STATUS */}

                    <div className='cartnova-profile-order-status'>

                      {order.isPaid ? (

                        <span className='cartnova-profile-status paid'>
                          <i className='fas fa-check-circle'></i>
                          Paid
                        </span>

                      ) : (

                        <span className='cartnova-profile-status unpaid'>
                          <i className='fas fa-clock'></i>
                          Unpaid
                        </span>

                      )}

                      {order.isDelivered ? (

                        <span className='cartnova-profile-status delivered'>
                          <i className='fas fa-check-circle'></i>
                          Delivered
                        </span>

                      ) : (

                        <span className='cartnova-profile-status pending'>
                          <i className='fas fa-truck'></i>
                          Pending
                        </span>

                      )}

                    </div>

                    {/* DETAILS */}

                    <Link
                      to={`/order/${order._id}`}
                      className='cartnova-profile-order-details'
                    >
                      <i className='fas fa-eye'></i>
                    </Link>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className='cartnova-profile-no-orders'>

              <div>
                <i className='fas fa-shopping-bag'></i>
              </div>

              <h3>
                No Orders Yet
              </h3>

              <p>
                Your recent orders will
                appear here.
              </p>

              <Link
                to='/'
                className='cartnova-profile-shop-button'
              >
                <i className='fas fa-shopping-cart'></i>
                Start Shopping
              </Link>

            </div>

          )}

        </div>

      </div>

    </div>
  )
}

export default ProfileScreen