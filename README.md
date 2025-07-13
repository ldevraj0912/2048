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
1. Make sure you have Python 3 installed.
2. Start a simple web server in the project directory:
   ```sh
   python3 -m http.server 8000
   ```
3. Open your browser and go to [http://localhost:8000](http://localhost:8000)

## Project Structure
- `index.html` — Main HTML structure
- `styles.css` — Game styling and animations
- `game.js` — Game logic and interactivity

## Credits
- Inspired by [Gabriele Cirulli's 2048](https://github.com/gabrielecirulli/2048)

Enjoy playing!
