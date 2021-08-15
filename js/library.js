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
          return searchResults;
      }
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
              delete bookCollection[i];
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

  exports = library;