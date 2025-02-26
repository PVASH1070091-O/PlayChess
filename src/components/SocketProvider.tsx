import React, { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../AppContext/KingContext'
import useSocket from '../hooks/useSocket'
import { Socket } from "socket.io-client"; 


const SocketProvider = ({children}) => {

    const [socket,setSocket] = useState<Socket | null>(null);
    
  return (
        <SocketContext.Provider value={{socket,setSocket}}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider