let books = [];

function initialLoad() {
  if (typeof localStorage == 'object') {
    books = JSON.parse(localStorage.getItem('booksData')) || [];
    updateLocalStorage();
    updateUI();
  } else {
    alert("Local storage tidak tersedia pada browser yang anda pakai. Data buku anda tidak dapat disimpan.");
  }
}

function updateLocalStorage() {
  if (typeof localStorage == 'object') {
    localStorage.setItem('booksData', JSON.stringify(books));
  } else {
    alert("Local storage tidak tersedia pada browser yang anda pakai. Data buku anda tidak dapat disimpan.");
  }
}

function updateUI(booksShowed = books) {
  // Get shelves div
  const incompleteBookListDiv = document.getElementById('incompleteBookList');
  const completeBookListDiv = document.getElementById('completeBookList');
  // Reset shelves
  incompleteBookListDiv.innerHTML = "";
  completeBookListDiv.innerHTML = "";
  // Fill div with book (to respective shelf)
  for (let book of booksShowed) {
    const bookDiv = document.createElement('div');
    bookDiv.setAttribute('data-bookid', book.id);
    bookDiv.setAttribute('data-testid', 'bookItem');
    bookDiv.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${ book.author }</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button name="isCompleteButton" data-testid="bookItemIsCompleteButton">${book.isComplete ? 'Belum' : 'Selesai'} dibaca</button>
        <button name="deleteButton" data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button name="editButton"  data-testid="bookItemEditButton">Edit Buku</button>
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
    incompleteBookListDiv.innerHTML = "<p>Belum ada buku yang ditambahkan.</p>";
  }
  if (completeBookListDiv.children.length == 0) {
    completeBookListDiv.innerHTML = "<p>Belum ada buku yang selesai dibaca.</p>";
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
  // Delete book
  books = books.filter(book => book.id != bookId);
  updateLocalStorage();
  updateUI();
  event.preventDefault();
};

function handleEditBookButton(event, bookId) {
  const book = books.find(book => book.id == bookId);
  const formDialog = document.getElementById('editBookForm');
  formDialog.querySelector('#editBookFormId').value = book.id;
  formDialog.querySelector('#editBookFormTitle').value = book.title;
  formDialog.querySelector('#editBookFormAuthor').value = book.author;
  formDialog.querySelector('#editBookFormYear').value = book.year;
  formDialog.querySelector('#editBookFormIsComplete').checked = book.isComplete;
  document.getElementById('editBookFormDialog').showModal();
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
  updateUI(searchedBooks);
  event.preventDefault();
}

// Change form onsubmit function
document.getElementById('bookFormButton').onclick = handleNewBookButton;
document.getElementById('bookForm').onsubmit = handleNewBookForm;
document.getElementById('editBookForm').onsubmit = handleEditBookForm;
document.getElementById('searchBook').onsubmit = handleSearchForm;

// Check for localstorage and update UI from saved data
initialLoad();

