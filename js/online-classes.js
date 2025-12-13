document.addEventListener("DOMContentLoaded", () => {

  const addBtn = document.getElementById("addClassBtn");
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");
  const saveClass = document.getElementById("saveClass");

  const classList = document.getElementById("classList");
  const emptyState = document.getElementById("emptyState");

  const titleInput = document.getElementById("classTitle");
  const teacherInput = document.getElementById("classTeacher");
  const linkInput = document.getElementById("classLink");

  const startDate = document.getElementById("startDate");
  const startTime = document.getElementById("startTime");
  const startMeridiem = document.getElementById("startMeridiem");

  const endDate = document.getElementById("endDate");
  const endTime = document.getElementById("endTime");
  const endMeridiem = document.getElementById("endMeridiem");

  // Back button
  window.goBack = function () {
    window.location.href = "dashboard.html";
  };

  modal.style.display = "none";

  let classes = JSON.parse(localStorage.getItem("classes")) || [];

  removeExpiredClasses();
  renderClasses();

  // Open modal
  addBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // Close modal
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Save class
  saveClass.addEventListener("click", () => {

    if (
      !titleInput.value ||
      !teacherInput.value ||
      !linkInput.value ||
      !startDate.value ||
      !startTime.value ||
      !endDate.value ||
      !endTime.value
    ) {
      alert("Please fill all fields");
      return;
    }

    const startTimestamp = buildTimestamp(
      startDate.value,
      startTime.value,
      startMeridiem.value
    );

    const endTimestamp = buildTimestamp(
      endDate.value,
      endTime.value,
      endMeridiem.value
    );

    if (endTimestamp <= startTimestamp) {
      alert("End time must be after start time");
      return;
    }

    classes.push({
      title: titleInput.value,
      teacher: teacherInput.value,
      link: linkInput.value,
      startTime: startTimestamp,
      endTime: endTimestamp
    });

    localStorage.setItem("classes", JSON.stringify(classes));
    addNotification(`New online class added: ${titleInput.value}`);


    // Reset
    document.querySelectorAll("#modal input").forEach(i => i.value = "");
    modal.style.display = "none";

    renderClasses();
  });

  function buildTimestamp(date, time, meridiem) {
    let [hours, minutes] = time.split(":").map(Number);

    if (meridiem === "PM" && hours < 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;

    const d = new Date(date);
    d.setHours(hours, minutes, 0, 0);
    return d.getTime();
  }

  function removeExpiredClasses() {
    const now = Date.now();
    classes = classes.filter(c => c.endTime > now);
    localStorage.setItem("classes", JSON.stringify(classes));
  }

  function renderClasses() {
    classList.innerHTML = "";

    if (classes.length === 0) {
      emptyState.style.display = "block";
      return;
    }

    emptyState.style.display = "none";

    classes.forEach(c => {
      const card = document.createElement("div");
      card.className = "class-card";
      card.innerHTML = `
        <h3>${c.title}</h3>
        <p>👨‍🏫 ${c.teacher}</p>
        <p>🕒 ${new Date(c.startTime).toLocaleString()} - ${new Date(c.endTime).toLocaleString()}</p>
        <a href="${c.link}" target="_blank">Join Class</a>
      `;
      classList.appendChild(card);
    });
  }

  setInterval(() => {
    removeExpiredClasses();
    renderClasses();
  }, 60000);

});
function addNotification(message) {
  let notifications = JSON.parse(localStorage.getItem("notifications")) || [];

  notifications.unshift({
    message,
    time: new Date().toLocaleString()
  });

  localStorage.setItem("notifications", JSON.stringify(notifications));
}
