class Book {
    constructor(title, author, isbn) {
      this.title = title;
      this.author = author;
      this.isbn = isbn;
    }
  }
  
  class UI {
    static displayBooks() {
      const books = Store.getBooks();
      books.forEach((book) => UI.addBookToList(book));
    }
  
    static addBookToList(book) {
      const list = document.querySelector("#book-list");
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td>
          <button class="btn btn-primary btn-sm edit-button"><i class="fas fa-pencil"></i></button>
          <button class="btn btn-success btn-sm save-button d-none"><i class="fas fa-floppy-disk"></i></button>
          <button class="btn btn-danger btn-sm delete-button"><i class="fas fa-trash"></i></button>
        </td>
      `;
      list.appendChild(row);
    }
  
    static showAlert(message, className) {
      const div = document.createElement("div");
      div.className = `alert alert-${className}`;
      div.appendChild(document.createTextNode(message));
      const container = document.querySelector(".container");
      const form = document.querySelector("#book-form");
      container.insertBefore(div, form);
      setTimeout(() => document.querySelector(".alert").remove(), 3000);
    }
  
    static editBook(targetElement) {
      const row = targetElement.closest("tr");
      const titleCell = row.cells[0];
      const authorCell = row.cells[1];
  
      const titleInput = document.createElement("input");
      titleInput.type = "text";
      titleInput.value = titleCell.textContent;
  
      const authorInput = document.createElement("input");
      authorInput.type = "text";
      authorInput.value = authorCell.textContent;
  
      titleCell.textContent = "";
      authorCell.textContent = "";
  
      titleCell.appendChild(titleInput);
      authorCell.appendChild(authorInput);
  
      titleInput.focus();
  
      targetElement.classList.add("d-none");
      targetElement.nextElementSibling.classList.remove("d-none");
    }
  
    static saveBook(targetElement) {
      const row = targetElement.closest("tr");
      const titleInput = row.cells[0].querySelector("input");
      const authorInput = row.cells[1].querySelector("input");
  
      const updatedTitle = titleInput.value;
      const updatedAuthor = authorInput.value;
      const isbn = row.cells[2].textContent;
  
      row.cells[0].textContent = updatedTitle;
      row.cells[1].textContent = updatedAuthor;
  
      targetElement.classList.add("d-none");
      targetElement.previousElementSibling.classList.remove("d-none");
  
      const book = new Book(updatedTitle, updatedAuthor, isbn);
      Store.updateBook(book);
  
      UI.showAlert("Book successfully edited", "success");
    }
  
    static deleteBook(targetElement) {
      if (targetElement.classList.contains("delete-button")) {
        targetElement.closest("tr").remove();
      }
    }
  
    static clearFields() {
      document.querySelector("#title").value = "";
      document.querySelector("#author").value = "";
      document.querySelector("#isbn").value = "";
    }
  
    static searchBooks() {
      const searchBar = document.querySelector("#search-bar");
      const searchValue = searchBar.value.toLowerCase();
      const bookRows = document.querySelectorAll("#book-list tr");
  
      bookRows.forEach((row) => {
        const title = row.cells[0].textContent.toLowerCase();
        const author = row.cells[1].textContent.toLowerCase();
        const isbn = row.cells[2].textContent.toLowerCase();
  
        if (
          title.includes(searchValue) ||
          author.includes(searchValue) ||
          isbn.includes(searchValue)
        ) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    }
  }
  
  class Store {
    static getBooks() {
      let books;
      if (localStorage.getItem("books") === null) {
        books = [];
      } else {
        books = JSON.parse(localStorage.getItem("books"));
      }
      return books;
    }
  
    static addBook(book) {
      const books = Store.getBooks();
      books.push(book);
      localStorage.setItem("books", JSON.stringify(books));
    }
  
    static updateBook(updatedBook) {
      const books = Store.getBooks();
      const index = books.findIndex((book) => book.isbn === updatedBook.isbn);
      if (index !== -1) {
        books[index] = updatedBook;
        localStorage.setItem("books", JSON.stringify(books));
      }
    }
  
    static removeBook(isbn) {
      const books = Store.getBooks();
      const index = books.findIndex((book) => book.isbn === isbn);
      if (index !== -1) {
        books.splice(index, 1);
        localStorage.setItem("books", JSON.stringify(books));
      }
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    UI.displayBooks();
    document.querySelector("#search-bar").addEventListener("input", UI.searchBooks);
  });
  
  document.querySelector("#book-form").addEventListener("submit", (e) => {
    e.preventDefault();
  
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;
  
    if (title === "" || author === "" || isbn === "") {
      UI.showAlert("Please fill out all the fields before submitting", "danger");
    } else {
      const book = new Book(title, author, isbn);
  
      UI.addBookToList(book);
  
      Store.addBook(book);
  
      UI.showAlert("Book added successfully", "success");
  
      UI.clearFields();
    }
  });
  
  document.querySelector("#book-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-button")) {
      UI.editBook(e.target);
    } else if (e.target.classList.contains("save-button")) {
      UI.saveBook(e.target);
    } else if (e.target.classList.contains("delete-button")) {
      UI.deleteBook(e.target);
  
      const isbn = e.target.closest("tr").cells[2].textContent;
      Store.removeBook(isbn);
  
      UI.showAlert("Book successfully removed", "success");
    }
  });