document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("registerForm");
  const confirmBtn = document.getElementById("confirmBtn");
  const result = document.querySelector(".response");

  const regPw = document.getElementById("regPassword");
  const regPw2 = document.getElementById("regConfirmPw");
  const toggleBoth = document.getElementById("toggleBothPw");

  // SHOW / HIDE BOTH PASSWORDS
  toggleBoth.addEventListener("click", () => {
    const hidden = regPw.type === "password";
    regPw.type = hidden ? "text" : "password";
    regPw2.type = hidden ? "text" : "password";
    toggleBoth.textContent = hidden ? "Hide" : "Show";
  });

  // CONFIRM BUTTON = REGISTER
  confirmBtn.addEventListener("click", () => {

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

    // GET EXISTING USERS
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // CHECK IF EMAIL EXISTS
    const exists = users.find(u => u.email === email);
    if (exists) {
      result.style.color = "salmon";
      result.textContent = "Email already registered.";
      return;
    }

    // SAVE USER
    users.push({
      fullname,
      stream,
      email,
      password   // ⚠️ plain text (demo only)
    });

    localStorage.setItem("users", JSON.stringify(users));

    result.style.color = "#90ee90";
    result.textContent = "Registration successful! Redirecting...";

    setTimeout(() => {
      window.location.href = "index.html"; // back to login
    }, 1200);
  });

});
