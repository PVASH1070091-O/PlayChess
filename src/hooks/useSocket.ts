import React, { useRef, useState } from 'react'
import { io } from "socket.io-client";

const useSocket = () => {

    const [socket,setSocket]=useState<WebSocket | null>(null);
    const socketConnection = (loggedInUser:any) =>{
        
        const newSocket = io("http://localhost:8000",{
            query: { userId: loggedInUser._id },
            transports: ['websocket'], 
            withCredentials: true, 
        });
        newSocket.on("connection",()=>{
            
        })
       
        setSocket(newSocket);
        return newSocket;
    }
    return {socket,socketConnection,setSocket};
}

export default useSocket