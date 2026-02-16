const STORAGE_KEY = "digital-auth-user";
const SESSION_KEY = "digital-auth-session";

function getUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function setSession(email) {
  localStorage.setItem(SESSION_KEY, email);
}

function getSession() {
  return localStorage.getItem(SESSION_KEY);
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function showMessage(el, text, type) {
  el.textContent = text;
  el.className = `message ${type}`;
}

function registerHandler() {
  const form = document.getElementById("register-form");
  if (!form) return;

  const msg = document.getElementById("register-message");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    if (!name || !email || !password) {
      showMessage(msg, "Please fill all fields.", "error");
      return;
    }

    const users = getUsers();
    if (users.some((u) => u.email === email)) {
      showMessage(msg, "User already exists. Please login.", "error");
      return;
    }

    users.push({ name, email, password });
    saveUsers(users);
    showMessage(msg, "Registration successful! Redirecting to login...", "success");

    setTimeout(() => {
      window.location.href = "login.html";
    }, 900);
  });
}

function loginHandler() {
  const form = document.getElementById("login-form");
  if (!form) return;

  const msg = document.getElementById("login-message");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const users = getUsers();

    const match = users.find((u) => u.email === email && u.password === password);
    if (!match) {
      showMessage(msg, "Invalid email or password.", "error");
      return;
    }

    setSession(match.email);
    showMessage(msg, "Login successful! Redirecting...", "success");
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 700);
  });
}

function dashboardHandler() {
  const loggedInEmail = getSession();
  if (!loggedInEmail) {
    window.location.href = "login.html";
    return;
  }

  const users = getUsers();
  const currentUser = users.find((u) => u.email === loggedInEmail);
  if (!currentUser) {
    clearSession();
    window.location.href = "login.html";
    return;
  }

  const userName = document.getElementById("user-name");
  if (userName) userName.textContent = currentUser.name;

  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearSession();
      window.location.href = "login.html";
    });
  }
}

registerHandler();
loginHandler();
dashboardHandler();
