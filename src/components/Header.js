import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import logo from '../images/placeholder.svg'

const WebsiteHeader = () => {
  return (
    <div className="website-header">
      <Container>
        <Row className="text-center brand">
          <h1>
            <a href="#">
              <img
                src={logo}
                alt="logo"
                className="logo"
              />
            </a>
            The Expense Splitter
          </h1>
        </Row>
        <Row className="tools">
          <Col className="tool-1">
            <a href="#">Quicksplit</a>
          </Col>
          <Col className="tool-2">
            <a href="#">Full Splitter</a>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default WebsiteHeader
