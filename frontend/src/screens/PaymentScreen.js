import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../actions/cartActions'

const PaymentScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart

  if (!shippingAddress) {
    history.push('/shipping')
  }

  const [paymentMethod, setPaymentMethod] =
    useState('Razorpay')

  const dispatch = useDispatch()

  const submitHandler = (e) => {
    e.preventDefault()

    dispatch(savePaymentMethod(paymentMethod))

    history.push('/placeorder')
  }

  return (
    <div className='cartnova-payment-page'>

      {/* ================= CHECKOUT STEPS ================= */}

      <div className='cartnova-checkout-steps-wrapper'>
        <CheckoutSteps
          step1
          step2
          step3
        />
      </div>

      {/* ================= PAYMENT CARD ================= */}

      <div className='cartnova-payment-card'>

        {/* LEFT PANEL */}

        <div className='cartnova-payment-left'>

          <div className='cartnova-payment-icon'>
            <i className='fas fa-credit-card'></i>
          </div>

          <span className='cartnova-payment-badge'>
            SECURE PAYMENT
          </span>

          <h1>
            Choose your
            <br />
            payment method
          </h1>

          <p>
            Select your preferred payment
            method to continue with your
            CartNova order.
          </p>

          <div className='cartnova-payment-features'>

            <div>
              <i className='fas fa-shield-alt'></i>
              <span>
                Secure & Protected Payment
              </span>
            </div>

            <div>
              <i className='fas fa-bolt'></i>
              <span>
                Fast Payment Processing
              </span>
            </div>

            <div>
              <i className='fas fa-lock'></i>
              <span>
                Encrypted Transactions
              </span>
            </div>

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className='cartnova-payment-right'>

          <div className='cartnova-payment-heading'>

            <div>
              <span>
                STEP 2 OF 2
              </span>

              <h2>
                Payment Method
              </h2>

              <p>
                Select how you'd like to pay
                for your order.
              </p>
            </div>

            <div className='cartnova-payment-step-icon'>
              <i className='fas fa-wallet'></i>
            </div>

          </div>

          <Form onSubmit={submitHandler}>

            <Form.Group className='cartnova-payment-form-group'>

              <Form.Label>
                Select Method
              </Form.Label>

              <div className='cartnova-payment-options'>

                {/* RAZORPAY */}

                <label
                  className={`cartnova-payment-option ${
                    paymentMethod === 'Razorpay'
                      ? 'selected'
                      : ''
                  }`}
                  htmlFor='Razorpay'
                >

                  <div className='cartnova-payment-option-radio'>

                    <Form.Check
                      type='radio'
                      id='Razorpay'
                      name='paymentMethod'
                      value='Razorpay'
                      checked={
                        paymentMethod === 'Razorpay'
                      }
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value
                        )
                      }
                    />

                  </div>

                  <div className='cartnova-payment-option-icon'>
                    <i className='fas fa-credit-card'></i>
                  </div>

                  <div className='cartnova-payment-option-content'>

                    <strong>
                      Razorpay
                    </strong>

                    <span>
                      Pay securely using Razorpay
                    </span>

                  </div>

                  <div className='cartnova-payment-option-check'>
                    <i className='fas fa-check'></i>
                  </div>

                </label>

              </div>

            </Form.Group>

            {/* PAYMENT SECURITY */}

            <div className='cartnova-payment-security'>

              <div className='cartnova-payment-security-icon'>
                <i className='fas fa-lock'></i>
              </div>

              <div>
                <strong>
                  Secure Checkout
                </strong>

                <span>
                  Your payment information is
                  protected with secure encryption.
                </span>
              </div>

            </div>

            {/* CONTINUE BUTTON */}

            <Button
              type='submit'
              className='cartnova-payment-button'
            >
              Continue to Place Order
              <i className='fas fa-arrow-right'></i>
            </Button>

          </Form>

        </div>

      </div>

    </div>
  )
}

export default PaymentScreen