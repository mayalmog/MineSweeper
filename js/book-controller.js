'use strict'

var gRatingCounter = 0;

function onInit() {
    renderBooks();

}

function renderBooks() {
    renderPageBtns();
    var books = getBooks();
    console.log(books);
    var strHtmls = books.map(function (book) {
        return `
        <tr>
        <td>${book.id}</td>
        <td>${book.name}</td>
        <td><img class = "book-img" src="${book.imgUrl}" alt="cover-img"></td>
        <td>${book.price}₪</td>
        <td><button class = "read-btn btn"  onclick="onReadBook('${book.id}', event)">Read</button></td>
        <td><button class = "update-btn btn" onclick="onUpdateBook('${book.id}', event)">Update</button></td>
        <td><button class = "delete-btn btn" onclick="onDeleteBook('${book.id}', event)">Delete</button></td>
        <td>
        <span class= "average-rating"> ${getAveRatingById(book.id)}</span>
        <br>${(book.ratings.length)} ratings</td>
    </tr>
        `
    })
    document.querySelector('.books-container').innerHTML = strHtmls.join('')
}

function onDeleteBook(bookId, ev) {
    console.log('Deleting: ', bookId);
    ev.stopPropagation();
    if (confirm('Confirm to delete Book')) {
        deleteBook(bookId);
        renderBooks();
    }
}

function onUpdateBook(bookId, ev) {
    console.log('Updating: ', bookId);
    ev.stopPropagation();
    var newPrice = +prompt('Enter new book price in ₪: ');
    updateBook(bookId, newPrice);
    renderBooks();
}


function onReadBook(bookId, ev) {

    ev.stopPropagation();

    var book = getBookById(bookId)
    console.log('book from onReadBook', book)
    var elModal = document.querySelector('.modal')

    var HTMLStr = ` <img class="modal-img" src="${book.imgUrl}" alt="cover-img">
        <h5>${book.name}</h5>
        <h6>${book.price}₪</h6>
        <p>${book.desc}</p>
        <button class="rate-minus modal-btn btn" onclick="onMinusRating()">-</button>
        <span class="rating-display">${gRatingCounter}</span>
        <button class="rate-plus modal-btn btn" onclick="onPlusRating()">+</button>
        <button class="modal-btn btn" onclick="onAddRating('${book.id}')">Send Rating</button>
        <button class="modal-btn btn" onclick="onCloseModal()">Close</button>
        `

    elModal.innerHTML = HTMLStr;
    elModal.hidden = false;
}

function onCloseModal() {
    gRatingCounter = 0;
    renderBooks();
    document.querySelector('.modal').hidden = true;
}

function onPlusRating() {
    if (gRatingCounter < 10) {
        gRatingCounter++;
    } else {
        return;
    }
    document.querySelector('.rating-display').innerHTML = gRatingCounter;

}

function onMinusRating() {
    if (gRatingCounter > 0) {
        gRatingCounter--;
    } else {
        return;
    }
    document.querySelector('.rating-display').innerHTML = gRatingCounter;

}

function onAddRating(bookId) {
    var RatingCounter = gRatingCounter;
    console.log(RatingCounter);
    addBookRating(bookId, RatingCounter);
}


function onAddBook() {

    var elModal = document.querySelector('.add-new-book')

    elModal.hidden = false;
}


function onAddNewBook() {
    var elBookTitle = document.querySelector('[name=newAddBookTitle]');
    var elBookPrice = document.querySelector('[name=newAddBookPrice]');
    var elBookImg = document.querySelector('[name=newAddBookImg]');
    var bookTitle = elBookTitle.value;
    var bookPrice = elBookPrice.value;
    if (!bookTitle) return;

    if (bookImg) {
        var bookImg = elBookImg.value;
        console.log(bookImg);
        createBook(bookTitle, bookPrice, bookImg);
    }
    else {
        console.log(bookImg);
        createBook(bookTitle, bookPrice);
    }

    renderBooks()
}

function onCloseNewBookModal() {

    renderBooks();
    document.querySelector('.add-new-book').hidden = true;
}

function onSetSort(SortBy) {
    console.log('Sorting by:', SortBy);
    setSortBy(SortBy);
    renderBooks();
}

function onBackPage() {
    backPage();
    renderBooks();

}

function onNextPage() {
    nextPage();
    renderBooks();
}

function onPageNumBtn(pageNum) {
    setPageByNumBtn(pageNum);
    renderBooks();

}

function renderPageBtns() {
    var strHTML = [];
    var numOfBtns = Math.ceil((gBooks.length / PAGE_SIZE))

    for (var i = 0; i < numOfBtns; i++) {
        strHTML.push(`<button class="add-book-btn btn" onclick="onPageNumBtn(${i + 1})">${i + 1}</button>`);
    }
    document.querySelector('.page-numbers').innerHTML = strHTML.join('');
}