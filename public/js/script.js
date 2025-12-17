document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("loginForm");
  const result = document.querySelector(".response");
  const pwd = document.getElementById("pwd");
  const toggle = document.getElementById("togglePw");

  // SHOW / HIDE PASSWORD
  toggle.addEventListener("click", () => {
    pwd.type = pwd.type === "password" ? "text" : "password";
    toggle.textContent = pwd.type === "password" ? "Show" : "Hide";
  });

  // LOGIN CHECK
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;

    if (!email || !password) {
      result.style.color = "salmon";
      result.textContent = "Please fill all fields.";
      return;
    }

    try {
      // ✅ SERVER LOGIN
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        result.style.color = "salmon";
        result.textContent = data.message;
        return;
      }

      // LOGIN SUCCESS
      result.style.color = "#90ee90";
      result.textContent = "Login successful! Redirecting...";

      // ✅ SAVE LOGIN USER
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);

    } catch (err) {
      result.style.color = "salmon";
      result.textContent = "Server not running!";
    }

  });

});
