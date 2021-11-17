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
      newTitle.summary
    );

  } catch (err) {
    alert(err.message);
  }
});

// Searchbar event listener
const searchInput = document.querySelector('.search');
searchInput.addEventListener('input', (e) => {
  let value = e.target.value;
  displayLibrary(value);
});

document.getElementById('content-section')
  .addEventListener('click', event => {
    if(event.target.className === 'cover-art'){
      let target = event.target.parentElement.querySelector(".modal-card")
      toggleModal(target);
    }

    if(event.target.className === 'close') {
      let target = event.target.parentElement.parentElement;
      toggleModal(target);
    }

    if(event.target.className === 'btn btn-red btn-del') {
      const title = event.target.nextElementSibling.textContent;
      library.removeBook(title);
    }
  })

const library = (function () {
  let bookCollection = {};
  
  checkLocalStorage();

  function checkLocalStorage() {
      if(localStorage.getItem('bookCollection')){
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
        let testLibrary = searchBooks('title', title)
        if(testLibrary.length > 0){
            this.removeBook(title);
        }

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
        checkLocalStorage();
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

function contentCard(Book) {
    const contentCard = document.createElement('div')
    contentCard.classList.add('content-card');
    // contentCard.setAttribute("onclick", "openModal(this)");
    
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
                <h4>Author: ${Book.author}</h3>
                <h4>Page Count: ${Book.pages}</h4>
                <h4>Read Status: ${Book.readStatus}</h4>
                <div class="synopsis">
                    <h4>Synopsis:</h4>
                    <p>${Book.synopsis}</p>
                    <br>
                    <div class="modal__buttons">
                        <button class="btn btn-red btn-del">Delete Book</button>
                        <p class="hidden">${Book.title}</p>
                    </div>
                        
                </div>
            </div>
        </div>
    `;

    contentCard.innerHTML = template;
    return contentCard;
}

function toggleModal(e) {
    e.classList.toggle('modal-open');
}

function displayLibrary(filterText) {
  const allBooks = library.getAllBooks();
  const page = document.getElementById('content-section');
  const filteredBooks = allBooks.filter(e => {
    return e.title.includes(filterText);
  });

  console.log(filteredBooks.length);
  if(filteredBooks.length == 0) {
    page.innerHTML= "";
    for(book in allBooks) {
      let card = contentCard(allBooks[book]);
      page.appendChild(card);
    }
  }
  else {
    page.innerHTML="";
    for(book in filteredBooks) {
      let card = contentCard(filteredBooks[book]);
      page.appendChild(card);
    }
  }
  // if(filter.length == 0){
  //   for(book in allBooks) {
  //     let card = contentCard(allBooks[book]);
  //     page.appendChild(card);
  //   }
  // } 
}
displayLibrary();


