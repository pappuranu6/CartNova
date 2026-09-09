import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'

const CheckoutSteps = ({
  step1,
  step2,
  step3,
  step4,
}) => {
  return (
    <div className='cartnova-checkout-steps'>

      {/* STEP 1 */}

      <div
        className={`cartnova-checkout-step ${
          step1 ? 'active' : ''
        }`}
      >
        {step1 ? (
          <LinkContainer to='/login'>
            <div className='cartnova-checkout-step-link'>
              <div className='cartnova-checkout-step-number'>
                <i className='fas fa-user'></i>
              </div>

              <div className='cartnova-checkout-step-text'>
                <span>
                  STEP 1
                </span>

                <strong>
                  Sign In
                </strong>
              </div>
            </div>
          </LinkContainer>
        ) : (
          <div className='cartnova-checkout-step-disabled'>
            <div className='cartnova-checkout-step-number'>
              <i className='fas fa-user'></i>
            </div>

            <div className='cartnova-checkout-step-text'>
              <span>
                STEP 1
              </span>

              <strong>
                Sign In
              </strong>
            </div>
          </div>
        )}
      </div>

      <div className='cartnova-checkout-connector'></div>

      {/* STEP 2 */}

      <div
        className={`cartnova-checkout-step ${
          step2 ? 'active' : ''
        }`}
      >
        {step2 ? (
          <LinkContainer to='/shipping'>
            <div className='cartnova-checkout-step-link'>
              <div className='cartnova-checkout-step-number'>
                <i className='fas fa-map-marker-alt'></i>
              </div>

              <div className='cartnova-checkout-step-text'>
                <span>
                  STEP 2
                </span>

                <strong>
                  Shipping
                </strong>
              </div>
            </div>
          </LinkContainer>
        ) : (
          <div className='cartnova-checkout-step-disabled'>
            <div className='cartnova-checkout-step-number'>
              <i className='fas fa-map-marker-alt'></i>
            </div>

            <div className='cartnova-checkout-step-text'>
              <span>
                STEP 2
              </span>

              <strong>
                Shipping
              </strong>
            </div>
          </div>
        )}
      </div>

      <div className='cartnova-checkout-connector'></div>

      {/* STEP 3 */}

      <div
        className={`cartnova-checkout-step ${
          step3 ? 'active' : ''
        }`}
      >
        {step3 ? (
          <LinkContainer to='/payment'>
            <div className='cartnova-checkout-step-link'>
              <div className='cartnova-checkout-step-number'>
                <i className='fas fa-credit-card'></i>
              </div>

              <div className='cartnova-checkout-step-text'>
                <span>
                  STEP 3
                </span>

                <strong>
                  Payment
                </strong>
              </div>
            </div>
          </LinkContainer>
        ) : (
          <div className='cartnova-checkout-step-disabled'>
            <div className='cartnova-checkout-step-number'>
              <i className='fas fa-credit-card'></i>
            </div>

            <div className='cartnova-checkout-step-text'>
              <span>
                STEP 3
              </span>

              <strong>
                Payment
              </strong>
            </div>
          </div>
        )}
      </div>

      <div className='cartnova-checkout-connector'></div>

      {/* STEP 4 */}

      <div
        className={`cartnova-checkout-step ${
          step4 ? 'active' : ''
        }`}
      >
        {step4 ? (
          <LinkContainer to='/placeorder'>
            <div className='cartnova-checkout-step-link'>
              <div className='cartnova-checkout-step-number'>
                <i className='fas fa-check'></i>
              </div>

              <div className='cartnova-checkout-step-text'>
                <span>
                  STEP 4
                </span>

                <strong>
                  Place Order
                </strong>
              </div>
            </div>
          </LinkContainer>
        ) : (
          <div className='cartnova-checkout-step-disabled'>
            <div className='cartnova-checkout-step-number'>
              <i className='fas fa-check'></i>
            </div>

            <div className='cartnova-checkout-step-text'>
              <span>
                STEP 4
              </span>

              <strong>
                Place Order
              </strong>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

export default CheckoutSteps