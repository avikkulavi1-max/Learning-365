document.addEventListener("DOMContentLoaded", () => {

  const addBtn = document.getElementById("addResourceBtn");
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");
  const saveBtn = document.getElementById("saveResource");

  const resourceList = document.getElementById("resourceList");
  const emptyState = document.getElementById("emptyState");

  const titleInput = document.getElementById("resTitle");
  const subjectInput = document.getElementById("resSubject");
  const fileInput = document.getElementById("resFile");

  // BACK TO DASHBOARD
  window.goBack = function () {
    window.location.href = "dashboard.html";
  };

  modal.style.display = "none";

  let resources = JSON.parse(localStorage.getItem("libraryResources")) || [];
  renderResources();

  // OPEN MODAL
  addBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // CLOSE MODAL
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // SAVE RESOURCE
  saveBtn.addEventListener("click", () => {

    const file = fileInput.files[0];

    if (!titleInput.value || !subjectInput.value || !file) {
      alert("Please fill all fields and select a file");
      return;
    }

   if (file.type !== "text/plain") {
  alert("Please upload a .txt file for AI exam generation");
  return;
}

const reader = new FileReader();

reader.onload = function () {
  const textContent = reader.result;

  resources.push({
    title: titleInput.value,
    subject: subjectInput.value,
    fileName: file.name,
    text: textContent
  });

  localStorage.setItem("libraryResources", JSON.stringify(resources));
  addNotification(`New library resource added: ${titleInput.value}`);


  // Store text for exam AI
  let libraryText = localStorage.getItem("libraryText") || "";
  libraryText += " " + textContent;
  localStorage.setItem("libraryText", libraryText);

  modal.style.display = "none";
  renderResources();
};

reader.readAsText(file);


    const sampleText = prompt(
  "Optional: Paste important text from this resource (used for AI-simulated exam)"
) || "";

resources.push({
  title: titleInput.value,
  subject: subjectInput.value,
  fileName: file.name,
  fileURL,
  text: sampleText
});

// SAVE TEXT FOR EXAM
let libraryText = localStorage.getItem("libraryText") || "";
libraryText += " " + sampleText;
localStorage.setItem("libraryText", libraryText);


    localStorage.setItem("libraryResources", JSON.stringify(resources));

    titleInput.value = "";
    subjectInput.value = "";
    fileInput.value = "";

    modal.style.display = "none";
    renderResources();
  });

  // DELETE RESOURCE
  function deleteResource(index) {
    resources.splice(index, 1);
    localStorage.setItem("libraryResources", JSON.stringify(resources));
    renderResources();
  }

  // RENDER RESOURCES
  function renderResources() {
    resourceList.innerHTML = "";

    if (resources.length === 0) {
      emptyState.style.display = "block";
      return;
    }

    emptyState.style.display = "none";

    resources.forEach((r, index) => {
      const card = document.createElement("div");
      card.className = "resource-card";

      card.innerHTML = `
        <span class="delete-icon" title="Delete"><h2>👉🏻🗑️</h2></span>

        <h3>${r.title}</h3>
        <p>📘 ${r.subject}</p>
        <p>📄 ${r.fileName}</p>
        <a href="${r.fileURL}" target="_blank">Open File</a>
      `;

      // DELETE ICON CLICK
      card.querySelector(".delete-icon").addEventListener("click", () => {
        if (confirm("Delete this resource?")) {
          deleteResource(index);
        }
      });

      resourceList.appendChild(card);
    });
  }

});
function addNotification(message) {
  let notifications = JSON.parse(localStorage.getItem("notifications")) || [];

  notifications.unshift({
    message,
    time: new Date().toLocaleString()
  });

  localStorage.setItem("notifications", JSON.stringify(notifications));
}
