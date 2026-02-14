import React, { useEffect, useRef, useState } from 'react'

// Grid configuration
const COLS = 20
const ROWS = 20
const CELL = 20
const WIDTH = COLS * CELL
const HEIGHT = ROWS * CELL

/**
 * Get a random empty grid position that is not in `exclude`.
 * `exclude` is an array of positions {x,y} to avoid (e.g. snake body).
 */
function randomPosition(exclude = []) {
  while (true) {
    const pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }
    if (!exclude.some(p => p.x === pos.x && p.y === pos.y)) return pos
  }
}

export default function Game() {
  // References and state used by the game
  const canvasRef = useRef(null) // canvas DOM reference for drawing
  // `snake` is an array of segments; first element is the head
  const [snake, setSnake] = useState([{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }])
  // `dirRef` holds the current movement direction (mutable ref so effects don't need to re-subscribe)
  const dirRef = useRef({ x: 1, y: 0 })
  // `food` is the current food position
  const [food, setFood] = useState(() => randomPosition([]))
  // game running state (paused/playing)
  const [running, setRunning] = useState(true)
  // speed in ticks per second (higher = faster)
  const [speed, setSpeed] = useState(8)
  // current score and persisted high score
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('snake_highscore') || 0))
  // touch start point for swipe detection on mobile
  const touchStartRef = useRef(null)

  /**
   * Keyboard input handler - maps arrow keys and WASD to direction vectors.
   * Prevents reversing direction directly (e.g., left -> right) which would self-collide.
   */
  useEffect(() => {
    function handleKey(e) {
      const key = e.key
      const map = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        d: { x: 1, y: 0 }
      }
      if (!map[key]) return
      const nd = map[key]
      // ignore if user attempts to reverse direction
      if (nd.x === -dirRef.current.x && nd.y === -dirRef.current.y) return
      dirRef.current = nd
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  /**
   * Game tick effect - runs the main game loop on a fixed interval (1 / speed seconds).
   * Moves the snake, detects collisions with itself, handles eating food, and updates score.
   */
  useEffect(() => {
    const id = setInterval(() => {
      if (!running) return
      setSnake(prev => {
        const head = prev[0]
        const nd = dirRef.current
        // wrap-around movement using modulo
        const newHead = { x: (head.x + nd.x + COLS) % COLS, y: (head.y + nd.y + ROWS) % ROWS }

        // collision with self -> stop the game
        if (prev.some(p => p.x === newHead.x && p.y === newHead.y)) {
          setRunning(false)
          return prev
        }

        const ate = newHead.x === food.x && newHead.y === food.y
        const newSnake = [newHead, ...prev]

        // if didn't eat, remove tail to keep length constant
        if (!ate) newSnake.pop()
        else {
          // increase score and persist high score if needed
          setScore(prevScore => {
            const newScore = prevScore + 1
            setHighScore(prevHigh => {
              if (newScore > prevHigh) {
                try { localStorage.setItem('snake_highscore', String(newScore)) } catch (e) {}
                return newScore
              }
              return prevHigh
            })
            return newScore
          })
          // place new food avoiding the snake's body
          setFood(randomPosition(newSnake))
        }
        return newSnake
      })
    }, 1000 / speed)
    return () => clearInterval(id)
  }, [running, speed, food])

  /**
   * Rendering effect - draws the background, food, and snake to the canvas whenever
   * the `snake` or `food` state changes.
   */
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    // clear background
    ctx.fillStyle = '#0b0b0b'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    // draw food (red)
    ctx.fillStyle = '#e63946'
    ctx.fillRect(food.x * CELL, food.y * CELL, CELL, CELL)

    // draw snake (head darker)
    ctx.fillStyle = '#2a9d8f'
    snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? '#264653' : '#2a9d8f'
      ctx.fillRect(s.x * CELL, s.y * CELL, CELL - 1, CELL - 1)
    })
  }, [snake, food])

  /**
   * Reset the game to the initial state. Keeps the stored high score intact.
   */
  function restart() {
    setSnake([{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }])
    dirRef.current = { x: 1, y: 0 }
    setFood(randomPosition([]))
    setScore(0)
    setHighScore(() => Number(localStorage.getItem('snake_highscore') || 0))
    setRunning(true)
  }

  // UI + canvas
  return (
    <div className="game">
      <div className="hud">
        <div>
          <div>Score: {score}</div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>Best: {highScore}</div>
        </div>
        <div className="controls">
          <label>Speed</label>
          <input type="range" min="4" max="16" value={speed} onChange={e => setSpeed(Number(e.target.value))} />
          <button onClick={() => setRunning(r => !r)}>{running ? 'Pause' : 'Resume'}</button>
          <button onClick={restart}>Restart</button>
        </div>
      </div>
      {/* Canvas handles pointer events for mobile swipe detection */}
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        style={{ background: '#0b0b0b' }}
        onPointerDown={e => {
          // record touch start for swipe detection
          touchStartRef.current = { x: e.clientX, y: e.clientY }
        }}
        onPointerUp={e => {
          // compute swipe vector and set direction accordingly
          const s = touchStartRef.current
          if (!s) return
          const dx = e.clientX - s.x
          const dy = e.clientY - s.y
          if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) dirRef.current = { x: 1, y: 0 }
            else dirRef.current = { x: -1, y: 0 }
          } else {
            if (dy > 0) dirRef.current = { x: 0, y: 1 }
            else dirRef.current = { x: 0, y: -1 }
          }
          touchStartRef.current = null
        }}
      />
      {!running && <div className="overlay">Game Over — Score: {score}</div>}
      <div className="hint">Use arrow keys or WASD to move</div>

      {/* Simple on-screen buttons for mobile controls (calls are pointer-based) */}
      <div className="mobile-controls">
        <button className="mc mc-up" onPointerDown={() => (dirRef.current = { x: 0, y: -1 })}>▲</button>
        <div className="mc-row">
          <button className="mc mc-left" onPointerDown={() => (dirRef.current = { x: -1, y: 0 })}>◀</button>
          <button className="mc mc-right" onPointerDown={() => (dirRef.current = { x: 1, y: 0 })}>▶</button>
        </div>
        <button className="mc mc-down" onPointerDown={() => (dirRef.current = { x: 0, y: 1 })}>▼</button>
      </div>
    </div>
  )
}
