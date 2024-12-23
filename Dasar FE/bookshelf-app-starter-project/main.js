document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "BOOKSHELF_APP";

  const bookForm = document.getElementById("bookForm");
  const searchBookForm = document.getElementById("searchBook");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  const books = [];

  const saveBooksToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  };

  const loadBooksFromStorage = () => {
    const savedBooks = localStorage.getItem(STORAGE_KEY);
    if (savedBooks) {
      books.push(...JSON.parse(savedBooks));
      renderBooks();
    }
  };

  const createBookElement = (book) => {
    const bookElement = document.createElement("div");
    bookElement.setAttribute("data-bookid", book.id);
    bookElement.setAttribute("data-testid", "bookItem");

    bookElement.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">${
          book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"
        }</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
      </div>
    `;

    const completeButton = bookElement.querySelector(
      '[data-testid="bookItemIsCompleteButton"]'
    );
    const deleteButton = bookElement.querySelector(
      '[data-testid="bookItemDeleteButton"]'
    );

    completeButton.addEventListener("click", () =>
      toggleBookCompletion(book.id)
    );
    deleteButton.addEventListener("click", () => deleteBook(book.id));

    return bookElement;
  };

  const renderBooks = () => {
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    books.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
  };

  const addBook = (title, author, year, isComplete) => {
    const id = Date.now().toString();
    books.push({ id, title, author, year: Number(year), isComplete });
    saveBooksToStorage();
    renderBooks();
  };

  const deleteBook = (id) => {
    const bookIndex = books.findIndex((book) => book.id === id);
    if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      saveBooksToStorage();
      renderBooks();
    }
  };

  const toggleBookCompletion = (id) => {
    const book = books.find((book) => book.id === id);
    if (book) {
      book.isComplete = !book.isComplete;
      saveBooksToStorage();
      renderBooks();
    }
  };

  bookForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = document.getElementById("bookFormYear").value;
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    addBook(title, author, year, isComplete);
    bookForm.reset();
  });

  searchBookForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const searchTitle = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    renderBooks();

    if (searchTitle) {
      const allBooks = [
        ...incompleteBookList.children,
        ...completeBookList.children,
      ];
      allBooks.forEach((bookElement) => {
        const title = bookElement
          .querySelector('[data-testid="bookItemTitle"]')
          .textContent.toLowerCase();
        if (!title.includes(searchTitle)) {
          bookElement.style.display = "none";
        }
      });
    }
  });

  loadBooksFromStorage();
});
