import React from 'react'
import Game from './Game'

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>Snake</h1>
      </header>
      <main>
        <Game />
      </main>
      <footer className="credit">Built with Vite + React</footer>
    </div>
  )
}
