import React, { useRef, useState } from 'react'
import { io,Socket } from "socket.io-client";

const useSocket = () => {

    const [socket,setSocket]=useState<Socket | null>(null);
    const socketConnection = (loggedInUser:any) =>{
        console.log("current socket",socket)
       
        const newSocket = io("http://localhost:8000",{
            query: { userId: loggedInUser._id },
            transports: ['websocket'], 
            withCredentials: true, 
        });
        newSocket.on("connection",()=>{
            console.log("socket connected")
        })
    
        setSocket(newSocket);
        return newSocket;
        
    }
    return {socket,socketConnection,setSocket};
}

export default useSocket