import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const FormContainer = ({ children }) => {
  return (
    <Container className='cartnova-form-container'>
      <Row className='justify-content-center'>
        <Col
          xs={12}
          sm={11}
          md={8}
          lg={6}
          xl={5}
          className='cartnova-form-column'
        >
          <div className='cartnova-form-card'>
            {children}
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default FormContainer