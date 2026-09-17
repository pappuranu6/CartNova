import { useHistory } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import jsPDF from 'jspdf'

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
  // INVOICE - DIRECT PDF DOWNLOAD
  // =========================================================

  const downloadInvoice = (order) => {
    if (!order) return

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const items = Array.isArray(order.orderItems)
      ? order.orderItems
      : []

    // =====================================================
    // PRICE CALCULATION
    // =====================================================

    const itemsPrice = items.reduce(
      (sum, item) =>
        sum +
        Number(item.price || 0) *
          Number(item.qty || 1),
      0
    )

    // Big Sale discount percentage. If order item has no saved
    // dealDiscount, use the current Big Sale rate of 10%.
    const dealDiscount =
      Number(
        items.find(
          (item) => Number(item.dealDiscount || 0) > 0
        )?.dealDiscount || 10
      )

    // Rebuild original price from the discounted price.
    const originalItemsPrice =
      dealDiscount > 0 && dealDiscount < 100
        ? Math.round(
            (itemsPrice / (1 - dealDiscount / 100)) * 100
          ) / 100
        : itemsPrice

    const discountAmount = Math.max(
      0,
      originalItemsPrice - itemsPrice
    )

    // Fixed shipping charge
    const shippingPrice = 150

    // Final total = discounted items + shipping
    const totalPrice = itemsPrice + shippingPrice

    // =====================================================
    // CUSTOMER DETAILS
    // =====================================================

    const customerName =
      order.user?.name || profileName || 'Customer'

    const customerEmail =
      order.user?.email || profileEmail || ''

    // Only shipping address is shown in invoice.
    const shippingAddress = order.shippingAddress || {}

    const makeAddress = (address) => {
      const lines = [
        address.address,
        address.house,
        address.area,
        address.city,
        address.state,
        address.postalCode || address.pincode,
        address.country,
      ].filter(Boolean)

      return lines.length
        ? lines.join(', ')
        : 'Address not available'
    }

    const shippingText = makeAddress(shippingAddress)

    // =====================================================
    // PAYMENT DETAILS
    // =====================================================

    const paymentId =
      order.paymentResult?.id ||
      order.paymentId ||
      'Not available'

    const paymentMethod =
      order.paymentResult?.method ||
      order.paymentMethod ||
      'Online Payment'

    const orderId = order._id || '-'
    const shortOrderId = String(orderId).slice(-8)

    const orderDate = order.createdAt
      ? new Date(order.createdAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : '-'

    const money = (value) =>
      `Rs.${Number(value || 0).toFixed(2)}`

    // =====================================================
    // PAGE / OUTER CARD
    // =====================================================

    const left = 14
    const right = 196

    doc.setFillColor(248, 250, 253)
    doc.rect(0, 0, 210, 297, 'F')

    doc.setDrawColor(210, 220, 232)
    doc.setLineWidth(0.5)
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(
      left,
      12,
      right - left,
      273,
      5,
      5,
      'FD'
    )

    // =====================================================
    // INVOICE CONTENT
    // =====================================================

    const generateInvoice = () => {
      // ===================================================
      // HEADER
      // ===================================================

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(22)
      doc.setTextColor(25, 39, 64)
      doc.text('CartNova', 43, 31)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(100, 115, 135)
      doc.text(
        'PROFESSIONAL ORDER INVOICE',
        43,
        36
      )

      // Invoice details
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(105, 118, 135)
      doc.text('INVOICE', 143, 24)
      doc.text('ORDER', 143, 32)
      doc.text('DATE', 171, 32)

      doc.setFontSize(9)
      doc.setTextColor(25, 39, 64)
      doc.text(`#${shortOrderId}`, 143, 38)
      doc.text(orderDate, 171, 38)

      doc.setDrawColor(210, 220, 232)
      doc.setLineWidth(0.4)
      doc.line(21, 45, 189, 45)

      // ===================================================
      // SHIPPING + PAYMENT
      // ===================================================

      let y = 54

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(25, 118, 210)
      doc.text('SHIPPING DETAILS', 21, y)
      doc.text('PAYMENT', 157, y)

      y += 7

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(35, 48, 70)
      doc.text(customerName, 21, y)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.8)
      doc.setTextColor(82, 96, 116)

      if (customerEmail) {
        doc.text(customerEmail, 21, y + 5)
      }

      const shippingLines = doc.splitTextToSize(
        shippingText,
        115
      )

      doc.text(shippingLines.slice(0, 4), 21, y + 10)

      // Payment status
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8.5)
      doc.setTextColor(
        order.isPaid ? 25 : 220,
        order.isPaid ? 135 : 70,
        order.isPaid ? 75 : 55
      )
      doc.text(
        order.isPaid ? 'PAID' : 'UNPAID',
        157,
        y
      )

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.8)
      doc.setTextColor(82, 96, 116)
      doc.text(
        order.isDelivered ? 'Delivered' : 'Processing',
        157,
        y + 5
      )
      doc.text(paymentMethod, 157, y + 10)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7.5)
      doc.setTextColor(105, 118, 135)
      doc.text('PAYMENT ID', 157, y + 17)

      doc.setFont('helvetica', 'normal')
      doc.setTextColor(82, 96, 116)
      const paymentLines = doc.splitTextToSize(
        String(paymentId),
        32
      )
      doc.text(paymentLines.slice(0, 2), 157, y + 22)

      // ===================================================
      // ITEM TABLE
      // ===================================================

      y = 93

      doc.setFillColor(238, 245, 253)
      doc.roundedRect(21, y, 168, 11, 2.5, 2.5, 'F')

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(55, 70, 90)
      doc.text('#', 25, y + 7)
      doc.text('PRODUCT', 38, y + 7)
      doc.text('QTY', 128, y + 7)
      doc.text('PRICE', 145, y + 7)
      doc.text('AMOUNT', 169, y + 7)

      y += 16

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.2)
      doc.setTextColor(45, 58, 78)

      if (items.length) {
        items.forEach((item, index) => {
          const productName = String(
            item.name || 'Product'
          )

          const productLines = doc.splitTextToSize(
            productName,
            82
          )

          const rowHeight = Math.max(
            9,
            productLines.length * 4.2 + 3
          )

          if (y + rowHeight > 235) {
            doc.addPage()
            y = 20
          }

          doc.text(String(index + 1), 25, y)
          doc.text(productLines.slice(0, 3), 38, y)
          doc.text(String(item.qty || 1), 128, y)
          doc.text(money(item.price), 145, y)
          doc.text(
            money(
              Number(item.price || 0) *
                Number(item.qty || 1)
            ),
            169,
            y
          )

          doc.setDrawColor(225, 231, 239)
          doc.setLineWidth(0.25)
          doc.line(
            21,
            y + rowHeight - 3,
            189,
            y + rowHeight - 3
          )

          y += rowHeight
        })
      } else {
        doc.text(
          'No item details available',
          38,
          y
        )
        y += 12
      }

      // ===================================================
      // ORDER SUMMARY
      // ===================================================

      y += 5

      const summaryTop = y

      doc.setFillColor(250, 252, 255)
      doc.roundedRect(
        105,
        summaryTop,
        84,
        61,
        3,
        3,
        'F'
      )

      const labelX = 112
      const valueX = 184
      let sy = summaryTop + 8

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.2)
      doc.setTextColor(82, 96, 116)

      // Original Price
      doc.text('Original Price', labelX, sy)
      doc.text(
        money(originalItemsPrice),
        valueX,
        sy,
        { align: 'right' }
      )

      sy += 7

      // Big Sale
      doc.setTextColor(5, 150, 105)
      doc.text(
        `Big Sale (${dealDiscount}% OFF)`,
        labelX,
        sy
      )
      doc.text(
        `-${money(discountAmount)}`,
        valueX,
        sy,
        { align: 'right' }
      )

      sy += 7

      // Items Price after discount
      doc.setTextColor(82, 96, 116)
      doc.text('Items Price', labelX, sy)
      doc.text(
        money(itemsPrice),
        valueX,
        sy,
        { align: 'right' }
      )

      sy += 7

      // Shipping
      doc.text('Shipping', labelX, sy)
      doc.text(
        money(shippingPrice),
        valueX,
        sy,
        { align: 'right' }
      )

      sy += 5

      doc.setDrawColor(185, 197, 212)
      doc.setLineWidth(0.45)
      doc.line(labelX, sy, valueX, sy)

      sy += 9

      // Total
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(25, 39, 64)
      doc.text('TOTAL', labelX, sy)
      doc.text(
        money(totalPrice),
        valueX,
        sy,
        { align: 'right' }
      )

      // ===================================================
      // BIG SALE SAVINGS MESSAGE
      // ===================================================

      doc.setFillColor(236, 253, 245)
      doc.roundedRect(
        21,
        sy + 8,
        168,
        12,
        3,
        3,
        'F'
      )

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(5, 150, 105)
      doc.text(
        `You saved ${money(discountAmount)} with Big Sale`,
        105,
        sy + 15,
        { align: 'center' }
      )

      // ===================================================
      // ORDER STATUS
      // ===================================================

      const statusY = Math.max(sy + 27, 205)

      doc.setFillColor(246, 249, 253)
      doc.roundedRect(
        21,
        statusY,
        168,
        16,
        3,
        3,
        'F'
      )

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7.5)
      doc.setTextColor(105, 118, 135)
      doc.text('ORDER STATUS', 27, statusY + 7)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(45, 58, 78)
      doc.text(
        order.isDelivered ? 'Delivered' : 'Processing',
        61,
        statusY + 7
      )

      doc.setFont('helvetica', 'bold')
      doc.setTextColor(105, 118, 135)
      doc.text('PAYMENT STATUS', 111, statusY + 7)

      doc.setFont('helvetica', 'normal')
      doc.setTextColor(45, 58, 78)
      doc.text(
        order.isPaid ? 'Paid' : 'Unpaid',
        151,
        statusY + 7
      )

      // ===================================================
      // FOOTER
      // ===================================================

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(25, 39, 64)
      doc.text(
        'Thank you for shopping with CartNova',
        105,
        244,
        { align: 'center' }
      )

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(105, 118, 135)
      doc.text(
        'Secure - Trusted - Easy Shopping',
        105,
        251,
        { align: 'center' }
      )

      doc.text(
        'This is a computer-generated invoice and does not require a signature.',
        105,
        257,
        { align: 'center' }
      )

      doc.setDrawColor(225, 231, 239)
      doc.setLineWidth(0.25)
      doc.line(21, 263, 189, 263)

      doc.setFontSize(7)
      doc.text(
        `CartNova | Invoice #${shortOrderId}`,
        105,
        269,
        { align: 'center' }
      )

      // ===================================================
      // DOWNLOAD
      // ===================================================

      doc.save(
        `CartNova-Invoice-${shortOrderId}.pdf`
      )
    }

    // =====================================================
    // CARTNOVA LOGO
    // =====================================================

    const logo = new window.Image()

    logo.onload = () => {
      try {
        doc.addImage(
          logo,
          'PNG',
          21,
          19,
          18,
          18
        )
      } catch (error) {
        console.log(
          'CartNova logo could not be added:',
          error
        )
      }

      generateInvoice()
    }

    logo.onerror = () => {
      // Fallback if cartnova-logo.png is not found.
      doc.setFillColor(25, 118, 210)
      doc.roundedRect(
        21,
        22,
        15,
        15,
        3,
        3,
        'F'
      )

      generateInvoice()
    }

    logo.src = '/cartnova-logo.png'
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

  {/* VIEW DETAILS */}

  <Link
    to={`/order/${order._id}`}
    className='cartnova-profile-order-details'
    title='View Order Details'
  >
    <i className='fas fa-eye'></i>
    <span>View Details</span>
  </Link>

  {/* DOWNLOAD INVOICE */}

  <Button
    type='button'
    className='cartnova-profile-order-invoice'
    onClick={() => downloadInvoice(order)}
    title='Download Invoice'
  >
    <i className='fas fa-file-invoice'></i>
    <span>Download Invoice</span>
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