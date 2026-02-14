# How this Snake game works (for beginners)

This short guide explains the project's structure and the core ideas in `src/Game.jsx` in simple words.

Overview
- This is a small React app made with Vite. The playable game is implemented in `src/Game.jsx`.
- The app uses a HTML `<canvas>` to draw the snake and food. React handles UI state (score, speed, pause) and user input.

Files to look at
- `index.html` — app entry HTML used by Vite.
- `src/main.jsx` — React entry point that mounts the app.
- `src/App.jsx` — simple wrapper that shows the `Game` component.
- `src/Game.jsx` — the main game code (see explanations below).
- `src/styles.css` — styles for layout and mobile controls.

Key concepts used (briefly)
- Component: `Game` is a React component — a function that returns UI (JSX).
- State: `useState` stores values that change over time (snake, score, running, speed).
- Effect: `useEffect` runs code with side effects (e.g., game loop timer, drawing to canvas, adding keyboard listeners).
- Ref: `useRef` holds mutable values that don’t cause a re-render (e.g., current direction, canvas DOM node).
- localStorage: stores the high score so it stays after page reloads.

How the game loop works (simple)
- A timer (set with `setInterval`) runs at a frequency based on the `speed` value.
- On each tick the code:
  1. Calculates a new snake head position based on the current direction.
  2. Checks for self-collision (if the head hits the body) — if so, the game stops.
  3. Checks if the new head is on the food. If yes, the snake grows (no tail removed), the score increases and new food is placed. If not, the tail segment is removed so the snake appears to move.
  4. Updates the `snake` state with the new array of segments.

Rendering
- The `useEffect` that watches `snake` and `food` draws everything on the `<canvas>`: background, food (red square), and snake (head darker).

Input handling
- Keyboard: Arrow keys and WASD change direction. The code prevents reversing direction immediately (e.g., left -> right) to avoid instant collisions.
- Touch/mobile: the canvas listens for pointer events to detect swipes; there are also on-screen buttons for up/left/right/down.

Where to change behavior (good beginner experiments)
- Grid size: change `COLS`, `ROWS`, or `CELL` at the top of `src/Game.jsx` to make the board larger or smaller.
- Speed: adjust initial `speed` state or use the UI slider while playing.
- Colors and look: edit `src/styles.css` or the canvas color values in `src/Game.jsx`.
- Add sounds: play a short audio when eating or on game over (use an `Audio` object inside effects).

How to run locally
1. Install dependencies:
```bash
npm install
```
2. Start dev server:
```bash
npm run dev
```
3. Open the shown URL (usually http://localhost:5173)

Tips for learning React using this project
- Open `src/Game.jsx` and find a small piece to change (e.g., cell color). Save and see live reload.
- Add console.log statements inside effects to see when they run.
- Try moving game logic out of the component into small helper functions to make the component simpler.

If you want, I can also add step-by-step inline comments, or a simple walkthrough video script showing how to modify one feature.
