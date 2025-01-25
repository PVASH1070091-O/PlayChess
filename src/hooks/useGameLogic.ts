import { useState,useEffect, useContext } from 'react';
import { PieceType } from '../components/Board';
import useCheckLogic from './useCheckLogic';
import useSafeLogic, { IsPawnSafeParams } from './useSafeLogic';
import {  CheckContext, GameStateContext, KingContext } from '../AppContext/KingContext';


interface GameState {
    crrRow: number;
    crrCol: number;
    prevRow: number;
    prevCol: number;
    piece: any; 
    direction: number;
    kingPosition: any; 
    board: PieceType[][]; 
}

const useGameLogic = (setShowModal:React.Dispatch<React.SetStateAction<boolean>>,setWon:React.Dispatch<React.SetStateAction<string>>) => {
    const {checkMate} = useCheckLogic();
   
    const {isPawnSafe,isBishopSafe,isKnightSafe,isRookSafe,isKingSafe} = useSafeLogic();
    const {isCheck,setCheck} = useContext(CheckContext);
    const {gameState,setGameState} = useContext(GameStateContext);
    const {value} = useContext(KingContext);
    useEffect(() => {
        
        if(isCheck){
            // dieFunction();
            alert("check lg gyi")
                  
            if(checkMate({gameState})){
            
            setWon(gameState.piece.color)
            setShowModal(true);
            
            }
            else {
                console.log("check hat gyi")
            }
        }
        else{
            
            //alert("check hatt gyi")
        }
        }, [isCheck])

    function boundaryCheck(row:number,col:number){
        return row >=0 && row<8 && col >=0 && col <8;
    }
    const validMove = (prevClickedCell:string,board:PieceType[][],currentCellId:string,parent:HTMLDivElement) =>{
        const crrRow = parseInt(currentCellId[0]);
        const crrCol = parseInt(currentCellId[2]);
        const prevRow = parseInt(prevClickedCell[0]);
        const prevCol = parseInt(prevClickedCell[2]);
        const piece = board[prevRow][prevCol]
        const direction = piece.color=='black' ? 1 :-1;

        
        const move={isCastle:false,isValid:false};
        function safeCell(){
            
            return ( isKingSafe({crrRow,crrCol,board,piece,forCheckMate:false}) && isPawnSafe({crrRow,crrCol,board,piece,forCheckMate:false}) && isKnightSafe({crrRow,crrCol,board,piece,forCheckMate:false}) && isRookSafe({crrRow,crrCol,board,piece,prevRow,prevCol,forCheckMate:false}) && isBishopSafe({crrRow,crrCol,board,piece,prevRow,prevCol,forCheckMate:false}));
        }
        

        const pawnMove = () =>{
            
            if(crrRow-prevRow==direction || (crrRow-prevRow==direction*2 && board[prevRow][prevCol].numberOfTurns==0)){
                if((!parent?.querySelector('.chessPiece') && (crrCol-prevCol == 0)) || (Math.abs(crrCol-prevCol)==1  && board[crrRow][crrCol].type!=null)) {
                   
                    if(isCheck){
                        
                        setGameState({
                            crrRow:0,
                            crrCol:0,
                            piece:{},
                            direction:0,
                            kingPosition:{},
                            board:[]
                            })
                        setCheck(false);
                    }
                    //isPawnCheck();
                    return {isCastle:false,isValid:true};
                }
                
                return move;
                
            }
            else{
               
                return move;
            }
        }
        const rookMove = () =>{
                let movedCorrectly=true;
                if(crrRow-prevRow==0){
                    let c1=prevCol;
                    let c2=crrCol;
                    while(c1!=c2){
                        if(c1!=prevCol && board[crrRow][c1].type!=null){
                            
                            movedCorrectly=false;
                            break;
                        }
                        c1<c2 ? c1++ : c1--;
                    }
                   
                    //isRookCheck();
    
                }
                else{
                    if(crrCol-prevCol==0){
                        let r1=prevRow;
                        let r2=crrRow;
                        while(r1!=r2){
                            if(r1!=prevRow && board[r1][crrCol].type!=null){
                                movedCorrectly=false;
                                break;
                            }
                            r1<r2 ? r1++ : r1--;
                        }
                        //isRookCheck();
    
                    }
                    else{
                        movedCorrectly=false;
                    }
                }
               
                if(movedCorrectly){
                    
                    if(isCheck){
                        setGameState({
                            crrRow:0,
                            crrCol:0,
                            piece:{},
                            direction:0,
                            kingPosition:{},
                            board:[]
                            })
                        
                        setCheck(false);
                    }
                    return {isCastle:false,isValid:true};
                }
                else{
                    return move;
                }

        }
        const knightMove = () =>{
            
            if((Math.abs(prevRow - crrRow) == 2 && Math.abs(prevCol - crrCol) == 1) || (Math.abs(prevRow - crrRow) == 1 && Math.abs(prevCol - crrCol) == 2)){
                if(isCheck){
                    setGameState({
                        crrRow:0,
                        crrCol:0,
                        piece:{},
                        direction:0,
                        kingPosition:{},
                        board:[]
                        })
                    
                    setCheck(false);
                }
                //isKnightCheck();
                return {isCastle:false,isValid:true};
            }
            
            return move;
            
        }
        const bishopMove = () =>{
            if(Math.abs(prevRow-crrRow) == Math.abs(prevCol-crrCol)){
                let posDiff = Math.abs(prevRow-crrRow);
                let r1=prevRow;
                let c1=prevCol;
                const rowSteps = crrRow > prevRow ? 1 : -1;
                const colSteps = crrCol > prevCol ? 1 : -1;
                for(let pos=1;pos<=posDiff;pos++){
                    if(board[r1][c1].type!=null && r1!=prevRow){
                        return move;
                    }
                    r1=r1+rowSteps;
                    c1=c1+colSteps
                }
                
                if(isCheck){
                    
                    setGameState({
                        crrRow:0,
                        crrCol:0,
                        piece:{},
                        direction:0,
                        kingPosition:{},
                        board:[]
                        })
                    setCheck(false);
                }
                //isBishopCheck();
                return {isCastle:false,isValid:true};
            }
            return move;
        }
        const kingMove = () =>{
            if(safeCell()){
                if(canCastle(crrRow,crrCol)){
                    return {isCastle:true,isValid:true};
                }
                if(Math.abs(crrRow-prevRow) == 0){
                    if(Math.abs(crrCol-prevCol)==1) {
                        setGameState({
                            crrRow:0,
                            crrCol:0,
                            piece:{},
                            direction:0,
                            kingPosition:{},
                            board:[]
                            })
                        setCheck(false);
                        return {isCastle:false,isValid:true}
                    }
                    
                }
                if(Math.abs(crrCol-prevCol) == 0){
                    if(Math.abs(crrRow-prevRow)==1) {
                        setGameState({
                            crrRow:0,
                            crrCol:0,
                            piece:{},
                            direction:0,
                            kingPosition:{},
                            board:[]
                            })
                        setCheck(false);
                        return {isCastle:false,isValid:true};
                    }
                }
                if(Math.abs(crrRow-prevRow)==1 && Math.abs(crrCol-prevCol)==1) {
                    setGameState({
                        crrRow:0,
                        crrCol:0,
                        piece:{},
                        direction:0,
                        kingPosition:{},
                        board:[]
                        })
                    setCheck(false);
                    return {isCastle:false,isValid:true};
                }

            }
            
            return move;
        }
        function canCastle(crrRow:number,crrCol:number){
            if(board[crrRow][crrCol].type=='rook' && board[crrRow][crrCol].numberOfTurns==0 && piece.numberOfTurns==0 && piece.color==board[crrRow][crrCol].color){
                for(let i=1;i<Math.abs(crrCol-prevCol);i++){
                    if(crrCol==7){
                        if(board[prevRow][prevCol+i].type!=null){
                            return false;
                        }
                       
                    }
                    if(crrCol==0){
                        if(board[prevRow][prevCol-i].type!=null){
                            return false;
                        }
                    }
                }
                sessionStorage.setItem("isCastle",'true');
                return true;
            }
           
        }
        const queenMove = () =>{
            if(pawnMove().isValid){
                
                return {isCastle:false,isValid:true}
            }
            if(rookMove().isValid){
                
                return {isCastle:false,isValid:true}
            }
            if(bishopMove().isValid){
                return {isCastle:false,isValid:true}
            }
            if(knightMove().isValid){
                return move;
            }

           // return ((pawnMove().isValid || rookMove().isValid || bishopMove().isValid) && !knightMove().isValid);
        }


        if(board[crrRow][crrCol].color == board[prevRow][prevCol].color && !(piece.type=='king' && board[crrRow][crrCol].type=='rook')){
            
            return move;
            
        }
        //for chcking , because of this movement will the king of same color ,get's check 
        if(piece.type!=='king'){
            let tempUpdatedBoard = gameState.board.length ? JSON.parse(JSON.stringify(gameState.board)) : JSON.parse(JSON.stringify(board));
            tempUpdatedBoard[prevRow][prevCol]={type:null,color:null,isDead:false,canMove:true,numberOfTurns:0}
            tempUpdatedBoard[crrRow][crrCol]={type:piece.type,color:piece.color,isDead:false,canMove:true,numberOfTurns:1}
            
            
            let params={
                crrRow:value[piece.color!].row, 
                crrCol:value[piece.color!].col,
                board:tempUpdatedBoard,
                piece:{type:'king' as 'king',color:piece.color,isDead:false,canMove:true,numberOfTurns:1},
                forCheckMate:false
            }
            
            if(!(isPawnSafe(params) && isBishopSafe(params) && isRookSafe(params) && isKnightSafe(params))){
                
                let nState= {...gameState}
                setGameState(nState);
                return move;
            }
        }
    
        
        switch(piece.type){
            case 'pawn':
                return pawnMove();
            case 'rook':
                return rookMove();
            case 'knight':
                return knightMove();
            case 'bishop':
                return bishopMove();
            case 'queen':
                return queenMove();
            case 'king':
                return kingMove();
            
        }
            
        
        
        return move;
    
    }
    
    return { validMove,boundaryCheck };
}

export default useGameLogic