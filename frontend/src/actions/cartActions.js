import axios from 'axios'
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
} from '../constants/cartConstants'

export const addToCart = (id, qty) => async (
  dispatch,
  getState
) => {
  const { data } = await axios.get(
    `/api/products/${id}`
  )

  /*
    ==========================================
    TODAY'S DEAL
    ==========================================

    Deal tabhi apply hoga jab:

    1. Admin ne deal ON kiya ho
    2. Discount 1-100% ke beech ho
    3. Deal ki expiry abhi future mein ho
  */

  const discount = Number(
    data.dealDiscount || 0
  )

  const dealIsLive =
    Boolean(data.isDealActive) &&
    discount > 0 &&
    discount <= 100 &&
    data.dealExpiresAt &&
    new Date(data.dealExpiresAt).getTime() >
      Date.now()

  const originalPrice = Number(
    data.price || 0
  )

  /*
    Actual discounted price

    Example:
    ₹1000 - 20% = ₹800
  */

  const finalPrice = dealIsLive
    ? Math.round(
        originalPrice *
          (1 - discount / 100)
      )
    : originalPrice

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,

      // Actual customer price
      price: finalPrice,

      // Original product price
      originalPrice,

      // Deal information
      isDealActive: dealIsLive,
      dealDiscount: dealIsLive
        ? discount
        : 0,
      dealExpiresAt: dealIsLive
        ? data.dealExpiresAt
        : null,

      countInStock: data.countInStock,
      qty,
    },
  })

  localStorage.setItem(
    'cartItems',
    JSON.stringify(
      getState().cart.cartItems
    )
  )
}

export const removeFromCart = (
  id
) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  })

  localStorage.setItem(
    'cartItems',
    JSON.stringify(
      getState().cart.cartItems
    )
  )
}

export const saveShippingAddress = (
  data
) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  })

  localStorage.setItem(
    'shippingAddress',
    JSON.stringify(data)
  )
}

export const savePaymentMethod = (
  data
) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  })

  localStorage.setItem(
    'paymentMethod',
    JSON.stringify(data)
  )
}