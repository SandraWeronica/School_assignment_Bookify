import fetchBookById from "./fetchBookById.js";
import createElement from "./createElement.js";
import fetchBooksOnLoad from "./fetchBooksOnLoad.js";
import addBookToTable from "./addBookToTable.js";
import getCurrentUser from "./getCurrentUser.js";
import createBookModal from "./createBookModal.js";
import fetchBooks from "./fetchBooks.js";
const bookContainer = document.querySelector(".books-container");

const bookModal = document.getElementById("modal");
const filter = document.getElementById("filter-from-all");
const addReveiwForm = document.getElementById("review-form");

const toggleAddReview = (isEditing) => {
  if (!isEditing) {
    addReveiwForm.reset();
    addReveiwForm.style.display = "none";
    return;
  }
  addReveiwForm.style.display = "flex";
};

const bookClick = (event) => {
  const eventTarget = event.target;
  const book = eventTarget.closest("figure");
  if (book.classList.contains("bookPic")) {
    showBookModal(event);
  }
};

const addBookToList = (book) => {
  const bookFig = createElement("figure", "bookPic");
  bookFig.dataset.id = book.id;
  const bookImg = createElement("img", "pic", null, book.image);
  const bookTitle = createElement("figcaption");
  const titleP = createElement("p", "titleP", book.title);
  const authorP = createElement("p", "authorP", book.author);
  bookTitle.append(titleP, authorP);
  bookFig.append(bookImg, bookTitle);
  bookContainer.appendChild(bookFig);
  return bookFig;
};

const getHistory = async () => {
  const user = await getCurrentUser();
  try {
    const response = await fetch(`http://localhost:3000/users/${user.id}`);
    const data = await response.json();
    return data.history;
  } catch (error) {
    console.error(error);
  }
};

const fetchHistoryOnLoad = async () => {
  const history = await getHistory();
  history.forEach((book) => {
    addBookToTable(book);
  });
};

const showBookModal = async (event) => {
  const targetId = event.target.closest("figure").dataset.id;
  const bookData = await fetchBookById(targetId);
  localStorage.setItem("currentBookId", targetId);
  createBookModal(bookData);
  bookModal.showModal();
};

const handleModalClick = async (e) => {
  const target = e.target;
  if (target.classList.contains("close-modal")) {
    toggleAddReview(false);
    bookModal.close();
  }
  if (target.classList.contains("loanStatusBtn")) {
    await handleLoan();
  }
  if (target.classList.contains("add-review-button")) {
    toggleAddReview(true);
  }
};

const handleLoan = async () => {
  const targetId = localStorage.getItem("currentBookId");
  const bookData = await fetchBookById(targetId);
  if (bookData.status === "borrowed") {
    await reserveBook(bookData.id);
  } else if (bookData.status === "available") {
    await borrowBook(bookData.id);
  }
};

const borrowBook = async (id) => {
  try {
    await fetch(`http://localhost:3000/books/${id}`, {
      method: "PATCH",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ status: "borrowed" }),
    });

    const user = await getCurrentUser();
    await updateBookStatus(user, id);
    alert("Boken är lånad, du hittar den i listan över lånade böcker.");
  } catch (error) {
    console.error(error);
  }
};

const reserveBook = async (id) => {
  const user = await getCurrentUser();
  const reservedBooks = user.reserved;
  const bookData = await fetchBookById(id);
  try {
    await fetch(`http://localhost:3000/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ reserved: [...reservedBooks, bookData] }),
    });
    alert(
      "Boken är reserverad, du hittar den i listan över reserverade böcker."
    );
  } catch (error) {
    console.error(error);
  }
};

const updateBookStatus = async (user, bookId) => {
  const bookData = await fetchBookById(bookId);
  try {
    await fetch(`http://localhost:3000/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        borrowed: [...user.borrowed, bookData],
        history: [...user.history, bookData],
      }),
    });
  } catch (error) {
    console.error(error);
  }
};

const handleAddReview = async (e) => {
  e.preventDefault();
  const bookId = localStorage.getItem("currentBookId");
  const book = await fetchBookById(bookId);
  const user = await getCurrentUser();
  const reveiws = book.reveiws;

  const review = {
    user: user.name,
    rating: e.target.elements.rating.value,
    body: e.target.elements.review.value,
  };

  try {
    await fetch(`http://localhost:3000/books/${bookId}`, {
      method: "PATCH",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ reveiws: [...reveiws, review] }),
    });
    toggleAddReview(false);
  } catch (error) {
    console.error(error);
  }
};

const filterAvailable = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/books?status=available"
    );
    if (!response.ok) {
      throw new Error("Kunde inte hämta böcker.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

const filterLoaned = async () => {
  try {
    const response = await fetch("http://localhost:3000/books?status=borrowed");
    if (!response.ok) {
      throw new Error("Kunde inte hämta böcker.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};
const filterBooks = async (e) => {
  const target = e.target.value;
  const title = document.getElementById("title");
  if (bookContainer.childNodes) {
    while (bookContainer.lastElementChild) {
      bookContainer.removeChild(bookContainer.lastElementChild);
    }
  }
  const user = await getCurrentUser();
  const userReserved = user.reserved;
  const userBorrowed = user.borrowed;

  switch (target) {
    case "filter-available":
      title.textContent = "Tillgängliga böcker";
      const avalibleBooks = await filterAvailable();
      avalibleBooks.forEach(addBookToList);
      break;
    case "filter-loaned":
      title.textContent = "Utlånade böcker";
      const loanedBooks = await filterLoaned();
      loanedBooks.forEach(addBookToList);
      break;
    case "filter-saved":
      title.textContent = "Mina sparade böcker";
      userReserved.forEach((book) => addBookToList(book));
      userBorrowed.forEach((book) => addBookToList(book));
      break;
    case "filter-user-loan":
      title.textContent = "Mina lånade böcker";
      userBorrowed.forEach((book) => addBookToList(book));
      break;
    case "filter-user-reserv":
      title.textContent = "Mina reserverade böcker";
      userReserved.forEach((book) => addBookToList(book));
      break;
    default:
      title.textContent = "Alla böcker";
      const books = await fetchBooks();
      books.forEach(addBookToList);
      break;
  }
};

bookContainer.addEventListener("click", bookClick);
bookModal.addEventListener("click", handleModalClick);
addReveiwForm.addEventListener("submit", handleAddReview);
filter.addEventListener("change", filterBooks);
fetchBooksOnLoad(addBookToList);
fetchHistoryOnLoad();
