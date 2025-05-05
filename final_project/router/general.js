const express = require('express');
let bookService = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users[username] = password;
            return res.status(201).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(409).json(
                {
                    title: "Unable to register user.",
                    message: "User is not valid!"
                });
        }
    }
    return res.status(400).json(
        {
            title: "Unable to register user.",
            message: "username and password are mandatory"
        });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        let books = await bookService.getAll();
        // As suggested we should use JSON.stringify(books) but I don't want to do that
        // as it return not consistent result - in bookdb isbn is integer, but after stringify is string
        // and another point - tools like postman and http request from IntelliJ Idea better work with proper output
        res.send(books);
    } catch {
        sendInternalError(res);
    }

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    let isbn = req.params.isbn;
    let isbnId = parseInt(isbn);
    if (isNaN(isbnId)) {
        res.status(400).send(JSON.stringify({
            title: "Bad request",
            message: "isbn should be an integer number"
        }));
        return
    }
    let booksByIsbn = null;
    try {
        booksByIsbn = await bookService.getByIsbn(isbnId);
    } catch (e) {
        sendInternalError(res);
        return
    }

    if (booksByIsbn !== undefined) {
        res.status(200).send(booksByIsbn);
    } else {
        res.status(404).send({
            title: "Resource not found",
            message: "Book with provided isbn is not found"
        });
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    let author = req.params.author;
    try {
        let books = await bookService.getByAuthor(author)

        if (books !== {}) {
            // again I don't like stringify output:
            res.status(200).send(books);
        } else {
            res.status(404).json({
                title: "Resource not found",
                message: "Books with provided author are not found"
            });
        }
    } catch {
        sendInternalError(res);
    }

});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    let title = req.params.title;
    let booksByTitle = null;
    try {
        booksByTitle = await bookService.getBooksByTitle(title);
    } catch (e) {
        sendInternalError(res)
        return
    }

    if (booksByTitle !== {}) {
        res.status(200).json(booksByTitle);
    } else {
        res.status(404).json({
            title: "Resource not found",
            message: "Books with provided title are not found"
        });
    }
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
    let isbn = req.params.isbn;
    let isbnId = parseInt(isbn);
    if (isNaN(isbnId)) {
        res.status(400).send(JSON.stringify({
            title: "Bad request",
            message: "isbn should be an integer number"
        }));
        return
    }
    let book = await bookService.getByIsbn(isbnId);
    if (book === undefined) {
        res.status(404).json({
            title: "Resource not found",
            message: "Reviews are not found for the book with provided isbn"
        });
        return;
    }
    res.status(200).json(book.reviews);
});

function sendInternalError(res) {
    res.status(500).send({title: "Internal error occurred"});
}

module.exports.general = public_users;
