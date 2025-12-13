document.addEventListener("DOMContentLoaded", () => {

  const examBox = document.getElementById("examBox");
  const startBtn = document.getElementById("startExam");
  const historyList = document.getElementById("historyList");

  // ---------------- BACK TO DASHBOARD ----------------
  window.goBack = () => {
    window.location.href = "dashboard.html";
  };

  // ---------------- NOTIFICATION FUNCTION ----------------
  function addNotification(message) {
    let notifications = JSON.parse(localStorage.getItem("notifications")) || [];

    notifications.unshift({
      message,
      time: new Date().toLocaleString()
    });

    localStorage.setItem("notifications", JSON.stringify(notifications));
  }

  // ---------------- READ TEXT FROM LIBRARY ----------------
  const libraryText = localStorage.getItem("libraryText");

  if (!libraryText || libraryText.length < 50) {
    examBox.innerHTML = `
      <p style="color:#666">
        No sufficient library content found.<br>
        Please upload .txt files in Library first.
      </p>
    `;
    return;
  }

  // ---------------- LOAD EXAM HISTORY ----------------
  let history = JSON.parse(localStorage.getItem("examHistory")) || [];
  renderHistory();

  // ---------------- START EXAM ----------------
  startBtn.addEventListener("click", startExam);

  function startExam() {

    addNotification("AI-based exam generated");

    const sentences = libraryText
      .split(".")
      .map(s => s.trim())
      .filter(s => s.length > 15)
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);

    examBox.innerHTML = "";
    let questionsMeta = [];

    sentences.forEach((sentence, index) => {

      // AI-SIMULATED DECISION
      const isMCQ = sentence.length < 80 && Math.random() > 0.4;

      if (isMCQ) {
        const words = sentence.split(" ");
        const answer = words[Math.floor(words.length / 2)];

        const options = shuffle([
          answer,
          "Option A",
          "Option B",
          "Option C"
        ]);

        questionsMeta.push({
          type: "mcq",
          correct: options.indexOf(answer)
        });

        examBox.innerHTML += `
          <div class="question">
            <h3>Q${index + 1}. Choose the correct answer:</h3>
            <p>${sentence.replace(answer, "_____")}</p>
            <div class="options">
              ${options.map((opt, i) => `
                <label>
                  <input type="radio" name="q${index}" value="${i}">
                  ${opt}
                </label>
              `).join("")}
            </div>
          </div>
        `;

      } else {
        questionsMeta.push({ type: "write" });

        examBox.innerHTML += `
          <div class="question">
            <h3>Q${index + 1}. Explain briefly:</h3>
            <p>${sentence}</p>
            <textarea placeholder="Write your answer"></textarea>
          </div>
        `;
      }
    });

    const submitBtn = document.createElement("button");
    submitBtn.className = "start-btn";
    submitBtn.textContent = "Submit Exam";
    submitBtn.style.marginTop = "20px";

    submitBtn.onclick = () => autoScore(questionsMeta);
    examBox.appendChild(submitBtn);
  }

  // ---------------- AUTO SCORING ----------------
  function autoScore(meta) {
    let score = 0;
    let mcqCount = 0;

    meta.forEach((q, index) => {
      if (q.type === "mcq") {
        mcqCount++;
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        if (selected && parseInt(selected.value) === q.correct) {
          score++;
        }
      }
    });

    const result = {
      date: new Date().toLocaleString(),
      score: `${score} / ${mcqCount}`,
      note: "MCQs auto-scored, writing answers need manual evaluation"
    };

    history.unshift(result);
    localStorage.setItem("examHistory", JSON.stringify(history));

    addNotification(`Exam submitted. Score: ${score}/${mcqCount}`);

    alert(
      `Exam submitted successfully!\nMCQ Score: ${score} / ${mcqCount}\nWriting answers require manual evaluation`
    );

    renderHistory();

    examBox.innerHTML = `
      <button id="startExam" class="start-btn">Start New Exam</button>
    `;
    document.getElementById("startExam").onclick = startExam;
  }

  // ---------------- RENDER EXAM HISTORY ----------------
  function renderHistory() {
    historyList.innerHTML = "";

    if (history.length === 0) {
      historyList.innerHTML = "<li>No exam attempts yet</li>";
      return;
    }

    history.forEach(h => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>Score:</strong> ${h.score}<br>
        <small>${h.date}</small><br>
        <em>${h.note}</em>
      `;
      historyList.appendChild(li);
    });
  }

  // ---------------- UTILITY ----------------
  function shuffle(arr) {
    return arr.sort(() => 0.5 - Math.random());
  }

});
