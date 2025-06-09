const fetchBookById = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/books/${id}`);
    if (!response.ok) {
      throw new Error("Kunde inte hämta boken.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export default fetchBookById;
