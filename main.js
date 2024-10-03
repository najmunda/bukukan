let books = [];

function initialLoad() {
  // Called every page loaded
  if (typeof localStorage == 'object') {
    // Get book data or Init
    books = JSON.parse(localStorage.getItem('booksData')) || [];
    updateLocalStorage();
    updateUI();
    // Init/get dark-ui boolean and set button
    const isDark = JSON.parse(localStorage.getItem('dark-ui'));
    if (isDark == null) {
      localStorage.setItem('dark-ui', 'false');
    }
    handleDarkToggle(false);
  } else {
    alert("Local storage tidak tersedia pada browser yang anda pakai. Data buku anda tidak dapat disimpan.");
  }
}

function updateLocalStorage() {
  // Check for local storage
  if (typeof localStorage == 'object') {
    localStorage.setItem('booksData', JSON.stringify(books));
  } else {
    alert("Local storage tidak tersedia pada browser yang anda pakai. Data buku anda tidak dapat disimpan.");
  }
}

function handleDarkToggle(toggle=true) {
  let isDark = JSON.parse(localStorage.getItem('dark-ui'));
  // Change 'dark-ui' on localstorage
  if (toggle) {
    isDark = !isDark;
    localStorage.setItem('dark-ui', isDark);
  }
  // Set button icon & html dark class
  if (isDark) {
    document.getElementById('darkToggleButton').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>';
    document.getElementsByTagName("html")[0].classList.add('dark');
  } else {
    document.getElementById('darkToggleButton').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/></svg>';
    document.getElementsByTagName("html")[0].classList.remove('dark');
  }
}

function updateUI(booksShowed = books, searchString = "") {
  // Function to update UI, called every book added, edited, or deleted
  // Get shelves div
  const incompleteBookListDiv = document.getElementById('incompleteBookList');
  const completeBookListDiv = document.getElementById('completeBookList');
  // Reset shelves
  incompleteBookListDiv.innerHTML = "";
  completeBookListDiv.innerHTML = "";
  // Fill div with book element (to respective shelf)
  for (let book of booksShowed) {
    const bookDiv = document.createElement('div');
    bookDiv.setAttribute('data-bookid', book.id);
    bookDiv.setAttribute('data-testid', 'bookItem');
    bookDiv.classList.add('book-card')
    bookDiv.innerHTML = `
      <div class="book-card-cover">
        <img src="/public/book.svg" alt="">
      </div>
      <div class="book-card-body">
        <div class="book-card-buttons">
          <button name="isCompleteButton" data-testid="bookItemIsCompleteButton">
            ${book.isComplete ? 
              '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z"/></svg>' 
              : 
              '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>'
            }
          </button>
          <button name="deleteButton" data-testid="bookItemDeleteButton">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>  
          </button>
          <button name="editButton" data-testid="bookItemEditButton">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
          </button>
        </div>
        <div class="book-card-detail">
          <h3 data-testid="bookItemTitle">${book.title}</h3>
          <p data-testid="bookItemAuthor">${ book.author }</p>
          <p data-testid="bookItemYear">${book.year}</p>
        </div>
      </div>
    `;
    // Add handler to buttons
    bookDiv.querySelector(`button[name=isCompleteButton]`).onclick = (e) => handleIsCompleteBookButton(e, book.id);
    bookDiv.querySelector(`button[name=deleteButton]`).onclick = (e) => handleDeleteBookButton(e, book.id);
    bookDiv.querySelector(`button[name=editButton]`).onclick = (e) => handleEditBookButton(e, book.id);
    if (book.isComplete) {
      completeBookListDiv.append(bookDiv);
    } else {
      incompleteBookListDiv.append(bookDiv);
    }
  }
  if (incompleteBookListDiv.children.length == 0) {
    incompleteBookListDiv.innerHTML = `
      <div class="shelf-card-body-empty">
        ${searchString ? 
          `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-80q-83 0-141.5-58.5T80-280q0-83 58.5-141.5T280-480q83 0 141.5 58.5T480-280q0 83-58.5 141.5T280-80Zm544-40L568-376q-12-13-25.5-26.5T516-428q38-24 61-64t23-88q0-75-52.5-127.5T420-760q-75 0-127.5 52.5T240-580q0 6 .5 11.5T242-557q-18 2-39.5 8T164-535q-2-11-3-22t-1-23q0-109 75.5-184.5T420-840q109 0 184.5 75.5T680-580q0 43-13.5 81.5T629-428l251 252-56 56Zm-615-61 71-71 70 71 29-28-71-71 71-71-28-28-71 71-71-71-28 28 71 71-71 71 28 28Z"/></svg>
          <p>Buku tidak ditemukan.</p>`
        : 
          `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>
          <p>Belum ada buku yang ditambahkan.</p>`}
      </div>`;
  }
  if (completeBookListDiv.children.length == 0) {
    completeBookListDiv.innerHTML = `
      <div class="shelf-card-body-empty">
        ${searchString ? 
          `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-80q-83 0-141.5-58.5T80-280q0-83 58.5-141.5T280-480q83 0 141.5 58.5T480-280q0 83-58.5 141.5T280-80Zm544-40L568-376q-12-13-25.5-26.5T516-428q38-24 61-64t23-88q0-75-52.5-127.5T420-760q-75 0-127.5 52.5T240-580q0 6 .5 11.5T242-557q-18 2-39.5 8T164-535q-2-11-3-22t-1-23q0-109 75.5-184.5T420-840q109 0 184.5 75.5T680-580q0 43-13.5 81.5T629-428l251 252-56 56Zm-615-61 71-71 70 71 29-28-71-71 71-71-28-28-71 71-71-71-28 28 71 71-71 71 28 28Z"/></svg>
          <p>Buku tidak ditemukan.</p>` 
        : 
          `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>
          <p>Belum ada buku yang ditambahkan.</p>`}
      </div>`;
  }
}

