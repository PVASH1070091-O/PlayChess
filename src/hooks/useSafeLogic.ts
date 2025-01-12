import React, { useContext } from 'react'
import useGameLogic from './useGameLogic';
import { PieceType } from '../components/Board';
import { GameStateContext, KingContext } from '../AppContext/KingContext';

export interface IsPawnSafeParams {
    crrRow: number;
    crrCol: number;
    board: PieceType[][];
    piece: PieceType;
    prevRow?: number;
    prevCol?: number;
}

const useSafeLogic = () => {

     const {gameState,setGameState} = useContext(GameStateContext);
     const {value,setValue} = useContext(KingContext);

    

    function boundaryCheck(row:number,col:number){
        return row >=0 && row<8 && col >=0 && col <8;
    }

    function isPawnSafe({crrRow,crrCol,board,piece}:IsPawnSafeParams){
        console.log("board",board)
        let dRow;
        let dCol;
        if(piece.color=='black'){
            dRow=[1,1];
            dCol=[1,-1];      
        }
        else{
            dRow=[-1,-1];
            dCol=[1,-1];
            
        }
        for(let i=0;i<2;i++){
            console.log("crrrrrPawn",board,board)

            if(boundaryCheck(crrRow+dRow[i],crrCol+dCol[i]) && (board[crrRow+dRow[i]][crrCol+dCol[i]].type=='pawn' || board[crrRow+dRow[i]][crrCol+dCol[i]].type=='queen') && 
            board[crrRow+dRow[i]][crrCol+dCol[i]].color!=piece.color){
                //console.log("pawn ki wajah se")
                return false;
            }
        }
        
        return true;
    }
    function isKnightSafe({crrRow,crrCol,board,piece}:IsPawnSafeParams){
        let rKnight = [2,2,-2,-2,-1,1,-1,1];
        let cKnight = [1,-1,1,-1,-2,-2,2,2];
        //console.log("knight safe called")
        for(let i=0;i<8;i++){
            console.log("knight chla",crrRow,rKnight[i],crrCol,cKnight[i])
            if(boundaryCheck(crrRow+rKnight[i],crrCol+cKnight[i]) && board[crrRow+rKnight[i]][crrCol+cKnight[i]].color!=piece.color && 
            board[crrRow+rKnight[i]][crrCol+cKnight[i]].type=='knight' ){
                //console.log("knight ki wajah se")
                return false;
            }
        }
        return true;
    }
    function isRookSafe({crrRow,crrCol,board,piece}:IsPawnSafeParams){
        let iteratorRook = [true,true,true,true]
        console.log("roook safe called",crrRow,crrCol,piece,board)
        for(let i=1;i<8;i++){
            if(boundaryCheck(crrRow,crrCol+i) && iteratorRook[0]){
                if((board[crrRow][crrCol+i].type=='rook' || board[crrRow][crrCol+i].type=='queen') && board[crrRow][crrCol+i].color!=piece.color){
                    console.log("rook or queen  ki wajah se1")
                    let checkPiece={
                        type:board[crrRow][crrCol+i].type,
                        color:board[crrRow][crrCol+i].color,
                        isDead:false,
                        canMove:true,
                        numberOfTurns:board[crrRow][crrCol+i].numberOfTurns+1
                    }
                    let direction = board[crrRow][crrCol+i].color=='white' ? 1: -1;
                    //console.log("dadad",value[piece.color ?? "white"].row,direction,piece.color)
                    let kingPosition={row:value[piece.color ?? "white"].row,col:value[piece.color ?? "white"].col,color:piece.color}
    
                    let nState={crrRow,crrCol:crrCol+i,piece:checkPiece,direction,board,kingPosition}
                    setGameState(nState);
                    return false;
                }
                if(board[crrRow][crrCol+i].type!=null && board[crrRow][crrCol+i].type!='king'){
                    iteratorRook[0]=false;
                }
                
            }
            if(boundaryCheck(crrRow,crrCol-i) && iteratorRook[1]){
                console.log("check rook",board,crrRow,crrCol-i,board[crrRow][crrCol-i],board[crrRow][crrCol-i].type)
                
                if((board[crrRow][crrCol-i].type=='rook' || board[crrRow][crrCol-i].type=='queen' ) && board[crrRow][crrCol-i].color!=piece.color){
                    console.log("rook or queen  ki wajah se2")
                    let checkPiece={
                        type:board[crrRow][crrCol-i].type,
                        color:board[crrRow][crrCol-i].color,
                        isDead:false,
                        canMove:true,
                        numberOfTurns:board[crrRow][crrCol-i].numberOfTurns+1
                    }
                    let direction = board[crrRow][crrCol-i].color=='white' ? 1: -1;
                    //console.log("dadad",value[piece.color ?? "white"].row,direction,piece.color)
                    let kingPosition={row:value[piece.color ?? "white"].row,col:value[piece.color ?? "white"].col,color:piece.color}
    
                    let nState={crrRow,crrCol:crrCol-i,piece:checkPiece,direction,board,kingPosition}
                    setGameState(nState);
                    return false;
                }
                if(board[crrRow][crrCol-i].type!=null && board[crrRow][crrCol-i].type!="king"){
                    iteratorRook[1]=false;
                }
                
            }
        }
        for(let i=1;i<8;i++){
            if(boundaryCheck(crrRow+i,crrCol) && iteratorRook[2]){
                if((board[crrRow+i][crrCol].type=='rook' || board[crrRow+i][crrCol].type=='queen') && board[crrRow+i][crrCol].color!=piece.color){
                    console.log("rook or queen  ki wajah se3")
                    let checkPiece={
                        type:board[crrRow+i][crrCol].type,
                        color:board[crrRow+i][crrCol].color,
                        isDead:false,
                        canMove:true,
                        numberOfTurns:board[crrRow+i][crrCol].numberOfTurns+1
                    }
                    let direction = board[crrRow+i][crrCol].color=='white' ? 1: -1;
                    //console.log("dadad",value[piece.color ?? "white"].row,direction,piece.color)
                    if(piece.color){
                        let kingPosition={row:value[piece.color].row,col:value[piece.color].col,color:piece.color}
                        let nState={crrRow:crrRow+i,crrCol:crrCol,piece:checkPiece,direction,board,kingPosition}
                        setGameState(nState);
                    }
    
                    
                    return false;
                    
                }
                if(board[crrRow+i][crrCol].type!=null && board[crrRow+i][crrCol].type!="king"){
                    iteratorRook[2]=false;
                }
                
            }
            if(boundaryCheck(crrRow-i,crrCol) && iteratorRook[3]){
                if((board[crrRow-i][crrCol].type=='rook' || board[crrRow-i][crrCol].type=='queen') && board[crrRow-i][crrCol].color!=piece.color){
                    console.log("rook or queen ki wajah se4")
                    let checkPiece={
                        type:board[crrRow-i][crrCol].type,
                        color:board[crrRow-i][crrCol].color,
                        isDead:false,
                        canMove:true,
                        numberOfTurns:board[crrRow][crrCol-i].numberOfTurns+1
                    }
                    let direction = board[crrRow-i][crrCol].color=='white' ? 1: -1;
                    //console.log("dadad",value[piece.color ?? "white"].row,direction,piece.color)
                    if(piece.color){
                        let kingPosition={row:value[piece.color].row,col:value[piece.color].col,color:piece.color}
                        let nState={crrRow:crrRow-i,crrCol:crrCol,piece:checkPiece,direction,board,kingPosition}
                        setGameState(nState);
                    }
                    return false;
                }
                if(board[crrRow-i][crrCol].type!=null &&  board[crrRow-i][crrCol].type!="king"){
                    iteratorRook[3]=false;
                }
               
            }
        }
        return true;
    }
    function isBishopSafe({crrRow,crrCol,board,piece,prevRow,prevCol}:IsPawnSafeParams){
        let rBishop = [1,-1,-1,1];
        let cBishop = [1,1,-1,-1];
        let ignore:number[]= [];
        for(let move=1;move<8;move++){
            for(let i=0;i<4;i++){
                if(!ignore.includes(i)){
                    const colMove = crrCol + cBishop[i] * move;
                    const rowMove = crrRow + rBishop[i] * move;
                    //console.log("is checking",rowMove,colMove)
                    if(boundaryCheck(rowMove,colMove)){
                        if((board[rowMove][colMove].type=='bishop' || board[rowMove][colMove].type=='queen' ) && board[rowMove][colMove].color!=piece.color){
                            //console.log("bishop ki wajah se",rowMove,colMove)
                            let checkPiece={
                                type:board[rowMove][colMove].type,
                                color:board[rowMove][colMove].color,
                                isDead:false,
                                canMove:true,
                                numberOfTurns:board[rowMove][colMove].numberOfTurns+1
                            }
                            let direction = board[rowMove][colMove].color=='white' ? 1: -1;
                            //console.log("dadad",value[piece.color ?? "white"].row,direction,piece.color)
                            let kingPosition={row:value[piece.color ?? "white"].row,col:value[piece.color ?? "white"].col,color:piece.color}
            
                            let nState={crrRow:rowMove,crrCol:colMove,piece:checkPiece,direction,board,kingPosition}
                            setGameState(nState);
                            
                            return false;
                        }
                        if(board[rowMove][colMove].type!=null){
                            if(prevRow && prevCol && board[prevRow][prevCol].type=='king'){
                                continue;
                            }
                            else{
                                
                                ignore.push(i);
                            }
                           
                        }
                        
                    }
                }
            }
        }
        //console.log("bishiop ki wajah se lgi hai check")
        return true;
    }
    function isKingSafe({crrRow,crrCol,board,piece}:IsPawnSafeParams){
        const dRow=[-1,-1,-1,0,1,1,1,0]
        const dCol=[-1,0,1,1,1,0,-1,-1]
        for(let i=0;i<8;i++){
            
            let cRow=crrRow + dRow[i];
            let cCol = crrCol + dCol[i];
            if(boundaryCheck(cRow,cCol)){
                //console.log("king check",cRow,cCol,board[cRow][cCol].type,board[cRow][cCol].color,piece.color)
                if((board[cRow][cCol].type=='king' || board[cRow][cCol].type=='queen') && board[cRow][cCol].color!=piece.color){
                    let npiece={
                        color:board[cRow][cCol].color,
                        type:'king' as 'king',
                        isDead:false,
                        canMove:true,
                        numberOfTurns:board[cRow][cCol].numberOfTurns+1
                    }
                    if(safeCell({crrRow,crrCol,board,piece:npiece})){
                        return false;
                    }
                }
                
            }
        }
        return true;
    }
    function safeCell(obj:IsPawnSafeParams){
        return (isPawnSafe(obj) && isKnightSafe(obj) && isRookSafe(obj) && isBishopSafe(obj));
    }

    return {isPawnSafe,isBishopSafe,isKnightSafe,isRookSafe,isKingSafe}
}

export default useSafeLogic