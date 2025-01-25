import { useState } from 'react';
import './App.css'
import {  CheckContext, GameState, GameStateContext, KingContext, SocketContext, TimerCheck } from './AppContext/KingContext';
import Board from './components/Board'
import Home from './components/Home'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate
} from "react-router-dom";
import Login from './components/Login';
import AuthenticateUser from './components/AuthenticateUser';
import SocketProvider from './components/SocketProvider';

function App() {
  const [value, setValue] = useState({white: { row: 7, col: 4, color: 'white' },
    black: { row: 0, col: 4, color: 'black' }});

  const [isCheck,setCheck] = useState(false);
  const [timer,setTimer] = useState(0);
  const [gameState,setGameState] = useState<GameState>({
    crrRow:0,
    crrCol:0,
    piece:{},
    direction:0,
    kingPosition:{},
    board:[]
    
})
  return (
    <Router>
      <KingContext.Provider value={{value,setValue}}>
        <CheckContext.Provider value={{isCheck,setCheck}}>
          <GameStateContext.Provider value={{gameState,setGameState}}>
            <TimerCheck.Provider value={{timer,setTimer}}>
            <SocketProvider>
              <Routes>
                  <Route path='/' element={<Home />}/>
                  <Route path='/login' element={<Login />}/>
                  <Route path='/authenticateUser' element={<AuthenticateUser />}/>
                  <Route path='/playGame' element={<Board />}/>
                  <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              </SocketProvider>
            </TimerCheck.Provider >
          </GameStateContext.Provider>
        </CheckContext.Provider>
      </KingContext.Provider>
    </Router>
  )
}

export default App
