/* ---------------------------------------------------------------------
 * Tile Fusion – Original 2048-style puzzle written from scratch
 * Author: Your Name – 2025
 * ------------------------------------------------------------------ */

// ======== Constants ========
const BOARD_SIZE = 4;                 // 4×4 board
const TILE_APPEAR_CHANCE = 0.8;       // 80 % → 2, otherwise 4
const WIN_VALUE = 2048;               // Value to win the game
const KEY_TO_DIR = {
  ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
  a: 'left', d: 'right', w: 'up', s: 'down'   // WASD support
};

// ======== Game State ========
let tiles = [];            // Array of tile objects { id, x, y, value, merged }  (0-based board coords)
let nextId = 1;            // Unique tile id counter
let running = true;        // Game active flag
let score = 0;             // Current score
let comboThisMove = 0;     // Merges in current move – used for combo bonus

// ======== Cached DOM ========
const layer = document.getElementById('tf-tile-layer');
const scoreSpan = document.getElementById('tf-score');
const bestSpan  = document.getElementById('tf-best');
const comboBox  = document.getElementById('tf-combo-box');
const comboSpan = document.getElementById('tf-combo');
const restartBtn = document.getElementById('tf-restart');
const overlay      = document.getElementById('tf-overlay');
const overlayMsg   = document.getElementById('tf-overlay-message');
const overlayBtn   = document.getElementById('tf-overlay-btn');
const darkToggle   = document.getElementById('tf-dark-toggle');

// Store best score across sessions
let bestScore = Number(localStorage.getItem('tfBest') || 0);
updateScore(0);

// ======== Utility Helpers ========
const tileAt = (x, y) => tiles.find(t => t.x === x && t.y === y);
const emptyCells = () => {
  const arr = [];
  for (let y = 0; y < BOARD_SIZE; y++)
    for (let x = 0; x < BOARD_SIZE; x++)
      if (!tileAt(x, y)) arr.push({ x, y });
  return arr;
};
const randChoice = arr => arr[Math.floor(Math.random() * arr.length)];

// Calculate pixel position for transforms (taken from CSS cell margin 8px + cell size 88px)
const px = coord => 8 + coord * (88 + 16); // gap 16 (8 left, 8 right)

// ======== Game Init ========
function startGame() {
  tiles = [];
  nextId = 1;
  running = true;
  score = 0;
  overlay.style.display = 'none';
  spawnTile();
  spawnTile();
  updateScore(0);
  render();
}

function spawnTile() {
  const empties = emptyCells();
  if (!empties.length) return;
  const { x, y } = randChoice(empties);
  const value = Math.random() < TILE_APPEAR_CHANCE ? 2 : 4;
  tiles.push({ id: nextId++, x, y, value, merged: false, fresh: true });
}

// ======== Movement ========
function move(dir) {
  if (!running) return;
  const order = [...tiles];
  // Sort tiles so they traverse in correct order
  if (dir === 'left') order.sort((a, b) => a.x - b.x);
  if (dir === 'right') order.sort((a, b) => b.x - a.x);
  if (dir === 'up') order.sort((a, b) => a.y - b.y);
  if (dir === 'down') order.sort((a, b) => b.y - a.y);

  let moved = false;
  comboThisMove = 0;
  tiles.forEach(t => { t.merged = false; t.fresh = false; });

  for (const tile of order) {
    let { x, y } = tile;
    while (true) {
      const nx = x + (dir === 'left' ? -1 : dir === 'right' ? 1 : 0);
      const ny = y + (dir === 'up'   ? -1 : dir === 'down'  ? 1 : 0);
      if (nx < 0 || nx >= BOARD_SIZE || ny < 0 || ny >= BOARD_SIZE) break;
      const target = tileAt(nx, ny);
      if (!target) {
        x = nx; y = ny; moved = true;
      } else if (!target.merged && target.value === tile.value) {
        // Merge
        target.value *= 2;
        target.merged = true;
        score += target.value;
        comboThisMove++;
        tiles = tiles.filter(t => t !== tile);
        moved = true;
        break;
      } else {
        break;
      }
    }
    tile.x = x; tile.y = y;
  }

  if (moved) {
    if (comboThisMove > 1) showCombo(comboThisMove * 10);
    else hideCombo();
    spawnTile();
    updateScore(0);
    render();
    checkEnd();
  }
}

// ======== End Condition ========
function checkEnd() {
  if (tiles.some(t => t.value >= WIN_VALUE)) {
    running = false;
    showOverlay('You Win!');
    return;
  }
  if (emptyCells().length) return;
  // No empty cells, check for possible merges
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      const t = tileAt(x, y);
      if (!t) continue;
      const right = tileAt(x + 1, y);
      const down  = tileAt(x, y + 1);
      if ((right && right.value === t.value) || (down && down.value === t.value)) return;
    }
  }
  running = false;
  showOverlay('Game Over');
}

// ======== Rendering ========
function render() {
  layer.innerHTML = '';
  for (const t of tiles) {
    const div = document.createElement('div');
    div.className = 'tf-tile';
    div.dataset.value = t.value;
    div.style.transform = `translate(${px(t.x)}px, ${px(t.y)}px)`;
    div.textContent = t.value;
    if (t.fresh) div.style.animation = 'tf-tile-spawn 0.23s';
    layer.appendChild(div);
  }
}

