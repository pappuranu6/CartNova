import React, { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { saveShippingAddress } from '../actions/cartActions'
import { getAddresses } from '../actions/userActions'
import CheckoutSteps from '../components/CheckoutSteps'

const ShippingScreen = ({ history }) => {
  const dispatch = useDispatch()

  const cart = useSelector(
    (state) => state.cart
  )

  const userLogin = useSelector(
    (state) => state.userLogin
  )

  const { shippingAddress } = cart

  const { userInfo } = userLogin

  const [address, setAddress] = useState(
    shippingAddress?.address || ''
  )

  const [city, setCity] = useState(
    shippingAddress?.city || ''
  )

  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || ''
  )

  const [country, setCountry] = useState(
    shippingAddress?.country || 'India'
  )

  const [phone, setPhone] = useState(
    shippingAddress?.phone || ''
  )

  // ==========================================
  // FETCH SAVED ADDRESSES
  // ==========================================

  useEffect(() => {
    const loadSavedAddress = async () => {
      if (!userInfo) {
        history.push('/login')
        return
      }

      try {
        const savedAddresses =
          await dispatch(getAddresses())

        if (
          Array.isArray(savedAddresses) &&
          savedAddresses.length > 0
        ) {
          // First priority: Default address
          // Second priority: First saved address

          const defaultAddress =
            savedAddresses.find(
              (item) => item.isDefault
            ) || savedAddresses[0]

          if (defaultAddress) {
            const fullAddress = [
              defaultAddress.house,
              defaultAddress.area,
            ]
              .filter(Boolean)
              .join(', ')

            setAddress(
              fullAddress ||
              shippingAddress?.address ||
              ''
            )

            setCity(
              defaultAddress.city ||
              shippingAddress?.city ||
              ''
            )

            setPostalCode(
              defaultAddress.pincode ||
              shippingAddress?.postalCode ||
              ''
            )

            setCountry(
              'India'
            )

            setPhone(
              defaultAddress.phone ||
              shippingAddress?.phone ||
              ''
            )
          }
        }
      } catch (error) {
        console.error(
          'Unable to load saved addresses:',
          error
        )
      }
    }

    loadSavedAddress()
  }, [
    dispatch,
    history,
    userInfo,
    shippingAddress,
  ])

  // ==========================================
  // SUBMIT
  // ==========================================

  const submitHandler = (e) => {
    e.preventDefault()

    dispatch(
      saveShippingAddress({
        address,
        city,
        postalCode,
        country,
        phone,
      })
    )

    history.push('/payment')
  }

  return (
    <div className='cartnova-shipping-page'>

      {/* ================= CHECKOUT STEPS ================= */}
      

      {/* ================= CHECKOUT STEPS ================= */}

      <div className="cartnova-checkout-back-wrapper">
        <Button
          type="button"
          className="cartnova-checkout-back-button"
          onClick={() => history.replace('/cart')}
          aria-label="Back to Cart"
        >
          <i className="fas fa-arrow-left"></i>
        </Button>
      </div>
      {/* ================= SHIPPING CARD ================= */}

      <div className='cartnova-shipping-card'>

        {/* ================= LEFT PANEL ================= */}

        <div className='cartnova-shipping-left'>

          <div className='cartnova-shipping-icon'>
            <i className='fas fa-map-marker-alt'></i>
          </div>

          <span className='cartnova-shipping-badge'>
            DELIVERY DETAILS
          </span>

          <h1>
            Where should we
            <br />
            deliver your order?
          </h1>

          <p>
            Enter your delivery address
            carefully so we can get your
            order to you safely and quickly.
          </p>

          <div className='cartnova-shipping-features'>

            <div>
              <i className='fas fa-truck'></i>
              <span>
                Fast & Reliable Delivery
              </span>
            </div>

            <div>
              <i className='fas fa-shield-alt'></i>
              <span>
                Secure Order Handling
              </span>
            </div>

            <div>
              <i className='fas fa-check-circle'></i>
              <span>
                Easy Checkout Process
              </span>
            </div>

          </div>

        </div>

        {/* ================= RIGHT PANEL ================= */}

        <div className='cartnova-shipping-right'>

          <div className='cartnova-shipping-heading'>

            <div>

              <span>
                STEP 1 OF 2
              </span>

              <h2>
                Shipping Address
              </h2>

              <p>
                Your saved address has been
                loaded automatically.
              </p>

            </div>

            <div className='cartnova-shipping-step-icon'>
              <i className='fas fa-home'></i>
            </div>

          </div>

          <Form
            onSubmit={submitHandler}
          >

            {/* ================= ADDRESS ================= */}

            <Form.Group
              controlId='address'
              className='cartnova-shipping-form-group'
            >

              <Form.Label>
                <i className='fas fa-road'></i>
                Address
              </Form.Label>

              <Form.Control
                type='text'
                placeholder='Enter your full address'
                value={address}
                required
                onChange={(e) =>
                  setAddress(
                    e.target.value
                  )
                }
              />

            </Form.Group>

            {/* ================= CITY + POSTAL ================= */}

            <div className='cartnova-shipping-form-row'>

              <Form.Group
                controlId='city'
                className='cartnova-shipping-form-group'
              >

                <Form.Label>
                  <i className='fas fa-city'></i>
                  City
                </Form.Label>

                <Form.Control
                  type='text'
                  placeholder='Enter city'
                  value={city}
                  required
                  onChange={(e) =>
                    setCity(
                      e.target.value
                    )
                  }
                />

              </Form.Group>

              <Form.Group
                controlId='postalCode'
                className='cartnova-shipping-form-group'
              >

                <Form.Label>
                  <i className='fas fa-mail-bulk'></i>
                  Postal Code
                </Form.Label>

                <Form.Control
                  type='text'
                  placeholder='Enter postal code'
                  value={postalCode}
                  required
                  onChange={(e) =>
                    setPostalCode(
                      e.target.value
                    )
                  }
                />

              </Form.Group>

            </div>

            {/* ================= PHONE ================= */}

            <Form.Group
              controlId='phone'
              className='cartnova-shipping-form-group'
            >

              <Form.Label>
                <i className='fas fa-phone'></i>
                Mobile Number
              </Form.Label>

              <Form.Control
                type='tel'
                placeholder='Enter mobile number'
                value={phone}
                required
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
              />

            </Form.Group>

            {/* ================= COUNTRY ================= */}

            <Form.Group
              controlId='country'
              className='cartnova-shipping-form-group'
            >

              <Form.Label>
                <i className='fas fa-globe'></i>
                Country
              </Form.Label>

              <Form.Control
                type='text'
                placeholder='Enter country'
                value={country}
                required
                onChange={(e) =>
                  setCountry(
                    e.target.value
                  )
                }
              />

            </Form.Group>

            {/* ================= SECURITY NOTE ================= */}

            <div className='cartnova-shipping-security'>

              <i className='fas fa-lock'></i>

              <span>
                Your delivery information is
                handled securely.
              </span>

            </div>

            {/* ================= CONTINUE ================= */}

            <Button
              type='submit'
              className='cartnova-shipping-button'
            >

              Continue to Payment

              <i className='fas fa-arrow-right'></i>

            </Button>

          </Form>

        </div>

      </div>

    </div>
  )
}

export default ShippingScreen