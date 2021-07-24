'use strict'

var gTimeDiffStr = '00:00';
////////// Utility Functions //////////

function createEmptyMat(ROWS, COLS) {//model

    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat;
}

//copyMat
function copyMat(mat) {
    var newMat = [];
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = []
        // newMat[i] = mat[i].slice();
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j];
        }
    }
    return newMat;
}

function renderMat(mat, selector) {//DOM, gets a model mat and where to insert it in the html

    var strHTML = '<table class = "table"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '\t<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = 'cell cell' + i + '-' + j;
            strHTML += '\t<td class="' + className + '"> ' + cell + ' </td>\n'
        }
        strHTML += '</tr>\n'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;

}

// location such as: {i: 2, j: 7} and HTMLStr value to insert into a specific cell;
function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);

    elCell.innerHTML = value;
}

//sum row
function sumRow(mat, rowIdx) {
    var rowSum = 0;
    for (var j = 0; j < mat[0].length; j++) {
        rowSum += mat[rowIdx][j];
    }
    return rowSum;
}
//sum col
function sumCol(mat, colIdx) {
    var colSum = 0;
    for (var i = 0; i < mat.length; i++) {
        colSum += mat[i][colIdx];
    }
    return colSum;
}

function shuffledArrCopy(array) {// returns a shuffled copy of a given array;
    var shuffledarr = array.slice();
    for (var i = shuffledarr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [shuffledarr[i], shuffledarr[j]] = [shuffledarr[j], shuffledarr[i]];
    }

    return shuffledarr;
}

function getRandEmptyCell(mat) { //returns a random empty cell (as object) in a given mat, requires getRandomInt. empty cell contains "";

    var emptyCell = {
        i,
        j
    };
    var emptyCells = [];

    for (var i = 1; i < mat.length - 1; i++) {
        for (var j = 1; j < mat[0].length - 1; j++)
            if (mat[i][j] === "") {
                emptyCell.i = i;
                emptyCell.j = j;
                emptyCells.push(emptyCell);
            }
    }

    var randomCell = emptyCells[getRandomInt(0, emptyCells.length)];

    if (!randomCell) return false; //if no empty cells yet in game start

    return randomCell;

}
//get random int (exclusive)
function getRandomIntEx(min, max) {//max not inclusive
    return Math.floor(Math.random() * (max - min)) + min;
}
//get random int (inclusive)
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
//negs loop, return an array of all empty neighboring cells;b
function getAllEmptyNegs(centerCoord, mat) {

    var res = [];

    for (var i = centerCoord.i - 1; i <= centerCoord.i + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = centerCoord.j - 1; j <= centerCoord.j + 1; j++) {
            if (i === centerCoord.i && j === centerCoord.j) continue;
            if (j < 0 || j >= mat[0].length) continue;
            var coord = {
                i: i,
                j: j
            };
            if (!(mat[coord.i][coord.j] === ' ')) continue;
            res.push(coord);
        }
    }

    return res;

}
//neighbors count, gets i, j and mat;
function countNeighbors(cellI, cellJ, mat) {
    var neighborMinesCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            var currCell = mat[i][j];
            var isCurrCellMine = currCell.isMine;
            if (isCurrCellMine) {
                neighborMinesCount++

            }
        }
    }
    gBoard[cellI][cellJ].minesAroundCount = neighborMinesCount;
}

function getNeiboringCells(i, j) {//i,j are coords of center cell
    var nbrCells = [];
    for (var nbrsI = i - 1; nbrsI <= i + 1; nbrsI++) {
        if (nbrsI < 0 || nbrsI >= gBoard.length) continue;
        for (var nbrsJ = j - 1; nbrsJ <= j + 1; nbrsJ++) {
            if (i === nbrsI && j === nbrsJ) continue;
            if (nbrsJ < 0 || nbrsJ >= gBoard[i].length) continue;
            var currCell = gBoard[nbrsI][nbrsJ];
            nbrCells.push(currCell);
        }
    }
    return nbrCells;
}

//timer, format: 00:000, alerts finish time;
// var gTime1 = Date.now();
// var gMyTime;
function startTimer() {
    gTime1 = Date.now();
    gMyTime = setInterval(timeCycle, 1);
}
function timeCycle() {
    var time2 = Date.now();
    var msTimeDiff = time2 - gTime1;
    gTimeDiffStr = new Date(msTimeDiff).toISOString().slice(14, -5);
    document.querySelector('.stopwatch').innerHTML = gTimeDiffStr;
}
function stopTimer() {
    clearInterval(gMyTime);
    var finishTime = document.querySelector('.stopwatch').innerHTML;
    document.querySelector('.stopwatch').innerHTML = finishTime;

}
//bubble sort:
// Creating the bubbleSort function, changes original array
function bubbleSort(arr) {

    for (var i = 0; i < arr.length; i++) {
        // Last i elements are already in place  
        for (var j = 0; j < (arr.length - i - 1); j++) {
            // Checking if the item at present iteration 
            // is greater than the next iteration
            if (arr[j] > arr[j + 1]) {
                // If the condition is true then swap them
                var temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
            }
        }
    }
    // Print the sorted array
    console.log(arr);
    return arr;
}
//Modal (from Pacman), get two booleans according to game state
function getModal(showModal, isVictory) {

    if (showModal) {
        document.querySelector('.modal').style.visibility = "visible";
    } else {
        document.querySelector('.modal').style.visibility = "hidden";
    }

    if (isVictory) {
        document.querySelector('.game-over-txt').innerText = 'Game Done';
    } else {
        document.querySelector('.game-over-txt').innerText = 'Game Over';
    }

}
//makeId, can get both letters and numbers
function makeid(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}
