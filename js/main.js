// Listen for new title submissions.
document.querySelector("#add-title").addEventListener("submit", (e) => {
  try {
    const newTitleFormData = new FormData(e.target);
    let newTitle = Object.fromEntries(newTitleFormData.entries());

    library.addBook(
      newTitle.title,
      newTitle.author,
      newTitle.pages,
      newTitle.genre,
      newTitle.readStatus,
      newTitle.coverArt,
      newTitle.synopsis
    );

  } catch (err) {
    alert(err.message);
  }
});

const library = (function () {
  let bookCollection = {};

  // generateId helper function.
  function dec2hex(dec) {
    return dec.toString(16).padStart(2, "0");
  }

  function generateId() {
    let arr = new Uint8Array(10);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, dec2hex).join("");
  }

  function searchBooks(para, search) {
    let searchResults = [];
    for([id, book] of Object.entries(bookCollection)) {
        if(book[para] == search) {
            searchResults.push(id);
        };
    }
    return searchResults;
  }

  return {
    search : searchBooks,

    addBook: function (title, author, pages, genre, readStatus, coverArt, synopsis) {
        let id =  generateId();
        let details = new Book(
          title,
          author,
          pages,
          genre,
          readStatus,
          coverArt,
          synopsis
        );
      bookCollection[id] = details;
    },

    removeBook: function(lookup) {
        let items = searchBooks('title', lookup);
        for (i in items){
            console.log(`deleting bookCollection item ${items[i]}`)
            delete bookCollection[items[i]];
        }
    },

    getAllBooks: function() {
        let books = [];
        for([id, book] of Object.entries(bookCollection)) {
            books.push(book);
        }
        return books;
    },
  }
})();

function Book(
  title,
  author,
  pages,
  genre,
  readStatus = "0%",
  coverArt = "https://previews.123rf.com/images/oasis15/oasis151506/oasis15150600007/40908971-blank-book-cover.jpg",
  synopsis = "No synopsis recorded as yet."
) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.genre = genre;
  this.readStatus = readStatus;
  this.coverArt = coverArt;
  this.synopsis = synopsis;
}

Book.prototype.info = function () {
  return `${this.title}, ${this.author}, ${this.pages}, ${this.readStatus}`;
};



/* library.addBook(
  "The rise of Hyperion",
  "Dan Simmons",
  723,
  "Science Fiction",
  "25%",
  "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTKbpGHJeFMd3UsEC5Cucn2U0E59U3nZmVBONonqEMYYIHm1Jt9",
  "lt is the 29th century and the universe of the Human Hegemony is under threat. Invasion by the warlike Ousters looms, and the mysterious schemes of the secessionist AI TechnoCore bring chaos ever closer. On the eve of disaster, with the entire galaxy at war, seven pilgrims set fourth on a final voyage to the legendary Time Tombs on Hyperion, home to the Shrike, a lethal creature, part god and part killing machine, whose powers transcend the limits of time and space. The pilgrims have resolved to die before discovering anything less than the secrets of the universe itself."
);

library.addBook(
    "Hyperion",
    "Dan Simmons",
    876,
    "Science Fiction"
) */