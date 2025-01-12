import { useState } from 'react';
import './App.css'
import { CheckContext, GameState, GameStateContext, KingContext } from './AppContext/KingContext';
import Board from './components/Board'
import Home from './components/Home'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

function App() {
  const [value, setValue] = useState({white: { row: 7, col: 4, color: 'white' },
    black: { row: 0, col: 4, color: 'black' }});

  const [isCheck,setCheck] = useState(false);
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
      <Routes>
        <Route path='/' element={
          <KingContext.Provider value={{value,setValue}}>
            <CheckContext.Provider value={{isCheck,setCheck}}>
              <GameStateContext.Provider value={{gameState,setGameState}}>
                 <Board />
              </GameStateContext.Provider>
            </CheckContext.Provider>
          </KingContext.Provider>
          }/>
      </Routes>
    </Router>
  )
}

export default App
