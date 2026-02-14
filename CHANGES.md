## CHANGES

- 2026-02-14: Centered and spaced mobile control buttons.
  - `src/styles.css`: Updated `.mobile-controls` to center the control cluster horizontally at the bottom, ensured vertical spacing between `up`, `left/right`, and `down` buttons, and increased horizontal gap for left/right buttons. Added responsive adjustments for small screens.

- 2026-02-14: Disable resume after collision
  - `src/Game.jsx`: Added `gameOver` state, set it when the snake collides, and disabled the Pause/Resume button so the player cannot resume after game over (must Restart).

- 2026-02-14: Make left/right arrows match up/down style
  - `src/Game.jsx` / `src/styles.css`: Use the same triangle glyph for all arrow buttons and rotate the glyph for left/right so visuals are consistent.
