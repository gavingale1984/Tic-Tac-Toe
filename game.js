let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let playerTurn = true;
let playerWins = 0;
let aiWins = 0;
let draws = 0;

const humanPlayer = 'X';
const aiPlayer = 'O';

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Initialize game
function initializeGame() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'disabled');
    });
    loadStats();
}

// Handle cell click
function handleCellClick(e) {
    if (!gameActive || !playerTurn) return;

    const cell = e.target;
    const index = cell.dataset.index;

    if (gameBoard[index] !== '') {
        alert('Cell already taken!');
        return;
    }

    // Player move
    gameBoard[index] = humanPlayer;
    cell.textContent = humanPlayer;
    cell.classList.add('x');

    if (checkWinner(humanPlayer)) {
        updateStatus(`You Win! 🎉`, 'winner');
        gameActive = false;
        playerWins++;
        updateStats();
        disableAllCells();
        return;
    }

    if (isBoardFull()) {
        updateStatus(`It's a Draw! 🤝`, 'draw');
        gameActive = false;
        draws++;
        updateStats();
        return;
    }

    playerTurn = false;
    updateStatus('AI is thinking...', 'ai');
    disableAllCells();

    // AI move with delay for better UX
    setTimeout(() => {
        makeAIMove();
    }, 600);
}

// Medium difficulty AI
function makeAIMove() {
    let move = -1;

    // Priority 1: Try to win
    move = findWinningMove(aiPlayer);
    if (move !== -1) {
        makeMove(move);
        playerTurn = true;
        updateStatus('Your Turn', 'player');
        enableAllCells();

        if (checkWinner(aiPlayer)) {
            updateStatus('AI Wins! 🤖', 'winner');
            gameActive = false;
            aiWins++;
            updateStats();
            disableAllCells();
        }
        return;
    }

    // Priority 2: Block player from winning
    move = findWinningMove(humanPlayer);
    if (move !== -1) {
        makeMove(move);
        playerTurn = true;
        updateStatus('Your Turn', 'player');
        enableAllCells();
        return;
    }

    // Priority 3: Take center if available
    if (gameBoard[4] === '') {
        move = 4;
    }
    // Priority 4: Take a corner
    else {
        const corners = [0, 2, 6, 8].filter(i => gameBoard[i] === '');
        if (corners.length > 0) {
            move = corners[Math.floor(Math.random() * corners.length)];
        }
        // Priority 5: Take any available cell
        else {
            const available = gameBoard.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
            move = available[Math.floor(Math.random() * available.length)];
        }
    }

    makeMove(move);
    playerTurn = true;
    updateStatus('Your Turn', 'player');
    enableAllCells();

    if (checkWinner(aiPlayer)) {
        updateStatus('AI Wins! 🤖', 'winner');
        gameActive = false;
        aiWins++;
        updateStats();
        disableAllCells();
    } else if (isBoardFull()) {
        updateStatus(`It's a Draw! 🤝`, 'draw');
        gameActive = false;
        draws++;
        updateStats();
    }
}

// Find winning move for a player
function findWinningMove(player) {
    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = player;
            if (checkWinner(player)) {
                gameBoard[i] = '';
                return i;
            }
            gameBoard[i] = '';
        }
    }
    return -1;
}

// Make a move on the board
function makeMove(index) {
    gameBoard[index] = aiPlayer;
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.textContent = aiPlayer;
    cell.classList.add('o');
}

// Check if there's a winner
function checkWinner(player) {
    return winningConditions.some(condition => {
        return condition.every(index => gameBoard[index] === player);
    });
}

// Check if board is full
function isBoardFull() {
    return gameBoard.every(cell => cell !== '');
}

// Update status message
function updateStatus(message, cssClass = '') {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
    statusElement.className = 'status ' + cssClass;
}

// Disable all cells
function disableAllCells() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.add('disabled'));
}

// Enable all cells
function enableAllCells() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('disabled'));
}

// Reset game
function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    playerTurn = true;
    updateStatus('Your Turn', 'player');
    
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'disabled');
    });
}

// Update stats display
function updateStats() {
    document.getElementById('playerWins').textContent = playerWins;
    document.getElementById('aiWins').textContent = aiWins;
    document.getElementById('draws').textContent = draws;
    saveStats();
}

// Save stats to localStorage
function saveStats() {
    localStorage.setItem('ticTacToe_playerWins', playerWins);
    localStorage.setItem('ticTacToe_aiWins', aiWins);
    localStorage.setItem('ticTacToe_draws', draws);
}

// Load stats from localStorage
function loadStats() {
    playerWins = parseInt(localStorage.getItem('ticTacToe_playerWins')) || 0;
    aiWins = parseInt(localStorage.getItem('ticTacToe_aiWins')) || 0;
    draws = parseInt(localStorage.getItem('ticTacToe_draws')) || 0;
    updateStats();
}

// Reset all stats
function resetStats() {
    if (confirm('Are you sure you want to reset all stats?')) {
        playerWins = 0;
        aiWins = 0;
        draws = 0;
        updateStats();
    }
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', initializeGame);
