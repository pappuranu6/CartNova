import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { register } from '../actions/userActions'

const RegisterScreen = ({ location, history }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()

  const userRegister = useSelector(
    (state) => state.userRegister
  )

  const { loading, error, userInfo } = userRegister

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

    setMessage(null)

    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else if (!phone) {
      setMessage('Please enter your mobile number')
    } else {
      dispatch(
        register(
          name,
          email,
          password,
          phone
        )
      )
    }
  }

  return (
    <div className='cartnova-register-page'>

      <div className='cartnova-register-card'>

        {/* ================= LEFT SIDE ================= */}

        <div className='cartnova-register-left'>

          <div className='cartnova-register-icon'>
            <i className='fas fa-user-plus'></i>
          </div>

          <h1>Join CartNova</h1>

          <p>
            Create your account and start
            <br />
            your shopping journey today.
          </p>

          <div className='cartnova-register-features'>

            <div>
              <i className='fas fa-check-circle'></i>
              Easy & Secure Signup
            </div>

            <div>
              <i className='fas fa-check-circle'></i>
              Exclusive Shopping
            </div>

            <div>
              <i className='fas fa-check-circle'></i>
              Fast & Reliable Service
            </div>

          </div>

        </div>

        {/* ================= RIGHT SIDE ================= */}

        <div className='cartnova-register-right'>

          <div className='cartnova-register-heading'>

            <h2>Create Account</h2>

            <p>
              Fill in your details to get started.
            </p>

          </div>

          {message && (
            <Message variant='danger'>
              {message}
            </Message>
          )}

          {error && (
            <Message variant='danger'>
              {error}
            </Message>
          )}

          {loading && <Loader />}

          <Form onSubmit={submitHandler}>

            {/* ================= NAME ================= */}

            <Form.Group
              controlId='name'
              className='cartnova-register-form-group'
            >

              <Form.Label>
                <i className='fas fa-user'></i>{' '}
                Full Name
              </Form.Label>

              <Form.Control
                type='text'
                placeholder='Enter your name'
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />

            </Form.Group>

            {/* ================= EMAIL ================= */}

            <Form.Group
              controlId='email'
              className='cartnova-register-form-group'
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

            {/* ================= MOBILE ================= */}

            <Form.Group
              controlId='phone'
              className='cartnova-register-form-group'
            >

              <Form.Label>
                <i className='fas fa-mobile-alt'></i>{' '}
                Mobile Number
              </Form.Label>

              <Form.Control
                type='tel'
                placeholder='Enter 10-digit mobile number'
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                required
              />

              <Form.Text className='cartnova-phone-help'>
                Enter your 10-digit mobile number
              </Form.Text>

            </Form.Group>

            {/* ================= PASSWORD ================= */}

            <Form.Group
              controlId='password'
              className='cartnova-register-form-group'
            >

              <Form.Label>
                <i className='fas fa-lock'></i>{' '}
                Password
              </Form.Label>

              <Form.Control
                type='password'
                placeholder='Enter password'
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

            </Form.Group>

            {/* ================= CONFIRM PASSWORD ================= */}

            <Form.Group
              controlId='confirmPassword'
              className='cartnova-register-form-group'
            >

              <Form.Label>
                <i className='fas fa-lock'></i>{' '}
                Confirm Password
              </Form.Label>

              <Form.Control
                type='password'
                placeholder='Confirm your password'
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />

            </Form.Group>

            {/* ================= REGISTER BUTTON ================= */}

            <Button
              type='submit'
              className='cartnova-register-button'
              disabled={loading}
            >
              <i className='fas fa-user-plus'></i>{' '}
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

          </Form>

          {/* ================= LOGIN ================= */}

          <div className='cartnova-register-login'>

            Already have an account?{' '}

            <Link
              to={
                redirect
                  ? `/login?redirect=${redirect}`
                  : '/login'
              }
            >
              Sign In
            </Link>

          </div>

        </div>

      </div>

    </div>
  )
}

export default RegisterScreen