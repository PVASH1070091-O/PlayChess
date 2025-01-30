import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../AppContext/KingContext';

const AuthenticateUser = () => {
    const [showModal,setShowModal] = useState(false);
    const [userName,setUserName] = useState('');
    const [user,setUser] = useState({})
    const navigate = useNavigate();
    const socketValue = useContext(SocketContext);

    useEffect(() => {
      if(Object.keys(user).length === 0){
      axios.get(import.meta.env.VITE_API_KEY+'api/verifyUser',{ withCredentials: true })
      .then((res)=>{
        console.log(res,"ress")
        setUser(res.data);
        if(res.data.userName.length==0){

            setShowModal(true);
        }
        else{
            sessionStorage.setItem("user",JSON.stringify(res.data));
            navigate('/')
        }
      })
      }
      else{
        console.log("alredy user")
      }
      
    }, [])

    const saveUserName = () =>{
        
        axios.patch("http://localhost:8000/api/setUserName",{"userName":userName},{ withCredentials: true })
        .then((res)=>{
            
            sessionStorage.setItem("user",JSON.stringify(res.data));
            navigate('/');
            setShowModal(false);

        })
        .catch((err)=> console.log(err))
    }
     
    
  return (<>
    <Modal show={showModal} onHide={()=>setShowModal(false)} centered backdrop="static"
        keyboard={false} >
    <Modal.Header className='justify-content-center'>Welcome King Slayer</Modal.Header>
    <Modal.Body style={{margin:'auto'}}>
        <p>Please Enter The User Name</p>
        
        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)}/>
    </Modal.Body>
    <Modal.Footer className='justify-content-center'>
      <Button variant="secondary" onClick={saveUserName}>
        Set Username
      </Button>
      
    </Modal.Footer>
  </Modal>
 
  </>)
}

export default AuthenticateUser



