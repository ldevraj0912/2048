const grid = document.querySelector('.grid-container');
const scoreDisplay = document.querySelector('.score-container');
const bestScoreDisplay = document.querySelector('.best-container');
const gameMessage = document.querySelector('.game-message');
const retryButton = document.querySelector('.retry-button');

let score = 0;
let bestScore = localStorage.getItem('bestScore') || 0;
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
        checkGameOver();
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
