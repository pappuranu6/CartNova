import { useHistory } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Message from '../components/Message'
import Loader from '../components/Loader'

import {
  getUserDetails,
  updateUserProfile,
  sendEmailChangeOtp,
  verifyEmailChangeOtp,
  sendPhoneChangeOtp,
  verifyPhoneChangeOtp,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getAddresses,
} from '../actions/userActions'

import { listMyOrders } from '../actions/orderActions'


const ProfileScreen = ({ settingsOnly = false }) => {
  const history = useHistory()
  const dispatch = useDispatch()

  // baaki code...

  // =========================================================
  // REDUX
  // =========================================================

  const userDetails = useSelector((state) => state.userDetails)

  const {
    loading,
    error,
    user,
  } = userDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderListMy = useSelector((state) => state.orderListMy)

  const {
    loading: loadingOrders,
    error: errorOrders,
    orders,
  } = orderListMy

  // =========================================================
  // PROFILE OVERVIEW
  // =========================================================

  const [profileName, setProfileName] = useState('')
  const [profileEmail, setProfileEmail] = useState('')
  const [profilePhone, setProfilePhone] = useState('')

  // PROFILE PHOTO
  const [profileImage, setProfileImage] = useState('')
  const [photoLoading, setPhotoLoading] = useState(false)

  // =========================================================
  // EDIT PROFILE
  // =========================================================

  const [settingsTab, setSettingsTab] = useState('personal')

  const [nameDraft, setNameDraft] = useState('')
  const [emailDraft, setEmailDraft] = useState('')
  const [phoneDraft, setPhoneDraft] = useState('')

  const [profileMessage, setProfileMessage] = useState('')
  const [profileError, setProfileError] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)

  // =========================================================
  // EMAIL CHANGE
  // =========================================================

  const [emailOtpSent, setEmailOtpSent] = useState(false)
  const [emailOtp, setEmailOtp] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailMessage, setEmailMessage] = useState('')
  const [emailError, setEmailError] = useState('')

  // =========================================================
  // PHONE CHANGE
  // =========================================================

  const [phoneOtpSent, setPhoneOtpSent] = useState(false)
  const [phoneOtp, setPhoneOtp] = useState('')
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [phoneLoading, setPhoneLoading] = useState(false)
  const [phoneMessage, setPhoneMessage] = useState('')
  const [phoneError, setPhoneError] = useState('')

  // =========================================================
  // ADDRESSES
  // =========================================================

  const emptyAddress = {
    fullName: '',
    phone: '',
    house: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    addressType: 'Home',
    isDefault: false,
  }

  const [addresses, setAddresses] = useState([])

  const [showAddressForm, setShowAddressForm] =
    useState(false)

  const [editingAddressId, setEditingAddressId] =
    useState(null)

  const [addressForm, setAddressForm] =
    useState(emptyAddress)

  const [addressLoading, setAddressLoading] =
    useState(false)

  const [addressError, setAddressError] =
    useState('')

  const [addressMessage, setAddressMessage] =
    useState('')

  // =========================================================
  // LOAD USER + ORDERS
  // =========================================================

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
      return
    }

    dispatch(getUserDetails('profile'))

    if (!settingsOnly) {
      dispatch(listMyOrders())
    }
  }, [dispatch, history, userInfo, settingsOnly])

  // =========================================================
  // SET PROFILE DATA
  // =========================================================

