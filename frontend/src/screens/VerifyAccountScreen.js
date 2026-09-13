import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useLocation, useHistory } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'

const VerifyAccountScreen = () => {
  const location = useLocation()
  const history = useHistory()

  // ==================================================
  // GET DATA FROM URL
  // ==================================================

  const params = new URLSearchParams(location.search)

  const emailFromUrl = params.get('email') || ''
  const phoneFromUrl = params.get('phone') || ''
  const redirectFromUrl = params.get('redirect') || '/'

  const [email, setEmail] = useState(emailFromUrl)
  const [phone, setPhone] = useState(phoneFromUrl)

  const [emailOtp, setEmailOtp] = useState('')
  const [phoneOtp, setPhoneOtp] = useState('')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [emailVerified, setEmailVerified] =
    useState(false)

  const [phoneVerified, setPhoneVerified] =
    useState(false)

  // ==================================================
  // VERIFY EMAIL
  // ==================================================

  const verifyEmailHandler = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch(
        '/api/users/verify-email',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            otp: emailOtp,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Email verification failed'
        )
      }

      setEmailVerified(true)
      setMessage(
        'Email verified successfully!'
      )
      setEmailOtp('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ==================================================
  // VERIFY PHONE
  // ==================================================

  const verifyPhoneHandler = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch(
        '/api/users/verify-phone',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone,
            otp: phoneOtp,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Phone verification failed'
        )
      }

      setPhoneVerified(true)
      setMessage(
        'Mobile number verified successfully!'
      )
      setPhoneOtp('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ==================================================
  // RESEND EMAIL OTP
  // ==================================================

  const resendEmailHandler = async () => {
    if (!email) return

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch(
        '/api/users/resend-email-otp',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Unable to resend email OTP'
        )
      }

      setEmailOtp('')

      setMessage(
        'New email OTP sent successfully!'
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ==================================================
  // RESEND PHONE OTP
  // ==================================================

  const resendPhoneHandler = async () => {
    if (!phone) return

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch(
        '/api/users/resend-phone-otp',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Unable to resend phone OTP'
        )
      }

      setPhoneOtp('')

      setMessage(
        'New phone OTP generated successfully!'
      )

      // Development mode only
      if (data.otp) {
        console.log(
          'Development Phone OTP:',
          data.otp
        )
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ==================================================
  // CONTINUE TO LOGIN
  // ==================================================

  const continueToLogin = () => {
    history.push(
      `/login?redirect=${encodeURIComponent(
        redirectFromUrl
      )}`
    )
  }

  // ==================================================
  // PAGE
  // ==================================================

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '40px auto',
        padding: '30px',
        background: '#fff',
        borderRadius: '15px',
        boxShadow:
          '0 5px 25px rgba(0,0,0,0.10)',
      }}
    >

      {/* ================= HEADER ================= */}

      <div
        style={{
          textAlign: 'center',
          marginBottom: '30px',
        }}
      >

        <div
          style={{
            fontSize: '50px',
            marginBottom: '10px',
          }}
        >
          🛡️
        </div>

        <h2
          style={{
            fontWeight: '700',
          }}
        >
          Verify Your Account
        </h2>

        <p
          style={{
            color: '#666',
          }}
        >
          Verify your email and mobile number
          to continue using CartNova.
        </p>

      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <Message variant='danger'>
          {error}
        </Message>
      )}

      {/* ================= SUCCESS ================= */}

      {message && (
        <Message variant='success'>
          {message}
        </Message>
      )}

      {loading && <Loader />}

      {/* ==================================================
          EMAIL VERIFICATION
      ================================================== */}

      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '20px',
        }}
      >

        <h4>
          📧 Email Verification
        </h4>

        <Form
          onSubmit={verifyEmailHandler}
        >

          <Form.Group
            controlId='verifyEmail'
            className='mb-3'
          >

            <Form.Label>
              Email Address
            </Form.Label>

            <Form.Control
              type='email'
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder='Enter your email'
              required
              disabled={emailVerified}
            />

          </Form.Group>

          {!emailVerified && (
            <>
              <Form.Group
                controlId='emailOtp'
                className='mb-3'
              >

                <Form.Label>
                  Email OTP
                </Form.Label>

                <Form.Control
                  type='text'
                  inputMode='numeric'
                  maxLength='6'
                  value={emailOtp}
                  onChange={(e) =>
                    setEmailOtp(
                      e.target.value.replace(
                        /\D/g,
                        ''
                      )
                    )
                  }
                  placeholder='Enter 6-digit OTP'
                  required
                />

              </Form.Group>

              <Button
                type='submit'
                variant='primary'
                className='w-100'
                disabled={loading}
              >
                <i className='fas fa-check'></i>{' '}
                Verify Email
              </Button>

              <Button
                type='button'
                variant='outline-secondary'
                className='w-100 mt-2'
                onClick={resendEmailHandler}
                disabled={
                  loading || !email
                }
              >
                <i className='fas fa-redo'></i>{' '}
                Resend Email OTP
              </Button>
            </>
          )}

          {emailVerified && (
            <div
              style={{
                color: '#198754',
                fontWeight: '600',
                marginTop: '10px',
              }}
            >
              ✓ Email Verified
            </div>
          )}

        </Form>
      </div>

      {/* ==================================================
          PHONE VERIFICATION
      ================================================== */}

      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '20px',
        }}
      >

        <h4>
          📱 Mobile Verification
        </h4>

        <Form
          onSubmit={verifyPhoneHandler}
        >

          <Form.Group
            controlId='verifyPhone'
            className='mb-3'
          >

            <Form.Label>
              Mobile Number
            </Form.Label>

            <Form.Control
              type='tel'
              inputMode='numeric'
              maxLength='10'
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value.replace(
                    /\D/g,
                    ''
                  )
                )
              }
              placeholder='Enter 10-digit mobile number'
              required
              disabled={phoneVerified}
            />

          </Form.Group>

          {!phoneVerified && (
            <>
              <Form.Group
                controlId='phoneOtp'
                className='mb-3'
              >

                <Form.Label>
                  Mobile OTP
                </Form.Label>

                <Form.Control
                  type='text'
                  inputMode='numeric'
                  maxLength='6'
                  value={phoneOtp}
                  onChange={(e) =>
                    setPhoneOtp(
                      e.target.value.replace(
                        /\D/g,
                        ''
                      )
                    )
                  }
                  placeholder='Enter 6-digit OTP'
                  required
                />

              </Form.Group>

              <Button
                type='submit'
                variant='primary'
                className='w-100'
                disabled={loading}
              >
                <i className='fas fa-check'></i>{' '}
                Verify Mobile
              </Button>

              <Button
                type='button'
                variant='outline-secondary'
                className='w-100 mt-2'
                onClick={resendPhoneHandler}
                disabled={
                  loading || !phone
                }
              >
                <i className='fas fa-redo'></i>{' '}
                Resend Mobile OTP
              </Button>
            </>
          )}

          {phoneVerified && (
            <div
              style={{
                color: '#198754',
                fontWeight: '600',
                marginTop: '10px',
              }}
            >
              ✓ Mobile Number Verified
            </div>
          )}

        </Form>
      </div>

      {/* ==================================================
          BOTH VERIFIED
      ================================================== */}

      {emailVerified &&
        phoneVerified && (
          <Button
            variant='success'
            className='w-100'
            onClick={continueToLogin}
          >
            <i className='fas fa-sign-in-alt'></i>{' '}
            Continue to Login
          </Button>
        )}

      {/* ================= BACK TO LOGIN ================= */}

      <div
        style={{
          textAlign: 'center',
          marginTop: '20px',
        }}
      >

        <Button
          variant='link'
          onClick={() =>
            history.push('/login')
          }
        >
          ← Back to Login
        </Button>

      </div>

    </div>
  )
}

export default VerifyAccountScreen