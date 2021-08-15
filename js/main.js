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
  
  checkLocalStorage();

  function checkLocalStorage() {
      if(localStorage.getItem(bookCollection)){
          bookCollection = JSON.parse(localStorage.getItem('bookCollection'));
      }else {
          bookCollection = {};
      };
  }

  function updateLocalStorage() {
    localStorage.setItem('bookCollection', JSON.stringify(bookCollection));
  }

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
      updateLocalStorage();
    },

    removeBook: function(lookup) {
        let items = searchBooks('title', lookup);
        for (i in items){
            console.log(`deleting bookCollection item ${items[i]}`)
            delete bookCollection[items[i]];
        }
        updateLocalStorage();
        location.reload();
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

function contentCard(Book) {
    const contentCard = document.createElement('div')
    contentCard.classList.add('content-card');
    
    const template = `
        <img class="cover-art" src=${Book.coverArt}>
        <div class="content-details">
            <span class="genre-label">
                ${Book.genre}
            </span>
            <p class="title-label">
                ${Book.title}
            </p>
            <span class="author-label">
                ${Book.author}
            </span>
        </div>

        <!-- Card Modal -->
        <div class="modal-card">
            <div class="modal__content">
                <span class="close">&times;</span>
                <h1>${Book.title}</h1>
                <hr />
                <h4>Author:${Book.author}</h3>
                <h4>Page Count:${Book.pages}</h4>
                <h4>I have read this book</h4>
                <div class="synopsis">
                    <h4>Synopsis:</h4>
                    <p>${Book.synopsis}</p>
                    <br>
                    <div class="modal__buttons">
                        <button class="btn btn-red">Delete Book</button>
                    </div>
                        
                </div>
            </div>
        </div>
    
    `;

    contentCard.innerHTML = template;
    return contentCard;
}

let allBooks = library.getAllBooks();
let page = document.getElementById('content-section');

for(book in allBooks) {
    let card = contentCard(allBooks[book]);
    page.appendChild(card);

}