// Dom
const form = document.getElementById('book-form');
const bookList = document.getElementById('book-list');
let search = document.querySelector('#search-bar');

class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class 
class UI {
    constructor() {}
        // Adding books to the table list
    addBookList(book) {
        const list = document.getElementById('book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete"><i class="fas fa-trash"></i></a></td>
        `;
        list.appendChild(row);
    };

    // Clearing input fields
    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }

    // Alert msg
    showAlert(message, className) {
        let div = document.createElement('div');
        div.className = `alert ${className}`;

        div.appendChild(document.createTextNode(message));

        let container = document.querySelector('.container');
        let form = document.querySelector('#book-form');

        container.insertBefore(div, form);

        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 2000)
    }

    // Adding books to the localStorage
    addBooksToLs(books) {
        let book;
        if (localStorage.getItem('books') === null) {
            book = [];
        } else {
            book = JSON.parse(localStorage.getItem('books'));
        }

        book.push(books);

        localStorage.setItem('books', JSON.stringify(book));
    }

    // Get items from localStorage
    static getItemsFromLs() {
        const getBooks = JSON.parse(localStorage.getItem('books'));
        getBooks.forEach((books) => {
            const list = document.getElementById('book-list');

            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${books.title}</td>
                <td>${books.author}</td>
                <td>${books.isbn}</td>
                <td><a href="#" class="delete"><i class="fas fa-trash"></i></a></td>
            `;
            list.appendChild(row);
        });
        return getBooks;
    }


    // remove books from dom
    removeFromDom(target) {
        if (target.hasAttribute('href')) {
            target.parentElement.parentElement.remove();
            this.showAlert('Book Removed', "success");
            this.removeBooksFromLs(target.parentElement.previousElementSibling.textContent.trim());
        }
    }

    // remove items from localStorage

    removeBooksFromLs(isbn) {
        const localStorageBooks = JSON.parse(localStorage.getItem('books'));
        localStorageBooks.forEach((book, index) => {
            if (book.isbn === isbn) {
                localStorageBooks.splice(index, 1);
            }
        })
        localStorage.setItem('books', JSON.stringify(localStorageBooks));
    }
}


// search class
class Search {
    constructor() {};

    static searchItems() {
        const searchVal = search.value.toLowerCase().trim();
        let txtVal;
        const tr = bookList.querySelectorAll('tr');

        tr.forEach((item) => {
            txtVal = item.textContent;

            if (txtVal.toLowerCase().indexOf(searchVal) > -1) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        })
    }
}

// Define functions

function newBook(e) {
    e.preventDefault();

    let title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

    let ui = new UI();
    const isbnReg = /^[0-9]{5}$/;
    // checking inputs validatins

    if (title === '' || author === '' || isbn === '') {
        ui.showAlert('Please fill the fields', "failed");
    } else if (!isbn.match(isbnReg)) {
        ui.showAlert('ISBN must be 5 digits number', "failed");
    } else {
        let book = new Book(title, author, isbn);

        ui.clearFields();
        ui.showAlert('Book added', "success");
        ui.addBookList(book);

        // localStorage stuff
        ui.addBooksToLs(book);
    }
}

// removing books from localStorage and DOM
function removeStuff(e) {
    let ui = new UI();
    ui.removeBooksFromLs(e.target.parentElement.previousElementSibling.textContent);
    ui.removeFromDom(e.target);
};


// Event listeners
form.addEventListener('submit', newBook);
document.addEventListener('DOMContentLoaded', UI.getItemsFromLs);
bookList.addEventListener('click', removeStuff);
search.addEventListener('keyup', Search.searchItems)