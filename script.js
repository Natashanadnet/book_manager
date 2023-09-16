"use strict";
const openModalBtn = document.querySelector("[data-open-modal]");
const submitModalBtn = document.querySelector("[data-submit-modal]");
const modal = document.querySelector("[data-modal]");
const closeModal = document.querySelector("[data-close-modal]");
const form = document.getElementById("new-book");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const pagesInput = document.getElementById("pages");
const readSlider = document.getElementById("read");
const tableBody = document.querySelector("tbody");
let isValid = true;
let books = [];
let id = 1;
const table = document.getElementById("bookTable");
//Errors
const pagesError = document.querySelector("[data-pages-error]");

checkToHide();

openModalBtn.addEventListener("click", () => {
  modal.showModal();
  pagesError.textContent = "";
});

//Form handling and validation:
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let pagesClean = pagesInput.value.replace(/[^0-9]/g, "");
  if (pagesClean.value === "0" || pagesClean.length > 4 || pagesClean === "") {
    isValid = false;
    pagesError.textContent = "*Book must have between 1 and 9.999 pages";
    pagesInput.setCustomValidity("Error");
  }
  if (isValid) {
    let title = titleCase(titleInput.value);
    let author = titleCase(authorInput.value);
    let pages = pagesInput.value.replace(/[^0-9]/g, "");
    let read = readSlider.checked === true ? true : false;
    let bookId = id;
    id++;
    let checked = read ? "checked" : "";
    books.push(new Book(title, author, pages, read, bookId));
    const html = `<tr data-id="${bookId}">
      <td>${title}</td>
      <td>${author}</td>
      <td>${pages}</td>
      <td>
        <div class="toggle toggle-table">
          <label class="switch">
            <input data-read-slider type="checkbox" ${checked}/>
            <span class="slider round"></span>
          </label>
        </div>
      </td>
      <td>
        <button class="delete-btn" type="button">Delete</button>
      </td>
    </tr>`;
    tableBody.insertAdjacentHTML("beforeend", html);
    resetModal();
  }
  checkToHide();
});

table.addEventListener("click", (e) => {
  let row = parseInt(e.target.closest("tr").getAttribute("data-id"));
  if (e.target.classList.contains("slider")) {
    books.forEach((book) => {
      if (book.id === row) {
        book.toggleRead();
      }
    });
  } else if (e.target.classList.contains("delete-btn")) {
    books = books.filter((book) => book.id !== row);
    document.querySelector(`[data-id="${row}"]`).remove();
    checkToHide();
  }
});

function resetModal() {
  modal.close();
  titleInput.value = "";
  authorInput.value = "";
  pagesInput.value = "";
  pagesError.value = "";
  readSlider.checked = false;
}

function titleCase(string) {
  string = string.replace(/\./g, ". ");
  let stringArray = string.split(" ").map((word) => {
    word = word.toLowerCase();
    let newWord = word[0].toUpperCase() + word.slice(1);
    return newWord;
  });
  return stringArray.join(" ");
}

closeModal.addEventListener("click", resetModal);

//closes the modal if user clicks outside of it's bound
modal.addEventListener("click", (e) => {
  const dialogDimensions = modal.getBoundingClientRect();
  if (
    e.clientX < dialogDimensions.left ||
    e.clientX > dialogDimensions.right ||
    e.clientY < dialogDimensions.top ||
    e.clientY > dialogDimensions.bottom
  ) {
    modal.close();
    resetModal();
  }
});

function checkToHide() {
  if (books.length === 0) {
    table.classList.add("hidden");
  } else {
    table.classList.remove("hidden");
  }
}

//creating the book object
const Book = function (title, author, pages, read, id) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.id = id;
};

Book.prototype.toggleRead = function () {
  this.read === true ? (this.read = false) : (this.read = true);
};
