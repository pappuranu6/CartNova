import React, { useEffect, useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

const getFallbackPath = (pathname) => {
  if (pathname === '/shipping') return '/cart'
  if (pathname === '/payment') return '/shipping'
  if (pathname === '/placeorder') return '/payment'
  if (pathname.startsWith('/order/')) return '/myorders'
  if (pathname === '/myorders') return '/profile'
  if (pathname === '/profile') return '/'
  if (pathname === '/account-settings') return '/profile'
  if (pathname === '/cart' || pathname.startsWith('/cart/')) return '/'
  if (pathname === '/login' || pathname === '/register' || pathname === '/forgotpassword') return '/'
  if (pathname === '/admin/login') return '/'
  if (pathname === '/admin/dashboard') return '/'
  if (pathname === '/admin/userlist') return '/admin/dashboard'
  if (pathname.startsWith('/admin/user/') && pathname.endsWith('/edit')) return '/admin/userlist'
  if (pathname === '/admin/productlist' || pathname.startsWith('/admin/productlist/')) return '/admin/dashboard'
  if (pathname.startsWith('/admin/product/') && pathname.endsWith('/edit')) return '/admin/productlist'
  if (pathname === '/admin/orderlist') return '/admin/dashboard'
  if (pathname.startsWith('/search/')) return '/'
  if (pathname.startsWith('/page/')) return '/'
  if (pathname.startsWith('/product/')) return '/'
  return '/'
}

const hasOwnBackControl = (pathname) => (
  pathname === '/shipping' ||
  pathname.startsWith('/product/') ||
  pathname.startsWith('/order/') ||
  (pathname.startsWith('/admin/user/') && pathname.endsWith('/edit')) ||
  (pathname.startsWith('/admin/product/') && pathname.endsWith('/edit')) ||
  pathname.startsWith('/search/')
)

const BackNavigation = () => {
  const history = useHistory()
  const location = useLocation()
  const previousPathRef = useRef(location.pathname)

  useEffect(() => {
    const unlisten = history.listen((nextLocation, action) => {
      const previousPath = previousPathRef.current
      const isCheckoutLogin = (
        nextLocation.pathname === '/login' &&
        new URLSearchParams(nextLocation.search).get('redirect') === 'shipping'
      )

      previousPathRef.current = nextLocation.pathname

      if (action === 'POP' && previousPath === '/shipping' && isCheckoutLogin) {
        window.setTimeout(() => {
          if (history.location.pathname === '/login') {
            history.goBack()
          }
        }, 0)
      }
    })

    return unlisten
  }, [history])

  if (location.pathname === '/' || hasOwnBackControl(location.pathname)) {
    return null
  }

  const goBack = () => {
    if (window.history.length > 1) {
      history.goBack()
      return
    }

    history.replace(getFallbackPath(location.pathname))
  }

  return (
    <div className='cartnova-global-back-wrapper'>
      <button
        type='button'
        className='cartnova-global-back-button'
        onClick={goBack}
        aria-label='Go back'
      >
        <i className='fas fa-arrow-left'></i>
        <span>Back</span>
      </button>
    </div>
  )
}

export default BackNavigation