useEffect(() => {
  if (!user) return

  setProfileName(user.name || '')
  setProfileEmail(user.email || '')
  setProfilePhone(user.phone || '')
  setProfileImage(user.profileImage || '')

  setNameDraft(user.name || '')
  setEmailDraft(user.email || '')
  setPhoneDraft(user.phone || '')

  setAddresses(user.addresses || [])
}, [user])

  // =========================================================
  // OPEN ACCOUNT SETTINGS PAGE
  // =========================================================

  const openSettings = () => {
    history.push('/account-settings')
  }

  // =========================================================
  // CLOSE ACCOUNT SETTINGS PAGE
  // =========================================================

  const closeSettings = () => {
    history.push('/profile')
  }

  // =========================================================
  // CHANGE SETTINGS TAB
  // =========================================================

  const changeSettingsTab = async (tab) => {
    setSettingsTab(tab)

    setProfileMessage('')
    setProfileError('')
    setAddressMessage('')
    setAddressError('')

    if (tab === 'addresses') {
      try {
        const data = await dispatch(getAddresses())

        if (data && data.addresses) {
          setAddresses(data.addresses)
        }
      } catch (err) {
        setAddressError(
          err?.response?.data?.message ||
            err?.message ||
            'Unable to load addresses.'
        )
      }
    }
  }


  // =========================================================
  // PROFILE PHOTO
  // =========================================================

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setProfileError('Please select an image file.')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setProfileError('Profile photo must be smaller than 2 MB.')
      return
    }

    const reader = new FileReader()

    reader.onloadend = async () => {
      try {
        setProfileError('')
        setProfileMessage('')
        setPhotoLoading(true)

        const imageData = reader.result

        await dispatch(
          updateUserProfile({
            id: user?._id,
            name: nameDraft.trim() || profileName,
            profileImage: imageData,
          })
        )

        setProfileImage(imageData)
        setProfileMessage('Profile photo updated successfully.')
        dispatch(getUserDetails('profile'))
      } catch (err) {
        setProfileError(
          err?.response?.data?.message ||
            err?.message ||
            'Unable to update profile photo.'
        )
      } finally {
        setPhotoLoading(false)
      }
    }

    reader.readAsDataURL(file)
  }

  // =========================================================
  // SAVE BASIC PROFILE
  // =========================================================

  const saveProfile = async (e) => {
    e.preventDefault()

    setProfileMessage('')
    setProfileError('')

    if (!nameDraft.trim()) {
      setProfileError('Please enter your name.')
      return
    }

    const emailChanged =
      emailDraft.trim().toLowerCase() !==
      profileEmail.trim().toLowerCase()

    const phoneChanged =
      phoneDraft.trim() !== profilePhone.trim()

    if (emailChanged && !emailVerified) {
      setProfileError(
        'Please verify your new email address with OTP before saving.'
      )
      return
    }

    if (phoneChanged && !phoneVerified) {
      setProfileError(
        'Please verify your new mobile number with OTP before saving.'
      )
      return
    }

    if (!user) {
      setProfileError('User details are not loaded.')
      return
    }

    setProfileSaving(true)

    try {
      await dispatch(
        updateUserProfile({
          id: user._id,
          name: nameDraft.trim(),
          profileImage,
        })
      )

      setProfileName(nameDraft.trim())

      setProfileMessage(
        'Profile information updated successfully.'
      )

      setEmailVerified(false)
      setPhoneVerified(false)

      dispatch(getUserDetails('profile'))
    } catch (err) {
      setProfileError(
        err?.response?.data?.message ||
          err?.message ||
          'Unable to update profile.'
      )
    } finally {
      setProfileSaving(false)
    }
  }

  // =========================================================
  // EMAIL INPUT
  // =========================================================

  const emailInputHandler = (e) => {
    const value = e.target.value

    setEmailDraft(value)

    setEmailOtpSent(false)
    setEmailOtp('')
    setEmailVerified(false)

    setEmailMessage('')
    setEmailError('')
  }

  // =========================================================
  // SEND EMAIL OTP
  // =========================================================

  const handleSendEmailOtp = async () => {
    setEmailError('')
    setEmailMessage('')

    const cleanEmail =
      emailDraft.trim().toLowerCase()

    if (!cleanEmail) {
      setEmailError(
        'Please enter your new email address.'
      )
      return
    }

    if (cleanEmail === profileEmail.toLowerCase()) {
      setEmailError(
        'This is already your current email address.'
      )
      return
    }

    setEmailLoading(true)

    try {
      await dispatch(
        sendEmailChangeOtp(cleanEmail)
      )

      setEmailOtpSent(true)
      setEmailOtp('')
      setEmailMessage(
        `Verification OTP sent to ${cleanEmail}.`
      )
    } catch (err) {
      setEmailError(
        err?.response?.data?.message ||
          err?.message ||
          'Unable to send email OTP.'
      )
    } finally {
      setEmailLoading(false)
    }
  }

  // =========================================================
  // VERIFY EMAIL OTP
  // =========================================================

  const handleVerifyEmailOtp = async () => {
    setEmailError('')
    setEmailMessage('')

    if (!emailOtp || emailOtp.length !== 6) {
      setEmailError(
        'Please enter the 6-digit OTP.'
      )
      return
    }

    setEmailLoading(true)

    try {
    await dispatch(
  verifyEmailChangeOtp(
    emailDraft.trim().toLowerCase(),
    emailOtp
  )
)

      setEmailVerified(true)
      setEmailOtpSent(false)
      setEmailOtp('')

      setProfileEmail(
        emailDraft.trim().toLowerCase()
      )

      setEmailMessage(
        'Email verified and changed successfully.'
      )
    } catch (err) {
      setEmailError(
        err?.response?.data?.message ||
          err?.message ||
          'Email verification failed.'
      )
    } finally {
      setEmailLoading(false)
    }
  }

  // =========================================================
  // CANCEL EMAIL CHANGE
  // =========================================================

  const cancelEmailChange = () => {
    setEmailDraft(profileEmail)
    setEmailOtp('')
    setEmailOtpSent(false)
    setEmailVerified(false)
    setEmailMessage('')
    setEmailError('')
  }

  // =========================================================
  // PHONE INPUT
  // =========================================================

  const phoneInputHandler = (e) => {
    const value = e.target.value.replace(/\D/g, '')

    setPhoneDraft(value)

    setPhoneOtpSent(false)
    setPhoneOtp('')
    setPhoneVerified(false)

    setPhoneMessage('')
    setPhoneError('')
  }

  // =========================================================
  // SEND PHONE OTP
  // =========================================================

  const handleSendPhoneOtp = async () => {
    setPhoneError('')
    setPhoneMessage('')

    const cleanPhone =
      phoneDraft.trim()

    if (!cleanPhone) {
      setPhoneError(
        'Please enter your new mobile number.'
      )
      return
    }

    if (cleanPhone === profilePhone.trim()) {
      setPhoneError(
        'This is already your current mobile number.'
      )
      return
    }

    if (cleanPhone.length < 10) {
      setPhoneError(
        'Please enter a valid mobile number.'
      )
      return
    }

    setPhoneLoading(true)

    try {
      await dispatch(
        sendPhoneChangeOtp(cleanPhone)
      )

      setPhoneOtpSent(true)
      setPhoneOtp('')

      setPhoneMessage(
        'Verification OTP generated successfully.'
      )
    } catch (err) {
      setPhoneError(
        err?.response?.data?.message ||
          err?.message ||
          'Unable to generate mobile OTP.'
      )
    } finally {
      setPhoneLoading(false)
    }
  }

  // =========================================================
  // VERIFY PHONE OTP
  // =========================================================

  const handleVerifyPhoneOtp = async () => {
    setPhoneError('')
    setPhoneMessage('')

    if (!phoneOtp || phoneOtp.length !== 6) {
      setPhoneError(
        'Please enter the 6-digit OTP.'
      )
      return
    }

    setPhoneLoading(true)

    try {
      await dispatch(
        verifyPhoneChangeOtp(phoneOtp)
      )

      setPhoneVerified(true)
      setPhoneOtpSent(false)
      setPhoneOtp('')

      setProfilePhone(
        phoneDraft.trim()
      )

      setPhoneMessage(
        'Mobile number verified and changed successfully.'
      )
    } catch (err) {
      setPhoneError(
        err?.response?.data?.message ||
          err?.message ||
          'Mobile verification failed.'
      )
    } finally {
      setPhoneLoading(false)
    }
  }

  // =========================================================
  // CANCEL PHONE CHANGE
  // =========================================================

  const cancelPhoneChange = () => {
    setPhoneDraft(profilePhone)
    setPhoneOtp('')
    setPhoneOtpSent(false)
    setPhoneVerified(false)
    setPhoneMessage('')
    setPhoneError('')
  }

  // =========================================================
  // ADDRESS INPUT
  // =========================================================

  const addressInputHandler = (e) => {
    const { name, value } = e.target

    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // =========================================================
  // OPEN ADD ADDRESS
  // =========================================================

  const openAddAddress = () => {
    setEditingAddressId(null)
    setAddressForm({
      ...emptyAddress,
      fullName: profileName,
      phone: profilePhone,
    })

    setAddressError('')
    setAddressMessage('')
    setShowAddressForm(true)
  }

  // =========================================================
  // OPEN EDIT ADDRESS
  // =========================================================

  const openEditAddress = (address) => {
    setEditingAddressId(address._id)

    setAddressForm({
      fullName: address.fullName || '',
      phone: address.phone || '',
      house: address.house || '',
      area: address.area || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      addressType:
        address.addressType || 'Home',
      isDefault:
        address.isDefault || false,
    })

    setAddressError('')
    setAddressMessage('')
    setShowAddressForm(true)
  }

  // =========================================================
  // CANCEL ADDRESS
  // =========================================================

  const cancelAddressForm = () => {
    setShowAddressForm(false)
    setEditingAddressId(null)
    setAddressForm(emptyAddress)
    setAddressError('')
  }

  // =========================================================
  // SAVE ADDRESS
  // =========================================================

  const saveAddress = async (e) => {
    e.preventDefault()

    setAddressError('')
    setAddressMessage('')

    const requiredFields = [
      'fullName',
      'phone',
      'house',
      'area',
      'city',
      'state',
      'pincode',
    ]

    const missingField =
      requiredFields.find(
        (field) =>
          !String(addressForm[field] || '').trim()
      )

    if (missingField) {
      setAddressError(
        'Please fill all required address fields.'
      )
      return
    }

    setAddressLoading(true)

    try {
      let data

      if (editingAddressId) {
        data = await dispatch(
          updateAddress(
            editingAddressId,
            {
              ...addressForm,
              phone:
                addressForm.phone.trim(),
              pincode:
                addressForm.pincode.trim(),
            }
          )
        )
      } else {
        data = await dispatch(
          addAddress({
            ...addressForm,
            phone:
              addressForm.phone.trim(),
            pincode:
              addressForm.pincode.trim(),
          })
        )
      }

      if (data && data.addresses) {
        setAddresses(data.addresses)
      }

      setAddressMessage(
        editingAddressId
          ? 'Address updated successfully.'
          : 'Address added successfully.'
      )

      setShowAddressForm(false)
      setEditingAddressId(null)
      setAddressForm(emptyAddress)
    } catch (err) {
      setAddressError(
        err?.response?.data?.message ||
          err?.message ||
          'Unable to save address.'
      )
    } finally {
      setAddressLoading(false)
    }
  }

  // =========================================================
  // DELETE ADDRESS
  // =========================================================

  const handleDeleteAddress = async (
    addressId
  ) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this address?'
    )

    if (!confirmed) return

    setAddressError('')
    setAddressMessage('')
    setAddressLoading(true)

    try {
      const data = await dispatch(
        deleteAddress(addressId)
      )

      if (data && data.addresses) {
        setAddresses(data.addresses)
      }

      setAddressMessage(
        'Address deleted successfully.'
      )
    } catch (err) {
      setAddressError(
        err?.response?.data?.message ||
          err?.message ||
          'Unable to delete address.'
      )
    } finally {
      setAddressLoading(false)
    }
  }

  // =========================================================
  // DEFAULT ADDRESS
  // =========================================================

  const handleSetDefaultAddress = async (
    addressId
  ) => {
    setAddressError('')
    setAddressMessage('')
    setAddressLoading(true)

    try {
      const data = await dispatch(
        setDefaultAddress(addressId)
      )

      if (data && data.addresses) {
        setAddresses(data.addresses)
      }

      setAddressMessage(
        'Default address updated successfully.'
      )
    } catch (err) {
      setAddressError(
        err?.response?.data?.message ||
          err?.message ||
          'Unable to set default address.'
      )
    } finally {
      setAddressLoading(false)
    }
  }


  // =========================================================
  // INVOICE - PRINT / SAVE AS PDF
  // =========================================================

  const downloadInvoice = (order) => {
    if (!order) return

    const items = Array.isArray(order.orderItems) ? order.orderItems : []

    const rows = items.length
      ? items.map((item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${item.name || 'Product'}</td>
            <td>${item.qty || 1}</td>
            <td>₹${Number(item.price || 0).toFixed(2)}</td>
            <td>₹${(Number(item.price || 0) * Number(item.qty || 1)).toFixed(2)}</td>
          </tr>
        `).join('')
      : '<tr><td colspan="5">No item details available</td></tr>'

    const customerName = order.user?.name || profileName || 'Customer'
    const customerEmail = order.user?.email || profileEmail || ''

    const invoiceWindow = window.open('', '_blank', 'width=900,height=700')

    if (!invoiceWindow) {
      setProfileError('Please allow pop-ups to download the invoice.')
      return
    }

    invoiceWindow.document.write(`<!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>CartNova Invoice</title>
        <style>
          body{font-family:Arial,sans-serif;padding:35px;color:#222}
          .invoice{max-width:850px;margin:auto}
          .head{display:flex;justify-content:space-between;border-bottom:2px solid #222;padding-bottom:18px}
          h1{margin:0}.muted{color:#666}.info{display:flex;justify-content:space-between;margin:25px 0}
          table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:10px;text-align:left}
          th{background:#f3f3f3}.totals{width:300px;margin:20px 0 0 auto}
          .row{display:flex;justify-content:space-between;padding:7px 0}
          .grand{border-top:2px solid #222;font-size:18px;font-weight:bold;padding-top:10px}
          .footer{text-align:center;margin-top:40px;color:#666}
          @media print{body{padding:0}}
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="head">
            <div><h1>CartNova</h1><div class="muted">Order Invoice</div></div>
            <div><b>Order #${order._id || '-'}</b><br/>
              ${order.createdAt ? String(order.createdAt).substring(0,10) : '-'}</div>
          </div>
          <div class="info">
            <div><b>Bill To</b><br/>${customerName}<br/>${customerEmail}</div>
            <div><b>Payment</b><br/>${order.isPaid ? 'Paid' : 'Unpaid'}<br/>
              ${order.isDelivered ? 'Delivered' : 'Processing'}</div>
          </div>
          <table>
            <thead><tr><th>#</th><th>Product</th><th>Qty</th><th>Price</th><th>Amount</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
          <div class="totals">
            <div class="row"><span>Items Price</span><span>₹${Number(order.itemsPrice || 0).toFixed(2)}</span></div>
            <div class="row"><span>Shipping</span><span>₹${Number(order.shippingPrice || 0).toFixed(2)}</span></div>
            <div class="row"><span>Tax</span><span>₹${Number(order.taxPrice || 0).toFixed(2)}</span></div>
            <div class="row grand"><span>Total</span><span>₹${Number(order.totalPrice || 0).toFixed(2)}</span></div>
          </div>
          <div class="footer">Thank you for shopping with CartNova.</div>
        </div>
        <script>window.onload=function(){window.print();}</script>
      </body>
      </html>`)

    invoiceWindow.document.close()
  }

  // =========================================================
  // INITIAL LOADING
  // =========================================================

  if (loading && !user) {
    return (
      <div className='cn-profile-loading'>
        <Loader />
      </div>
    )
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className='cn-profile-page'>
      <style>{`
        .cn-profile-avatar{position:relative;overflow:visible}
        .cn-profile-avatar-image{width:100%;height:100%;object-fit:cover;border-radius:50%;display:block}
        .cn-profile-photo-button{position:absolute;right:-4px;bottom:-4px;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;background:#fff;box-shadow:0 2px 10px rgba(0,0,0,.18);border:1px solid #ddd;z-index:2}
        .cn-profile-photo-link{display:inline-flex;align-items:center;gap:6px;margin-top:8px;cursor:pointer;font-weight:600}
        .cartnova-profile-orders-list{width:100%;display:flex;flex-direction:column}
        .cartnova-profile-order-row{display:grid !important;grid-template-columns:minmax(220px,1.8fr) 90px 100px 110px 125px 165px;align-items:center;gap:14px;width:100%;padding:14px 0;border-bottom:1px solid #edf0f3;box-sizing:border-box}
        .cartnova-profile-order-product{display:flex;align-items:center;gap:10px;min-width:0}
        .cartnova-profile-order-product img{width:52px;height:52px;flex:0 0 52px;object-fit:cover;border-radius:8px;border:1px solid #e5e5e5}
        .cartnova-profile-order-product strong{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:190px}
        .cartnova-profile-order-product small{display:block;margin-top:3px;opacity:.7}
        .cartnova-profile-order-id-box,.cartnova-profile-order-date,.cartnova-profile-order-total,.cartnova-profile-order-status{min-width:0}
        .cartnova-profile-order-actions{display:flex !important;align-items:center;justify-content:flex-end;gap:8px;min-width:0}
        .cartnova-profile-order-details{width:38px !important;height:38px !important;display:flex !important;align-items:center;justify-content:center;border-radius:9px;text-decoration:none}
        .cartnova-profile-order-invoice{width:auto !important;min-width:128px !important;height:42px !important;border:0 !important;background:#eaf3ff !important;color:#1976d2 !important;padding:8px 14px !important;border-radius:10px !important;cursor:pointer;font-weight:600;white-space:nowrap;box-shadow:none !important}
        @media (max-width:1100px){
          .cartnova-profile-order-row{grid-template-columns:minmax(190px,1.6fr) 80px 95px 95px 110px 150px;gap:9px}
          .cartnova-profile-order-invoice{min-width:118px !important;padding:8px 10px !important}
        }
        @media (max-width:850px){
          .cartnova-profile-order-row{grid-template-columns:1fr 1fr;gap:12px}
          .cartnova-profile-order-product{grid-column:1 / -1}
          .cartnova-profile-order-actions{justify-content:flex-start}
        }
      `}</style>

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className='cn-profile-header'>

        <div>
          <span className='cn-profile-eyebrow'>
            ACCOUNT
          </span>

          <h1>
            {settingsOnly ? 'Account Settings' : 'My Profile'}
          </h1>

          <p>
            {settingsOnly
              ? 'Update your profile, security and saved addresses.'
              : 'Manage your personal information and view your orders.'}
          </p>
        </div>

        <div className='cn-profile-header-icon'>
          <i className='fas fa-user'></i>
        </div>

      </div>

      {!settingsOnly && (
        <>
          {/* =====================================================
              MAIN GRID
          ===================================================== */}

          <div className='cn-profile-main-grid'>

        {/* ===================================================
            PROFILE OVERVIEW
        =================================================== */}

        <section className='cn-profile-overview-card'>

          <div className='cn-profile-overview-top'>

            <div className='cn-profile-avatar'>
              {profileImage ? (
                <img
                  src={profileImage}
                  alt='Profile'
                  className='cn-profile-avatar-image'
                />
              ) : (
                <i className='fas fa-user'></i>
              )}

              <label
                htmlFor='profile-photo-input'
                className='cn-profile-photo-button'
                title='Change Photo'
              >
                <i className='fas fa-camera'></i>
              </label>

              <input
                id='profile-photo-input'
                type='file'
                accept='image/*'
                onChange={handleProfilePhotoChange}
                disabled={photoLoading}
                style={{ display: 'none' }}
              />
            </div>

            <div className='cn-profile-overview-heading'>

              <span className='cn-profile-small-label'>
                ACCOUNT PROFILE
              </span>

              <h2>
                {profileName || 'Your Profile'}
              </h2>

              <p>
                Your account information
              </p>

              <label
                htmlFor='profile-photo-input'
                className='cn-profile-photo-link'
              >
                <i className='fas fa-camera'></i>
                {photoLoading ? 'Saving Photo...' : 'Change Photo'}
              </label>

            </div>

          </div>

          {/* PROFILE INFORMATION */}

          <div className='cn-profile-info-list'>

            {/* NAME */}

            <div className='cn-profile-info-item'>

              <div className='cn-profile-info-icon'>
                <i className='fas fa-user'></i>
              </div>

              <div className='cn-profile-info-content'>
                <span>
                  Full Name
                </span>

                <strong>
                  {profileName || '-'}
                </strong>
              </div>

            </div>

            {/* EMAIL */}

            <div className='cn-profile-info-item'>

              <div className='cn-profile-info-icon'>
                <i className='fas fa-envelope'></i>
              </div>

              <div className='cn-profile-info-content'>

                <span>
                  Email Address
                </span>

                <strong>
                  {profileEmail || '-'}
                </strong>

                {user?.isEmailVerified && (
                  <small className='cn-verified-badge'>
                    <i className='fas fa-check-circle'></i>
                    Verified
                  </small>
                )}

              </div>

            </div>

            {/* MOBILE */}

            <div className='cn-profile-info-item'>

              <div className='cn-profile-info-icon'>
                <i className='fas fa-mobile-alt'></i>
              </div>

              <div className='cn-profile-info-content'>

                <span>
                  Mobile Number
                </span>

                <strong>
                  {profilePhone || '-'}
                </strong>

                {user?.isPhoneVerified && (
                  <small className='cn-verified-badge'>
                    <i className='fas fa-check-circle'></i>
                    Verified
                  </small>
                )}

              </div>

            </div>

          </div>

          {/* EDIT BUTTON */}

          <div className='cn-profile-overview-footer'>

            <Button
              type='button'
              className='cn-edit-profile-button'
              onClick={openSettings}
            >
              <i className='fas fa-user-edit'></i>
              Edit Profile
            </Button>

          </div>

        </section>

        {/* ===================================================
            MY ORDERS
        =================================================== */}

        <section className='cn-profile-orders-wrapper'>

          <div className='cartnova-profile-orders-card'>

            <div className='cartnova-profile-orders-header'>

              <div className='cartnova-profile-orders-title'>

                <div className='cartnova-profile-orders-icon'>
                  <i className='fas fa-shopping-bag'></i>
                </div>

                <div>

                  <h2>
                    My Orders
                  </h2>

                  <span>
                    Your recent order history
                  </span>

                </div>

              </div>

              <Link
                to='/myorders'
                className='cartnova-profile-view-all'
              >
                View All
                <i className='fas fa-arrow-right'></i>
              </Link>

            </div>

            {/* ORDERS LOADING */}

            {loadingOrders ? (

              <div className='cartnova-profile-orders-loader'>
                <Loader />
              </div>

            ) : errorOrders ? (

              <div className='cartnova-profile-orders-message'>

                <Message variant='danger'>
                  {errorOrders}
                </Message>

              </div>

            ) : orders &&
              orders.length > 0 ? (

              <div className='cartnova-profile-orders-list'>

                {orders
                  .slice(0, 5)
                  .map((order) => (

                    <div
                      className='cartnova-profile-order-row'
                      key={order._id}
                    >

                      {/* PRODUCT IMAGE */}

                      <div className='cartnova-profile-order-product'>
                        {order.orderItems && order.orderItems.length > 0 ? (
                          <>
                            <img
                              src={
                                order.orderItems[0].image ||
                                '/images/placeholder.png'
                              }
                              alt={
                                order.orderItems[0].name ||
                                'Ordered product'
                              }
                              className='cartnova-order-item-image'
                            />
                            <div>
                              <strong>
                                {order.orderItems[0].name || 'Ordered Product'}
                              </strong>
                              {order.orderItems.length > 1 && (
                                <small>
                                  + {order.orderItems.length - 1} more item
                                  {order.orderItems.length - 1 > 1 ? 's' : ''}
                                </small>
                              )}
                            </div>
                          </>
                        ) : (
                          <div>
                            <i className='fas fa-box'></i> Order items
                          </div>
                        )}
                      </div>

                      {/* ORDER ID */}

                      <div className='cartnova-profile-order-id-box'>

                        <span>
                          ORDER
                        </span>

                        <strong>
                          #{order._id.slice(-8)}
                        </strong>

                      </div>

                      {/* DATE */}

                      <div className='cartnova-profile-order-date'>

                        <span>
                          DATE
                        </span>

                        <strong>
                          {order.createdAt
                            ? order.createdAt.substring(
                                0,
                                10
                              )
                            : '-'}
                        </strong>

                      </div>

                      {/* TOTAL */}

                      <div className='cartnova-profile-order-total'>

                        <span>
                          TOTAL
                        </span>

                        <strong>
                          ₹{order.totalPrice}
                        </strong>

                      </div>

                      {/* STATUS */}

                      <div className='cartnova-profile-order-status'>

                        {order.isPaid ? (

                          <span className='cartnova-profile-status paid'>
                            <i className='fas fa-check-circle'></i>
                            Paid
                          </span>

                        ) : (

                          <span className='cartnova-profile-status unpaid'>
                            <i className='fas fa-clock'></i>
                            Unpaid
                          </span>

                        )}

                        {order.isDelivered ? (

                          <span className='cartnova-profile-status delivered'>
                            <i className='fas fa-check-circle'></i>
                            Delivered
                          </span>

                        ) : (

                          <span className='cartnova-profile-status pending'>
                            <i className='fas fa-truck'></i>
                            Pending
                          </span>

                        )}

                      </div>

                      {/* DETAILS */}

                      <div className='cartnova-profile-order-actions'>
                        <Link
                          to={`/order/${order._id}`}
                          className='cartnova-profile-order-details'
                          title='View Order'
                        >
                          <i className='fas fa-eye'></i>
                        </Link>

                        <Button
                          type='button'
                          className='cartnova-profile-order-invoice'
                          onClick={() => downloadInvoice(order)}
                          title='Download Invoice / Save as PDF'
                        >
                          <i className='fas fa-file-invoice'></i>
                        </Button>
                      </div>

                    </div>

                  ))}

              </div>

            ) : (

              <div className='cartnova-profile-no-orders'>

                <div>
                  <i className='fas fa-shopping-bag'></i>
                </div>

                <h3>
                  No Orders Yet
                </h3>

                <p>
                  Your recent orders will
                  appear here.
                </p>

                <Link
                  to='/'
                  className='cartnova-profile-shop-button'
                >
                  <i className='fas fa-shopping-cart'></i>
                  Start Shopping
                </Link>

              </div>

            )}

          </div>

        </section>

          </div>
        </>
      )}

      {/* =====================================================
          ACCOUNT SETTINGS PAGE
      ===================================================== */}

      {settingsOnly && (

        <section className='cn-settings-card'>

          {/* SETTINGS HEADER */}

          <div className='cn-settings-header'>

            <div>

              <span className='cn-profile-eyebrow'>
                ACCOUNT SETTINGS
              </span>

              <h2>
                Edit Profile
              </h2>

              <p>
                Update your information and manage
                your account settings.
              </p>

            </div>

            <button
              type='button'
              className='cn-settings-close'
              onClick={closeSettings}
              aria-label='Close settings'
            >
              <i className='fas fa-times'></i>
            </button>

          </div>

          {/* SETTINGS TABS */}

          <div className='cn-settings-tabs'>

            <button
              type='button'
              className={
                settingsTab === 'personal'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                changeSettingsTab('personal')
              }
            >
              <i className='fas fa-user'></i>
              Personal Information
            </button>

            <button
              type='button'
              className={
                settingsTab === 'security'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                changeSettingsTab('security')
              }
            >
              <i className='fas fa-shield-alt'></i>
              Security
            </button>

            <button
              type='button'
              className={
                settingsTab === 'addresses'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                changeSettingsTab('addresses')
              }
            >
              <i className='fas fa-map-marker-alt'></i>
              Saved Addresses
            </button>

          </div>

          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          {settingsTab === 'personal' && (

            <div className='cn-settings-content'>

              {(profileError || error) && (
                <Message variant='danger'>
                  {profileError || error}
                </Message>
              )}

              {profileMessage && (
                <Message variant='success'>
                  {profileMessage}
                </Message>
              )}

              {/* NAME */}

              <div className='cn-settings-section'>

                <div className='cn-settings-section-heading'>

                  <div className='cn-settings-section-icon'>
                    <i className='fas fa-user'></i>
                  </div>

                  <div>
                    <h3>
                      Personal Information
                    </h3>

                    <p>
                      Update your basic account information.
                    </p>
                  </div>

                </div>

                <Form
                  onSubmit={saveProfile}
                  className='cn-settings-form'
                >

                  <div className='cn-form-field'>

                    <Form.Label>
                      Full Name
                    </Form.Label>

                    <Form.Control
                      type='text'
                      value={nameDraft}
                      placeholder='Enter your full name'
                      onChange={(e) =>
                        setNameDraft(
                          e.target.value
                        )
                      }
                    />

                  </div>

                  {/* EMAIL */}

                  <div className='cn-settings-change-block'>

                    <div className='cn-settings-change-header'>

                      <div>

                        <Form.Label>
                          Email Address
                        </Form.Label>

                        <p>
                          {profileEmail}
                        </p>

                      </div>

                      {user?.isEmailVerified && (
                        <span className='cn-verified-badge'>
                          <i className='fas fa-check-circle'></i>
                          Verified
                        </span>
                      )}

                    </div>

                    <div className='cn-change-input-row'>

                      <Form.Control
                        type='email'
                        value={emailDraft}
                        onChange={
                          emailInputHandler
                        }
                        placeholder='Enter new email address'
                      />

                      {emailDraft
                        .trim()
                        .toLowerCase() !==
                        profileEmail
                          .trim()
                          .toLowerCase() && (

                        <Button
                          type='button'
                          className='cn-secondary-action'
                          onClick={
                            handleSendEmailOtp
                          }
                          disabled={emailLoading}
                        >
                          {emailLoading
                            ? 'Sending...'
                            : 'Send OTP'}
                        </Button>

                      )}

                    </div>

                    {emailError && (
                      <div className='cn-inline-message error'>
                        {emailError}
                      </div>
                    )}

                    {emailMessage && (
                      <div className='cn-inline-message success'>
                        {emailMessage}
                      </div>
                    )}

                    {emailOtpSent && (

                      <div className='cn-otp-box'>

                        <div className='cn-otp-heading'>
                          <i className='fas fa-envelope-open-text'></i>

                          <div>
                            <strong>
                              Verify New Email
                            </strong>

                            <span>
                              Enter the 6-digit OTP sent
                              to your new email.
                            </span>
                          </div>
                        </div>

                        <div className='cn-change-input-row'>

                          <Form.Control
                            type='text'
                            inputMode='numeric'
                            maxLength='6'
                            value={emailOtp}
                            placeholder='Enter 6-digit OTP'
                            onChange={(e) =>
                              setEmailOtp(
                                e.target.value.replace(
                                  /\D/g,
                                  ''
                                )
                              )
                            }
                          />

                          <Button
                            type='button'
                            className='cn-verify-button'
                            onClick={
                              handleVerifyEmailOtp
                            }
                            disabled={
                              emailLoading
                            }
                          >
                            {emailLoading
                              ? 'Verifying...'
                              : 'Verify Email'}
                          </Button>

                          <Button
                            type='button'
                            variant='light'
                            className='cn-cancel-button'
                            onClick={
                              cancelEmailChange
                            }
                          >
                            Cancel
                          </Button>

                        </div>

                      </div>

                    )}

                    {emailVerified && (
                      <div className='cn-verification-success'>
                        <i className='fas fa-check-circle'></i>
                        New email address verified successfully.
                      </div>
                    )}

                  </div>

                  {/* MOBILE */}

                  <div className='cn-settings-change-block'>

                    <div className='cn-settings-change-header'>

                      <div>

                        <Form.Label>
                          Mobile Number
                        </Form.Label>

                        <p>
                          {profilePhone}
                        </p>

                      </div>

                      {user?.isPhoneVerified && (
                        <span className='cn-verified-badge'>
                          <i className='fas fa-check-circle'></i>
                          Verified
                        </span>
                      )}

                    </div>

                    <div className='cn-change-input-row'>

                      <Form.Control
                        type='tel'
                        inputMode='numeric'
                        maxLength='15'
                        value={phoneDraft}
                        onChange={
                          phoneInputHandler
                        }
                        placeholder='Enter new mobile number'
                      />

                      {phoneDraft.trim() !==
                        profilePhone.trim() && (

                        <Button
                          type='button'
                          className='cn-secondary-action'
                          onClick={
                            handleSendPhoneOtp
                          }
                          disabled={phoneLoading}
                        >
                          {phoneLoading
                            ? 'Sending...'
                            : 'Send OTP'}
                        </Button>

                      )}

                    </div>

                    {phoneError && (
                      <div className='cn-inline-message error'>
                        {phoneError}
                      </div>
                    )}

                    {phoneMessage && (
                      <div className='cn-inline-message success'>
                        {phoneMessage}
                      </div>
                    )}

                    {phoneOtpSent && (

                      <div className='cn-otp-box'>

                        <div className='cn-otp-heading'>
                          <i className='fas fa-mobile-alt'></i>

                          <div>
                            <strong>
                              Verify New Mobile
                            </strong>

                            <span>
                              Enter the 6-digit OTP for
                              your new mobile number.
                            </span>
                          </div>
                        </div>

                        <div className='cn-change-input-row'>

                          <Form.Control
                            type='text'
                            inputMode='numeric'
                            maxLength='6'
                            value={phoneOtp}
                            placeholder='Enter 6-digit OTP'
                            onChange={(e) =>
                              setPhoneOtp(
                                e.target.value.replace(
                                  /\D/g,
                                  ''
                                )
                              )
                            }
                          />

                          <Button
                            type='button'
                            className='cn-verify-button'
                            onClick={
                              handleVerifyPhoneOtp
                            }
                            disabled={
                              phoneLoading
                            }
                          >
                            {phoneLoading
                              ? 'Verifying...'
                              : 'Verify Mobile'}
                          </Button>

                          <Button
                            type='button'
                            variant='light'
                            className='cn-cancel-button'
                            onClick={
                              cancelPhoneChange
                            }
                          >
                            Cancel
                          </Button>

                        </div>

                      </div>

                    )}

                    {phoneVerified && (
                      <div className='cn-verification-success'>
                        <i className='fas fa-check-circle'></i>
                        New mobile number verified successfully.
                      </div>
                    )}

                  </div>

                  {/* SAVE */}

                  <div className='cn-settings-form-footer'>

                    <Button
                      type='submit'
                      className='cn-save-profile-button'
                      disabled={profileSaving}
                    >
                      <i className='fas fa-save'></i>

                      {profileSaving
                        ? 'Saving...'
                        : 'Save Profile Changes'}
                    </Button>

                  </div>

                </Form>

              </div>

            </div>

          )}

          {/* =================================================
              SECURITY
          ================================================= */}

          {settingsTab === 'security' && (

            <div className='cn-settings-content'>

              <div className='cn-settings-section'>

                <div className='cn-settings-section-heading'>

                  <div className='cn-settings-section-icon security'>
                    <i className='fas fa-shield-alt'></i>
                  </div>

                  <div>
                    <h3>
                      Password & Security
                    </h3>

                    <p>
                      Keep your account secure with
                      verified password recovery.
                    </p>
                  </div>

                </div>

                <div className='cn-security-card'>

                  <div className='cn-security-icon'>
                    <i className='fas fa-lock'></i>
                  </div>

                  <div className='cn-security-content'>

                    <h4>
                      Password
                    </h4>

                    <p>
                      Reset your password using
                      OTP verification.
                    </p>

                  </div>

                  <Link
                    to='/forgotpassword'
                    className='cn-security-button'
                  >
                    Reset Password
                    <i className='fas fa-arrow-right'></i>
                  </Link>

                </div>

                <div className='cn-security-info'>

                  <i className='fas fa-info-circle'></i>

                  <span>
                    Never share your password or
                    verification OTP with anyone.
                  </span>

                </div>

              </div>

            </div>

          )}

          {/* =================================================
              SAVED ADDRESSES
          ================================================= */}

          {settingsTab === 'addresses' && (

            <div className='cn-settings-content'>

              {addressError && (
                <Message variant='danger'>
                  {addressError}
                </Message>
              )}

              {addressMessage && (
                <Message variant='success'>
                  {addressMessage}
                </Message>
              )}

              <div className='cn-settings-section'>

                <div className='cn-address-header'>

                  <div className='cn-settings-section-heading'>

                    <div className='cn-settings-section-icon address'>
                      <i className='fas fa-map-marker-alt'></i>
                    </div>

                    <div>
                      <h3>
                        Saved Addresses
                      </h3>

                      <p>
                        Manage your delivery addresses
                        for faster checkout.
                      </p>
                    </div>

                  </div>

                  <Button
                    type='button'
                    className='cn-add-address-button'
                    onClick={openAddAddress}
                  >
                    <i className='fas fa-plus'></i>
                    Add Address
                  </Button>

                </div>

                {/* ADDRESS FORM */}

                {showAddressForm && (

                  <div className='cn-address-form-card'>

                    <div className='cn-address-form-header'>

                      <div>

                        <h4>
                          {editingAddressId
                            ? 'Edit Address'
                            : 'Add New Address'}
                        </h4>

                        <p>
                          Enter your complete delivery
                          address.
                        </p>

                      </div>

                      <button
                        type='button'
                        className='cn-form-close'
                        onClick={
                          cancelAddressForm
                        }
                      >
                        <i className='fas fa-times'></i>
                      </button>

                    </div>

                    <Form
                      onSubmit={saveAddress}
                      className='cn-address-form'
                    >

                      <div className='cn-address-grid'>

                        <div className='cn-form-field'>

                          <Form.Label>
                            Full Name
                          </Form.Label>

                          <Form.Control
                            name='fullName'
                            value={
                              addressForm.fullName
                            }
                            onChange={
                              addressInputHandler
                            }
                            placeholder='Full name'
                          />

                        </div>

                        <div className='cn-form-field'>

                          <Form.Label>
                            Mobile Number
                          </Form.Label>

                          <Form.Control
                            name='phone'
                            type='tel'
                            value={
                              addressForm.phone
                            }
                            onChange={
                              addressInputHandler
                            }
                            placeholder='Mobile number'
                          />

                        </div>

                        <div className='cn-form-field'>

                          <Form.Label>
                            House / Flat / Building
                          </Form.Label>

                          <Form.Control
                            name='house'
                            value={
                              addressForm.house
                            }
                            onChange={
                              addressInputHandler
                            }
                            placeholder='House / Flat / Building'
                          />

                        </div>

                        <div className='cn-form-field'>

                          <Form.Label>
                            Area / Street
                          </Form.Label>

                          <Form.Control
                            name='area'
                            value={
                              addressForm.area
                            }
                            onChange={
                              addressInputHandler
                            }
                            placeholder='Area / Street'
                          />

                        </div>

                        <div className='cn-form-field'>

                          <Form.Label>
                            City
                          </Form.Label>

                          <Form.Control
                            name='city'
                            value={
                              addressForm.city
                            }
                            onChange={
                              addressInputHandler
                            }
                            placeholder='City'
                          />

                        </div>

                        <div className='cn-form-field'>

                          <Form.Label>
                            State
                          </Form.Label>

                          <Form.Control
                            name='state'
                            value={
                              addressForm.state
                            }
                            onChange={
                              addressInputHandler
                            }
                            placeholder='State'
                          />

                        </div>

                        <div className='cn-form-field'>

                          <Form.Label>
                            Pincode
                          </Form.Label>

                          <Form.Control
                            name='pincode'
                            inputMode='numeric'
                            value={
                              addressForm.pincode
                            }
                            onChange={
                              addressInputHandler
                            }
                            placeholder='Pincode'
                          />

                        </div>

                        <div className='cn-form-field'>

                          <Form.Label>
                            Address Type
                          </Form.Label>

                          <Form.Control
                            as='select'
                            name='addressType'
                            value={
                              addressForm.addressType
                            }
                            onChange={
                              addressInputHandler
                            }
                          >
                            <option value='Home'>
                              Home
                            </option>

                            <option value='Work'>
                              Work
                            </option>

                            <option value='Other'>
                              Other
                            </option>
                          </Form.Control>

                        </div>

                      </div>

                      <div className='cn-default-address-check'>

                        <Form.Check
                          type='checkbox'
                          label='Set as default address'
                          checked={
                            addressForm.isDefault
                          }
                          onChange={(e) =>
                            setAddressForm(
                              (prev) => ({
                                ...prev,
                                isDefault:
                                  e.target.checked,
                              })
                            )
                          }
                        />

                      </div>

                      <div className='cn-address-form-actions'>

                        <Button
                          type='submit'
                          className='cn-save-address-button'
                          disabled={
                            addressLoading
                          }
                        >
                          <i className='fas fa-save'></i>

                          {addressLoading
                            ? 'Saving...'
                            : editingAddressId
                            ? 'Update Address'
                            : 'Save Address'}
                        </Button>

                        <Button
                          type='button'
                          variant='light'
                          className='cn-cancel-address-button'
                          onClick={
                            cancelAddressForm
                          }
                        >
                          Cancel
                        </Button>

                      </div>

                    </Form>

                  </div>

                )}

                {/* ADDRESS LIST */}

                {addresses &&
                addresses.length > 0 ? (

                  <div className='cn-address-list'>

                    {addresses.map((address) => (

                      <div
                        className={
                          address.isDefault
                            ? 'cn-address-card default'
                            : 'cn-address-card'
                        }
                        key={address._id}
                      >

                        <div className='cn-address-card-top'>

                          <div className='cn-address-card-title'>

                            <div className='cn-address-type-icon'>
                              <i
                                className={
                                  address.addressType ===
                                  'Work'
                                    ? 'fas fa-briefcase'
                                    : 'fas fa-home'
                                }
                              ></i>
                            </div>

                            <div>

                              <h4>
                                {address.fullName}
                              </h4>

                              <span>
                                {address.addressType}
                              </span>

                            </div>

                          </div>

                          {address.isDefault && (

                            <span className='cn-default-badge'>
                              <i className='fas fa-check'></i>
                              Default
                            </span>

                          )}

                        </div>

                        <div className='cn-address-details'>

                          <p>
                            {address.house},{' '}
                            {address.area},{' '}
                            {address.city},{' '}
                            {address.state} -{' '}
                            {address.pincode}
                          </p>

                          <span>
                            <i className='fas fa-phone-alt'></i>
                            {address.phone}
                          </span>

                        </div>

                        <div className='cn-address-actions'>

                          {!address.isDefault && (

                            <Button
                              type='button'
                              className='cn-address-default-button'
                              onClick={() =>
                                handleSetDefaultAddress(
                                  address._id
                                )
                              }
                              disabled={
                                addressLoading
                              }
                            >
                              <i className='fas fa-star'></i>
                              Set Default
                            </Button>

                          )}

                          <Button
                            type='button'
                            className='cn-address-edit-button'
                            onClick={() =>
                              openEditAddress(
                                address
                              )
                            }
                          >
                            <i className='fas fa-edit'></i>
                            Edit
                          </Button>

                          <Button
                            type='button'
                            className='cn-address-delete-button'
                            onClick={() =>
                              handleDeleteAddress(
                                address._id
                              )
                            }
                            disabled={
                              addressLoading
                            }
                          >
                            <i className='fas fa-trash'></i>
                            Delete
                          </Button>

                        </div>

                      </div>

                    ))}

                  </div>

                ) : (

                  <div className='cn-no-addresses'>

                    <div className='cn-no-address-icon'>
                      <i className='fas fa-map-marker-alt'></i>
                    </div>

                    <h4>
                      No Saved Addresses
                    </h4>

                    <p>
                      Add your first delivery address
                      for a faster checkout experience.
                    </p>

                    <Button
                      type='button'
                      className='cn-add-first-address'
                      onClick={
                        openAddAddress
                      }
                    >
                      <i className='fas fa-plus'></i>
                      Add Your First Address
                    </Button>

                  </div>

                )}

              </div>

            </div>

          )}

        </section>

      )}

    </div>
  )
}

export default ProfileScreen