document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("loginForm");
  const result = document.querySelector(".response");
  const pwd = document.getElementById("pwd");
  const toggle = document.getElementById("togglePw");

  // SHOW / HIDE PASSWORD
  toggle.addEventListener("click", () => {
    if (pwd.type === "password") {
      pwd.type = "text";
      toggle.textContent = "Hide";
    } else {
      pwd.type = "password";
      toggle.textContent = "Show";
    }
  });

  // LOGIN CHECK
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;

    if (!email || !password) {
      result.style.color = "salmon";
      result.textContent = "Please fill all fields.";
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      result.style.color = "salmon";
      result.textContent = "Invalid email or password.";
      return;
    }

    // LOGIN SUCCESS
    result.style.color = "#90ee90";
    result.textContent = "Login successful! Redirecting...";

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);
  });

});
