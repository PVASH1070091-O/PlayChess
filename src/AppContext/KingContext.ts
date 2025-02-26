import { createContext } from "react";
import { PieceType } from "../components/Board";
import { Socket } from "socket.io-client"; 

interface Piece {
    row: number;
    col: number;
    color: string;
  }
interface ContextType{
    value:{
        white:Piece;
        black:Piece
    };
    setValue:React.Dispatch<React.SetStateAction<
    {
        white:Piece;
        black:Piece
    }
    >>
} 
interface CheckType{
    isCheck:boolean;
    setCheck:React.Dispatch<React.SetStateAction<boolean>>
}
export interface GameState {
    crrRow: number;
    crrCol: number;
    piece: any; 
    direction: number;
    kingPosition: any; 
    board: PieceType[][]; 
}
interface GameStateType{
    gameState:GameState;
    setGameState:React.Dispatch<React.SetStateAction<GameState>>
}
interface TimerType{
    timer:number;
    setTimer:React.Dispatch<React.SetStateAction<number>>
}
interface SocketType{
    socket: Socket | null,
    setSocket:React.Dispatch<React.SetStateAction<Socket | null>>
}


export const KingContext = createContext<ContextType>({
    value: { 
        white: { row: 7, col: 4, color: 'white' },
        black: { row: 0, col: 4, color: 'black' },
      },
      setValue: () => {}
});

export const CheckContext = createContext<CheckType>({
    isCheck:false,
    setCheck: () => {}
});

export const GameStateContext = createContext<GameStateType>({
    gameState: {
        crrRow:0,
        crrCol:0,
        piece:{},
        direction:0,
        kingPosition:{},
        board:[]
        },
    setGameState: () =>{}
})

export const TimerCheck = createContext<TimerType>({
    timer:0,
    setTimer: () => {}
});

export const SocketContext = createContext<SocketType>({
    socket:null,
    setSocket: () =>{}
})