import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { login } from '../actions/userActions'

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)

  const {
    loading,
    error,
    userInfo,
  } = userLogin

  const redirect = location.search
    ? location.search.split('=')[1]
    : '/'

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()

    dispatch(login(email, password))
  }

  return (
    <div className='cartnova-login-page'>

      <div className='cartnova-login-card'>

        {/* ================= LEFT SIDE ================= */}

        <div className='cartnova-login-left'>

          <div className='cartnova-login-icon'>
            <i className='fas fa-shopping-bag'></i>
          </div>

          <h1>CartNova</h1>

          <p>
            Your trusted destination for
            <br />
            seamless online shopping.
          </p>

          <div className='cartnova-login-features'>

            <div>
              <i className='fas fa-check-circle'></i>
              Quality Products
            </div>

            <div>
              <i className='fas fa-check-circle'></i>
              Secure Shopping
            </div>

            <div>
              <i className='fas fa-check-circle'></i>
              Fast & Reliable
            </div>

          </div>

        </div>

        {/* ================= RIGHT SIDE ================= */}

        <div className='cartnova-login-right'>

          <div className='cartnova-login-heading'>

            <h2>Welcome Back!</h2>

            <p>
              Sign in to continue shopping with CartNova.
            </p>

          </div>

          {/* ================= ERROR ================= */}

          {error && (
            <Message variant='danger'>
              {error}
            </Message>
          )}

          {/* ================= LOADER ================= */}

          {loading && <Loader />}

          {/* ================= LOGIN FORM ================= */}

          <Form onSubmit={submitHandler}>

            {/* ================= EMAIL ================= */}

            <Form.Group
              controlId='email'
              className='cartnova-login-form-group'
            >

              <Form.Label>
                <i className='fas fa-envelope'></i>{' '}
                Email Address
              </Form.Label>

              <Form.Control
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </Form.Group>

            {/* ================= PASSWORD ================= */}

            <Form.Group
              controlId='password'
              className='cartnova-login-form-group'
            >

              <Form.Label>
                <i className='fas fa-lock'></i>{' '}
                Password
              </Form.Label>

              <Form.Control
                type='password'
                placeholder='Enter your password'
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

            </Form.Group>

            {/* ================= FORGOT PASSWORD ================= */}

            <div className='cartnova-forgot'>

              <Link to='/forgotpassword'>
                Forgot Password?
              </Link>

            </div>

            {/* ================= SIGN IN ================= */}

            <Button
              type='submit'
              className='cartnova-signin-btn'
              disabled={loading}
            >

              <i className='fas fa-sign-in-alt'></i>{' '}

              {loading
                ? 'Signing In...'
                : 'Sign In'}

            </Button>

          </Form>

          {/* ================= REGISTER ================= */}

          <div className='cartnova-register'>

            New to CartNova?{' '}

            <Link
              to={
                redirect
                  ? `/register?redirect=${redirect}`
                  : '/register'
              }
            >
              Create an Account
            </Link>

          </div>

          {/* ================= DIVIDER ================= */}

          <div className='cartnova-login-divider'>
            <span>OR</span>
          </div>

          {/* ================= ADMIN LOGIN ================= */}

          <Link
            to='/admin/login'
            className='cartnova-admin-btn'
          >

            <i className='fas fa-user-shield'></i>{' '}
            Admin Login

          </Link>

        </div>

      </div>

    </div>
  )
}

export default LoginScreen