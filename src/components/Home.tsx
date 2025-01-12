import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';



const Home = () => {
    const[showModal,setShowModal] = useState(false);
  return (
    <>
    <Button onClick={()=>setShowModal(true)}>Click it home</Button>
    <Modal show={showModal} onHide={()=>setShowModal(false)} centered>
    <Modal.Header closeButton>
      <Modal.Title>Modal heading</Modal.Title>
    </Modal.Header>
    <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={()=>setShowModal(false)}>
        Close
      </Button>
      <Button variant="primary" onClick={()=>setShowModal(false)}>
        Save Changes
      </Button>
    </Modal.Footer>
  </Modal>
  </>
  )
}

export default Home