import React, { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { login } from '../actions/userActions'

const AdminLoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [accessDenied, setAccessDenied] = useState(false)

  const dispatch = useDispatch()
  const history = useHistory()

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin

  useEffect(() => {
    if (userInfo) {
      if (userInfo.isAdmin) {
        history.push('/admin/dashboard')
      } else {
        setAccessDenied(true)
        dispatch({ type: 'USER_LOGOUT' })
      }
    }
  }, [userInfo, history, dispatch])

  const submitHandler = (e) => {
    e.preventDefault()
    setAccessDenied(false)

    dispatch(login(email, password))
  }

  return (
    <div className='cartnova-admin-login-page'>

      <div className='cartnova-admin-login-card'>

        {/* ================= LEFT SIDE ================= */}

        <div className='cartnova-admin-login-left'>

          <div className='cartnova-admin-icon'>
            <i className='fas fa-user-shield'></i>
          </div>

          <h1>CartNova</h1>

          <div className='cartnova-admin-badge'>
            ADMIN PORTAL
          </div>

          <p>
            Secure access to your
            <br />
            CartNova administration panel.
          </p>

          <div className='cartnova-admin-features'>

            <div>
              <i className='fas fa-chart-line'></i>
              Dashboard Management
            </div>

            <div>
              <i className='fas fa-users'></i>
              User Management
            </div>

            <div>
              <i className='fas fa-box'></i>
              Product Management
            </div>

            <div>
              <i className='fas fa-shopping-bag'></i>
              Order Management
            </div>

          </div>

        </div>

        {/* ================= RIGHT SIDE ================= */}

        <div className='cartnova-admin-login-right'>

          <div className='cartnova-admin-heading'>

            <h2>Admin Login</h2>

            <p>
              Sign in to access the CartNova Admin Panel.
            </p>

          </div>

          {error && (
            <Message variant='danger'>
              {error}
            </Message>
          )}

          {accessDenied && (
            <Message variant='danger'>
              Access denied. Admin account required.
            </Message>
          )}

          {loading && <Loader />}

          <Form onSubmit={submitHandler}>

            {/* ================= EMAIL ================= */}

            <Form.Group
              controlId='email'
              className='cartnova-admin-form-group'
            >

              <Form.Label>
                <i className='fas fa-envelope'></i>{' '}
                Admin Email
              </Form.Label>

              <Form.Control
                type='email'
                placeholder='Enter admin email'
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
              className='cartnova-admin-form-group'
            >

              <Form.Label>
                <i className='fas fa-lock'></i>{' '}
                Password
              </Form.Label>

              <Form.Control
                type='password'
                placeholder='Enter admin password'
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

            </Form.Group>

            {/* ================= LOGIN BUTTON ================= */}

            <Button
              type='submit'
              className='cartnova-admin-login-button'
              disabled={loading}
            >
              <i className='fas fa-sign-in-alt'></i>{' '}
              {loading
                ? 'Signing In...'
                : 'Admin Login'}
            </Button>

          </Form>

          {/* ================= DIVIDER ================= */}

          <div className='cartnova-admin-divider'>
            <span>OR</span>
          </div>

          {/* ================= CUSTOMER LOGIN ================= */}

          <Link
            to='/login'
            className='cartnova-customer-login-button'
          >
            <i className='fas fa-user'></i>{' '}
            Customer Login
          </Link>

        </div>

      </div>

    </div>
  )
}

export default AdminLoginScreen