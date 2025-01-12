import React, { useContext, useEffect, useRef, useState } from 'react'
import './Board.css'
import BoardUi from './BoardUi'
import useGameLogic from '../hooks/useGameLogic'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { CheckContext, GameStateContext, KingContext } from '../AppContext/KingContext';
import useSafeLogic from '../hooks/useSafeLogic';


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
    const[showModal,setShowModal] = useState(false);
    const [won,setWon]=useState('');
    const [timerW,setTimerW]=useState(2400);
    const [timerIdW,setTimerIdW] = useState<number>(0);
    const [timerB,setTimerB]=useState(2400);
    const [timerIdB,setTimerIdB] = useState<number>(0);
    const {value,setValue} = useContext(KingContext);
    const {isCheck,setCheck} = useContext(CheckContext);
    const {isPawnSafe,isBishopSafe,isKnightSafe,isRookSafe} = useSafeLogic();

    if(!value.white){
       setValue({
        white: { row: 7, col: 4, color: 'white' },
        black: { row: 0, col: 4, color: 'black' }
        })
    }
    const initialState = Array.from({length: 8}, () =>Array(8).fill({
        type:null,
        color:null
    }));
    const [board,setBoard] = useState<PieceType [][]>(initialState);
    const {validMove} = useGameLogic(setShowModal,setWon);
   
    const handelMove = (cellRef:React.RefObject<HTMLDivElement>) =>{
        const parent = cellRef.current
        const currentCellId = cellRef?.current?.id;
        if(currentCellId){
            const crrRow = parseInt(currentCellId[0]);
            const crrCol = parseInt(currentCellId[2]);
            const piece = board[crrRow][crrCol];
            if((piece.color && !turn[piece.color]) && !prevClickedCell){
                // to get turn one by one, 
                // if we remove !prevClickedCell, then when a piece will try to capture another piece , it will come into this condition
                // if one piece takes over other color piece then 'prevClickedCell' will have something
                // so !prevClickedCell this value will be false;
                console.log("not your turn")
            }
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
                        if(parent && validMove(prevClickedCell,board,currentCellId || "",parent)){
                            console.log("its a move",board,turn.white,timerIdW)
                            turn.white ? clearInterval(timerIdW) : clearInterval(timerIdB);
                            setTurn({white:!turn.white,black:!turn.black});
                            const updatedBoard = [...board];
                            updatedBoard[crrRow][crrCol] = board[prevClickedCell[0]][prevClickedCell[2]];
                            updatedBoard[crrRow][crrCol].numberOfTurns+=1;
                            if(updatedBoard[crrRow][crrCol].type=='king' && updatedBoard[crrRow][crrCol].color=='white'){
                                
                                setValue({...value,white:{row:crrRow,col:crrCol,color:updatedBoard[crrRow][crrCol].color as string}})
                            }
                            if(updatedBoard[crrRow][crrCol].type=='king' && updatedBoard[crrRow][crrCol].color=='black'){
                                
                                setValue({...value,black:{row:crrRow,col:crrCol,color:updatedBoard[crrRow][crrCol].color as string}})
                            }
                            if(updatedBoard[crrRow][crrCol].type=='pawn'){
                                if(crrRow==7){
                                    updatedBoard[crrRow][crrCol] = {type:'queen',color:"black",isDead:false,canMove:true,numberOfTurns:0};
                                }
                                if(crrRow==0){
                                    updatedBoard[crrRow][crrCol] = {type:'queen',color:"white",isDead:false,canMove:true,numberOfTurns:0};
                                }
                              
                            }
                            updatedBoard[prevClickedCell[0]][prevClickedCell[2]]={type:null,color:null,isDead:null,canMove:true,numberOfTurns:0};

                            
                            if(updatedBoard[crrRow][crrCol].color=='black'){
                                
                                let param={
                                    crrRow:value.white.row, 
                                    crrCol:value.white.col,
                                    board:updatedBoard,
                                    piece:{type:'king' as 'king',color:'white' as 'white',isDead:false,canMove:true,numberOfTurns:1}
                                }
                                console.log("params123",isCheck)
                                if(!(isPawnSafe(param) && isBishopSafe(param) && isRookSafe(param) && isKnightSafe(param))){
                                    alert("check lgi to hai htane se")
                                    setCheck(true)
                                }
                            }
                            if(updatedBoard[crrRow][crrCol].color=='white'){
                                
                                let param={
                                    crrRow:value.black.row, 
                                    crrCol:value.black.col,
                                    board:updatedBoard,
                                    piece:{type:'king' as 'king',color:'black' as 'black',isDead:false,canMove:true,numberOfTurns:1}
                                }
                                console.log("params passes2",param)
                                if(!(isPawnSafe(param) && isBishopSafe(param) && isRookSafe(param) && isKnightSafe(param))){
                                    
                                    setCheck(true)
                                }
                            }
                        
                            
                            setBoard(updatedBoard);
                            
                        }
                        else{
                            console.log("invalid move")
                        }
                    }
                    else{
                        console.log("not a move")
                    }
                    setClickedCell('');
                }
            }
            
    }

    }
    const handelReset = () =>{
        setTurn({white:true,black:false});
        setWon('')
        setTimerW(120);
        setTimerB(120);
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
    useEffect(()=>{
        initializeBoard();
    },[])
    useEffect(()=>{
        if(timerW==0){
            setWon('Black')
            setShowModal(true);
            clearInterval(timerIdW);
            clearInterval(timerIdB);
        }
        if(timerB==0){
            setWon('White')
            setShowModal(true);
            clearInterval(timerIdB);
            clearInterval(timerIdW);
        }
    },[timerW,timerB])
    function handleClose(){
        setShowModal(false);
        handelReset();
        clearInterval(timerIdB);
        clearInterval(timerIdW);
        setTimerB(120);
        setTimerW(120)
    }
   
  return (
    <>
    
    <Modal show={showModal} onHide={handleClose} centered>
    <Modal.Header closeButton>
      <Modal.Title className='justify-content-center'>{(timerB==0 || timerW==0) ? 'Times Up': 'Checkmate'}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{won} won</Modal.Body>
    </Modal>
     <BoardUi board={board} handelMove={handelMove} clickedCell={prevClickedCell} handelReset={handelReset} setTimerW={setTimerW} timerW={timerW} setTimerIdW={setTimerIdW} setTimerB={setTimerB} timerB={timerB} setTimerIdB={setTimerIdB} turn={turn}/>
     </>
  
  )
}


export default Board