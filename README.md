# 2048 Game

A smooth and playable implementation of the classic 2048 puzzle game, built with HTML, CSS, and JavaScript.

## Features
- Smooth tile animations and transitions
- Responsive and clean design
- Win and game over detection
- Score and best score tracking (using local storage)
- "New Game" button to restart

## How to Play
- Use your **arrow keys** (↑ ↓ ← →) to move the tiles.
- When two tiles with the same number touch, they merge into one!
- Your goal is to create a tile with the number **2048**.
- The game ends when there are no more valid moves.

## Running Locally
### Option 1 — Python quick server
1. Make sure you have Python 3 installed.
2. Start a simple web server in the project directory:
   ```sh
   python3 -m http.server 8000
   ```
3. Open your browser and go to [http://localhost:8000](http://localhost:8000)

### Option 2 — Node.js / Express static server
1. Ensure you have Node.js installed.
2. From the project directory, install dependencies and start the server:
   ```sh
   npm install express
   node server.js
   ```
3. Visit [http://localhost:8000](http://localhost:8000) in your browser.

## Project Structure
- `index.html` — Main HTML structure
- `styles.css` — Game styling and animations
- `game.js` — Game logic and interactivity

## License

This is an original implementation of the 2048 game, designed and developed from scratch with unique code and styling. No external 2048 codebases or templates were used.

Enjoy playing!
