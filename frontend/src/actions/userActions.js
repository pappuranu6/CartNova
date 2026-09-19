import axios from 'axios'

import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_DETAILS_RESET,
  USER_LIST_FAIL,
  USER_LIST_SUCCESS,
  USER_LIST_REQUEST,
  USER_LIST_RESET,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_UPDATE_FAIL,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_REQUEST,

  USER_FORGOT_PASSWORD_REQUEST,
  USER_FORGOT_PASSWORD_SUCCESS,
  USER_FORGOT_PASSWORD_FAIL,
  USER_VERIFY_OTP_REQUEST,
  USER_VERIFY_OTP_SUCCESS,
  USER_VERIFY_OTP_FAIL,
  USER_RESET_PASSWORD_REQUEST,
  USER_RESET_PASSWORD_SUCCESS,
  USER_RESET_PASSWORD_FAIL,
} from '../constants/userConstants'

import { ORDER_LIST_MY_RESET } from '../constants/orderConstants'

// ================= LOGIN =================

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    })

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const { data } = await axios.post(
      '/api/users/login',
      {
        email,
        password,
      },
      config
    )

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    })

    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

// ================= LOGOUT =================

export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo')

  dispatch({
    type: USER_LOGOUT,
  })

  dispatch({
    type: USER_DETAILS_RESET,
  })

  dispatch({
    type: ORDER_LIST_MY_RESET,
  })

  dispatch({
    type: USER_LIST_RESET,
  })
}

// ================= REGISTER =================

export const register =
  (name, email, password, phone) =>
  async (dispatch) => {
    try {
      dispatch({
        type: USER_REGISTER_REQUEST,
      })

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const { data } = await axios.post(
        '/api/users',
        {
          name,
          email,
          password,
          phone,
        },
        config
      )

      // Registration successful.
      // Do NOT automatically log the user in.
      // Email and mobile OTP verification must happen first.
      dispatch({
        type: USER_REGISTER_SUCCESS,
        payload: data,
      })
    } catch (error) {
      dispatch({
        type: USER_REGISTER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }

// ================= GET USER DETAILS =================

export const getUserDetails =
  (id) => async (dispatch, getState) => {
    try {
      dispatch({
        type: USER_DETAILS_REQUEST,
      })

      const {
        userLogin: { userInfo },
      } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.get(
        `/api/users/${id}`,
        config
      )

      dispatch({
        type: USER_DETAILS_SUCCESS,
        payload: data,
      })
    } catch (error) {
      dispatch({
        type: USER_DETAILS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }

// ================= UPDATE PROFILE =================

export const updateUserProfile =
  (user) => async (dispatch, getState) => {
    try {
      dispatch({
        type: USER_UPDATE_PROFILE_REQUEST,
      })

      const {
        userLogin: { userInfo },
      } = getState()

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.put(
        `/api/users/profile`,
        user,
        config
      )

      dispatch({
        type: USER_UPDATE_PROFILE_SUCCESS,
        payload: data,
      })

      return data
    } catch (error) {
      const message =
        error.response &&
        error.response.data &&
        error.response.data.message
          ? error.response.data.message
          : error.message

      dispatch({
        type: USER_UPDATE_PROFILE_FAIL,
        payload: message,
      })

      throw error
    }
  }

// ================= SEND EMAIL CHANGE OTP =================

export const sendEmailChangeOtp =
  (email) => async (dispatch, getState) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState()

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.post(
        '/api/users/profile/change-email/send-otp',
        {
          email,
        },
        config
      )

      return data
    } catch (error) {
      throw error
    }
  }

// ================= VERIFY EMAIL CHANGE OTP =================

export const verifyEmailChangeOtp =
  (email, otp) => async (dispatch, getState) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState()

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.post(
        '/api/users/profile/change-email/verify-otp',
        {
          email,
          otp,
        },
        config
      )

      return data
    } catch (error) {
      throw error
    }
  }

// ================= SEND PHONE CHANGE OTP =================

export const sendPhoneChangeOtp =
  (phone) => async (dispatch, getState) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState()

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.post(
        '/api/users/profile/change-phone/send-otp',
        {
          phone,
        },
        config
      )

      return data
    } catch (error) {
      throw error
    }
  }

// ================= VERIFY PHONE CHANGE OTP =================

export const verifyPhoneChangeOtp =
  (phone, otp) => async (dispatch, getState) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState()

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.post(
        '/api/users/profile/change-phone/verify-otp',
        {
          phone,
          otp,
        },
        config
      )

      return data
    } catch (error) {
      throw error
    }
  }

// ================= GET ADDRESSES =================

export const getAddresses =
  () => async (dispatch, getState) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.get(
        '/api/users/profile/addresses',
        config
      )

      return data
    } catch (error) {
      throw error
    }
  }

