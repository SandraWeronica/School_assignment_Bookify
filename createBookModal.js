const modalPic = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalAuthor = document.getElementById("modal-author");
const modalGenre = document.getElementById("modal-genre");
const modalPages = document.getElementById("modal-length");
const modalDescript = document.getElementById("modal-story");
const modalStatus = document.getElementById("modal-status");
const reviewSec = document.getElementById("reviews");

const createBookModal = (book) => {
  modalPic.src = `${book.image}`;
  modalTitle.textContent = book.title;
  modalAuthor.textContent = `Författare: ${book.author}`;
  modalGenre.textContent = `Genre: ${book.genre}`;
  modalPages.textContent = `Längd: ${book.pages} sidor`;
  modalDescript.textContent = book.description;
  modalStatus.style.fontStyle = "italic";
  if (book.status === "borrowed") {
    bookStatusBtn.textContent = "Reservera bok";
  } else if (book.status === "available") {
    bookStatusBtn.textContent = "Låna bok";
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
};

export default createBookModal;