// ======== UI Helpers ========
function updateScore(extra) {
  score += extra;
  scoreSpan.textContent = score;
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem('tfBest', bestScore);
  }
  bestSpan.textContent = bestScore;
}
function showCombo(bonus) {
  comboSpan.textContent = bonus;
  comboBox.style.display = 'inline-block';
  updateScore(bonus);
}
function hideCombo() {
  comboBox.style.display = 'none';
}
function showOverlay(msg) {
  overlayMsg.textContent = msg;
  overlay.style.display = 'flex';
}
function tfHideOverlay() {
  overlay.style.display = 'none';
}

// ======== Event Listeners ========
window.addEventListener('keydown', e => {
  const dir = KEY_TO_DIR[e.key];
  if (dir) {
    e.preventDefault();
    move(dir);
  }
});
restartBtn.addEventListener('click', startGame);
overlayBtn.addEventListener('click', startGame);

darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('tf-dark');
});

// ======== Start ========
startGame();

let hasWon = false;

// Initialize game
let board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

// Add event listeners
retryButton.addEventListener('click', initGame);
document.addEventListener('keydown', handleKeyPress);

function initGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    score = 0;
    hasWon = false;
    updateScore();
    gameMessage.style.display = 'none';
    addNewTile();
    addNewTile();
    renderBoard();
}

function handleKeyPress(e) {
    if (gameOver()) return;
    
    let moved = false;
    switch(e.key) {
        case 'ArrowUp':
            moved = moveUp();
            break;
        case 'ArrowDown':
            moved = moveDown();
            break;
        case 'ArrowLeft':
            moved = moveLeft();
            break;
        case 'ArrowRight':
            moved = moveRight();
            break;
    }

    if (moved) {
        addNewTile();
        renderBoard();
        
    }
}

function moveUp() {
    return slideTiles(0, -1);
}

function moveDown() {
    return slideTiles(0, 1);
}

function moveLeft() {
    return slideTiles(-1, 0);
}

function moveRight() {
    return slideTiles(1, 0);
}

function slideTiles(dx, dy) {
    let moved = false;
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (board[y][x] !== 0) {
                let newX = x;
                let newY = y;
                let currentValue = board[y][x];

                // Move tile
                while (newX + dx >= 0 && newX + dx < 4 && newY + dy >= 0 && newY + dy < 4) {
                    const nextX = newX + dx;
                    const nextY = newY + dy;
                    
                    if (board[nextY][nextX] === 0) {
                        board[nextY][nextX] = currentValue;
                        board[newY][newX] = 0;
                        newX = nextX;
                        newY = nextY;
                        moved = true;
                    } else if (board[nextY][nextX] === currentValue && !hasWon) {
                        board[nextY][nextX] *= 2;
                        board[newY][newX] = 0;
                        score += board[nextY][nextX];
                        
                        // Add merge animation
                        const tile = document.querySelector(`.grid-row:nth-child(${nextY + 1}) .grid-cell:nth-child(${nextX + 1}) .tile`);
                        if (tile) {
                            tile.classList.add('merge');
                            setTimeout(() => tile.classList.add('active'), 100);
                        }
                        
                        if (board[nextY][nextX] === 2048) {
                            hasWon = true;
                            showGameMessage('You Win!');
                        }
                        moved = true;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    return moved;
}

function addNewTile() {
    const emptyCells = [];
    board.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === 0) {
                emptyCells.push({ x, y });
            }
        });
    });

    if (emptyCells.length === 0) return;

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    board[randomCell.y][randomCell.x] = value;

    // Add animation class to new tile
    const tile = document.querySelector(`.grid-row:nth-child(${randomCell.y + 1}) .grid-cell:nth-child(${randomCell.x + 1})`);
    if (tile) {
        const newTile = document.createElement('div');
        newTile.className = `tile tile-${value} appear`;
        newTile.textContent = value;
        tile.appendChild(newTile);
        
        // Add animation
        setTimeout(() => {
            newTile.classList.add('active');
        }, 100);
    }
}

function renderBoard() {
    const tiles = grid.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.classList.remove('appear', 'active', 'merge');
        tile.classList.add('appear');
        setTimeout(() => tile.classList.add('active'), 100);
    });

    board.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell !== 0) {
                const tile = document.createElement('div');
                tile.className = `tile tile-${cell}`;
                tile.textContent = cell;
                const cellElement = document.querySelector(`.grid-row:nth-child(${y + 1}) .grid-cell:nth-child(${x + 1})`);
                if (cellElement) {
                    cellElement.appendChild(tile);
                }
            }
        });
    });
}

function updateScore() {
    scoreDisplay.textContent = score;
    if (score > bestScore) {
        bestScore = score;
        bestScoreDisplay.textContent = score;
        localStorage.setItem('bestScore', score);
    }
}

function gameOver() {
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (board[y][x] === 0) return false;
            
            // Check horizontal and vertical neighbors
            if (x < 3 && board[y][x] === board[y][x + 1]) return false;
            if (y < 3 && board[y][x] === board[y + 1][x]) return false;
        }
    }
    showGameMessage('Game Over!');
    return true;
}

function checkGameOver() {
    if (gameOver()) {
        showGameMessage('Game Over!');
    }
}

function showGameMessage(message) {
    gameMessage.querySelector('p').textContent = message;
    gameMessage.style.display = 'block';
}

// Initialize game
initGame();
