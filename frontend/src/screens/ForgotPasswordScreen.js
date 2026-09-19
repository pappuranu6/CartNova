import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Message from '../components/Message'
import Loader from '../components/Loader'

import {
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
} from '../actions/userActions'

const ForgotPasswordScreen = ({ history }) => {
  const [step, setStep] = useState(1)

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const dispatch = useDispatch()

  const userForgotPassword = useSelector(
    (state) => state.userForgotPassword
  )

  const userVerifyOtp = useSelector(
    (state) => state.userVerifyOtp
  )

  const userResetPassword = useSelector(
    (state) => state.userResetPassword
  )

  const {
    loading: sendingOtp,
    error: sendOtpError,
    success: otpSent,
    otp: developmentOtp,
  } = userForgotPassword

  const {
    loading: verifyingOtp,
    error: verifyOtpError,
    success: otpVerified,
    resetToken,
  } = userVerifyOtp

  const {
    loading: resettingPassword,
    error: resetError,
    success: passwordReset,
  } = userResetPassword

  const sendOtpHandler = async (e) => {
    e.preventDefault()

    try {
      await dispatch(sendPasswordResetOtp(email))
      setStep(2)
    } catch (error) {
      // Error is already handled by reducer
    }
  }

  const verifyOtpHandler = async (e) => {
    e.preventDefault()

    try {
      await dispatch(
        verifyPasswordResetOtp(email, otp)
      )

      setStep(3)
    } catch (error) {
      // Error is already handled by reducer
    }
  }

  const resetPasswordHandler = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      return
    }

    if (!resetToken) {
      return
    }

    try {
      await dispatch(
        resetPassword(
          email,
          resetToken,
          password
        )
      )
    } catch (error) {
      // Error is already handled by reducer
    }
  }

  if (passwordReset) {
    return (
      <div className='cartnova-forgot-page'>
        <div className='cartnova-forgot-card cartnova-forgot-success-card'>

          <div className='cartnova-forgot-success-icon'>
            <i className='fas fa-check'></i>
          </div>

          <h1>Password Reset Successful!</h1>

          <p className='cartnova-forgot-success-text'>
            Your password has been reset successfully.
            <br />
            You can now login with your new password.
          </p>

          <Link
            to='/login'
            className='cartnova-forgot-login-button'
          >
            <i className='fas fa-sign-in-alt'></i>{' '}
            Back to Login
          </Link>

        </div>
      </div>
    )
  }

  return (
    <div className='cartnova-forgot-page'>
      <div className='cartnova-forgot-card'>

        {/* LEFT SIDE */}
        <div className='cartnova-forgot-left'>

          <div className='cartnova-forgot-icon'>
            <i className='fas fa-key'></i>
          </div>

          <h1>CartNova</h1>

          <div className='cartnova-forgot-badge'>
            ACCOUNT RECOVERY
          </div>

          <p>
            Securely recover your account
            <br />
            and reset your password.
          </p>

          <div className='cartnova-forgot-features'>

            <div>
              <i className='fas fa-envelope'></i>
              Email OTP Verification
            </div>

            <div>
              <i className='fas fa-shield-alt'></i>
              Secure Account Recovery
            </div>

            <div>
              <i className='fas fa-lock'></i>
              Protected Password Reset
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className='cartnova-forgot-right'>

          <div className='cartnova-forgot-heading'>
            <h2>Forgot Password?</h2>

            <p>
              {step === 1 &&
                'Enter your email address to continue.'}

              {step === 2 &&
                'Enter the OTP sent to your email address.'}

              {step === 3 &&
                'Create a new password for your account.'}
            </p>
          </div>

          {/* STEP INDICATOR */}
          <div className='cartnova-forgot-steps'>

            <div
              className={
                step >= 1
                  ? 'cartnova-forgot-step active'
                  : 'cartnova-forgot-step'
              }
            >
              <span>1</span>
              <small>Email</small>
            </div>

            <div
              className={
                step >= 2
                  ? 'cartnova-forgot-step active'
                  : 'cartnova-forgot-step'
              }
            >
              <span>2</span>
              <small>OTP</small>
            </div>

            <div
              className={
                step >= 3
                  ? 'cartnova-forgot-step active'
                  : 'cartnova-forgot-step'
              }
            >
              <span>3</span>
              <small>Password</small>
            </div>

          </div>

          {sendOtpError && (
            <Message variant='danger'>
              {sendOtpError}
            </Message>
          )}

          {verifyOtpError && (
            <Message variant='danger'>
              {verifyOtpError}
            </Message>
          )}

          {resetError && (
            <Message variant='danger'>
              {resetError}
            </Message>
          )}

          {sendingOtp && <Loader />}
          {verifyingOtp && <Loader />}
          {resettingPassword && <Loader />}

          {/* ================= STEP 1 ================= */}

          {step === 1 && (
            <Form onSubmit={sendOtpHandler}>

              <Form.Group
                controlId='email'
                className='cartnova-forgot-form-group'
              >
                <Form.Label>
                  <i className='fas fa-envelope'></i>{' '}
                  Email Address
                </Form.Label>

                <Form.Control
                  type='email'
                  placeholder='Enter your registered email address'
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

                <Form.Text className='cartnova-forgot-help'>
                  Enter the email address registered with
                  your CartNova account.
                </Form.Text>
              </Form.Group>

              <Button
                type='submit'
                className='cartnova-forgot-button'
                disabled={sendingOtp}
              >
                <i className='fas fa-paper-plane'></i>{' '}
                {sendingOtp
                  ? 'Sending OTP...'
                  : 'Send OTP'}
              </Button>

            </Form>
          )}

          {/* ================= STEP 2 ================= */}

          {step === 2 && (
            <>
              {otpSent && (
                <Message variant='success'>
                  OTP sent successfully.
                </Message>
              )}

              <Form onSubmit={verifyOtpHandler}>

                <Form.Group
                  controlId='otp'
                  className='cartnova-forgot-form-group'
                >
                  <Form.Label>
                    <i className='fas fa-shield-alt'></i>{' '}
                    Enter 6-Digit OTP
                  </Form.Label>

                  <Form.Control
                    type='text'
                    inputMode='numeric'
                    maxLength='6'
                    placeholder='Enter OTP'
                    value={otp}
                    onChange={(e) =>
                      setOtp(
                        e.target.value.replace(/\D/g, '')
                      )
                    }
                    required
                  />

                  <Form.Text className='cartnova-forgot-help'>
                    Enter the 6-digit verification code.
                  </Form.Text>
                </Form.Group>

                <Button
                  type='submit'
                  className='cartnova-forgot-button'
                  disabled={
                    verifyingOtp || otp.length !== 6
                  }
                >
                  <i className='fas fa-check-circle'></i>{' '}
                  {verifyingOtp
                    ? 'Verifying...'
                    : 'Verify OTP'}
                </Button>

              </Form>

              <button
                type='button'
                className='cartnova-back-step'
                onClick={() => setStep(1)}
              >
                <i className='fas fa-arrow-left'></i>{' '}
                Change Email Address
              </button>
            </>
          )}

          {/* ================= STEP 3 ================= */}

          {step === 3 && (
            <>
              {otpVerified && (
                <Message variant='success'>
                  OTP verified successfully.
                </Message>
              )}

              <Form onSubmit={resetPasswordHandler}>

                <Form.Group
                  controlId='password'
                  className='cartnova-forgot-form-group'
                >
                  <Form.Label>
                    <i className='fas fa-lock'></i>{' '}
                    New Password
                  </Form.Label>

                  <Form.Control
                    type='password'
                    placeholder='Enter new password'
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    minLength='6'
                    required
                  />
                </Form.Group>

                <Form.Group
                  controlId='confirmPassword'
                  className='cartnova-forgot-form-group'
                >
                  <Form.Label>
                    <i className='fas fa-lock'></i>{' '}
                    Confirm Password
                  </Form.Label>

                  <Form.Control
                    type='password'
                    placeholder='Confirm new password'
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    minLength='6'
                    required
                  />
                </Form.Group>

                {password !== confirmPassword &&
                  confirmPassword && (
                    <Message variant='danger'>
                      Passwords do not match.
                    </Message>
                  )}

                <Button
                  type='submit'
                  className='cartnova-forgot-button'
                  disabled={
                    resettingPassword ||
                    !password ||
                    !confirmPassword ||
                    password !== confirmPassword
                  }
                >
                  <i className='fas fa-key'></i>{' '}
                  {resettingPassword
                    ? 'Resetting Password...'
                    : 'Reset Password'}
                </Button>

              </Form>
            </>
          )}

          <div className='cartnova-forgot-login'>
            Remember your password?{' '}
            <Link to='/login'>
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordScreen