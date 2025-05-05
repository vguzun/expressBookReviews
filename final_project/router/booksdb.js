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
    getAll: async function () {
        return Promise.resolve(books)
    },

    getByIsbn: async function (isbn) {
        return Promise.resolve(books[isbn])
    },

    getByAuthor: async function (author) {
        const booksByAuthor = {}
        for (const [key, value] of Object.entries(books)) {
            if (value.author === author) {
                booksByAuthor[parseInt(key)] = value;
            }
        }
        return Promise.resolve(booksByAuthor);
    },

    getBooksByTitle: async function (title) {
        const booksByTitle = {}
        for (const [key, value] of Object.entries(books)) {
            if (value.title === title) {
                booksByTitle[parseInt(key)] = value;
            }
        }
        return Promise.resolve(booksByTitle);
    },
    addReview: async function (isbnId, userName, body) {
        let book = await this.getByIsbn(isbnId)
        if (book !== undefined) {
            book.reviews[userName] = body;
        }
        return body;
    },
    deleteReview: async function (isbnId, userName) {
        let book = await this.getByIsbn(isbnId)
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
