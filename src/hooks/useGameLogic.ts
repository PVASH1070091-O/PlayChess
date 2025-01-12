import { useState,useEffect, useContext } from 'react';
import { PieceType } from '../components/Board';
import useCheckLogic from './useCheckLogic';
import useSafeLogic, { IsPawnSafeParams } from './useSafeLogic';
import { CheckContext, GameStateContext, KingContext } from '../AppContext/KingContext';


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
    //const [isCheck,setCheck] = useState<boolean>(false);
    const {checkMate} = useCheckLogic();
   
    const {isPawnSafe,isBishopSafe,isKnightSafe,isRookSafe} = useSafeLogic();

   
    const {value,setValue} = useContext(KingContext);
    const {isCheck,setCheck} = useContext(CheckContext);
    const {gameState,setGameState} = useContext(GameStateContext);
    useEffect(() => {
            console.log("is check is called",isCheck)
            if(isCheck){
               // dieFunction();
               console.log("iss piece ne di hai check",gameState);      
               if(checkMate({gameState})){
                console.log("checkmate lgei gyi hai ab  ");
                setWon(gameState.piece.color)
                setShowModal(true);
                
               }
               else console.log("nhi lgi checkmate")
            }
        }, [isCheck])
    

        

    function boundaryCheck(row:number,col:number){
        return row >=0 && row<8 && col >=0 && col <8;
    }
    const validMove = (prevClickedCell:string,board:PieceType[][],currentCellId:string,parent:HTMLDivElement):boolean =>{
        const crrRow = parseInt(currentCellId[0]);
        const crrCol = parseInt(currentCellId[2]);
        const prevRow = parseInt(prevClickedCell[0]);
        const prevCol = parseInt(prevClickedCell[2]);
        const piece = board[prevRow][prevCol]
        const direction = piece.color=='black' ? 1 :-1;
        var updatedState= {
            crrRow:crrRow,
            crrCol:crrCol,
            piece:piece,
            direction:direction,
            board:board,
            kingPosition:{}
        }
        
        console.log("context value",value)
        console.log("this is piece",piece)
        
        console.log("isschecckk",isCheck)

        function safeCell(){
            
            return (isPawnSafe({crrRow,crrCol,board,piece}) && isKnightSafe({crrRow,crrCol,board,piece}) && isRookSafe({crrRow,crrCol,board,piece}) && isBishopSafe({crrRow,crrCol,board,piece,prevRow,prevCol}));
        }
        
       
        function isPawnCheck(){
            if((boundaryCheck(crrRow + direction,crrCol-1) && board[crrRow+direction][crrCol-1].type=='king' && (piece.color != (board[crrRow+direction][crrCol-1].color))) || (boundaryCheck(crrRow + direction,crrCol+1) && (board[crrRow+direction][crrCol+1].type=='king') && (piece.color != board[crrRow+direction][crrCol+1].color))){
                setCheck(true);
                alert("check lg gyi  check lg gyi pawn");
                let kingPosition = {};
                if(board[crrRow+direction][crrCol-1].type=='king'){
                    kingPosition={row:crrRow+direction,col:crrCol-1,color:board[crrRow+direction][crrCol-1].color}
                }
                else{
                    kingPosition={row:crrRow+direction,col:crrCol+1,color:board[crrRow+direction][crrCol-1].color}
                }
                updatedState = { ...updatedState,
                    kingPosition:kingPosition};
                console.log("dsadsdadasda",gameState)
                setGameState(updatedState)
                return true;
            } 
            return false;
        }
        function isKnightCheck(){
            let dRow = [-2,-2,2,2];
            let dCol = [1,-1,1,-1]
            for(let i=0;i<4;i++){
                
                if(boundaryCheck(crrRow + dRow[i],crrCol + dCol[i]) && board[crrRow + dRow[i]][crrCol + dCol[i]].type == 'king' && board[crrRow + dRow[i]][crrCol + dCol[i]].color != piece.color){
                    alert("check lg gyi")
                    let kingPosition={};
                    kingPosition={row:crrRow + dRow[i],col:crrCol + dCol[i],color:board[crrRow + dRow[i]][crrCol + dCol[i]].color}
                    updatedState = { ...updatedState,
                        kingPosition:kingPosition};
                    console.log("updated state",updatedState)
                    setCheck(true);
                    setGameState(updatedState);
                    return true;
                }
                
            }
            let dRow1 = [1,-1,1,-1];
            let dCol1 = [-2,-2,2,2];
            for(let i=0;i<4;i++){
                if(boundaryCheck(crrRow + dRow1[i],crrCol + dCol1[i]) && board[crrRow + dRow1[i]][crrCol + dCol1[i]].type == 'king' && board[crrRow + dRow1[i]][crrCol + dCol1[i]].color != piece.color){
                    alert("checklg gyi knight")
                    let kingPosition={};
                    kingPosition={row:crrRow + dRow1[i],col:crrCol + dCol1[i],color:board[crrRow + dRow1[i]][crrCol + dCol1[i]].color}
                    updatedState = { ...updatedState,
                        kingPosition:kingPosition};
                        console.log("knightttttt")
                    setCheck(true);
                    setGameState(updatedState);
                    return true;
                }
                
            }
            return false;
        }
        function isRookCheck(){
            var rookCheck=false;
            console.log("here it comes")
            
            
            for(let i=crrRow+1;i<8;i++){
                
                    if(board[i][crrCol].type != null && board[i][crrCol].type!='king'){
                        break;
                    }
                    else{
                        console.log("isme aaya hai rook 2")
                        if(board[i][crrCol].type=='king' && board[i][crrCol].color != piece.color){
                            alert("check lg gyi rook");
                            let kingPosition={};
                            kingPosition={row:i,col:crrCol,color:board[i][crrCol].color}
                            updatedState = { ...updatedState,
                                kingPosition:kingPosition};
                            setCheck(true);
                            setGameState(updatedState);
                            rookCheck=true;
                            return true;
                        }
                        
                    }
                
            }
            for(let i=crrRow-1;i>=0;i--){
                
                    console.log("types is herer",board[i][crrCol].type)
                    if(board[i][crrCol].type != null && board[i][crrCol].type!='king'){
                        console.log("isme kyu nhi aaya")
                        break;
                    }
                    else{
                        console.log("isme aaya hai rook 3")
                        if(board[i][crrCol].type=='king' && board[i][crrCol].color != piece.color){
                            alert("check lg gyi");
                            let kingPosition={};
                            kingPosition={row:i,col:crrCol,color:board[i][crrCol].color}
                            updatedState = { ...updatedState,
                                kingPosition:kingPosition};
                            setCheck(true);
                            setGameState(updatedState);
                            rookCheck=true;
                            return true;
                        }
                        
                    }
                
            }
            for(let i=crrCol+1;i<8;i++){
                
                if(board[crrRow][i].type != null && board[crrRow][i].type!='king'){
                    break;
                }
                else{
                    console.log("isme aaya hai rook 4",board[crrRow][i].type)
                    if(board[crrRow][i].type=='king' && board[crrRow][i].color != piece.color){
                        alert("check lg gyi");
                        let kingPosition={};
                        kingPosition={row:crrRow,col:i,color:board[crrRow][i].color}
                        updatedState = { ...updatedState,
                            kingPosition:kingPosition};
                        setCheck(true);
                        setGameState(updatedState);
                        rookCheck=true;
                        return true;
                    }
                }
            
            }
            for(let i=crrCol-1;i>=0;i--){
                
                    if(board[crrRow][i].type != null && board[crrRow][i].type!='king'){
                        break;
                    }
                    else{
                        console.log("isme aaya hai rook 5")
                        if(board[crrRow][i].type=='king' && board[crrRow][i].color != piece.color){
                            alert("check lg gyi");
                            let kingPosition={};
                            kingPosition={row:crrRow,col:i,color:board[crrRow][i].color}
                            updatedState = { ...updatedState,
                                kingPosition:kingPosition};
                            setCheck(true);
                            setGameState(updatedState);
                            rookCheck=true;
                            return true;
                        }
                        
                    }
                
            }
            
            
            return false;
        }
        function isBishopCheck(){
            let dRow = [1,-1,-1,1];
            let dCol = [1,1,-1,-1];
            let ignore:number[]= [];
            console.log("gamestatehere ",gameState,piece)
            for(let move=1;move<8;move++){
                for(let i=0;i<4;i++){
                    if(!ignore.includes(i)){
                        const colMove = crrCol + dCol[i] * move;
                        const rowMove = crrRow + dRow[i] * move;
                        
                        if(boundaryCheck(rowMove,colMove)){
                         //   console.log("ccxzccz",rowMove,colMove,board[rowMove][colMove].type)
                            if(board[rowMove][colMove].type!=null && board[rowMove][colMove].type!='king'){
                                ignore.push(i);
                            }
                            if(board[rowMove][colMove].type=='king' && board[rowMove][colMove].color!=piece.color){
                                alert("check lg gyi bishop")
                                
                                setCheck(true);
                                console.log("gameeeeee",gameState)
                                let kingPosition={row:rowMove,col:colMove,color:board[rowMove][colMove].color}
                                updatedState = { ...updatedState,
                                    kingPosition:kingPosition};
                                setGameState(updatedState)
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        }
        function isQueenCheck(){
            return (isPawnCheck() || isRookCheck() || isBishopCheck());
        }


        const pawnMove = () =>{
            
            if(crrRow-prevRow==direction || (crrRow-prevRow==direction*2 && board[prevRow][prevCol].numberOfTurns==0)){
                if((!parent?.querySelector('.chessPiece') && (crrCol-prevCol == 0)) || (Math.abs(crrCol-prevCol)==1  && board[crrRow][crrCol].type!=null)) {
                    console.log("ischeckk",isCheck)
                    if(isCheck){
                        let tempUpdatedBoard = JSON.parse(JSON.stringify(gameState.board));

                        tempUpdatedBoard[crrRow][crrCol]={type:'pawn',color:gameState.kingPosition.color,isDead:false,canMove:true,numberOfTurns:1}
                        let params={
                            crrRow:gameState.kingPosition.row, 
                            crrCol:gameState.kingPosition.col,
                            board:tempUpdatedBoard,
                            piece:{type:'king' as 'king',color:gameState.kingPosition.color,isDead:false,canMove:true,numberOfTurns:1}
                        }
                        
                        if(!(isPawnSafe(params) && isBishopSafe(params) && isRookSafe(params) && isKnightSafe(params))){
                            
                            return false;
                        }
                        setCheck(false);
                    }
                    isPawnCheck();
                    return true;
                }
                
                return false;
                
            }
            else{
               
                return false;
            }
        }
        const rookMove = () =>{
            console.log("rook moving");
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
                   
                    isRookCheck();
    
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
                        isRookCheck();
    
                    }
                    else{
                        movedCorrectly=false;
                    }
                }
               
                if(movedCorrectly){
                    if(isCheck){
                        
                        let tempUpdatedBoard = JSON.parse(JSON.stringify(gameState.board));
                        tempUpdatedBoard={type:'rook',color:gameState.kingPosition.color,isDead:false,canMove:true,numberOfTurns:1}
                        let params={
                            crrRow:gameState.kingPosition.row, 
                            crrCol:gameState.kingPosition.col,
                            board:tempUpdatedBoard,
                            piece:{type:'king' as 'king',color:gameState.kingPosition.color,isDead:false,canMove:true,numberOfTurns:1}
                        }
                        
                        if(!(isPawnSafe(params) && isBishopSafe(params) && isRookSafe(params) && isKnightSafe(params))){
                            
                            return false;
                        }
                        setCheck(false);
                    }
                    return true;
                }
                else{
                    return false;
                }

        }
        const knightMove = () =>{
            
            if((Math.abs(prevRow - crrRow) == 2 && Math.abs(prevCol - crrCol) == 1) || (Math.abs(prevRow - crrRow) == 1 && Math.abs(prevCol - crrCol) == 2)){
                if(isCheck){
                    
                    let tempUpdatedBoard = JSON.parse(JSON.stringify(gameState.board));
                    tempUpdatedBoard[crrRow][crrCol]={type:'knight',color:gameState.kingPosition.color,isDead:false,canMove:true,numberOfTurns:1}
                    let params={
                        crrRow:gameState.kingPosition.row, 
                        crrCol:gameState.kingPosition.col,
                        board:tempUpdatedBoard,
                        piece:{type:'king' as 'king',color:gameState.kingPosition.color,isDead:false,canMove:true,numberOfTurns:1}
                    }
                    
                    if(!(isPawnSafe(params) && isBishopSafe(params) && isRookSafe(params) && isKnightSafe(params))){
                       
                        return false;
                    }
                    setCheck(false);
                }
                //isKnightCheck();
                return true;
            }
            
            return false;
            
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
                        return false;
                    }
                    r1=r1+rowSteps;
                    c1=c1+colSteps
                }
                console.log("")
                
                if(isCheck){
                    
                    let tempUpdatedBoard = JSON.parse(JSON.stringify(gameState.board));
                    
                    tempUpdatedBoard[crrRow][crrCol] ={type:'bishop',color:gameState.kingPosition.color,isDead:false,canMove:true,numberOfTurns:1}
                    console.log(gameState.board,tempUpdatedBoard)
                    let params={
                        crrRow:gameState.kingPosition.row, 
                        crrCol:gameState.kingPosition.col,
                        board:tempUpdatedBoard,
                        piece:{type:'king' as 'king',color:gameState.kingPosition.color,isDead:false,canMove:true,numberOfTurns:1}
                    }
                    console.log("params",params,tempUpdatedBoard,crrRow,crrCol)
                    if(!(isPawnSafe(params) && isBishopSafe(params) && isRookSafe(params) && isKnightSafe(params))){
                        
                        return false;
                    }
                    setCheck(false);
                }
                isBishopCheck();
                
                return true;
            }
            return false;
        }
        const kingMove = () =>{
            if(safeCell()){
                
                if(Math.abs(crrRow-prevRow) == 0){
                    if(Math.abs(crrCol-prevCol)==1) {
                        setCheck(false)
                        return true
                    }
                    
                }
                if(Math.abs(crrCol-prevCol) == 0){
                    if(Math.abs(crrRow-prevRow)==1) {
                        setCheck(false)
                        return true;
                    }
                }
                if(Math.abs(crrRow-prevRow)==1 && Math.abs(crrCol-prevCol)==1) {
                    setCheck(false)
                    return true;
                }

            }
            
            return false;
        }
        const queenMove = () =>{
            isQueenCheck();
            return ((pawnMove() || rookMove() || bishopMove()) && !knightMove());
        }


        if(board[crrRow][crrCol].color == board[prevRow][prevCol].color){
            console.log("same color");
            return false;
            
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
            
        
        
        return false;
    
    }
    
    return { validMove,boundaryCheck };
}

export default useGameLogic