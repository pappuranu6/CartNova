import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { register } from '../actions/userActions'

const RegisterScreen = ({ location, history }) => {
  // ==================================================
  // REGISTRATION STATES
  // ==================================================

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [message, setMessage] = useState(null)

  // ==================================================
  // VERIFICATION STATES
  // ==================================================

  const [showVerification, setShowVerification] = useState(false)

  const [emailOtp, setEmailOtp] = useState('')
  const [phoneOtp, setPhoneOtp] = useState('')

  const [emailVerified, setEmailVerified] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)

  const [verifyLoading, setVerifyLoading] = useState(false)
  const [verifyError, setVerifyError] = useState('')
  const [verifyMessage, setVerifyMessage] = useState('')

  const [developmentPhoneOtp, setDevelopmentPhoneOtp] = useState('')

  const dispatch = useDispatch()

  // ==================================================
  // REDUX
  // ==================================================

  const userRegister = useSelector(
    (state) => state.userRegister
  )

  const {
    loading,
    error,
    userInfo,
  } = userRegister

  const redirect = location.search
    ? location.search.split('=')[1]
    : '/'

  // ==================================================
  // REGISTRATION SUCCESS
  // ==================================================

  useEffect(() => {
    if (userInfo) {
      setShowVerification(true)

      if (userInfo.phoneOtp) {
        setDevelopmentPhoneOtp(userInfo.phoneOtp)
      }
    }
  }, [userInfo])

  // ==================================================
  // REGISTER
  // ==================================================

  const submitHandler = (e) => {
    e.preventDefault()

    setMessage(null)
    setVerifyError('')
    setVerifyMessage('')

    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters')
      return
    }

    const cleanPhone = phone.replace(/\D/g, '')

    if (cleanPhone.length !== 10) {
      setMessage(
        'Please enter a valid 10-digit mobile number'
      )
      return
    }

    dispatch(
      register(
        name.trim(),
        email.trim(),
        password,
        cleanPhone
      )
    )
  }

  // ==================================================
  // VERIFY EMAIL
  // ==================================================

  const verifyEmailHandler = async (e) => {
    e.preventDefault()

    if (emailOtp.length !== 6) {
      setVerifyError('Please enter a valid 6-digit email OTP')
      return
    }

    setVerifyLoading(true)
    setVerifyError('')
    setVerifyMessage('')

    try {
      const response = await fetch(
        '/api/users/verify-email',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            otp: emailOtp,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Email verification failed'
        )
      }

      setEmailVerified(true)
      setEmailOtp('')

      setVerifyMessage(
        'Email verified successfully!'
      )
    } catch (err) {
      setVerifyError(err.message)
    } finally {
      setVerifyLoading(false)
    }
  }

  // ==================================================
  // VERIFY PHONE
  // ==================================================

  const verifyPhoneHandler = async (e) => {
    e.preventDefault()

    if (phoneOtp.length !== 6) {
      setVerifyError(
        'Please enter a valid 6-digit mobile OTP'
      )
      return
    }

    setVerifyLoading(true)
    setVerifyError('')
    setVerifyMessage('')

    try {
      const cleanPhone = phone.replace(/\D/g, '')

      const response = await fetch(
        '/api/users/verify-phone',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: cleanPhone,
            otp: phoneOtp,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Mobile verification failed'
        )
      }

      setPhoneVerified(true)
      setPhoneOtp('')

      setVerifyMessage(
        'Mobile number verified successfully!'
      )
    } catch (err) {
      setVerifyError(err.message)
    } finally {
      setVerifyLoading(false)
    }
  }

  // ==================================================
  // RESEND EMAIL OTP
  // ==================================================

  const resendEmailOtp = async () => {
    if (!email.trim()) return

    setVerifyLoading(true)
    setVerifyError('')
    setVerifyMessage('')

    try {
      const response = await fetch(
        '/api/users/resend-email-otp',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to resend email OTP'
        )
      }

      setEmailOtp('')

      setVerifyMessage(
        'New email OTP sent successfully!'
      )
    } catch (err) {
      setVerifyError(err.message)
    } finally {
      setVerifyLoading(false)
    }
  }

  // ==================================================
  // RESEND MOBILE OTP
  // ==================================================

  const resendPhoneOtp = async () => {
    if (!phone.trim()) return

    setVerifyLoading(true)
    setVerifyError('')
    setVerifyMessage('')

    try {
      const cleanPhone = phone.replace(/\D/g, '')

      const response = await fetch(
        '/api/users/resend-phone-otp',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: cleanPhone,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to resend mobile OTP'
        )
      }

      setPhoneOtp('')

      if (data.otp) {
        setDevelopmentPhoneOtp(data.otp)
      }

      setVerifyMessage(
        'New mobile OTP generated successfully!'
      )
    } catch (err) {
      setVerifyError(err.message)
    } finally {
      setVerifyLoading(false)
    }
  }

  // ==================================================
  // CONTINUE TO LOGIN
  // ==================================================

  const continueToLogin = () => {
    history.push(
      redirect
        ? `/login?redirect=${redirect}`
        : '/login'
    )
  }

  // ==================================================
  // PAGE
  // ==================================================

  return (
    <div className='cartnova-register-page'>
      <div className='cartnova-register-card'>

        {/* LEFT SIDE */}

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

        {/* RIGHT SIDE */}

        <div className='cartnova-register-right'>

          <div className='cartnova-register-heading'>

            <h2>
              {showVerification
                ? 'Verify Your Account'
                : 'Create Account'}
            </h2>

            <p>
              {showVerification
                ? 'Account created. Complete verification below.'
                : 'Fill in your details to get started.'}
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

          {verifyError && (
            <Message variant='danger'>
              {verifyError}
            </Message>
          )}

          {verifyMessage && (
            <Message variant='success'>
              {verifyMessage}
            </Message>
          )}

          {loading && <Loader />}
          {verifyLoading && <Loader />}

          {/* ==================================================
              CREATE ACCOUNT FORM
          ================================================== */}

          <Form onSubmit={submitHandler}>

            {/* FULL NAME */}

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
                disabled={showVerification}
                required
              />

            </Form.Group>

            {/* EMAIL */}

            <Form.Group
              controlId='email'
              className='cartnova-register-form-group'
            >

              <Form.Label>
                <i className='fas fa-envelope'></i>{' '}
                Email Address
              </Form.Label>

              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'stretch',
                }}
              >

                <Form.Control
                  type='email'
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  disabled={showVerification}
                  required
                />

                {showVerification && (
                  <Button
                    type='button'
                    variant={
                      emailVerified
                        ? 'success'
                        : 'primary'
                    }
                    onClick={() => {
                      if (!emailVerified) {
                        const input =
                          document.getElementById(
                            'emailOtp'
                          )

                        if (input) {
                          input.focus()
                        }
                      }
                    }}
                    disabled={
                      verifyLoading ||
                      emailVerified
                    }
                    style={{
                      minWidth: '125px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {emailVerified
                      ? '✓ Verified'
                      : 'Verify Email'}
                  </Button>
                )}

              </div>

              {/* EMAIL OTP */}

              {showVerification &&
                !emailVerified && (

                  <div
                    style={{
                      marginTop: '10px',
                    }}
                  >

                    <Form.Control
                      id='emailOtp'
                      type='text'
                      inputMode='numeric'
                      maxLength='6'
                      placeholder='Enter 6-digit Email OTP'
                      value={emailOtp}
                      onChange={(e) =>
                        setEmailOtp(
                          e.target.value.replace(
                            /\D/g,
                            ''
                          )
                        )
                      }
                    />

                    <div
                      style={{
                        display: 'flex',
                        gap: '10px',
                        marginTop: '8px',
                      }}
                    >

                      <Button
                        type='button'
                        className='flex-grow-1'
                        onClick={
                          verifyEmailHandler
                        }
                        disabled={
                          verifyLoading ||
                          emailOtp.length !== 6
                        }
                      >
                        <i className='fas fa-check'></i>{' '}
                        Confirm Email OTP
                      </Button>

                      <Button
                        type='button'
                        variant='outline-secondary'
                        onClick={
                          resendEmailOtp
                        }
                        disabled={verifyLoading}
                      >
                        <i className='fas fa-redo'></i>{' '}
                        Resend
                      </Button>

                    </div>

                  </div>
                )}

              {showVerification &&
                emailVerified && (

                  <div
                    style={{
                      color: '#198754',
                      fontWeight: '600',
                      marginTop: '8px',
                    }}
                  >
                    ✓ Email Verified
                  </div>

                )}

            </Form.Group>

            {/* MOBILE */}

            <Form.Group
              controlId='phone'
              className='cartnova-register-form-group'
            >

              <Form.Label>
                <i className='fas fa-mobile-alt'></i>{' '}
                Mobile Number
              </Form.Label>

              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'stretch',
                }}
              >

                <Form.Control
                  type='tel'
                  inputMode='numeric'
                  maxLength='10'
                  placeholder='Enter 10-digit mobile number'
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value.replace(
                        /\D/g,
                        ''
                      )
                    )
                  }
                  disabled={showVerification}
                  required
                />

                {showVerification && (
                  <Button
                    type='button'
                    variant={
                      phoneVerified
                        ? 'success'
                        : 'primary'
                    }
                    onClick={() => {
                      if (!phoneVerified) {
                        const input =
                          document.getElementById(
                            'phoneOtp'
                          )

                        if (input) {
                          input.focus()
                        }
                      }
                    }}
                    disabled={
                      verifyLoading ||
                      phoneVerified
                    }
                    style={{
                      minWidth: '125px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {phoneVerified
                      ? '✓ Verified'
                      : 'Verify Mobile'}
                  </Button>
                )}

              </div>

              <Form.Text className='cartnova-phone-help'>
                Enter your 10-digit mobile number
              </Form.Text>

              {/* MOBILE OTP */}

              {showVerification &&
                !phoneVerified && (

                  <div
                    style={{
                      marginTop: '10px',
                    }}
                  >

                    <Form.Control
                      id='phoneOtp'
                      type='text'
                      inputMode='numeric'
                      maxLength='6'
                      placeholder='Enter 6-digit Mobile OTP'
                      value={phoneOtp}
                      onChange={(e) =>
                        setPhoneOtp(
                          e.target.value.replace(
                            /\D/g,
                            ''
                          )
                        )
                      }
                    />

                    {developmentPhoneOtp && (
                      <div
                        style={{
                          background: '#fff3cd',
                          border: '1px solid #ffe69c',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          marginTop: '8px',
                          fontSize: '14px',
                        }}
                      >

                        <strong>
                          Development Mobile OTP:
                        </strong>{' '}

                        {developmentPhoneOtp}

                      </div>
                    )}

                    <div
                      style={{
                        display: 'flex',
                        gap: '10px',
                        marginTop: '8px',
                      }}
                    >

                      <Button
                        type='button'
                        className='flex-grow-1'
                        onClick={
                          verifyPhoneHandler
                        }
                        disabled={
                          verifyLoading ||
                          phoneOtp.length !== 6
                        }
                      >
                        <i className='fas fa-check'></i>{' '}
                        Confirm Mobile OTP
                      </Button>

                      <Button
                        type='button'
                        variant='outline-secondary'
                        onClick={
                          resendPhoneOtp
                        }
                        disabled={verifyLoading}
                      >
                        <i className='fas fa-redo'></i>{' '}
                        Resend
                      </Button>

                    </div>

                  </div>
                )}

              {showVerification &&
                phoneVerified && (

                  <div
                    style={{
                      color: '#198754',
                      fontWeight: '600',
                      marginTop: '8px',
                    }}
                  >
                    ✓ Mobile Number Verified
                  </div>

                )}

            </Form.Group>

            {/* PASSWORD */}

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
                disabled={showVerification}
                required
              />

            </Form.Group>

            {/* CONFIRM PASSWORD */}

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
                  setConfirmPassword(
                    e.target.value
                  )
                }
                disabled={showVerification}
                required
              />

            </Form.Group>

            {/* CREATE ACCOUNT BUTTON */}

            {!showVerification && (
              <Button
                type='submit'
                className='cartnova-register-button'
                disabled={loading}
              >
                <i className='fas fa-user-plus'></i>{' '}

                {loading
                  ? 'Creating Account...'
                  : 'Create Account'}
              </Button>
            )}

          </Form>

          {/* BOTH VERIFIED */}

          {showVerification &&
            emailVerified &&
            phoneVerified && (

              <div className='mt-3'>

                <Message variant='success'>
                  🎉 Your account has been
                  successfully verified!
                </Message>

                <Button
                  variant='success'
                  className='w-100'
                  onClick={
                    continueToLogin
                  }
                >
                  <i className='fas fa-sign-in-alt'></i>{' '}
                  Continue to Login
                </Button>

              </div>
            )}

          {/* LOGIN LINK */}

          {!showVerification && (
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
          )}

        </div>
      </div>
    </div>
  )
}

export default RegisterScreen