// ================= ADD ADDRESS =================

export const addAddress =
  (address) => async (dispatch, getState) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState()

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.post(
        '/api/users/profile/addresses',
        address,
        config
      )

      return data
    } catch (error) {
      throw error
    }
  }

// ================= UPDATE ADDRESS =================

export const updateAddress =
  (addressId, address) =>
  async (dispatch, getState) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState()

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.put(
        `/api/users/profile/addresses/${addressId}`,
        address,
        config
      )

      return data
    } catch (error) {
      throw error
    }
  }

// ================= DELETE ADDRESS =================

export const deleteAddress =
  (addressId) => async (dispatch, getState) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.delete(
        `/api/users/profile/addresses/${addressId}`,
        config
      )

      return data
    } catch (error) {
      throw error
    }
  }

// ================= SET DEFAULT ADDRESS =================

export const setDefaultAddress =
  (addressId) => async (dispatch, getState) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.put(
        `/api/users/profile/addresses/${addressId}/default`,
        {},
        config
      )

      return data
    } catch (error) {
      throw error
    }
  }

// ================= LIST USERS =================

export const listUsers =
  () => async (dispatch, getState) => {
    try {
      dispatch({
        type: USER_LIST_REQUEST,
      })

      const {
        userLogin: { userInfo },
      } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.get(
        `/api/users`,
        config
      )

      dispatch({
        type: USER_LIST_SUCCESS,
        payload: data,
      })
    } catch (error) {
      dispatch({
        type: USER_LIST_FAIL,
        payload:
          error.response &&
          error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }

// ================= DELETE USER =================

export const deleteUser =
  (id) => async (dispatch, getState) => {
    try {
      dispatch({
        type: USER_DELETE_REQUEST,
      })

      const {
        userLogin: { userInfo },
      } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      await axios.delete(
        `/api/users/${id}`,
        config
      )

      dispatch({
        type: USER_DELETE_SUCCESS,
      })
    } catch (error) {
      dispatch({
        type: USER_DELETE_FAIL,
        payload:
          error.response &&
          error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }

// ================= UPDATE USER =================

export const updateUser =
  (user) => async (dispatch, getState) => {
    try {
      dispatch({
        type: USER_UPDATE_REQUEST,
      })

      const {
        userLogin: { userInfo },
      } = getState()

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.put(
        `/api/users/${user._id}`,
        user,
        config
      )

      dispatch({
        type: USER_UPDATE_SUCCESS,
      })

      dispatch({
        type: USER_DETAILS_SUCCESS,
        payload: data,
      })
    } catch (error) {
      dispatch({
        type: USER_UPDATE_FAIL,
        payload:
          error.response &&
          error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }

// ================= SEND PASSWORD RESET OTP =================

export const sendPasswordResetOtp =
  (email) => async (dispatch) => {
    try {
      dispatch({
        type: USER_FORGOT_PASSWORD_REQUEST,
      })

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const { data } = await axios.post(
        '/api/users/forgot-password/send-otp',
        {
          email,
        },
        config
      )

      dispatch({
        type: USER_FORGOT_PASSWORD_SUCCESS,
        payload: data,
      })

      return data
    } catch (error) {
      dispatch({
        type: USER_FORGOT_PASSWORD_FAIL,
        payload:
          error.response &&
          error.response.data.message
            ? error.response.data.message
            : error.message,
      })

      throw error
    }
  }

// ================= VERIFY OTP =================

export const verifyPasswordResetOtp =
  (email, otp) => async (dispatch) => {
    try {
      dispatch({
        type: USER_VERIFY_OTP_REQUEST,
      })

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const { data } = await axios.post(
        '/api/users/forgot-password/verify-otp',
        {
          email,
          otp,
        },
        config
      )

      dispatch({
        type: USER_VERIFY_OTP_SUCCESS,
        payload: data,
      })

      return data
    } catch (error) {
      dispatch({
        type: USER_VERIFY_OTP_FAIL,
        payload:
          error.response &&
          error.response.data.message
            ? error.response.data.message
            : error.message,
      })

      throw error
    }
  }

// ================= RESET PASSWORD =================

export const resetPassword =
  (email, resetToken, password) =>
  async (dispatch) => {
    try {
      dispatch({
        type: USER_RESET_PASSWORD_REQUEST,
      })

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const { data } = await axios.post(
        '/api/users/forgot-password/reset-password',
        {
          email,
          resetToken,
          password,
        },
        config
      )

      dispatch({
        type: USER_RESET_PASSWORD_SUCCESS,
        payload: data,
      })

      return data
    } catch (error) {
      dispatch({
        type: USER_RESET_PASSWORD_FAIL,
        payload:
          error.response &&
          error.response.data.message
            ? error.response.data.message
            : error.message,
      })

      throw error
    }
  }