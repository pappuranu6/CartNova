import React from 'react'

const Loader = () => {
  return (
    <div
      className='cartnova-loader'
      role='status'
      aria-label='Loading'
    >
      <div className='cartnova-loader-spinner'></div>
      <span>Loading...</span>
    </div>
  )
}

export default Loader