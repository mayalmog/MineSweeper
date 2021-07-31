'use strict'

var gBooks = [];
var gSortBy = 'title';//either title or price
const PAGE_SIZE = 3;
var gPageIdx = 0;

_createBooks();

function createBook(title, price, imgUrl = './img/random-book.jfif') {
    var book = {
        id: _makeId(),
        name: title,
        price: price,
        imgUrl: imgUrl,
        desc: _makeLorem(),
        ratings: [5]
    }
    gBooks.unshift(book);
    _saveBooksToStorage()
}

function _createBooks() {
    var books = loadFromStorage('booksDB')
    if (books && books.length) {
        gBooks = books;
    } else {
        createBook('Sapiens', 80.50, './img/sapiens.jpg')
        createBook('Light on Yoga', 100.50, './img/light-on-yoga.jpg')
        createBook('Thinking, Fast and Slow', 75.50, './img/thinking.jpg')
    }

}

function _saveBooksToStorage() {
    saveToStorage('booksDB', gBooks)
}


function setSortBy(SortBy) {
    gSortBy = SortBy;
}


function getBooks() {
    var books = getBooksForPage();

    //sort
    switch (gSortBy) {
        case 'price':
            books.sort((a, b) => (a.price >= b.price) ? 1 : -1);
            break;
        case 'title':
            books.sort((a, b) => (a.name >= b.name) ? 1 : -1);
            break;

    }
    //send arranged array to rederBooks on controller:
    return books;
}

function _makeId(length = 3) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

function _makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn'];
    var txt = '';
    while (size > 0) {
        size--;
        txt += words[Math.floor(Math.random() * words.length)] + ' ';
    }
    return txt;
}

function deleteBook(bookId) {
    var idx = gBooks.findIndex(function (book) {
        return book.id === bookId
    })
    gBooks.splice(idx, 1);
    _saveBooksToStorage();
}

function updateBook(bookId, newPrice) {
    var book = gBooks.find(function (book) {
        return book.id === bookId;
    })
    book.price = newPrice;
    _saveBooksToStorage();
}

function getBookById(bookId) {
    var book = gBooks.find(function (book) {
        return bookId === book.id
    })
    return book
}

function getAveRatingById(bookId) {
    var book = getBookById(bookId);
    var bookRatings = book.ratings;
    var ratingsSum = bookRatings.reduce((a, b) => a + b, 0);
    var averageRating = Math.floor(ratingsSum / (bookRatings).length);
    return averageRating
}

function addBookRating(bookId, RatingCounter) {
    console.log('trying to add book rating')
    var book = getBookById(bookId);

    console.log('Rating counter' + RatingCounter);
    book.ratings.push(RatingCounter);

    book.rating = getAveRatingById(bookId);
    _saveBooksToStorage();
}

function nextPage() {
    if (gPageIdx >= ((gBooks.length / PAGE_SIZE) - 1)) {
        return;
    } else {
        gPageIdx++;
    }
}

function backPage() {
    if (gPageIdx === 0) {
        return;
    } else {
        gPageIdx--;
    }
}

function getBooksForPage() {
    var startIdx = gPageIdx * PAGE_SIZE;
    return gBooks.slice(startIdx, startIdx + PAGE_SIZE)
}

function setPageByNumBtn(pageNum) {
    gPageIdx = pageNum - 1;
}