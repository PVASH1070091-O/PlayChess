import React, { useCallback, useContext, useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Row,Col, Container, OverlayTrigger, Tooltip, Badge, Spinner } from 'react-bootstrap';
import { SocketContext, TimerCheck } from '../AppContext/KingContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch } from "react-icons/fa";
import SuggestionList from './SuggestionList';
import RequestItems from './RequestItems';
import Statistics from './Statistics';
import * as FaIcons  from 'react-icons/fa6'
import Notification from './Notification';
import FriendsList from './FriendsList';
import useSocket from '../hooks/useSocket';



const Home = () => {
    const {timer,setTimer} = useContext(TimerCheck);
    const  [user,setUser] = useState<any>('');
    const [searchValue,setSearch] = useState('');
    const [searchList,setSearchList] = useState<Record<string,unknown>[]>([]);
    const [isSearched,setIsSearched] = useState(false);
    const [friendsList,setFriendsList] = useState([]);
    const [requestsList,setRequestList] = useState([]);
    const [showPanel,setPanel] = useState(false);
    const [notifications,setNotification] = useState([]);
    const [loader,showLoader] = useState(false);
    const[showModal,setShowModal] = useState(false);
    //const {socketConnection} = useSocket();
    const socketValue = useContext(SocketContext);

    const navigate = useNavigate();

    function selectTimer(time:number){
        setTimer(time*60);
    }
    function startGame(){
        navigate('/playGame')
    }
    useEffect(()=>{
        
        if(sessionStorage.getItem('user')){
            //))
            const userLoggedIn = JSON.parse(sessionStorage.getItem('user') as string);
            setUser(userLoggedIn)
            showFriends(userLoggedIn);
            showRequests(userLoggedIn);
            challengeRequests();
        }
        else{
            navigate('/login')
        }
    },[])
    
    useEffect(() => {
        if(showModal){
            setTimeout(()=>{
                setShowModal(false)
            },3000)
        }
    }, [showModal])

    

    function challengeRequests(){
        
        axios.get(import.meta.env.VITE_API_KEY+ "api/challengeRequests",{withCredentials:true})
        .then((res)=>{
            
            setNotification(res.data.reverse());
        })
    }
    const updateChallenge = (status:string,item:any) =>{
        
        axios.patch(import.meta.env.VITE_API_KEY+ "api/updateChallenge/" + item._id,{status:status,sender_id:item.player1._id},{withCredentials:true})
        .then((res)=>{
            
            setPanel(false);
            setTimer(res.data.gameTime.time);
            challengeRequests();
            navigate("/playGame",{state:{color:"black"}})
        })
        .catch(err => {
            
            setPanel(false);
            challengeRequests();
            setShowModal(true);
        })
    }
    
    function showRequests(userLoggedIn:any){
        axios.get(import.meta.env.VITE_API_KEY+ "api/showRequests?id=" + userLoggedIn._id , {withCredentials:true})
        .then((res)=>{
            setRequestList(res.data);
            
        })
        .catch((err)=>{
            
        })
    }
    function showFriends(userLoggedIn:any){
        axios.get(import.meta.env.VITE_API_KEY+ "api/getFriends?id=" + userLoggedIn._id , {withCredentials:true})
            .then((res)=>{
                setFriendsList(res.data);
                
            })
            .catch((err)=>{
                if(err?.response?.data?.status === 'Logged Out'){
                    navigate("/login");
                    sessionStorage.removeItem('user');
                    console.log("errr in friendlist fetching",err.response.data.status)
                }
            })
    }
    
    const handleSearch = () =>{
        
        
        if(searchValue.length>0){
        axios.post(import.meta.env.VITE_API_KEY+ 'api/searchFriend',{searched:searchValue.toLowerCase()}, {withCredentials:true})
        .then((res)=>{
            setSearchList(res.data)
            setIsSearched(true);
            
        })
        .catch((err)=> console.log(err)
        )
        }
        else{
            setSearch('');
            setSearchList([]);
            setIsSearched(false);
        }
    }
    const handleInput = (e) =>{
        
        if(e.target.value.length>0){
            setSearch(e.target.value);
        }
        else{
            setSearch('');
            setSearchList([]);
            setIsSearched(false);
        }
    }
    const sendRequest = useCallback(() =>{
        axios.post(import.meta.env.VITE_API_KEY+ "api/sendRequest",{sendTo:searchValue.toLowerCase()},{withCredentials:true})
        .then((res)=>{
            
        })
        .catch((err)=>{
            
        })
    },[])
    const handleRequest = useCallback((status:string,id:any) =>{
        
        axios.patch(import.meta.env.VITE_API_KEY+ "api/updateRequest?reqid=" + id,{status:status})
        .then((res)=>{
            
            
            const newList = requestsList.filter((request)=> request['request_id']!=res.data['_id'])
            
            setRequestList(newList);
            showFriends(JSON.parse(sessionStorage.getItem('user') as string));
        })
        .catch((err)=>console.log(err))
    },[])
    

  return (
    <>
     <Modal show={showModal} onHide={()=>setShowModal(false)} centered backdrop="static"
        keyboard={false} >
    <Modal.Body style={{margin:'auto'}}>Challenge Has Expired !</Modal.Body>
    
    </Modal>
    <Modal size="sm" show={loader} onHide={()=>showLoader(false)} centered backdrop="static"
        keyboard={false} >
    <Modal.Body style={{margin:'auto'}}>
        <h6>Waiting for opponent</h6>
        <div className='spinner'>
            <Spinner animation="border" role="status">
                
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    </Modal.Body>
    
    </Modal>
    <Container className={`homePage ${loader ? 'overLay':""}`}>
        <Container className={`innerContainer ${(showPanel) ? 'overLay' :""}`}>
        <Row style={{marginBottom:'20px'}}>
            <Col sm={2} md={2}>
            <Row style={{alignItems:'center'}}>
                <div style={{width:'40px',height:'40px',padding:'10px',backgroundColor:'#dfdfdf',margin:'10px'}}>
                    <img src='/chess_icon.svg' style={{objectFit:'contain',height:'100%'}}/>
                </div>
                <div style={{width:'20%'}}>{user.userName}</div>
            </Row>
            </Col>
            <Col sm={10} md={10}>
                <Row style={{float:'right',marginTop:'10px'}}>
                    <Notification setPanel={setPanel} count={notifications.length}/>
                </Row>
            </Col>
        </Row>
        <Row>
            <Col sm={12} md={3}>
            <div className='leftSide'>
                <div className='inputBox'>
                    <input type='text' placeholder='Search For Friends' value={searchValue} onChange={handleInput}  style={{textDecoration:'none',border:'none',backgroundColor:'white',outline:'none',color:'black',float:'left'}}/>
                    <FaSearch onClick={handleSearch} style={{float:'right'}}/>
                </div>
                {searchList.length> 0 ? (<div className='suggestionBox'>
                    {searchList.map((item:any)=>(
                        <SuggestionList friend={item} sendRequest={sendRequest} friendsList={friendsList}/>
                    )) 
                    
                }
                </div>) : (
                    isSearched && <div className='suggestionBox'>
                        <p>Try Someone Else !!</p>
                    </div>
                
                )
                }
                
            </div>
            <FriendsList friendsList={friendsList} showLoader={showLoader}/>
            </Col>
            <Col sm={12} md={6}>
                <Row style={{width:'90%',margin:'auto'}}>
                    <Col>
                        <Row>
                            
                            <img src='/board.png' />
                            </Row>
                            <Row  style={{margin:'auto',marginTop:'10px'}}>
                            <Button className='playButton'>Play A Friend</Button>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <img src='/board.png' />
                            </Row>
                            <Row style={{margin:'auto',marginTop:'10px'}}>
                            <Button className='playButton'>Play Random</Button>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            
                            <img src='/board.png' />
                            </Row>
                            <Row  style={{margin:'auto',marginTop:'10px'}}>
                            <Button className='playButton'>Play Offline</Button>
                        </Row>
                    </Col>
                </Row>
                <Row className='statistics'>
                    <Statistics />
                </Row>
            </Col>
            <Col sm={12} md={3}>
            <div className='rightSide'>
                <div className='friendRequest'>
                    <h5>Friends Request</h5>
                    <hr/>
                   {requestsList.length > 0 ?
                    <>
                    {requestsList.map((request:any)=>(
                        <RequestItems key={request?._id} request={request} handleRequest={handleRequest}/>
                    ))}
                    </>
                    :
                    <div>No requests</div>
                   }
                </div>

            </div>
            </Col>
        </Row>
        </Container>
        {showPanel && <Container className='notificationPanel'>
            <Row>
                <Col xs={10}>
                <h6 style={{float:'left'}}>Challenge Requests</h6>
                </Col>
                <Col xs={2}>
                <FaIcons.FaXmark className='icons' onClick={() => setPanel(false)} style={{ marginLeft:'10px'}}/></Col>
            </Row>
            <hr/>
            {notifications.map((item:any)=>{
                return (
                    <Row>
                        <Col sm={8}>{item.player1.firstName} {item.player1.lastName} </Col>
                        <Col sm={4}><FaIcons.FaCheck className='icons' onClick={() => updateChallenge('accepted',item)}/> <FaIcons.FaXmark className='icons' onClick={() => updateChallenge('rejected',item)}style={{ marginLeft:'10px'}}/>
                        </Col>
                        <hr/>
                    </Row>
                )
            })}
            
        </Container>}
    
        {/* {loader && 
        <div className='loader'>
            <h6>Waiting for opponent</h6>
            <Spinner animation="border" role="status">
            
            <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>} */}
   </Container>
   </>
  )
}

export default Home