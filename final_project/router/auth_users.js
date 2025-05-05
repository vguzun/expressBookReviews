const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const bookService = require("./booksdb");
const regd_users = express.Router();
const SECRET = 'accessSecret';

let users = [];

const isValid = (username) => { //returns boolean
    return users[username] !== undefined
}

const authenticatedUser = (username, password) => { //returns boolean
    return users[username] === password
}

const verifyAuthentication = (req, res, next) => {
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];
        jwt.verify(token, SECRET, (err, user) => {
            if (!err) {
                req.user = user;
                next();
            } else {
                return res.status(403).json({message: "User not authenticated"});
            }
        });
    } else {
        return res.status(403).json({message: "User not logged in"});
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, SECRET, {expiresIn: 60 * 60});

        req.session.authorization = {
            'accessToken': accessToken,
            'username': username
        }
        return res.status(200).send({
            "message": "User successfully logged in"
        });
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let isbnId = parseInt(isbn);
    if (isNaN(isbnId)) {
        res.status(400).send(JSON.stringify({
            title: "Bad request",
            message: "isbn should be an integer number"
        }));
        return
    }
    const userName = req.session.authorization['username'];
    let review = bookService.addReview(isbnId, userName, req.body);
    return res.status(201).send(review);
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let isbnId = parseInt(isbn);
    if (isNaN(isbnId)) {
        res.status(400).send(JSON.stringify({
            title: "Bad request",
            message: "isbn should be an integer number"
        }));
        return
    }
    const userName = req.session.authorization['username'];
    bookService.deleteReview(isbnId, userName);
    return res.status(204).send();
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.verifyAuthentication = verifyAuthentication;
module.exports.users = users;
