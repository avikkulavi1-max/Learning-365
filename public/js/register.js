document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("registerForm");
  const confirmBtn = document.getElementById("confirmBtn");
  const result = document.querySelector(".response");

  const regPw = document.getElementById("regPassword");
  const regPw2 = document.getElementById("regConfirmPw");
  const toggleBoth = document.getElementById("toggleBothPw");

  // SHOW / HIDE PASSWORDS
  toggleBoth.addEventListener("click", () => {
    const hidden = regPw.type === "password";
    regPw.type = hidden ? "text" : "password";
    regPw2.type = hidden ? "text" : "password";
    toggleBoth.textContent = hidden ? "Hide" : "Show";
  });

  // REGISTER
  confirmBtn.addEventListener("click", async () => {

    const fullname = form.fullname.value.trim();
    const stream = form.stream.value.trim();
    const email = form.email.value.trim().toLowerCase();
    const password = regPw.value;
    const confirmPassword = regPw2.value;

    if (!fullname || !stream || !email || !password || !confirmPassword) {
      result.style.color = "salmon";
      result.textContent = "Please fill all fields.";
      return;
    }

    if (password !== confirmPassword) {
      result.style.color = "salmon";
      result.textContent = "Passwords do not match.";
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, stream, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        result.style.color = "salmon";
        result.textContent = data.message || "Registration failed";
        return;
      }

      result.style.color = "#90ee90";
      result.textContent = data.message;

      setTimeout(() => {
        window.location.href = "index.html"; // login page
      }, 1200);

    } catch (err) {
      result.style.color = "salmon";
      result.textContent = "Server not running!";
    }
  });
});
