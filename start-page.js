const bookSection = document.getElementById("bookSection");
const closeModalBtn = document.getElementById("close-modal");
const bookModal = document.getElementById("modal");
const modalPic = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalAuthor = document.getElementById("modal-author");
const modalList = document.getElementById("modal-list");
const modalGenre = document.getElementById("modal-genre");
const modalPages = document.getElementById("modal-length");
const modalDescript = document.getElementById("modal-story");
const loanBtn = document.getElementById("loan-btn");
const modalStatus = document.getElementById("modal-status");
const reviewSec = document.getElementById("reviews");

function bookClick(event) {
	const eventTarget = event.target;
	if (eventTarget.classList.contains("close-modal")) {
		bookModal.close();
	} else if (eventTarget.closest("figure").classList.contains("bookPic")) {
		showBookMod(event);
	}
}
const fetchBooks = async () => {
	try {
		const response = await fetch("http://localhost:3000/books");
		if (!response.ok) {
			throw new Error("Något blev fel med att hämta från servern");
		}
		const bookData = await response.json();
		return bookData;
	} catch (error) {
		console.error(error);
	}
};
const showBooks = async () => {
	try {
		const bookData = await fetchBooks();
		await bookData.forEach((book) => {
			createCards(book);
		});
	} catch (error) {
		console.error("Något blev fel med att hämta böckerna", error);
	}
};
function createCards(book) {
	const bookFig = document.createElement("figure");
	const bookImg = document.createElement("img");
	bookImg.src = `${book.image}`;
	bookImg.classList.add("pic");
	const bookTitle = document.createElement("figcaption");
	const titleP = document.createElement("p");
	const authorP = document.createElement("p");
	titleP.textContent = book.title;
	titleP.classList.add("titleP");
	authorP.textContent = book.author;
	authorP.classList.add("authorP");
	bookFig.dataset.id = book.id;
	bookFig.classList.add("bookPic");
	if (book.status === "borrowed") {
		loanBtn.textContent = "Reservera bok";
	} else if (book.status === "available") {
		loanBtn.textContent = "Låna bok";
	}
	bookTitle.appendChild(titleP);
	bookTitle.appendChild(authorP);
	bookFig.appendChild(bookImg);
	bookFig.appendChild(bookTitle);
	bookSection.appendChild(bookFig);
}

function createBookMod(book) {
	modalPic.src = `${book.image}`;
	modalTitle.textContent = book.title;
	modalAuthor.textContent = `Författare: ${book.author}`;
	modalGenre.textContent = `Genre: ${book.genre}`;
	modalPages.textContent = `Längd: ${book.pages} sidor`;
	modalDescript.textContent = book.description;
	modalStatus.style.fontStyle = "italic";
	if (book.status === "borrowed") {
		modalStatus.textContent = "Utlånad för tillfället";
		loanBtn.textContent = "Logga in för att reservera";
	} else if (book.status === "available") {
		modalStatus.textContent = "Tillgänglig för utlåning";
		loanBtn.textContent = "Logga in för att låna";
	}
	if (book.reveiws.length === 0) {
		const noReview = document.createElement("p");
		noReview.textContent = "Inga recensioner än";
		noReview.style.fontStyle = "italic";
		reviewSec.appendChild(noReview);
	} else if (book.reveiws.length > 0 && book.reveiws.length < 4) {
		if (reviewSec.childNodes) {
			while (reviewSec.lastElementChild) {
				reviewSec.removeChild(reviewSec.lastElementChild);
			}
		}
		book.reveiws.forEach((rev) => {
			const reviewCard = document.createElement("article");
			reviewCard.classList.add("rev-card");
			const ratingP = document.createElement("p");
			for (let i = 0; i < rev.rating; i++) {
				ratingP.textContent += "♥";
			}

			const review = document.createElement("p");
			review.textContent = rev.body;

			const revName = document.createElement("p");
			revName.textContent = rev.user;

			reviewCard.appendChild(revName);
			reviewCard.appendChild(ratingP);
			reviewCard.appendChild(review);
			reviewSec.appendChild(reviewCard);
		});
	} else if (book.reveiws.length > 3) {
		if (reviewSec.childNodes) {
			while (reviewSec.lastElementChild) {
				reviewSec.removeChild(reviewSec.lastElementChild);
			}
		}
		const backBtn = document.createElement("button");
		backBtn.textContent = "➺";
		backBtn.style.rotate = "180deg";
		backBtn.classList.add("back-btn");
		reviewSec.appendChild(backBtn);
		book.reveiws.forEach((rev, index) => {
			if (index < 3) {
				const reviewCard = document.createElement("article");
				reviewCard.classList.add("rev-card");
				const ratingP = document.createElement("p");
				for (let i = 0; i < rev.rating; i++) {
					ratingP.textContent += "♥";
				}

				const review = document.createElement("p");
				review.textContent = rev.body;

				const revName = document.createElement("p");
				revName.textContent = rev.user;

				reviewCard.appendChild(revName);
				reviewCard.appendChild(ratingP);
				reviewCard.appendChild(review);
				reviewSec.appendChild(reviewCard);
			}
		});
		const forwardBtn = document.createElement("button");
		forwardBtn.textContent = "➺";
		forwardBtn.classList.add("forward-btn");
		reviewSec.appendChild(forwardBtn);
	}
}

const showBookMod = async (event) => {
	console.clear();
	const targetId = event.target.closest("figure").dataset.id;
	const bookData = await fetchSingleBook(targetId);
	createBookMod(bookData);
	bookModal.showModal();
};
const fetchSingleBook = async (targetId) => {
	try {
		const url = `http://localhost:3000/books/${targetId}`;
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error("Något gick fel med att hämta boken");
		}

		const bookData = await response.json();
		return bookData;
	} catch (error) {
		console.error(error);
	}
};

closeModalBtn.addEventListener("click", bookClick);
bookSection.addEventListener("click", bookClick);

showBooks();
bookModal.close();
