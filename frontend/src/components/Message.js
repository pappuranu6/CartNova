import React from 'react'
import { Alert } from 'react-bootstrap'

const Message = ({ variant, children }) => {
  const iconMap = {
    success: 'fas fa-check-circle',
    danger: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle',
  }

  const icon =
    iconMap[variant] || iconMap.info

  return (
    <Alert
      variant={variant}
      className={`cartnova-message cartnova-message-${variant}`}
    >
      <div className='cartnova-message-content'>
        <i className={icon}></i>

        <span>
          {children}
        </span>
      </div>
    </Alert>
  )
}

Message.defaultProps = {
  variant: 'info',
}

export default Message