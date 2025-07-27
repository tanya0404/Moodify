import { useState } from 'react'

import './index.css'
import FacialEspression from './components/FacialExpression.jsx'
import MoodSongs from './components/MoodSongs.jsx'

function App() {
  
  const [Songs, setSongs]= useState([
      
  ]);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header glass">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🎵</span>
            <h1>Moodify</h1>
          </div>
          <p className="tagline">Your mood, your music</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <FacialEspression setSongs={setSongs}></FacialEspression>
        <MoodSongs Songs={Songs}></MoodSongs>
      </main>

      {/* Footer */}
      <footer className="app-footer glass">
      </footer>
    </div>
  )
}

export default App
