'use strict'
//global vars:
var MINE = '💣';
var FLAG = '🚩';
var GAMELOST = '☠️';
var HEART = '❤️';

//a var to verify requested number of mines on board;
var gMineCount = 0;
//for stopwatch:
var gTimer = false;
var gTime1 = Date.now();
var gMyTime;

//the model:
// A Matrix containing cell objects: Each cell: { minesAroundCount: 4, isShown: true, isMine: false, isMarked: true }
var gBoard;

//This is an object in which you can keep and update the current game state: isOn: Boolean, when true we let the user play 
//shownCount: How many cells are shown
//markedCount: How many cells are marked(with a flag)
//secsPassed: How many seconds passed

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    livesCount: 3
};

var gLevel = {//changes according to level chosen
    SIZE: 4,
    MINES: 2
};

function initGame() {

    //This is called when page loads
    //zero gGame:
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        livesCount: 3
    };

    document.querySelector('.game-state-indicator').innerHTML = '<img src="./img/pirate-emoji.png" alt="pirate-emoji">';
    document.querySelector('.hearts-remained').innerHTML = "❤️".repeat(gGame.livesCount);


    //zero Mines count:
    gMineCount = 0;

    gBoard = buildBoard();
    // placeMinesRandom();
    // setMinesNegsCount(gBoard);
    renderBoard(gBoard, '.board-container');

    //zero stopwatch:
    gTimer = false;
    document.querySelector('.stopwatch').innerHTML = "00:00";
    document.querySelector('.mines-remained').innerHTML = gLevel.MINES;

}

function buildBoard() {
    //Builds the board -done
    //Call setMinesNegsCount() -done
    var SIZE = gLevel.SIZE;
    var board = [];

    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            var cell = {
                i: i,
                j: j,
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isBlown: false
            };
            board[i][j] = cell;
        }
    }
    //Return the created board-done
    return board;
}
//Set mines at random locations -done
function placeMinesRandom(i, j) {

    while (gMineCount < gLevel.MINES) {
        //getRandomInt exclusive
        var mineCellI = getRandomIntEx(0, gBoard.length);
        var mineCellJ = getRandomIntEx(0, gBoard[0].length);
        var mineCell = gBoard[mineCellI][mineCellJ];
        if (mineCell !== gBoard[i][j]) {
            if (!mineCell.isMine) {
                mineCell.isMine = true;
                gMineCount++;
            }

        }

    }
    console.log(gMineCount);
}


function setMinesNegsCount(board) {
    //Count mines around each cell and set the cell's minesAroundCount.
    var neighborMinesCount = 0;
    for (var cellI = 0; cellI < gBoard.length; cellI++) {
        for (var cellJ = 0; cellJ < gBoard[0].length; cellJ++) {
            var neighborMinesCount = 0;

            for (var i = cellI - 1; i <= cellI + 1; i++) {
                if (i < 0 || i >= gBoard.length) continue;
                for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                    if (i === cellI && j === cellJ) continue;
                    if (j < 0 || j >= gBoard[i].length) continue;
                    var currCell = gBoard[i][j];
                    var isCurrCellMine = currCell.isMine;
                    if (isCurrCellMine) {
                        neighborMinesCount++

                    }
                }
            }
            gBoard[cellI][cellJ].minesAroundCount = neighborMinesCount;
        }
    }

}


function renderBoard(board, selector) {
    //     //Render the board as a <table> to the page

    var strHTML = '<table class="game-table"><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '\t<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];

            if (!cell.isShown && !cell.isMarked) {
                var className = 'cell cell' + i + '-' + j;
                strHTML += `\t<td class="${className} cell-not-shown" onmouseup="cellRightClicked(event,${i}, ${j})" onclick = "cellClicked(${i}, ${j})"> </td>\n`
            }
            if (!cell.isShown && cell.isMarked) {
                var className = 'cell cell' + i + '-' + j;
                strHTML += `\t<td class="${className} cell-not-shown" onmouseup="cellRightClicked(event,${i}, ${j})" onclick = "cellClicked(${i}, ${j})">${FLAG}</td>\n`
            }

            if (cell.isShown === true && cell.isMine === true && !cell.isBlown) {
                var className = 'cell cell' + i + '-' + j;
                strHTML += `\t<td class="${className}" onmouseup="cellRightClicked(event,${i}, ${j})" onclick = "cellClicked(${i}, ${j})"> ${MINE} </td>\n`
            }

            if (cell.isShown === true && cell.isMine === true && cell.isBlown) {
                var className = 'cell cell' + i + '-' + j;
                strHTML += `\t<td class="${className} blown-mine" onmouseup="cellRightClicked(event,${i}, ${j})" onclick = "cellClicked(${i}, ${j})"> ${MINE} </td>\n`
            }
            if (cell.isShown === true && cell.isMine === false) {
                if (cell.minesAroundCount === 0) { //cell has zero mine neighbors
                    var className = 'cell cell' + i + '-' + j;
                    strHTML += `\t<td class="${className} " onmouseup="cellRightClicked(event,${i}, ${j})" onclick = "cellClicked(${i}, ${j})"> </td>\n`

                } else {
                    var className = 'cell cell' + i + '-' + j;
                    strHTML += `\t<td class="${className} " onmouseup="cellRightClicked(event,${i}, ${j})" onclick = "cellClicked(${i}, ${j})"> ${cell.minesAroundCount} </td>\n`
                }

            }

            // var className = 'cell cell' + i + '-' + j;
            // strHTML += `\t<td class="${className} cell-not-shown" onclick = "cellClicked(this, ${i}, ${j})"> ${cell} </td>\n`
        }
        strHTML += '</tr>\n'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;

}

