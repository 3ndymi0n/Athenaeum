const library = (function () {
    let bookCollection = [];

    return {
        addBook: function(title, author, pages, readStatus) {
            let newBook = {
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
}

Book.prototype.info = function() {
    return (`${this.title}, ${this.author}, ${this.pages}, ${this.readStatus}`);
}

Book.prototype.tags = function(...tags) {
    tags.forEach(e => this.metadata.push(e));
}


library.addBook('The Hobbits','J.R.R Tolkien', 295,false);
library.addBook('Lord of the Rings','J.R.R.Tolkien', 342, true);

//library.removeBook('Lord of the Rings');

let hobbits = library.getBook('The Hobbits');
let lotr = library.getBook('Lord of the Rings');

//console.log(hobbits.info());
hobbits.tags('Adventure', 'Fantasy', 'Magic');
console.log(lotr);
//console.log(lotr);
//console.log(library.getAllBooks());