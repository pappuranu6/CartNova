import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  listUsers,
  deleteUser,
} from '../actions/userActions'

const UserListScreen = ({ history }) => {
  const dispatch = useDispatch()

  const userList = useSelector(
    (state) => state.userList
  )

  const {
    loading,
    error,
    users,
  } = userList

  const userLogin = useSelector(
    (state) => state.userLogin
  )

  const { userInfo } = userLogin

  const userDelete = useSelector(
    (state) => state.userDelete
  )

  const {
    success: successDelete,
  } = userDelete

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers())
    } else {
      history.push('/login')
    }
  }, [
    dispatch,
    history,
    successDelete,
    userInfo,
  ])

  const deleteHandler = (id) => {
    if (
      window.confirm(
        'Are you sure you want to delete this user?'
      )
    ) {
      dispatch(deleteUser(id))
    }
  }

  return (
    <div className='cartnova-admin-users-page'>

      {/* PAGE HEADER */}

      <div className='cartnova-admin-page-header'>

        <div>
          <h1>
            <i className='fas fa-users'></i>{' '}
            Users
          </h1>

          <p>
            Manage CartNova customer and admin accounts.
          </p>
        </div>

        {users && (
          <div className='cartnova-user-count'>
            <i className='fas fa-users'></i>
            <span>{users.length}</span>
            Users
          </div>
        )}

      </div>

      {/* CONTENT */}

      {loading ? (
        <div className='cartnova-admin-loader'>
          <Loader />
        </div>
      ) : error ? (
        <Message variant='danger'>
          {error}
        </Message>
      ) : (
        <div className='cartnova-users-card'>

          {/* CARD HEADER */}

          <div className='cartnova-users-card-header'>

            <div>
              <h3>
                <i className='fas fa-list'></i>{' '}
                User List
              </h3>

              <span>
                Manage registered CartNova accounts
              </span>
            </div>

          </div>

          {/* TABLE */}

          <div className='cartnova-users-table-wrapper'>

            <table className='cartnova-users-table'>

              <thead>
                <tr>
                  <th>ID</th>
                  <th>USER</th>
                  <th>EMAIL</th>
                  <th>ROLE</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>

                {users && users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id}>

                      {/* ID */}

                      <td>
                        <span className='cartnova-user-id'>
                          #{user._id.slice(-8)}
                        </span>
                      </td>

                      {/* USER */}

                      <td>
                        <div className='cartnova-user-info'>

                          <div className='cartnova-user-avatar'>
                            <i className='fas fa-user'></i>
                          </div>

                          <span>
                            {user.name}
                          </span>

                        </div>
                      </td>

                      {/* EMAIL */}

                      <td>
                        <a
                          href={`mailto:${user.email}`}
                          className='cartnova-user-email'
                        >
                          <i className='fas fa-envelope'></i>
                          {user.email}
                        </a>
                      </td>

                      {/* ROLE */}

                      <td>
                        {user.isAdmin ? (
                          <span className='cartnova-user-role admin'>
                            <i className='fas fa-user-shield'></i>
                            Admin
                          </span>
                        ) : (
                          <span className='cartnova-user-role customer'>
                            <i className='fas fa-user'></i>
                            Customer
                          </span>
                        )}
                      </td>

                      {/* ACTION */}

                      <td>
                        <div className='cartnova-user-actions'>

                          <LinkContainer
                            to={`/admin/user/${user._id}/edit`}
                          >
                            <Button
                              className='cartnova-user-edit-btn'
                              title='Edit User'
                            >
                              <i className='fas fa-edit'></i>
                            </Button>
                          </LinkContainer>

                          <Button
                            className='cartnova-user-delete-btn'
                            onClick={() =>
                              deleteHandler(user._id)
                            }
                            title='Delete User'
                          >
                            <i className='fas fa-trash'></i>
                          </Button>

                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan='5'
                      className='cartnova-no-users'
                    >
                      <i className='fas fa-users-slash'></i>

                      <h4>
                        No Users Found
                      </h4>

                      <p>
                        There are currently no registered
                        users.
                      </p>
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>
      )}

    </div>
  )
}

export default UserListScreen