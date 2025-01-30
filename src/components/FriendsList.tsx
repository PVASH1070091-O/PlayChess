import React,{useContext, useEffect, useState} from 'react'
import './Board.css';
import axios from 'axios';
import { Button, Col, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { FaChessBoard } from "react-icons/fa";
import * as FaIcons  from 'react-icons/fa6';
import { FaCheckCircle } from "react-icons/fa";
import { Navigate, useNavigate } from 'react-router-dom';
import { SocketContext, TimerCheck } from '../AppContext/KingContext';
import useSocket from '../hooks/useSocket';

const FriendsList = (props:any) => {

    const[showModal,setShowModal] = useState(false);
    const [timer,setTimerObj] = useState({});
    const [selectedFriend,setFriend] = useState({});
    const [challengeSent,setSentChallenge] = useState(false);
    const [gameTypes,setGameTypes] = useState([]);
    const navigate = useNavigate();
    const {setTimer} = useContext(TimerCheck)
    const socketValue = useContext(SocketContext);

    const renderTooltip = (props:any) => (
        <Tooltip id="button-tooltip" {...props}>
          Challenge
        </Tooltip>
      );
    
    const sendChallenge = () =>{
        setSentChallenge(false);
        
        //as string),selectedFriend._id);
        const loggedInUser= JSON.parse(sessionStorage.getItem('user') as string);
        axios.post("http://localhost:8000/api/requestChallenge",{player1:loggedInUser._id,player2:selectedFriend._id,status:'pending',gameTime:timer},{withCredentials:true})
        .then((res)=>{
            
            handleWebSocket(loggedInUser,selectedFriend._id);
            setSentChallenge(true);
            setTimeout(()=>{
                setShowModal(false);
                props.showLoader(true);
            },2000)
           
        })
        .catch(() => {
            props.showLoader(false);
            
            setShowModal(false);
    })
    }
    const handleWebSocket = (loggedInUser:any,selectedFriendId:string) =>{
        
        
        
        if(socketValue?.socket){
            
            socketValue.socket.emit("ChallengeSent",selectedFriendId)

            socketValue.socket.on("ChallengeStatus",(event)=>{
                const res=JSON.parse(event)
             
            //  setTimer(res.time);
                if(res.status==='accepted' || res.status==='rejected'){
                    props.showLoader(false);
                }
                if(res.status==='accepted'){
                    //socket.onmessage=null;
                    navigate("/playGame",{state:{color:'white'}})
                }
            })
            socketValue.socket.on("disconnect",()=>{
                
            })
        }
        

    }
    const challengePopup = (item:any)=>{
        axios.get("http://localhost:8000/admin/getGameTypes")
        .then((res)=>{
            
            setGameTypes(res.data)
        })
        .catch((err)=>console.log(err));

        setSentChallenge(false);    
        setFriend(item);
        setShowModal(true);
    }
    const selectTimer = (time:any) =>{
        
        setTimerObj(time);
        setTimer(time.time);
    }
    const getButtonClass = (time:number) =>{
        return timer?.time==time ? "selectedButton" : ""
    }
    
    
  return (
    <>
    <Modal show={showModal} onHide={()=>setShowModal(false)} centered
        keyboard={false} >
    <Modal.Header className='justify-content-center'>Send Challenge</Modal.Header>
    <Modal.Body style={{margin:'auto'}}>
        {gameTypes.length && gameTypes.map((gameType:any) => (
            <Button className={`timerButton ${getButtonClass(gameType.time)}`} onClick={() => selectTimer(gameType)}>
                {gameType.time} mins
            </Button>
        ))
        }
    </Modal.Body>
    <Modal.Footer className='justify-content-center'>
      {challengeSent ? <p><FaCheckCircle style={{backgroundColor:'white',fontSize:'25px',color:'green'}}/></p>
      :
      <Button variant="secondary" onClick={()=>sendChallenge()}>
        Send Challenge
      </Button>
        }
      
    </Modal.Footer>
  </Modal>
    <div className='friendsList'>
            <h4 style={{float:'left'}}>Friends</h4>
            <br/>
            <hr/>
            {props.friendsList.length > 0 ? (
                    props.friendsList.map((item:any,index)=>(
                    <Row key={item._id}>
                        <Col xs={6}>{item.firstName} {item?.lastName}</Col>
                        <Col xs={6} style={{marginBottom:'10px'}}>
                        <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip}
                            >
                            <span className='challengeButton' onClick={() => challengePopup(item)}>
                                <FaChessBoard style={{fontSize:'20px'}}/>
                                <span className='plusIcon'>
                                <FaIcons.FaCirclePlus />
                                </span>
                            </span>
                        </OverlayTrigger>
                        
                        </Col>
                        <hr/>
                        </Row>
                    
                    
                )) 
            ) :
            (
                <p>No Friends Yet</p>
            )
        }
        </div>
        </>
  )
}

export default FriendsList