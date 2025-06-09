import fetchBooks from "./fetchBooks.js";

const fetchBooksOnLoad = async (fn) => {
  const books = await fetchBooks();

  if (!books) {
    return;
  }

  books.forEach(fn);
};

export default fetchBooksOnLoad;