function handleNewBookButton(event, bookId) {
  const formDialog = document.getElementById('bookFormDialog');
  document.getElementById('bookFormCancel').onclick = (e) => {
    e.preventDefault();
    formDialog.close();
  };
  formDialog.showModal();
};

function handleNewBookForm(event) {
  const formDialog = document.getElementById('bookFormDialog');
  const formElement = document.getElementById('bookForm');
  // Get Form Data
  const form = new FormData(formElement);
  // Convert & Unshift (for newest book showed first on shelf) book to array
  books.unshift({
    id: new Date().getTime().toString(),
    title: form.get('bookFormTitle'),
    author: form.get('bookFormAuthor'),
    year: Number.parseInt(form.get('bookFormYear')),
    isComplete: form.get('bookFormIsComplete') == "true" ? true : false,
  });
  updateLocalStorage();
  formElement.reset();
  updateUI();
  formDialog.close();
  event.preventDefault();
};

function handleIsCompleteBookButton(event, bookId) {
  // Get data, Change isComplete, and unshift (for edited book showed first on shelf) book
  const book = books.find(book => book.id == bookId);
  books = books.filter(book => book.id != bookId);
  book.isComplete = !book.isComplete;
  books.unshift(book);
  updateLocalStorage();
  updateUI();
  event.preventDefault();
};

function handleDeleteBookButton(event, bookId) {
  // Delete book from book array and localstorage
  books = books.filter(book => book.id != bookId);
  updateLocalStorage();
  updateUI();
  event.preventDefault();
};

function handleEditBookButton(event, bookId) {
  const book = books.find(book => book.id == bookId);
  const formDialog = document.getElementById('editBookFormDialog');
  document.getElementById('editBookFormCancel').onclick = (e) => {
    e.preventDefault();
    formDialog.close();
  };
  // Copy book detail to edit form
  const formElement = document.getElementById('editBookForm');
  formElement.querySelector('#editBookFormId').value = book.id;
  formElement.querySelector('#editBookFormTitle').value = book.title;
  formElement.querySelector('#editBookFormAuthor').value = book.author;
  formElement.querySelector('#editBookFormYear').value = book.year;
  formElement.querySelector('#editBookFormIsComplete').checked = book.isComplete;
  formDialog.showModal();
};

function handleEditBookForm(event) {
  // Get Form element
  const formDialog = document.getElementById('editBookFormDialog');
  const formElement = document.getElementById('editBookForm');
  // Get Form Data
  const form = new FormData(formElement);
  const bookId = form.get('editBookFormId');
  // Edit book data on array
  books = books.map(book => book.id == bookId ? 
    {
      ...book,
      title: form.get('editBookFormTitle'),
      author: form.get('editBookFormAuthor'),
      year: Number.parseInt(form.get('editBookFormYear')),
      isComplete: form.get('editBookFormIsComplete') == "true" ? true : false,
    } : book
  );
  updateLocalStorage();
  formElement.reset();
  updateUI();
  formDialog.close();
  event.preventDefault();
}

function handleSearchForm(event) {
  // Get Form element
  const formElement = document.getElementById('searchBook');
  // Get Search string and normalize
  const form = new FormData(formElement);
  const searchString = form.get('searchBookTitle').trim().toLowerCase();
  // Make new array with books filtered if title != inputted search
  const searchedBooks = books.filter(book => book.title.toLowerCase().includes(searchString));
  // Update UI with copied array instead books
  updateUI(searchedBooks, searchString);
  event.preventDefault();
}

// Set form year max value
document.getElementById('bookFormYear').setAttribute('max', (new Date()).getFullYear());
document.getElementById('editBookFormYear').setAttribute('max', (new Date()).getFullYear());

// Add click listener to dark toggle button
document.getElementById('darkToggleButton').onclick = handleDarkToggle;

// Change form onsubmit function
document.getElementById('bookFormButton').onclick = handleNewBookButton;
document.getElementById('bookForm').onsubmit = handleNewBookForm;
document.getElementById('editBookForm').onsubmit = handleEditBookForm;
document.getElementById('searchBook').onsubmit = handleSearchForm;

// Check for localstorage and update UI from saved data
initialLoad();

