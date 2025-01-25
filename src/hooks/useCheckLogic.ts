import { useContext } from 'react';
import useSafeLogic from './useSafeLogic'
import { KingContext } from '../AppContext/KingContext';

const useCheckLogic = () => {
    const {isPawnSafe,isBishopSafe,isKnightSafe,isRookSafe,isKingSafe} = useSafeLogic();
    const {value} = useContext(KingContext);


    const checkMate = (props:any):boolean =>{
    const kingPosition = props.gameState.kingPosition
    const gameState = props.gameState;
    const dRow=[-1,-1,-1,0,1,1,1,0]
    const dCol=[-1,0,1,1,1,0,-1,-1]
    
   // 

    function boundaryCheck(row:number,col:number){
        return row >=0 && row<8 && col >=0 && col <8;
    }
    //check if king can move to a safe place
    for(let i=0;i<8;i++){
        let params={
            crrRow:kingPosition.row + dRow[i],
            crrCol:kingPosition.col + dCol[i],
            board:gameState.board,
            piece:{type:'king' as 'king',color:kingPosition.color,isDead:false,canMove:true,numberOfTurns:1},
            forCheckMate:false,
            prevRow:kingPosition.row,
            prevCol:kingPosition.col
        }
        let safeFromPawn=false;
        let safeFromKnight=false;
        let safeFromRook=false;
        let safeFromBishop=false;
        let safeFromKing=false;
        if(boundaryCheck(params.crrRow,params.crrCol) && params.board[params.crrRow][params.crrCol].type==null){
            if(isPawnSafe(params)){
                
                safeFromPawn=true;
               
            }
            if(isKnightSafe(params)){
                
                safeFromKnight=true;
               
            }
            if(isRookSafe(params)){
                
                safeFromRook=true;
               
            }
            
            if(isBishopSafe(params)){
                
                safeFromBishop=true;
                
            }
            if(isKingSafe(params)){
                
                safeFromKing=true;
                
            }
        }
        if(safeFromPawn && safeFromBishop && safeFromKnight && safeFromRook && safeFromKing){
            
            return false;
        }
        else{
            
        }
    }

    //check if the check giving piece can be killed

    let params={
        crrRow:gameState.crrRow,
        crrCol:gameState.crrCol,
        board:gameState.board,
        piece:gameState.piece,
        forCheckMate:false
    }
    if(!isPawnSafe(params)){
        
        return false;

        
    }
    if(!isKnightSafe(params)){
        
        return false;
        
    }
    if(!isRookSafe(params)){
        
        return false;
        
    }
    if(!isBishopSafe(params)){
        
        return false;
        
    }
    if(!isKingSafe(params)){
        
        return false;
        
    }
    
    //check if something can come in the line of the check

    if(props.gameState.piece.type=='bishop' || props.gameState.piece.type=='queen'){
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
                piece:props.gameState.piece,
                forCheckMate:true
            }
            
            if((props.gameState.board[rowMove-props.gameState.direction][colMove].type=='pawn' || props.gameState.board[rowMove-2*props.gameState.direction][colMove].type=='pawn') 
                && (props.gameState.board[rowMove-props.gameState.direction][colMove].color !=props.gameState.piece.color || props.gameState.board[rowMove-2*props.gameState.direction][colMove].color !=props.gameState.piece.color)){
                    
                    return false;
            }
            if(!isBishopSafe(params)){
                
                return false;
            }
            if(!isKnightSafe(params)){
                
                return false;
            }
            if(!isRookSafe(params)){
                
                return false;
            }

        }
    }
    else if(gameState.piece.type=='rook' || gameState.piece.type=='queen'){
        
        let kingsRow = gameState.kingPosition.row;
        let rookRow = gameState.crrRow
        let kingsCol =gameState.kingPosition.col;
        let rookCol = gameState.crrCol
        const rowDiff = Math.abs(rookRow - kingsRow);
        const colDiff = Math.abs(rookCol - kingsCol);
        
        if(rowDiff==0){
            if(kingsCol < rookCol){
                for(let i=kingsCol+1;i<rookCol;i++){
                   
                    const colMove = i;
                    let params={
                        crrRow:rookRow,
                        crrCol:colMove,
                        board:gameState.board,
                        piece:gameState.piece,
                        forCheckMate:true
                    }
                    
                    if((boundaryCheck(rookRow - 1*gameState.direction,colMove)) && (gameState.board[rookRow - 1*gameState.direction][colMove].type=='pawn' || gameState.board[rookRow-2*gameState.direction][colMove].type=='pawn')){
                        if(gameState.board[rookRow - 1*gameState.direction][colMove].color!=gameState.piece.color || gameState.board[rookRow - 2*gameState.direction][colMove].color!=gameState.piece.color){
                            
                            return false;
                        }
                    }
                    if(!isBishopSafe(params)){
                        
                        return false;
                    }
                    if(!isKnightSafe(params)){
                        
                        return false;
                    }
                    if(!isRookSafe(params)){
                        
                        return false;
                    }
                }
            }
            if(kingsCol > rookCol){
                for(let i=rookCol+1;i<kingsCol;i++){
                   
                    const colMove = i;
                    let params={
                        crrRow:rookRow,
                        crrCol:colMove,
                        board:gameState.board,
                        piece:gameState.piece,
                        forCheckMate:true
                    }
                    
                    if(boundaryCheck(rookRow - 1*gameState.direction,colMove) && (gameState.board[rookRow - 1*gameState.direction][colMove].type=='pawn' || gameState.board[rookRow-2*gameState.direction][colMove].type=='pawn')){
                        if(gameState.board[rookRow - 1*gameState.direction][colMove].color!=gameState.piece.color || gameState.board[rookRow - 2*gameState.direction][colMove].color!=gameState.piece.color){
                            
                            return false;
                        }
                    }
                    if(!isBishopSafe(params)){
                        
                        return false;
                    }
                    if(!isKnightSafe(params)){
                        
                        return false;
                    }
                    if(!isRookSafe(params)){
                        
                        return false;
                    }
                }
            }
        }
        else{
            if(colDiff==0){
                if(kingsRow < rookRow){
                    for(let i=kingsRow+1;i<rookRow;i++){
                       
                       
                        let params={
                            crrRow:i,
                            crrCol:rookCol,
                            board:gameState.board,
                            piece:gameState.piece,
                            forCheckMate:true
                        }
                        
                       
                        if(!isBishopSafe(params)){
                            
                            return false;
                        }
                        if(!isKnightSafe(params)){
                            
                            return false;
                        }
                        if(!isRookSafe(params)){
                            
                            return false;
                        }
                    }
                }
                if(kingsRow > rookRow){
                    for(let i=rookRow+1;i<kingsRow;i++){
                       
                        
                        let params={
                            crrRow:i,
                            crrCol:rookCol,
                            board:gameState.board,
                            piece:gameState.piece,
                            forCheckMate:true
                        }
                        
                        
                        if(!isBishopSafe(params)){
                            
                            return false;
                        }
                        if(!isKnightSafe(params)){
                            
                            return false;
                        }
                        if(!isRookSafe(params)){
                            
                            return false;
                        }
                    }
                }
            }
        }
    }
    
    return true;
  }
  return {checkMate}
}

export default useCheckLogic