function cellClicked(i, j) {
    //Called when a cell (td) is clicked
    var clickedCell = gBoard[i][j];
    console.log(clickedCell);
    //start timer when first cell is clicked (if no cell has been flagged yet)
    if (!gTimer && gGame.shownCount === 0) {
        placeMinesRandom(i, j);
        setMinesNegsCount(gBoard);
        // renderBoard(gBoard, '.board-container');
        startTimer();
        gTimer = true;
    }

    //does not enable opening a flagged cell:
    if (clickedCell.isMarked) {
        return;
    }
    //if the cell has not been clicked yet:
    if (!clickedCell.isShown && !clickedCell.isMine) {
        clickedCell.isShown = true;
        gGame.shownCount++;
        if (clickedCell.minesAroundCount === 0) {
            expandShown(i, j);
        }
        renderBoard(gBoard, '.board-container');
        checkGameOver(clickedCell);
    }
    //if the cell is a mine, activate checkGameOver
    if (clickedCell.isMine) {
        //reveal all mines
        checkGameOver(clickedCell);

    }


    console.log('shownCount:' + gGame.shownCount);

}

function cellRightClicked(ev, i, j) {
    if (ev.button === 2) {
        if (!gTimer) {
            startTimer();
            gTimer = true;
        }
        var elCell = gBoard[i][j];
        cellMarked(elCell);
    }
}

function cellMarked(elCell) {
    //Called on right click to mark a cell (suspected to be a mine) 
    //Search the web (and implement) how to hide the context menu on right click-done (on index.html)
    if (elCell.isShown) {
        return;
    }
    if (elCell.isMarked) {
        elCell.isMarked = false;
        gGame.markedCount--;
        renderBoard(gBoard, '.board-container');
    } else {
        elCell.isMarked = true;
        gGame.markedCount++;
        renderBoard(gBoard, '.board-container');
        checkGameOver(elCell);
    }
    console.log('marked count:' + gGame.markedCount);

}

function checkGameOver(clickedCell) {
    //game is lost when user left-clicks on a mine:
    if (clickedCell.isMine && !clickedCell.isMarked) {
        if (gGame.livesCount > 1) {
            //either the lives count is bigger than 1 - continue playing, take down one heart
            gGame.livesCount--;
            document.querySelector('.hearts-remained').innerHTML = "❤️".repeat(gGame.livesCount);
            clickedCell.isShown = true;
            renderBoard(gBoard, '.board-container');

        } else if (gGame.livesCount === 1) { //or- user is at 1 heart and loses the game;  
            gGame.livesCount--;
            document.querySelector('.hearts-remained').innerHTML = "";
            //stop timer:
            stopTimer();
            //add class ".blown-mine" to selected cell
            clickedCell.isBlown = true;
            //reveal all mines:
            for (var boardI = 0; boardI < gBoard.length; boardI++) {
                for (var boardJ = 0; boardJ < gBoard[0].length; boardJ++) {
                    if (gBoard[boardI][boardJ].isMine) {
                        gBoard[boardI][boardJ].isShown = true;
                    }

                }
            }
            renderBoard(gBoard, '.board-container');
            document.querySelector('.game-state-indicator').innerHTML = GAMELOST;
            gGame.isOn = false;
        }
    } else if ((gGame.shownCount === (gLevel.SIZE * gLevel.SIZE) - gLevel.MINES)
        && (gGame.markedCount === gLevel.MINES) || (gGame.shownCount === (gLevel.SIZE * gLevel.SIZE) - gLevel.MINES) && gGame.livesCount > 1 && gLevel.MINES === (gGame.markedCount + (3 - gGame.livesCount))) { //Game is won-1. when all mines are marked, and all the other cells are shown, or- 2. when all other cells are shown, all mines are either shown or flagged, and there is more than 1 heart:
        stopTimer();
        renderBoard(gBoard, '.board-container');
        document.querySelector('.game-state-indicator').innerHTML = '<img src="./img/game-won-treasure.png" alt="treasure-chest">';
        gGame.isOn = false;
    }
}


function changeGameLevelBeginner() {
    gLevel.SIZE = 4;
    gLevel.MINES = 2;
    //zero gGame
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,

    };
    initGame();
}

function changeGameLevelMedium() {
    gLevel.SIZE = 8;
    gLevel.MINES = 12;
    //zero gGame
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,

    };
    initGame();
}

function changeGameLevelExpert() {
    gLevel.SIZE = 12;
    gLevel.MINES = 30;
    //zero gGame
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,

    };
    initGame();
}

function expandShown(i, j) {
    //When user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors.
    //NOTE: start with a basic implementation that only opens the non-mine 1st degree neighbors
    //BONUS: if you have the time later, try to work more like the real algorithm (see description at the Bonuses section below)
    var nbrCells = getNeiboringCells(i, j);// an array of all neighboring cells for i,j (except limits);
    for (var k = 0; k < nbrCells.length; k++) {
        if (!nbrCells[k].isShown) {
            nbrCells[k].isShown = true;
            gGame.shownCount++;
            if (nbrCells[k].minesAroundCount === 0) {
                expandShown(nbrCells[k].i, nbrCells[k].j);
            }
        }
    }
}
