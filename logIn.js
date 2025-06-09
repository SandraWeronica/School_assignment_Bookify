const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const changeToSignUp = document.getElementById("changeToSignUp");
const signUpForm = document.getElementById("signUpForm");

const toggleForm = () => {
	loginForm.classList.add("hidden");
	signUpForm.classList.toggle("hidden");
};

const handleLogin = async (e) => {
	try {
		e.preventDefault();

		const email = e.target.elements.email.value.trim();
		const password = e.target.elements.password.value.trim();

		const response = await fetch("http://localhost:3000/users", {
			method: "GET",
		});

		if (!response.ok) {
			throw new Error(
				"Ett fel uppstod, vänligen försök igen efter en kopp kaffe :)."
			);
		}

		const users = await response.json();
		const user = users.find(
			(user) => user.email === email && user.password === password
		);

		if (!user) {
			throw new Error("Fel email eller lösenord");
		}

		const saveUser = {
			name: user.name,
			email: user.email,
			id: user.id,
			role: user.role,
		};
		localStorage.setItem("user", JSON.stringify(saveUser));

		if (saveUser.role === "admin") {
			location.href = "./admin.html";
		}
		if (saveUser.role === "user") {
			location.href = "./user.html";
		}
	} catch (error) {
		message.textContent = error.message;
		console.error("An error occurred", error);
	}
};

const handleSignUp = async (e) => {
	try {
		e.preventDefault();
		const name = e.target.elements.name.value.trim();
		const email = e.target.elements.email.value.trim();
		const password = e.target.elements.password.value.trim();
		const confirmPassword = e.target.elements.confirmPassword.value.trim();

		if (await checkIfEmailExists(email)) {
			alert("Konto för denna email finns redan");
			throw new Error("Konto för denna email finns redan");
		}
		if (password !== confirmPassword) {
			alert("Lösenordet stämmer inte överens, vänligen försök igen.");
			return;
		}

		const response = await fetch("http://localhost:3000/users", {
			method: "POST",
			body: JSON.stringify({
				name: name,
				email: email,
				password: password,
				role: "user",
				borrowed: [],
				reserved: [],
				history: [],
			}),
			headers: {
				"Content-type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Något gick fel, försök igen");
		}
		alert("Ditt konto har skapats, välkommen in i Barbies värld!");
	} catch (error) {
		console.error("An error occurred", error);
	}
};

const checkIfEmailExists = async (newEmail) => {
	try {
		const response = await fetch("http://localhost:3000/users", {
			method: "GET",
		});

		if (!response.ok) {
			return;
		}

		const users = await response.json();
		const user = users.find((user) => user.email === newEmail);
		if (user) {
			return true;
		}
		return false;
	} catch {
		console.error("An error occurred", error);
	}
};
document.getElementById("logo").addEventListener("click", function () {
	window.location.href = "start-page.html";
});
loginForm.addEventListener("submit", handleLogin);
changeToSignUp.addEventListener("click", toggleForm);
signUpForm.addEventListener("submit", handleSignUp);
