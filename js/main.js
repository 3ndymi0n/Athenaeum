const library = (function () {
    let bookCollection = [];

    function dec2hex(dec) {
        return dec.toString(16).padStart(2,"0");
    }

    function generateId() {
        let arr = new Uint8Array(20)
        window.crypto.getRandomValues(arr)
        return Array.from(arr,dec2hex).join('');

    }

    return {
        addBook: function(title, author, pages, readStatus) {
            let newBook = {
                id: generateId(),
                title: title,
                details: new Book(title,author, pages, readStatus)
            }
            bookCollection.push(newBook);
        },
        removeBook: function(title) {
            console.log(`Removing ${title} from library...`)
            bookCollection = bookCollection.filter((e) => {
                return e.title != title;
            });
        },
        getBook: function(title) {
            for(let i = 0; i < bookCollection.length; i++) {
                if (bookCollection[i].title == title) {
                    return bookCollection[i].details;
                }
            };
            return `${title} not found.`
        },
        getAllBooks: function () {
            let bookTitles = [];
            for (let i = 0; i < bookCollection.length; i++) {
                bookTitles.push(bookCollection[i].title);
            };
            return bookTitles;
        } 
    };
})();

function Book(title, author, pages, readStatus=false) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.readStatus = readStatus;
    this.metadata = [];
    this.synopsis = ""
}

Book.prototype.info = function() {
    return (`${this.title}, ${this.author}, ${this.pages}, ${this.readStatus}`);
}

Book.prototype.tags = function(...tags) {
    tags.forEach(e => this.metadata.push(e));
}


library.addBook("gone with the wind","someone",200);

library.getAllBooks();