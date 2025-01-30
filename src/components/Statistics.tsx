import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

const Statistics = () => {
  return (
    <>
        <Row style={{textAlign:'left'}}>
            <h4>Statistics</h4>
        </Row>
        <Row className="justify-content-between">
            <Col xs={4} className='ratingContainer'>
            
                <Row>
                    <p>Blitz</p>
                </Row>
                <Row>
                    <span>W: 100</span>
                    <span>L: 100</span>
                </Row>
            
            </Col>
            <Col  xs={4}  className='ratingContainer'>
                <Row>
                    <p>Rapid</p>
                </Row>
                <Row>
                    <span>W: 100</span>
                    <span>L: 100</span>
                </Row>
            </Col>
            <Col  xs={4} className='ratingContainer'>
                <Row>
                    <p>Classic</p>
                </Row>
                <Row>
                    <span>W: 100</span>
                    <span>L: 100</span>
                </Row>
            </Col>
        </Row>

    </>
  )
}

export default Statistics