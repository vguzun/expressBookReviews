const express = require('express');
const axios = require("axios");
const bookService = require("./booksdb.js");
const port = require('../config/default.js').port;

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
public_users.get('/', function (req, res) {
    try {
        let books = bookService.getAll();
        // As suggested we should use JSON.stringify(books) but I don't want to do that
        // as it return not consistent result - in bookdb isbn is integer, but after stringify is string
        // and another point - tools like postman and http request from IntelliJ Idea better work with proper output
        res.send(books);
    } catch {
        sendInternalError(res);
    }

});

public_users.get("/books-async", async function (req, res) {
    try {
        let response = await axios.get(`http://localhost:${port}/`)
        res.status(response.status).send(response.data)
    } catch (e) {
        res.status(500).send(
            {
                "title": "Internal Server error"
            }
        )
    }
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
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
    booksByIsbn = bookService.getByIsbn(isbnId);

    if (booksByIsbn !== undefined) {
        res.status(200).send(booksByIsbn);
    } else {
        res.status(404).send({
            title: "Resource not found",
            message: "Book with provided isbn is not found"
        });
    }
});

public_users.get("/isbn-async/:isbn", async function (req, res) {
    let  isbn = req.params.isbn
    try {
        let response = await axios.get(`http://localhost:${port}/isbn/${isbn}`)
        res.status(response.status).send(response.data)
    } catch (e) {
        res.send(
            {
                "title": "Internal Server error"
            }
        )
    }
})
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let author = req.params.author;
    let books = bookService.getByAuthor(author)

    if (books !== {}) {
        // again I don't like stringify output:
        res.status(200).send(books);
    } else {
        res.status(404).json({
            title: "Resource not found",
            message: "Books with provided author are not found"
        });
    }
});

public_users.get("/author-async/:author", async function (req, res) {
    let  author = req.params.author
    try {
        let response = await axios.get(`http://localhost:${port}/author/${author}`)
        res.status(response.status).send(response.data)
    } catch (e) {
        res.status(500).send(
            {
                "title": "Internal Server error"
            }
        )
    }
})

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    let title = req.params.title;
    let booksByTitle = null;
    booksByTitle = bookService.getBooksByTitle(title);

    if (booksByTitle !== {}) {
        res.status(200).json(booksByTitle);
    } else {
        res.status(404).json({
            title: "Resource not found",
            message: "Books with provided title are not found"
        });
    }
});

public_users.get("/title-async/:title", async function (req, res) {
    let  title = req.params.title
    try {
        let response = await axios.get(`http://localhost:${port}/title/${title}`)
        res.status(response.status).send(response.data)
    } catch (e) {
        res.status(500).send(
            {
                "title": "Internal Server error"
            }
        )
    }
})

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    let isbnId = parseInt(isbn);
    if (isNaN(isbnId)) {
        res.status(400).send({
            title: "Bad request",
            message: "isbn should be an integer number"
        });
        return
    }
    let book = bookService.getByIsbn(isbnId);
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
