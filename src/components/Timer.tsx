import React, { useCallback, useContext, useEffect, useState } from 'react'
import './Board.css'

const Timer = (props:any) => {
    
    return(
       <div>
            {props.timerW && <div style={{fontSize:'30px',fontWeight:'600'}} id='timerW'>{String(Math.floor(props.timerW/60)).padStart(2,'0')}:{String(props.timerW%60).padStart(2,'0')}</div>}
            {props.timerB && <div style={{fontSize:'30px',fontWeight:'600'}} id='timerB'>{String(Math.floor(props.timerB/60)).padStart(2,'0')}:{String(props.timerB%60).padStart(2,'0')}</div>}

        </div> 
    )
  
}

export default Timer