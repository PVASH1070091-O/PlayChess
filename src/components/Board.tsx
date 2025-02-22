import React, { useContext, useEffect, useRef, useState } from 'react'
import './Board.css'
import BoardUi from './BoardUi'
import useGameLogic from '../hooks/useGameLogic'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {  CheckContext, KingContext, SocketContext, TimerCheck } from '../AppContext/KingContext';
import useSafeLogic from '../hooks/useSafeLogic';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import useSocket from '../hooks/useSocket';
import axios from 'axios';


export type PieceType = {
    type: 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king' | null,
    color: 'black' | 'white' | null,
    isDead: boolean | null;
    canMove: boolean;
    numberOfTurns:number;
}

const Board = () => {
    const [prevClickedCell, setClickedCell] = useState<any>('')
    const [turn,setTurn] = useState<any>({white:true,black:false});
    const [showModal,setShowModal] = useState(false);
    const [won,setWon]=useState('');
    const location = useLocation();
    const stateData = location.state;
  
    const {timer} = useContext(TimerCheck);
   
    const [timerW,setTimerW]=useState(timer);
    const [timerIdW,setTimerIdW] = useState<number>(0);
    const [timerB,setTimerB]=useState(timer);
    const [timerIdB,setTimerIdB] = useState<number>(0);
    const {value,setValue} = useContext(KingContext);
    const {isCheck,setCheck} = useContext(CheckContext);
    const {isPawnSafe,isBishopSafe,isKnightSafe,isRookSafe} = useSafeLogic();
    const [gameValue,setGameValue] = useState({});
    const [onGoingGame,setonGoingGame] = useState({});
    const [userPiece,setUserPiece]= useState('');
    const [rowValue,setRowValue] = useState(0);
    const [player1,setPlayer1] = useState(false);
    const [player2,setPlayer2] = useState(false);
    const [exitGame,setExistGame] = useState(false);

    const navigate = useNavigate();

    const socketValue = useContext(SocketContext);
    if(!value.white){
       setValue({
        white: { row: 7, col: 4, color: 'white' },
        black: { row: 0, col: 4, color: 'black' }
        })
    }
    const initialState = Array.from({length: 8}, () =>Array(8).fill({
        type:null,
        color:null,
        isDead:false,
        canMove:false,
        numberOfTurns:0
    }));
    const [board,setBoard] = useState<PieceType [][]>(initialState);
    const {validMove} = useGameLogic(setShowModal,setWon);

    //
   
    const handelMove = (cellRef:React.RefObject<HTMLDivElement>) =>{
        const parent = cellRef.current
        const currentCellId = cellRef?.current?.id;
        if(currentCellId){
            const crrRow = parseInt(currentCellId[0]);
            const crrCol = parseInt(currentCellId[2]);
            const piece = board[crrRow][crrCol];
            
            if(piece.color && userPiece.toLowerCase() !== piece.color.toLowerCase() && !prevClickedCell){
               console.log("not your piece") 
            }
            else if((player1 && !gameValue.player1Turn) || (player2 && gameValue.player1Turn) ){
                console.log("not your turn")
            }
            // else if((piece.color && !turn[piece.color]) && !prevClickedCell){
            //     // to get turn one by one, 
            //     // if we remove !prevClickedCell, then when a piece will try to capture another piece , it will come into this condition
            //     // if one piece takes over other color piece then 'prevClickedCell' will have something
            //     // so !prevClickedCell this value will be false;
            //     
                
            // }
            else{
                if(parent?.querySelector('.chessPiece') && !prevClickedCell){
                    // this is when we are trying to make 1st move
                    // and we select a piece to play
                    // so ofcourse there should'nt be previously clicked cell so !prevClickedCell
                    // otherwise it will be considered a move
                    setClickedCell(currentCellId);
                }
                else{
                    if(prevClickedCell){
                        
                        if(parent){
                            let isValidMove = validMove(prevClickedCell,board,currentCellId || "",parent);
                            if(typeof isValidMove === "object" && "isValid" in isValidMove && isValidMove.isValid){
                                
                                turn.white ? clearInterval(timerIdW) : clearInterval(timerIdB);
                                setTurn({white:!turn.white,black:!turn.black});
                                

                                const updatedBoard = [...board];
                                if(isValidMove.isCastle===true){
                                    let castleDirection;
                                    if(crrCol==7){
                                        castleDirection=1;
                                    }
                                    else{
                                        castleDirection=-1;
                                    }
                                    
                                    //kings new position
                                    updatedBoard[crrRow][Number(prevClickedCell[2])+(2)*castleDirection]= board[prevClickedCell[0]][prevClickedCell[2]];
                                    //rooks new position
                                    updatedBoard[crrRow][Number(prevClickedCell[2])+(2)*castleDirection - castleDirection]=updatedBoard[crrRow][crrCol];

                                    updatedBoard[crrRow][prevClickedCell[2]]={type:null,color:null,isDead:null,canMove:true,numberOfTurns:0};
                                    updatedBoard[crrRow][crrCol]={type:null,color:null,isDead:null,canMove:true,numberOfTurns:0};

                                    updatedBoard[crrRow][Number(prevClickedCell[2])+(2)*castleDirection - castleDirection].numberOfTurns+=1;
                                    updatedBoard[crrRow][Number(prevClickedCell[2])+2*castleDirection].numberOfTurns+=1;

                                    if(turn.white){
                                
                                        setValue({...value,white:{row:crrRow,col:Number(prevClickedCell[2]) + 2*castleDirection,color:'white' as string}})
                                    }
                                    if(turn.black){
                                        
                                        setValue({...value,black:{row:crrRow,col:Number(prevClickedCell[2]) + (2)*castleDirection,color:'black' as string}})
                                    }
                                }
                                else{
                                    
                                updatedBoard[crrRow][crrCol] = board[prevClickedCell[0]][prevClickedCell[2]];
                                updatedBoard[crrRow][crrCol].numberOfTurns+=1;
                                
                                console.log("new board",updatedBoard)
                                if(updatedBoard[crrRow][crrCol].type=='pawn'){
                                    if(crrRow==7){
                                        updatedBoard[crrRow][crrCol] = {type:'queen',color:"black",isDead:false,canMove:true,numberOfTurns:0};
                                    }
                                    if(crrRow==0){
                                        updatedBoard[crrRow][crrCol] = {type:'queen',color:"white",isDead:false,canMove:true,numberOfTurns:0};
                                    }
                                
                                }
                                updatedBoard[prevClickedCell[0]][prevClickedCell[2]]={type:null,color:null,isDead:null,canMove:true,numberOfTurns:0};

                                if(updatedBoard[crrRow][crrCol].type=='king' && updatedBoard[crrRow][crrCol].color=='white'){
                                
                                    setValue({...value,white:{row:crrRow,col:crrCol,color:updatedBoard[crrRow][crrCol].color as string}})
                                }
                                if(updatedBoard[crrRow][crrCol].type=='king' && updatedBoard[crrRow][crrCol].color=='black'){
                                    
                                    setValue({...value,black:{row:crrRow,col:crrCol,color:updatedBoard[crrRow][crrCol].color as string}})
                                }
                                
                                // to check if the because of this piece, the opponent king is getting check
                                if(updatedBoard[crrRow][crrCol].color=='black'){
                                    
                                    let param={
                                        crrRow:value.white.row, 
                                        crrCol:value.white.col,
                                        board:updatedBoard,
                                        piece:{type:'king' as 'king',color:'white' as 'white',isDead:false,canMove:true,numberOfTurns:1},
                                        forCheckMate:false

                                    }
                                    
                                    if(!(isPawnSafe(param) && isBishopSafe(param) && isRookSafe(param) && isKnightSafe(param))){
                                       // alert("check lgi to hai htane se")
                                       
                                        setCheck(true)
                                    }
                                }
                                if(updatedBoard[crrRow][crrCol].color=='white'){
                                    
                                    let param={
                                        crrRow:value.black.row, 
                                        crrCol:value.black.col,
                                        board:updatedBoard,
                                        piece:{type:'king' as 'king',color:'black' as 'black',isDead:false,canMove:true,numberOfTurns:1},
                                        forCheckMate:false
                                    }
                                    if(!(isPawnSafe(param) && isBishopSafe(param) && isRookSafe(param) && isKnightSafe(param))){
                                        
                                        setCheck(true)
                                    }
                                }
                                
                                }
                                console.log("players value",player1,player2)
                                if(socketValue){                                    
                                    socketValue?.socket?.emit("makeMove",JSON.stringify({...gameValue,player1Turn:!gameValue.player1Turn,board:updatedBoard}))                                    
                                }
                             
                        }
                        else{
                            
                        }
                    }
                    }
                    else{
                        
                    }
                    setClickedCell('');
                }
            }
            
    }

    }
    const handelReset = () =>{
        setTurn({white:true,black:false});
        setWon('')
        setTimerW(timerW);
        setTimerB(timerB);
        initializeBoard();   
    }

    const initializeBoard = () =>{    
        const updatedBoard = initialState.map((row,rowIndex)=>{
            return row.map((col,colIndex)=>{
                let piece:PieceType = col;
                if(rowIndex==1){
                    piece ={type:'pawn',color:'black',isDead:false,canMove:true,numberOfTurns:0}
                }
                if(rowIndex==6){
                    piece ={type:'pawn',color:'white',isDead:false,canMove:true,numberOfTurns:0}
                }
                if(rowIndex == 0){
                    if(colIndex==0 || colIndex==7){
                        piece = {type:'rook',color:'black',isDead:false,canMove:true,numberOfTurns:0}
                    }
                    if(colIndex==1 || colIndex==6){
                        piece = {type:'knight',color:'black',isDead:false,canMove:true,numberOfTurns:0}
                    }
                    if(colIndex==2 || colIndex==5){
                        piece = {type:'bishop',color:'black',isDead:false,canMove:true,numberOfTurns:0}
                    }
                    if(colIndex==3 ){
                        piece = {type:'queen',color:'black',isDead:false,canMove:true,numberOfTurns:0}
                    }
                    if(colIndex==4){
                        piece = {type:'king',color:'black',isDead:false,canMove:true,numberOfTurns:0}
                    }
                }
                if(rowIndex == 7){
                    if(colIndex==0 || colIndex==7){
                        piece = {type:'rook',color:'white',isDead:false,canMove:true,numberOfTurns:0}
                    }
                    if(colIndex==1 || colIndex==6){
                        piece = {type:'knight',color:'white',isDead:false,canMove:true,numberOfTurns:0}
                    }
                    if(colIndex==2 || colIndex==5){
                        piece = {type:'bishop',color:'white',isDead:false,canMove:true,numberOfTurns:0}
                    }
                    if(colIndex==4 ){
                        piece = {type:'king',color:'white',isDead:false,canMove:true,numberOfTurns:0}
                    }
                    if(colIndex==3){
                        piece = {type:'queen',color:'white',isDead:false,canMove:true,numberOfTurns:0}
                    }
                }
                return piece;
            })
            
        })
        setBoard(updatedBoard);
        
    }
    const handleSocket = () =>{
       
      
        console.log("handleSocket is called")
        if(socketValue?.socket){
            socketValue?.socket?.on("gameState",(event)=>{
                
                const res=JSON.parse(event)
                //console.log("resss",res)
                setGameValue(res);
              //  
                setTimerW(res.player1Time);
                setTimerB(res.player2Time);
                if(res.board.length>0){
                    setBoard(res.board);
                    //
                }
            })
            socketValue?.socket.on('opponentLeft',(event)=>{
                console.log("evtnt data",event)
                setShowModal(true);
                setWon(event)
            })
            socketValue?.socket.on("gameFinished",(event)=>{
                console.log("evenof who won checkmate",event);
                setShowModal(true);
                setWon(JSON.parse(event).piece);
            })
        }
    }
    useEffect(()=>{
        handleSocket();
    },[socketValue])
    useEffect(()=>{
        console.log('who won',won)
        if(won === 'white'){
            if(socketValue?.socket){
                console.log('white won',won)
                socketValue?.socket.emit("gameWon",JSON.stringify({piece:"White"}));
                
            }
        }
        if(won === 'Black'){
            if(socketValue?.socket){
                console.log('black won',won)
                socketValue?.socket.emit("gameWon",JSON.stringify({piece:"Black"}));
            }
        }
    },[won])
    
    function currentGame(){
        axios.get("http://localhost:8000/api/currentGame",{withCredentials:true})
        .then((res)=>{
            
            setonGoingGame(res.data);
            const loggedInUser = JSON.parse(sessionStorage.getItem('user') as string)
           
                if(res.data.player1.player_id===loggedInUser._id){
                    setRowValue(0);
                    setPlayer1(true);
                    setUserPiece(res.data.player1.pieceType)
                }
                else if(res.data.player2.player_id===loggedInUser._id){
                    setRowValue(8)
                    setPlayer2(true);
                    setUserPiece(res.data.player2.pieceType)
                }
        })
        .catch(err=> console.log(err));
    }
    useEffect(()=>{
        initializeBoard();
       
        currentGame();
        window.history.pushState(null,'null',window.location.href);

        const handlePopState = () =>{
            setExistGame(true);
        }
        window.addEventListener('popstate',handlePopState)
        return () =>{
            window.removeEventListener('popstate',handlePopState);
        }
        
    },[])

    function yesExit(){
        setExistGame(false);
        setShowModal(true);
        if(userPiece.toLowerCase() === 'white'){
            
            setWon('Black');
            socketValue?.socket?.emit('playerDisconnect','white');
        }
        if(userPiece.toLowerCase() === 'black'){
            setWon('White');
            socketValue?.socket?.emit('playerDisconnect','black');
        }
        
        navigate("/");
    }
    function noStay(){
        
        setExistGame(false);
    }
    
    useEffect(()=>{
        if(timerW==0){
            setWon('Black')
            setShowModal(true);
           
        }
        if(timerB==0){
            setWon('White')
            setShowModal(true);
           
        }
    },[timerW,timerB])
    function handleClose(){
        setShowModal(false);
        navigate("/");
    }
   
  return (
    <>
    
    <Modal show={exitGame} onHide={noStay} centered>
    <Modal.Header closeButton>
      <Modal.Title className='justify-content-center'>Do you want to exit the game?</Modal.Title>
    </Modal.Header>
    <Modal.Body><Button onClick={yesExit}>Yes</Button><Button onClick={noStay}>No</Button></Modal.Body>
    </Modal>
    

    <Modal show={showModal} onHide={handleClose} centered>
    <Modal.Header closeButton>
      <Modal.Title className='justify-content-center'>{(timerB==0 || timerW==0) ? 'Times Up': 'Checkmate'}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{won} won</Modal.Body>
    </Modal>
     <BoardUi board={board} handelMove={handelMove} clickedCell={prevClickedCell} handelReset={handelReset} setTimerW={setTimerW} timerW={timerW} setTimerIdW={setTimerIdW} setTimerB={setTimerB} timerB={timerB} setTimerIdB={setTimerIdB} turn={turn} rowValue={rowValue}/>
     </>
  
  )
}


export default Board