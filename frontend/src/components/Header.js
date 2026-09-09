import React from 'react'
import { Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
} from 'react-bootstrap'
import SearchBox from './SearchBox'
import { logout } from '../actions/userActions'

const Header = () => {
  const dispatch = useDispatch()

  const userLogin = useSelector(
    (state) => state.userLogin
  )

  const { userInfo } = userLogin

  const logoutHandler = () => {
    dispatch(logout())
  }

  return (
    <header>
      <Navbar
        expand='lg'
        collapseOnSelect
        className='cartnova-navbar'
      >
        <Container>

          {/* ================= TOP HEADER ================= */}

          <div className='cartnova-header-top'>

            {/* LOGO */}

            <LinkContainer to='/'>
              <Navbar.Brand className='cartnova-brand'>
                <img
                  src='/cartnova-logo.png'
                  alt='CartNova'
                  className='cartnova-logo'
                />

                <span>CartNova</span>
              </Navbar.Brand>
            </LinkContainer>

            {/* MOBILE MENU BUTTON */}

            <Navbar.Toggle
              aria-controls='cartnova-navbar-menu'
              className='cartnova-mobile-toggle'
            >
              <span></span>
              <span></span>
              <span></span>
            </Navbar.Toggle>

          </div>

          {/* ================= NAVBAR MENU ================= */}

          <Navbar.Collapse
            id='cartnova-navbar-menu'
            className='cartnova-navbar-menu'
          >

            {/* SEARCH */}

            <div className='cartnova-search-wrapper'>
              <Route
                render={({ history }) => (
                  <SearchBox history={history} />
                )}
              />
            </div>

            {/* RIGHT SIDE MENU */}

            <div className='cartnova-menu-right'>

              {/* SHOPPING CART */}

              <Nav>
                <LinkContainer to='/cart'>
                  <Nav.Link className='cartnova-main-link'>
                    <i className='fas fa-shopping-cart'></i>
                    <span>Shopping cart</span>
                  </Nav.Link>
                </LinkContainer>
              </Nav>

              {/* ADMIN */}

              {userInfo && userInfo.isAdmin && (
                <Nav>
                  <NavDropdown
                    title={
                      <>
                        <i className='fas fa-user-shield'></i>{' '}
                        Admin
                      </>
                    }
                    id='adminmenu'
                    className='cartnova-admin-dropdown'
                  >

                    <LinkContainer to='/admin/dashboard'>
                      <NavDropdown.Item>
                        <i className='fas fa-chart-line'></i>
                        <span>Dashboard</span>
                      </NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to='/admin/userlist'>
                      <NavDropdown.Item>
                        <i className='fas fa-users'></i>
                        <span>Users</span>
                      </NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to='/admin/productlist'>
                      <NavDropdown.Item>
                        <i className='fas fa-boxes'></i>
                        <span>Products</span>
                      </NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to='/admin/orderlist'>
                      <NavDropdown.Item>
                        <i className='fas fa-shopping-bag'></i>
                        <span>Orders</span>
                      </NavDropdown.Item>
                    </LinkContainer>

                  </NavDropdown>
                </Nav>
              )}

              {/* USER / LOGIN */}

              <div className='cartnova-header-right'>

                {userInfo ? (

                  <Nav>
                    <NavDropdown
                      title={
                        <>
                          <i className='fas fa-user-circle'></i>{' '}
                          {userInfo.name || 'User'}
                        </>
                      }
                      id='username'
                      align='end'
                      className='cartnova-user-dropdown'
                    >

                      <LinkContainer to='/profile'>
                        <NavDropdown.Item>
                          <i className='fas fa-user'></i>
                          <span>Profile</span>
                        </NavDropdown.Item>
                      </LinkContainer>

                      <LinkContainer to='/myorders'>
                        <NavDropdown.Item>
                          <i className='fas fa-box'></i>
                          <span>My Orders</span>
                        </NavDropdown.Item>
                      </LinkContainer>

                      <NavDropdown.Item
                        onClick={logoutHandler}
                      >
                        <i className='fas fa-sign-out-alt'></i>
                        <span>Logout</span>
                      </NavDropdown.Item>

                    </NavDropdown>
                  </Nav>

                ) : (

                  <Nav className='cartnova-login-links'>

                    {/* CUSTOMER LOGIN */}

                    <LinkContainer to='/login'>
                      <Nav.Link>
                        <i className='fas fa-user'></i>
                        <span>Login</span>
                      </Nav.Link>
                    </LinkContainer>

                    {/* ADMIN LOGIN */}

                    <LinkContainer to='/admin/login'>
                      <Nav.Link>
                        <i className='fas fa-user-shield'></i>
                        <span>Admin Login</span>
                      </Nav.Link>
                    </LinkContainer>

                  </Nav>

                )}

              </div>

            </div>

          </Navbar.Collapse>

        </Container>
      </Navbar>
    </header>
  )
}

export default Header