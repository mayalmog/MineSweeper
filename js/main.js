'use strict'
//global vars:
var MINE = '💣';
var FLAG = '🚩';

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

};

var gLevel = {//changes according to level chosen
    SIZE: 6,
    MINES: 4
};

function initGame() {
    //This is called when page loads
    gGame.isOn = true;

    gBoard = buildBoard();
    placeMinesRandom();
    setMinesNegsCount(gBoard);
    console.log(gBoard);
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
function placeMinesRandom() {

    while (gMineCount < gLevel.MINES) {
        //getRandomInt exclusive
        var mineCellI = getRandomIntEx(0, gBoard.length);
        var mineCellJ = getRandomIntEx(0, gBoard[0].length);
        var mineCEll = gBoard[mineCellI][mineCellJ];
        if (!mineCEll.isMine) {
            mineCEll.isMine = true;
            gMineCount++;
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
                if (cell.minesAroundCount === 0) {
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
    //does not enable opening a flagged cell:
    if (clickedCell.isMarked) {
        return;
    }
    //if the cell has not been clicked yet:
    if (!clickedCell.isShown) {
        clickedCell.isShown = true;
        renderBoard(gBoard, '.board-container');
        gGame.shownCount++;
        checkGameOver(clickedCell);
    }
    //if the cell is a mine, stop timer and lose game
    if (clickedCell.isMine) {
        stopTimer()
        //reveal all mines
        checkGameOver(clickedCell);

        //change smiley indicator to lost
    }

    //start timer when first cell is clicked (if no cell has been flagged yet)
    if (gGame.shownCount === 1 && gTimer === false) {
        startTimer();
        gTimer = true;
    }
    console.log('shownCount:' + gGame.shownCount);

}

function cellRightClicked(ev, i, j) {
    if (ev.button === 2) {
        var elCell = gBoard[i][j];
        cellMarked(elCell);
        if (gGame.shownCount === 0 && gTimer === false) {
            startTimer();
            gTimer = true;
        }
    }

}

function cellMarked(elCell) {
    //Called on right click to mark a cell (suspected to be a mine) 
    //Search the web (and implement) how to hide the context menu on right click-done (on index.html)
    if (elCell.isMarked === true) {
        elCell.isMarked = false;
        gGame.markedCount--;
        // console.log(elCell);
        renderBoard(gBoard, '.board-container');
    } else { //(elCell.isMarked === false)
        elCell.isMarked = true;
        gGame.markedCount++;
        //console.log(elCell);
        renderBoard(gBoard, '.board-container');
    }
    console.log('marked count:' + gGame.markedCount);
    checkGameOver(elCell)

}

function checkGameOver(clickedCell) {
    //game is lost when user left-clicks on a mine:
    if (clickedCell.isMine && !clickedCell.isMarked) {
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
        gGame.isOn = false;
    }

    //Game is won when all mines are marked, and all the other cells are shown:
    else if ((gGame.shownCount === (gLevel.SIZE * gLevel.SIZE) - gLevel.MINES)
        && (gGame.markedCount === gLevel.MINES)) {
        //check if all mines are flagged and all other cells are shown:
        document.querySelector('.game-state-indicator').innerText = 'You Win!';
        renderBoard(gBoard, '.board-container');
        gGame.isOn = false;
    }


}

function expandShown(board, elCell, i, j) {
    //When user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors.
    //NOTE: start with a basic implementation that only opens the non-mine 1st degree neighbors
    //BONUS: if you have the time later, try to work more like the real algorithm (see description at the Bonuses section below)
}





