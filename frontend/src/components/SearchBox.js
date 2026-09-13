import React, { useState } from 'react'
import { Form } from 'react-bootstrap'

const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState('')

  const submitHandler = (e) => {
    e.preventDefault()

    if (keyword.trim()) {
      history.push(`/search/${keyword.trim()}`)
    } else {
      history.push('/')
    }
  }

  return (
    <Form
      onSubmit={submitHandler}
      className='cartnova-search-form'
    >
      <div className='cartnova-search-box'>

        {/* Search Icon */}
        <i className='fas fa-search cartnova-search-icon'></i>

        {/* Input */}
        <Form.Control
          type='text'
          name='q'
          value={keyword}
          onChange={(e) =>
            setKeyword(e.target.value)
          }
          placeholder='Search products, brands & categories...'
          className='cartnova-search-input'
          autoComplete='off'
        />

        {/* Search Button */}
        <button
          type='submit'
          className='cartnova-search-button'
          aria-label='Search'
        >
          <span>Search</span>
          <i className='fas fa-arrow-right'></i>
        </button>

      </div>
    </Form>
  )
}

export default SearchBox