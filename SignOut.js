const logStatus = document.getElementById('logStatus');
const user = JSON.parse(localStorage.getItem('user'));
if (user) {
  logStatus.textContent = 'Logga ut';
  const signOut = () => {
    localStorage.clear();
    {
      alert('Du är nu utloggad, välkommen åter!');
      location.href = './start-page.html';
    }
  };

  logStatus.addEventListener('click', signOut);
} else {
  logStatus.textContent = 'Logga in';
  {
    location.href = './login.html';
  }
}
