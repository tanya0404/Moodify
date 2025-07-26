import { useState } from 'react'

import './index.css'
import FacialEspression from './components/FacialExpression.jsx'
import MoodSongs from './components/MoodSongs.jsx'

function App() {
  
  const [Songs, setSongs]= useState([
      
  ]);

  return (
    <>
      <FacialEspression setSongs={setSongs}></FacialEspression>
      <MoodSongs Songs={Songs}></MoodSongs>
    </>
  )
}

export default App
