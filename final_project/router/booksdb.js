const books =
    {
        1: {"author": "Chinua Achebe", "title": "Things Fall Apart", "reviews": {}},
        2: {"author": "Hans Christian Andersen", "title": "Fairy tales", "reviews": {}},
        3: {"author": "Dante Alighieri", "title": "The Divine Comedy", "reviews": {}},
        4: {"author": "Unknown", "title": "The Epic Of Gilgamesh", "reviews": {}},
        5: {"author": "Unknown", "title": "The Book Of Job", "reviews": {}},
        6: {"author": "Unknown", "title": "One Thousand and One Nights", "reviews": {}},
        7: {"author": "Unknown", "title": "Nj\u00e1l's Saga", "reviews": {}},
        8: {"author": "Jane Austen", "title": "Pride and Prejudice", "reviews": {}},
        9: {"author": "Honor\u00e9 de Balzac", "title": "Le P\u00e8re Goriot", "reviews": {}},
        10: {"author": "Samuel Beckett", "title": "Molloy, Malone Dies, The Unnamable, the trilogy", "reviews": {}}
    }


let bookService = {
    getAll: function () {
        return books
    },

    getByIsbn:  function (isbn) {
        return books[isbn]
    },

    getByAuthor: function (author) {
        const booksByAuthor = {}
        for (const [key, value] of Object.entries(books)) {
            if (value.author === author) {
                booksByAuthor[parseInt(key)] = value;
            }
        }
        return booksByAuthor;
    },

    getBooksByTitle: function (title) {
        const booksByTitle = {}
        for (const [key, value] of Object.entries(books)) {
            if (value.title === title) {
                booksByTitle[parseInt(key)] = value;
            }
        }
        return booksByTitle;
    },
    addReview:  function (isbnId, userName, body) {
        let book = this.getByIsbn(isbnId)
        if (book !== undefined) {
            book.reviews[userName] = body;
        }
        return body;
    },
    deleteReview:  function (isbnId, userName) {
        let book = this.getByIsbn(isbnId)
        if (book === undefined) {
            return;
        }
        const review = book.reviews[userName];
        if (review !== undefined) {
            delete book.reviews[userName];
        }
    }
}


module.exports = bookService;
