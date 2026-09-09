import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import Message from '../components/Message'
import Loader from '../components/Loader'

import {
  getUserDetails,
  updateUser,
} from '../actions/userActions'

import { USER_UPDATE_RESET } from '../constants/userConstants'

const UserEditScreen = ({ match, history }) => {
  const userId = match.params.id

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  const dispatch = useDispatch()

  const userDetails = useSelector(
    (state) => state.userDetails
  )

  const {
    loading,
    error,
    user,
  } = userDetails

  const userUpdate = useSelector(
    (state) => state.userUpdate
  )

  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate

  useEffect(() => {
    if (successUpdate) {
      dispatch({
        type: USER_UPDATE_RESET,
      })

      history.push('/admin/userlist')
    } else {
      if (!user.name || user._id !== userId) {
        dispatch(getUserDetails(userId))
      } else {
        setName(user.name)
        setEmail(user.email)
        setIsAdmin(user.isAdmin)
      }
    }
  }, [
    dispatch,
    history,
    userId,
    user,
    successUpdate,
  ])

  const submitHandler = (e) => {
    e.preventDefault()

    dispatch(
      updateUser({
        _id: userId,
        name,
        email,
        isAdmin,
      })
    )
  }

  return (
    <div className='cartnova-admin-user-edit-page'>

      {/* BACK BUTTON */}

      <Link
        to='/admin/userlist'
        className='cartnova-edit-back'
      >
        <i className='fas fa-arrow-left'></i>{' '}
        Back to Users
      </Link>

      {/* EDIT CARD */}

      <div className='cartnova-user-edit-card'>

        {/* LEFT SIDE */}

        <div className='cartnova-user-edit-left'>

          <div className='cartnova-user-edit-icon'>
            <i className='fas fa-user-edit'></i>
          </div>

          <h1>Edit User</h1>

          <p>
            Update user account details and
            <br />
            manage administrator access.
          </p>

          <div className='cartnova-user-edit-info'>

            <div>
              <i className='fas fa-user'></i>
              <span>
                Update Name
              </span>
            </div>

            <div>
              <i className='fas fa-envelope'></i>
              <span>
                Update Email
              </span>
            </div>

            <div>
              <i className='fas fa-user-shield'></i>
              <span>
                Manage Admin Role
              </span>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className='cartnova-user-edit-right'>

          <div className='cartnova-user-edit-heading'>
            <h2>
              User Information
            </h2>

            <p>
              Make changes to the selected user account.
            </p>
          </div>

          {loadingUpdate && <Loader />}

          {errorUpdate && (
            <Message variant='danger'>
              {errorUpdate}
            </Message>
          )}

          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>
              {error}
            </Message>
          ) : (
            <Form onSubmit={submitHandler}>

              {/* NAME */}

              <Form.Group
                controlId='name'
                className='cartnova-user-edit-form-group'
              >
                <Form.Label>
                  <i className='fas fa-user'></i>{' '}
                  Full Name
                </Form.Label>

                <Form.Control
                  type='text'
                  placeholder='Enter name'
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                />
              </Form.Group>

              {/* EMAIL */}

              <Form.Group
                controlId='email'
                className='cartnova-user-edit-form-group'
              >
                <Form.Label>
                  <i className='fas fa-envelope'></i>{' '}
                  Email Address
                </Form.Label>

                <Form.Control
                  type='email'
                  placeholder='Enter email'
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </Form.Group>

              {/* ADMIN ROLE */}

              <div className='cartnova-admin-role-box'>

                <div className='cartnova-admin-role-text'>

                  <div className='cartnova-admin-role-icon'>
                    <i className='fas fa-user-shield'></i>
                  </div>

                  <div>
                    <strong>
                      Administrator Access
                    </strong>

                    <span>
                      Allow this user to access the
                      Admin Panel.
                    </span>
                  </div>

                </div>

                <Form.Check
                  type='switch'
                  id='isadmin'
                  checked={isAdmin}
                  onChange={(e) =>
                    setIsAdmin(e.target.checked)
                  }
                  className='cartnova-admin-switch'
                />

              </div>

              {/* UPDATE BUTTON */}

              <Button
                type='submit'
                className='cartnova-user-update-button'
                disabled={loadingUpdate}
              >
                <i className='fas fa-save'></i>{' '}
                {loadingUpdate
                  ? 'Updating...'
                  : 'Update User'}
              </Button>

            </Form>
          )}

        </div>

      </div>

    </div>
  )
}

export default UserEditScreen