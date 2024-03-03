const startButton = document.querySelector('#start')
const restartButton = document.querySelector('#restart')

startButton.addEventListener('click', () => {
    Game.startGame();
})

restartButton.addEventListener('click', () => {
    Game.restartGame();
})

const displayController = (() => {
    const messageDiv = document.querySelector('#message')
    function renderMessage(message) {
        messageDiv.innerHTML = message
    }
    return {renderMessage}
})();

const Gameboard = (() => {
    let gameboard = 
    ['', '', '', '', '', '', '', '', ''];

    function render () {
        let boardHTML = '';
        gameboard.forEach((square, index) => {
            boardHTML += `<div class='square' id='square-${index}'>${square}</div>`
        })
        document.querySelector('#gameboard').innerHTML = boardHTML;
        const squares = document.querySelectorAll('.square')
        squares.forEach((square) => {
        square.addEventListener('click', Game.handleClick)
        })

    }

    function updateSquare (index, value) {
        gameboard[index] = value;
        render();
    }

    function getGameboard () {
        return gameboard;
    }


return {
    render,
    updateSquare, 
    getGameboard
}
})();


const createPlayer = (name, mark) => {
    return {
        name,
        mark
    }
}

const Game = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver;

    function startGame() {
        players = [
            createPlayer(document.querySelector('#player1').value, 'X'), 
            createPlayer(document.querySelector('#player2').value, 'O')
        ]
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.render();
    }

    function handleClick (event) {
        if (gameOver === true) {
            return;
        }
        let index = parseInt(event.target.id.split('-')[1]);

        if (Gameboard.getGameboard()[index] !== '') {
            return;
        }

        Gameboard.updateSquare(index, players[currentPlayerIndex].mark)

        

        if (checkForWin(Gameboard.getGameboard(), players[currentPlayerIndex].mark)) {
            gameOver = true;
            displayController.renderMessage(`${players[currentPlayerIndex].name} won!`)
        }
        else if (checkForTie(Gameboard.getGameboard())) {
            gameOver = true;
            displayController.renderMessage(`It's a tie.`)
            }

        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;

        if (gameOver === false) {
            displayController.renderMessage(`${players[currentPlayerIndex].name}'s turn`)
        }

    }

    function restartGame() {
        for (let i = 0; i < 9; i++) {
            Gameboard.updateSquare(i, '');
        }
        gameOver = false
        displayController.renderMessage('')
        Gameboard.render();
    }

    function updateStatus() {

    }

return {
    startGame, 
    handleClick, 
    restartGame}
})();


function checkForTie(board) {
    return board.every(cell => cell !== '')
}

function checkForWin(board) {
    const winningConditions = [
        [0, 1, 2], 
        [3, 4, 5], 
        [6, 7, 8], 
        [0, 3, 6], 
        [1, 4, 7], 
        [2, 5, 8],
        [0, 4, 8], 
        [2, 4, 6]
    ]

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board [a] && board[a] === board[b] &&  board[a] === board[c]) {
            return true;
        }
    }
    return false
}