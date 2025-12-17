document.addEventListener("DOMContentLoaded", () => {

  // 🔐 LOGIN CHECK
  const userData = localStorage.getItem("currentUser");
  if (!userData) {
    window.location.href = "index.html";
    return;
  }

  let user = JSON.parse(userData);

  // --- DOM REFERENCES ---
  const nameEl = document.getElementById("name");
  const emailEl = document.getElementById("email");
  const useridEl = document.getElementById("userid");
  const streamEl = document.getElementById("stream");

  const profilePic = document.getElementById("profilePic");
  const photoPlaceholder = document.getElementById("photoPlaceholder");
  const fileUpload = document.getElementById("fileUpload");

  // --- LOAD USER DATA (✅ SERVER STRUCTURE) ---
  nameEl.innerText = user.fullname || "N/A";
  emailEl.innerText = user.email || "N/A";
  useridEl.innerText = user.id || "N/A";
  streamEl.innerText = user.stream || "N/A";

  // 👉 If photo already exists
  if (user.photo) {
    profilePic.src = user.photo;
    profilePic.style.display = "block";
    photoPlaceholder.style.display = "none";
  }

  // --- PHOTO UPLOAD ---
  fileUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // ❌ Type check
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image (JPG or PNG)");
      fileUpload.value = "";
      return;
    }

    // ❌ Size check (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      fileUpload.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      profilePic.src = reader.result;
      profilePic.style.display = "block";
      photoPlaceholder.style.display = "none";

      // ✅ Save photo locally (demo purpose)
      user.photo = reader.result;
      localStorage.setItem("currentUser", JSON.stringify(user));

      alert("Profile photo updated!");
    };

    reader.readAsDataURL(file);
  });
});
