import React, { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../AppContext/KingContext'
import useSocket from '../hooks/useSocket'


const SocketProvider = ({children}) => {

    const {socket,socketConnection,setSocket} = useSocket();
   // const socketValue = useContext(SocketContext);
   const [socketData,setData] = useState(null)

    
    useEffect(()=>{
        if(sessionStorage.getItem('user')) {
            
            let res = JSON.parse(sessionStorage.getItem('user') as string)
            const newSocket = socketConnection(res);
            setSocket(newSocket);
            
            setData({
                socket:newSocket,
                socketConnection,
                setSocket
            })
            
        }
        
        
    },[])
    
  return (
        <SocketContext.Provider value={socketData}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider