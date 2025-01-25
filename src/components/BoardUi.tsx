import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import * as FaIcons from "react-icons/fa6"
import './Board.css'
import { PieceType } from './Board'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Timer from './Timer';
import { TimerCheck } from '../AppContext/KingContext';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';


interface BoardProps{
    board: PieceType[][];
    handelMove: (cellRef:React.RefObject<HTMLDivElement>) => void;
    clickedCell:string;
    handelReset: () => void;
    setTimerW: React.Dispatch<React.SetStateAction<number>>;
    timerW:number;
    setTimerIdW: React.Dispatch<React.SetStateAction<number>>;
    setTimerB: React.Dispatch<React.SetStateAction<number>>;
    timerB:number;
    setTimerIdB: React.Dispatch<React.SetStateAction<number>>;
    turn:any;
    rowValue:number;
}

const BoardUi = (props:BoardProps) => {
    const blocks =[];
    const[showModal,setShowModal] = useState(false);
   
    const [requestsList,setRequestList] = useState([]);

    const {timer} = useContext(TimerCheck)
    const navigate = useNavigate();
    const numbers = Array.from({length:8},(_,i)=> i)
    
    useEffect(() => {
        
       // ))
       if(sessionStorage.getItem('user')){
            const userLoggedIn =  JSON.parse(sessionStorage.getItem('user') as string)
           
            showRequests(userLoggedIn);
            
        }
    }, [])
    function showRequests(userLoggedIn:any){
        axios.get("http://localhost:8000/api/showRequests?id=" + userLoggedIn._id , {withCredentials:true})
        .then((res)=>{
            setRequestList(res.data);
           
        })
        .catch((err)=>{
            
        })
    }
    
   
    if(props.rowValue==0){
    for(var row=0;row<8;row++){
        for(var col=0;col<8;col++){
           let piece=null;
           switch(props.board[row][col].type){
               case 'pawn':
                   piece = <FaIcons.FaChessPawn className='chessPiece' style={{color:props.board[row][col].color || undefined}}/>
                   break;
               case 'rook':
                   piece = <FaIcons.FaChessRook className='chessPiece' style={{color:props.board[row][col].color || undefined}}/>
                   break;
               case 'knight':
                   piece = <FaIcons.FaChessKnight className='chessPiece' style={{color:props.board[row][col].color || undefined}}/>
                   break;
               case 'bishop':
                   piece = <FaIcons.FaChessBishop className='chessPiece' style={{color:props.board[row][col].color || undefined}}/>
                   break;
               case 'king':
                   piece = <FaIcons.FaChessKing className='chessPiece' style={{color:props.board[row][col].color || undefined}}/>
                   break;
               case 'queen':
                   piece = <FaIcons.FaChessQueen className='chessPiece' style={{color:props.board[row][col].color || undefined}}/>
           }
            const id = `${row}-${col}`;
            const cellRef = useRef<HTMLDivElement>(null);
    
            blocks.push(<div key={id} ref={cellRef} id={id} className={`${(row+col) %2 == 0 ? 'green-chess-cell': 'white-chess-cell'} ${props.clickedCell === id ? 'clicked': ''}`} onClick={() => props.handelMove(cellRef)}>{piece}</div>)
        }
        
       }
    }
    else if(props.rowValue==8){
        for(var row=7;row>=0;row--){
            for(var col=7;col>=0;col--){
               let piece=null;
               switch(props.board[row][col].type){
                   case 'pawn':
                       piece = <FaIcons.FaChessPawn className='chessPiece' style={{color:props.board[row][col].color || undefined}}/>
                       break;
                   case 'rook':
                       piece = <FaIcons.FaChessRook className='chessPiece' style={{color:props.board[row][col].color || undefined}}/>
                       break;
                   case 'knight':
                       piece = <FaIcons.FaChessKnight className='chessPiece' style={{color:props.board[row][col].color || undefined}}/>
                       break;
                   case 'bishop':
                       piece = <FaIcons.FaChessBishop className='chessPiece' style={{color:props.board[row][col].color || undefined}}/>
                       break;
                   case 'king':
                       piece = <FaIcons.FaChessKing className='chessPiece' style={{color:props.board[row][col].color || undefined}}/>
                       break;
                   case 'queen':
                       piece = <FaIcons.FaChessQueen className='chessPiece' style={{color:props.board[row][col].color || undefined}}/>
               }
                const id = `${row}-${col}`;
                const cellRef = useRef<HTMLDivElement>(null);
        
                blocks.push(<div key={id} ref={cellRef} id={id} className={`${(row+col) %2 == 0 ? 'green-chess-cell': 'white-chess-cell'} ${props.clickedCell === id ? 'clicked': ''}`} onClick={() => props.handelMove(cellRef)}>{piece}</div>)
            }
            
           }
        }
    
  return (
    <>
    
    <Modal show={showModal} onHide={()=>setShowModal(false)} centered backdrop="static"
        keyboard={false} >
    <Modal.Header className='justify-content-center'>New Game <br/> {timer} mins</Modal.Header>
    <Modal.Body style={{margin:'auto'}}><FaIcons.FaRegChessKing style={{fontSize:'75px'}}/> V/S <FaIcons.FaChessKing style={{fontSize:'75px'}}/></Modal.Body>
    <Modal.Footer className='justify-content-center'>
      <Button variant="secondary" onClick={()=>setShowModal(false)}>
        Start
      </Button>
      
    </Modal.Footer>
  </Modal>
   
        <div onClick={props.handelReset}><button onClick={() => navigate("/")}>Reset</button></div> 
        <div style={{display:'flex'}}>

            <div className="chessBoard">
                <div style={{minWidth:'90px',position:'relative',paddingRight:'10px'}}>
                    <div style={{color:'black'}}>Dead Piece</div>
                    <div style={{color:'black',position:'absolute',bottom:'0'}}>Dead Piece</div>
                    
                </div>
                <div style={{display:'flex',flexDirection:'column',justifyContent:'space-evenly'}}>
                    {numbers.map((number)=>{
                        return (
                            <div><p>{number}</p></div>
                        )
                    })}
                </div>
                <div className='wrapper'>
                    {blocks}
                </div>
                <div style={{width:'90px',position:'relative',paddingLeft:'10px'}}>
                    {props.rowValue==0 ?
                    <>
                        <div style={{color:'black'}}>
                            <Timer turn={props.turn} showModal={showModal} timerB={props.timerB} setTimerB={props.setTimerB} setTimerIdB={props.setTimerIdB}/>
                        </div>
                        <div style={{color:'black',position:'absolute',bottom:'0'}}>
                            <Timer showModal={showModal} turn={props.turn} timerW={props.timerW} setTimerW={props.setTimerW} setTimerIdW={props.setTimerIdW}/>                
                        </div>
                    </>
                    :
                    <>
                        <div style={{color:'black'}}>
                            <Timer showModal={showModal} turn={props.turn} timerW={props.timerW} setTimerW={props.setTimerW} setTimerIdW={props.setTimerIdW}/>                
                        </div>
                        <div style={{color:'black',position:'absolute',bottom:'0'}}>
                            <Timer turn={props.turn} showModal={showModal} timerB={props.timerB} setTimerB={props.setTimerB} setTimerIdB={props.setTimerIdB}/>
                        </div>
                    </>
                    }
                </div>
            </div>
            
        </div>
    
    </>
  )
}

export default BoardUi