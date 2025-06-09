const fetchBooks = async () => {
  try {
    const response = await fetch("http://localhost:3000/books");
    if (!response.ok) {
      throw new Error("Kunde inte hämta böcker.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export default fetchBooks;
