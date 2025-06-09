import fetchBookById from "./fetchBookById.js";
import addBookToTable from "./addBookToTable.js";
import fetchBooksOnLoad from "./fetchBooksOnLoad.js";

const bookList = document.getElementById("book-list");

const errorMessage = document.getElementById("error-message");

const openAddBookModalButton = document.getElementById("open-add-book-modal");
const closeAddBookModalButton = document.getElementById("close-add-book-modal");
const addBookModal = document.getElementById("add-book-modal");
const addBookForm = document.getElementById("add-book-form");
const addBookButton = document.getElementById("add-book-btn");

const bookInformationModal = document.getElementById("book-information-modal");
const modalBook = document.getElementById("book-information");
const modalPic = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalAuthor = document.getElementById("modal-author");
const modalGenre = document.getElementById("modal-genre");
const modalPages = document.getElementById("modal-length");
const modalDescript = document.getElementById("modal-story");

const editBookForm = document.getElementById("edit-book-form");
const editBookButtons = document.getElementById("edit-book-buttons");

const toggleEditMode = (isEditing, book = null) => {
	if (!isEditing) {
		editBookForm.reset();
		editBookForm.style.display = "none";
		modalBook.style.display = "flex";
		editBookButtons.style.display = "flex";
		bookInformationModal.style.backgroundColor = "";
		return;
	}

	if (book) {
		const formElements = editBookForm.elements;
		formElements.title.value = book.title;
		formElements.author.value = book.author;
		formElements.genre.value = book.genre;
		formElements.pages.value = book.pages;
		formElements.image.value = book.image;
		formElements.description.value = book.description;
	}

	editBookForm.style.display = "flex";
	modalBook.style.display = "none";
	bookInformationModal.style.backgroundColor = "#ffd7ef";
	editBookButtons.style.display = "none";
};

const toggleErrorMessage = (isError, message) => {
	if (isError) {
		errorMessage.textContent = message;
		errorMessage.style.display = "block";
		bookList.style.display = "none";
	} else {
		errorMessage.textContent = "";
		errorMessage.style.display = "none";
		bookList.style.display = "block";
	}
};

const addBookToDB = async (book) => {
	try {
		const response = await fetch("http://localhost:3000/books", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(book),
		});

		if (!response.ok) {
			throw new Error("Kunde inte lägga till boken.");
		}

		const newBook = await response.json();
		return newBook;
	} catch (error) {
		console.error("Något gick fel", error);
		toggleErrorMessage(true, error.message);
	}
};

const updateBookInDB = async (id, updatedBook) => {
	try {
		await fetch(`http://localhost:3000/books/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(updatedBook),
		});
	} catch (error) {
		console.error("Kunde inte uppdatera boken:", error);
		toggleErrorMessage(true, error.message);
	}
};

const deleteBookFromDB = async () => {
	const bookId = localStorage.getItem("bookId");
	try {
		await fetch(`http://localhost:3000/books/${bookId}`, { method: "DELETE" });
		localStorage.removeItem("bookId");
		bookInformationModal.close();
	} catch (error) {
		console.error("Kunde inte radera boken:", error);
		toggleErrorMessage(true, error.message);
	}
};

const validateForm = (form) => {
	const { title, author, genre, pages, image, description } = form.elements;
	return [title, author, genre, pages, image, description].every((input) =>
		input.value.trim()
	);
};

const handleAddBook = async (e) => {
	e.preventDefault();

	if (!validateForm(e.target)) {
		return;
	}

	const title = e.target.elements.title.value.trim();
	const author = e.target.elements.author.value.trim();
	const genre = e.target.elements.genre.value.trim();
	const pages = e.target.elements.pages.value.trim();
	const image = e.target.elements.image.value.trim();
	const description = e.target.elements.description.value.trim();

	const book = { title, author, genre, pages, image, description };
	const newBook = await addBookToDB(book);

	addBookToTable(newBook);
	addBookForm.reset();
	toggleErrorMessage(false);
	addBookButton.disabled = true;
};

const handleBookListClick = async (e) => {
	const target = e.target.closest("tr");
	if (target.classList.contains("book-row")) {
		const book = target;
		const bookData = await fetchBookById(book.dataset.id);
		localStorage.setItem("bookId", bookData.id);

		modalPic.src = bookData.image;
		modalTitle.textContent = bookData.title;
		modalAuthor.textContent = `Författare: ${bookData.author}`;
		modalGenre.textContent = `Genre: ${bookData.genre}`;
		modalPages.textContent = `Antal sidor: ${bookData.pages}`;
		modalDescript.textContent = bookData.description;

		bookInformationModal.showModal();
	}
};

const resetModalState = () => {
	[
		modalPic,
		modalTitle,
		modalAuthor,
		modalGenre,
		modalPages,
		modalDescript,
	].forEach((element) => {
		element.textContent = "";
	});
	modalPic.src = "";
	toggleEditMode(false);
	localStorage.removeItem("bookId");
};

const handleBookInformationModalClick = (e) => {
	if (e.target.id === "close-modal" || e.target === bookInformationModal) {
		bookInformationModal.close();
		resetModalState();
		toggleEditMode(false);
	}
	if (e.target.classList.contains("edit-book-button")) {
		handleEditBook();
	}
	if (e.target.classList.contains("delete-book-button")) {
		deleteBookFromDB();
	}
	if (e.target.classList.contains("close-edit-book-modal")) {
		toggleEditMode(false);
	}
};

const handleEditBook = async () => {
	const bookId = localStorage.getItem("bookId");
	const book = await fetchBookById(bookId);
	toggleEditMode(true, book);
};

const handleSaveUpdateBook = async (e) => {
	e.preventDefault();
	const bookId = localStorage.getItem("bookId");

	const updatedBook = {
		title: e.target.elements.title.value.trim(),
		author: e.target.elements.author.value.trim(),
		genre: e.target.elements.genre.value.trim(),
		pages: e.target.elements.pages.value.trim(),
		image: e.target.elements.image.value.trim(),
		description: e.target.elements.description.value.trim(),
	};

	await updateBookInDB(bookId, updatedBook);
	toggleEditMode(false);
	localStorage.removeItem("bookId");
	bookInformationModal.close();
};

bookList.addEventListener("click", handleBookListClick);
addBookForm.addEventListener("input", () => {
	const isFormValid = validateForm(addBookForm);
	addBookButton.disabled = !isFormValid;
});
addBookForm.addEventListener("submit", handleAddBook);
openAddBookModalButton.addEventListener("click", () => {
	addBookModal.showModal();
});
closeAddBookModalButton.addEventListener("click", () => {
	addBookForm.reset();
	addBookModal.close();
});
bookInformationModal.addEventListener("click", handleBookInformationModalClick);
editBookForm.addEventListener("submit", handleSaveUpdateBook);

fetchBooksOnLoad(addBookToTable);
