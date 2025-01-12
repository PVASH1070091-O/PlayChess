import React, { useState } from 'react'
import useGameLogic from './useGameLogic'
import useSafeLogic from './useSafeLogic'

const useCheckLogic = () => {
    const {isPawnSafe,isBishopSafe,isKnightSafe,isRookSafe,isKingSafe} = useSafeLogic();
  const checkMate = (props:any):boolean =>{

    console.log("gameState",props)
    const kingPosition = props.gameState.kingPosition
    const gameState = props.gameState;
    const dRow=[-1,-1,-1,0,1,1,1,0]
    const dCol=[-1,0,1,1,1,0,-1,-1]
    

    function boundaryCheck(row:number,col:number){
        return row >=0 && row<8 && col >=0 && col <8;
    }
    //check if king can move to a safe place
    for(let i=0;i<8;i++){
        let params={
            crrRow:kingPosition.row + dRow[i],
            crrCol:kingPosition.col + dCol[i],
            board:gameState.board,
            piece:{type:'king' as 'king',color:kingPosition.color,isDead:false,canMove:true,numberOfTurns:1}
        }
        let safeFromPawn=false;
        let safeFromKnight=false;
        let safeFromRook=false;
        let safeFromBishop=false;
        let safeFromKing=false;
        if(boundaryCheck(params.crrRow,params.crrCol) && params.board[params.crrRow][params.crrCol].type==null){
            if(isPawnSafe(params)){
                console.log("is pawn safe")
                safeFromPawn=true;
               
            }
            if(isKnightSafe(params)){
                console.log("is knight safe")
                safeFromKnight=true;
               
            }
            if(isRookSafe(params)){
                console.log("is rook safe")
                safeFromRook=true;
               
            }
            console.log("safffff",safeFromRook)
            if(isBishopSafe(params)){
                console.log("is bishop safe")
                safeFromBishop=true;
                
            }
            if(isKingSafe(params)){
                console.log("is king safe")
                safeFromKing=true;
                
            }
        }
        if(safeFromPawn && safeFromBishop && safeFromKnight && safeFromRook && safeFromKing){
            console.log("safe place",params.crrRow,params.crrCol)
            return false;
        }
        else{
            console.log("king cannot move")
        }
    }

    //check if the check giving piece can be killed

    let params={
        crrRow:gameState.crrRow,
        crrCol:gameState.crrCol,
        board:gameState.board,
        piece:gameState.piece
    }
    console.log("params",params)
    if(!isPawnSafe(params)){
        console.log("pawn marr dega")
        return false;

        
    }
    if(!isKnightSafe(params)){
        console.log("ghoda maar dega")
        return false;
        
    }
    if(!isRookSafe(params)){
        console.log("hathi maar dega")
        return false;
        
    }
    if(!isBishopSafe(params)){
        console.log("bishop maar dega")
        return false;
        
    }
    if(!isKingSafe(params)){
        console.log("king maar dega")
        return false;
        
    }

    //check if something can come in the line of the check

    if(props.gameState.piece.type=='bishop'){
        let rBishop = [1,-1,-1,1];
        let cBishop = [1,1,-1,-1];
        let i=0;
        const diff = Math.abs(props.gameState.crrRow - props.gameState.kingPosition.row);
        if(props.gameState.crrRow < props.gameState.kingPosition.row && props.gameState.crrCol > props.gameState.kingPosition.col){
            i=3;
        }
        else if(props.gameState.crrRow < props.gameState.kingPosition.row && props.gameState.crrCol < props.gameState.kingPosition.col){
            i=0;
        }
        else if(props.gameState.crrRow > props.gameState.kingPosition.row && props.gameState.crrCol < props.gameState.kingPosition.col){
            i=1;
        }
        else if(props.gameState.crrRow > props.gameState.kingPosition.row && props.gameState.crrCol > props.gameState.kingPosition.col){
            i=2;
        }
        for(let j=1;j<diff;j++){
            const rowMove = props.gameState.crrRow + rBishop[i] * j;
            const colMove = props.gameState.crrCol + cBishop[i] * j;
            let params={
                crrRow:rowMove,
                crrCol:colMove,
                board:gameState.board,
                piece:props.gameState.piece
            }
            console.log("inpe check hoga",rowMove,colMove);
            if(props.gameState.board[rowMove+props.gameState.direction][colMove].type=='pawn' 
                && props.gameState.board[rowMove+props.gameState.direction][colMove].color !=props.gameState.piece.color){
                    console.log("pawn aayega beech me")
                    return false;
            }
            if(!isBishopSafe(params)){
                console.log("bishop aayega beech me")
                return false;
            }
            if(!isKnightSafe(params)){
                console.log("knight aajayega")
                return false;
            }
            if(!isRookSafe(params)){
                console.log("rook aajygea")
                return false;
            }

        }
    }
    
    return true;
  }
  return {checkMate}
}

export default useCheckLogic