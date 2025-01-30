import React, { useEffect } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'

const Login = () => {
    function handleGoogleSignin(){
        window.open(import.meta.env.VITE_API_KEY+ "auth/google", "_self");
    }
    useEffect(()=>{
        if(sessionStorage.getItem('user')){
            sessionStorage.removeItem('user')
        }
    },[])
  return (
    <Container fluid className='mainContainer'>
        <Row className='mainRow'>
            <Col xs={12} md={6} className="loginPage">
                <div className="imageContainer">
                    <img src='/chessB3.jpeg' className='backgroundImage'/>
                </div>
            </Col>
            <Col xs={12} md={6} style={{margin:'auto'}}>
                <div>
                    <h4>Welcome Player !</h4>
                    <p>Please Continue With:</p>
                </div>
                <Button onClick={handleGoogleSignin}>Google Signin</Button>
            </Col>
        </Row>
    </Container>
  )
}

export default Login