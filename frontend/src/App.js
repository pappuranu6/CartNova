import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  useLocation,
} from 'react-router-dom'
import { Container } from 'react-bootstrap'
import './CartNova.css'

import Header from './components/Header'
import Footer from './components/Footer'
import BackNavigation from './components/BackNavigation'

import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/cartScreen'
import RegisterScreen from './screens/RegisterScreen'
import LoginScreen from './screens/loginScreen'
import ForgotPasswordScreen from './screens/ForgotPasswordScreen'
import ProfileScreen from './screens/ProfileScreen'
import ShippingScreen from './screens/ShippingScreen'
import PaymentScreen from './screens/PaymentScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderScreen from './screens/OrderScreen'
import MyOrdersScreen from './screens/MyOrdersScreen'

import AdminLoginScreen from './screens/AdminLoginScreen'
import UserListScreen from './screens/UserListScreen'
import UserEditScreen from './screens/UserEditScreen'
import ProductListScreen from './screens/ProductListScreen'
import ProductEditScreen from './screens/ProductEditScreen'
import OrderListScreen from './screens/OrderListScreen'
import DashboardScreen from './screens/DashboardScreen'

const AppContent = () => {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <>
      <Header />

      <main className='py-3'>
        <Container>
          {/*
            Global Back System
            - Website Back button
            - Browser/laptop Back support
            - Android/iPhone device Back support
            - Route-aware fallback for direct page visits
          */}
          <BackNavigation />

          <Route path='/myorders' component={MyOrdersScreen} exact />
          <Route path='/order/:id' component={OrderScreen} exact />
          <Route path='/shipping' component={ShippingScreen} exact />
          <Route path='/payment' component={PaymentScreen} exact />
          <Route path='/placeorder' component={PlaceOrderScreen} exact />
          <Route path='/login' component={LoginScreen} exact />
          <Route path='/admin/login' component={AdminLoginScreen} exact />
          <Route path='/forgotpassword' component={ForgotPasswordScreen} exact />
          <Route path='/register' component={RegisterScreen} exact />
          <Route path='/profile' component={ProfileScreen} exact />
          <Route
            path='/account-settings'
            render={() => <ProfileScreen settingsOnly={true} />}
            exact
          />
          <Route path='/product/:id' component={ProductScreen} exact />
          <Route path='/cart/:id?' component={CartScreen} exact />
          <Route path='/admin/dashboard' component={DashboardScreen} exact />
          <Route path='/admin/userlist' component={UserListScreen} exact />
          <Route path='/admin/user/:id/edit' component={UserEditScreen} exact />
          <Route path='/admin/productlist' component={ProductListScreen} exact />
          <Route path='/admin/productlist/:pageNumber' component={ProductListScreen} exact />
          <Route path='/admin/product/:id/edit' component={ProductEditScreen} exact />
          <Route path='/admin/orderlist' component={OrderListScreen} exact />
          <Route path='/search/:keyword/page/:pageNumber' component={HomeScreen} exact />
          <Route path='/search/:keyword' component={HomeScreen} exact />
          <Route path='/page/:pageNumber' component={HomeScreen} exact />
          <Route path='/' component={HomeScreen} exact />
        </Container>
      </main>

      {isHomePage && <Footer />}
    </>
  )
}

const App = () => (
  <Router>
    <AppContent />
  </Router>
)

export default App
