import React, { useEffect, useState } from 'react'
import './Board.css'

const Timer = (props:any) => {
    
    useEffect(()=>{
        if(!props.showModal){
            console.log("props.show",props.showModal,props)
            if(props.turn.white && props.setTimerIdW) timerStartsW();
            if(props.turn.black && props.setTimerIdB) timerStartsB();
        }
    },[props.showModal,props.turn.white])
    function timerStartsW(){
        let intervalId=setInterval(()=>{
                let ele = document.getElementById('timerW');
               // ele?.classList.add('lastSeconds')
                
                props.setTimerW(prevState => prevState-1);
                
            
        },1000)
        props.setTimerIdW(intervalId)
    }
    function timerStartsB(){
        let intervalId=setInterval(()=>{
            props.setTimerB(prevState => prevState-1);
        },1000)
        props.setTimerIdB(intervalId)
    }
 
    return(
       <div>
            {props.timerW && <div style={{fontSize:'30px',fontWeight:'600'}} id='timerW'>{String(Math.floor(props.timerW/60)).padStart(2,'0')}:{String(props.timerW%60).padStart(2,'0')}</div>}
            {props.timerB && <div style={{fontSize:'30px',fontWeight:'600'}} id='timerB'>{String(Math.floor(props.timerB/60)).padStart(2,'0')}:{String(props.timerB%60).padStart(2,'0')}</div>}

        </div> 
    )
  
}

export default Timer