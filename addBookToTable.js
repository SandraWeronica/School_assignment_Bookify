import createElement from "./createElement.js";
const tableBody = document.getElementById("table-body");

const addBookToTable = (book) => {
  const row = createElement("tr", "book-row");
  row.dataset.id = book.id;
  const tdImg = createElement("td", "table-img");
  const image = createElement("img", null, null, book.image);
  tdImg.appendChild(image);
  const title = createElement("td", null, book.title);
  const author = createElement("td", null, book.author);
  const genre = createElement("td", null, book.genre);
  const pages = createElement("td", null, book.pages);
  const description = createElement(
    "td",
    null,
    `Beskrivning: ${book.description}`
  );
  row.append(tdImg, title, author, genre, pages, description);
  tableBody.appendChild(row);
};

export default addBookToTable;
