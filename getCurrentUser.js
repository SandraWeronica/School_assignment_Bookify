const getCurrentUser = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const response = await fetch(`http://localhost:3000/users/${user.id}`);
  const userData = response.json();

  return userData;
};

export default getCurrentUser;
