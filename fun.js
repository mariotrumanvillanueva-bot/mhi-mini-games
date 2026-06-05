(() => {
  const ADMIN_CODE = "MHI-ADMIN-FRIDAY-2026";
  const byId = (id) => document.getElementById(id);
  const GAMES = {
    Trivia: [
      { type: "choice", q: "What is a movie preview called?", a: ["Trailer", "Receipt", "Spreadsheet", "Invoice"], c: 0 },
      { type: "choice", q: "What do you call the music from a movie?", a: ["Soundtrack", "Memo", "Ledger", "Subtitle"], c: 0 },
      { type: "choice", q: "Which is a movie genre?", a: ["Comedy", "Keyboard", "Stapler", "Calendar"], c: 0 }
    ],
    Emoji: [
      { type: "choice", q: "Guess: 🦁👑", a: ["The Lion King", "Frozen", "Jaws", "Cars"], c: 0 },
      { type: "choice", q: "Guess: 🧊👸❄️", a: ["Frozen", "Titanic", "Up", "Shrek"], c: 0 }
    ],
    Scramble: [
      { type: "typed", q: "Unscramble: MLIF", answer: "film" },
      { type: "typed", q: "Unscramble: POCORPN", answer: "popcorn" },
      { type: "typed", q: "Unscramble: COTAR", answer: "actor" }
    ],
    SelectAll: [
      { type: "selectAll", q: "Select all movie snacks.", a: ["Popcorn", "Candy", "Soda", "Keyboard"], c: [0, 1, 2] },
      { type: "selectAll", q: "Select all movie jobs.", a: ["Director", "Actor", "Editor", "Printer"], c: [0, 1, 2] }
    ],
    Matching: [
      { type: "matching", q: "Match the terms.", pairs: [["Trailer", "Preview"], ["Genre", "Type"], ["Actor", "Performer"], ["Credits", "Worker list"], ["Scene", "Movie section"]] }
    ],
    Kahoot: [
      { type: "choice", q: "Kahoot: Which is a movie award?", a: ["Oscar", "Receipt", "Stapler", "Keyboard"], c: 0 },
      { type: "choice", q: "Kahoot: Which is a movie job?", a: ["Director", "Dentist only", "Bank teller only", "Pilot only"], c: 0 }
    ]
  };
  let player = "", active = [], index = 0, score = 0, selected = new Set();
  function isKahootOpen() { return localStorage.getItem("mhiKahootOpen") === "true"; }
  function updateKahootStatus() { byId("kahootStatus").textContent = isKahootOpen() ? "Kahoot is OPEN" : "Kahoot is CLOSED"; }
  function shuffle(items) { return [...items].sort(() => Math.random() - 0.5); }
  function pickGame() {
    const gameName = byId("gameSelect").value;
    if (gameName === "Kahoot" && !isKahootOpen()) { alert("Kahoot is closed. Admin must open it first."); return null; }
    if (gameName === "Random") {
      const all = Object.keys(GAMES).filter((name) => name !== "Kahoot").flatMap((name) => GAMES[name]);
      return shuffle(all).slice(0, 7);
    }
    return shuffle(GAMES[gameName]).slice(0, 7);
  }
  function startGame() {
    player = byId("playerName").value.trim() || "Guest";
    active = pickGame();
    if (!active || active.length === 0) return;
    index = 0; score = 0;
    byId("entryPanel").classList.add("hidden");
    byId("activePanel").classList.remove("hidden");
    renderQuestion();
  }
  function renderQuestion() {
    answerLocked = false;
    const q = active[index];
    byId("questionText").textContent = q.q;
    byId("answers").innerHTML = "";
    byId("matchingBox").innerHTML = "";
    byId("typedBox").classList.add("hidden");
    byId("matchingBox").classList.add("hidden");
    byId("nextBtn").disabled = true;
    byId("feedback").textContent = "Score: " + score;
    selected = new Set();
    if (q.type === "choice") {
      q.a.forEach((txt, i) => {
        const b = document.createElement("button");
        b.type = "button"; b.className = "answer-btn"; b.textContent = txt;
        b.addEventListener("click", () => submitAnswer(i === q.c, b));
        byId("answers").appendChild(b);
      });
    }
    if (q.type === "typed") byId("typedBox").classList.remove("hidden");
    if (q.type === "selectAll") {
      q.a.forEach((txt, i) => {
        const b = document.createElement("button");
        b.type = "button"; b.className = "answer-btn"; b.textContent = txt;
        b.addEventListener("click", () => {
          if (selected.has(i)) { selected.delete(i); b.classList.remove("correct"); }
          else { selected.add(i); b.classList.add("correct"); }
        });
        byId("answers").appendChild(b);
      });
      const submit = document.createElement("button");
      submit.type = "button"; submit.textContent = "Submit Selected";
      submit.addEventListener("click", () => submitAnswer([...selected].sort().join(",") === [...q.c].sort().join(",")));
      byId("answers").appendChild(submit);
    }
    if (q.type === "matching") {
      byId("matchingBox").classList.remove("hidden");
      const right = shuffle(q.pairs.map((p) => p[1]));
      q.pairs.forEach((pair) => {
        const row = document.createElement("div"); row.className = "match-row";
        const left = document.createElement("strong"); left.textContent = pair[0];
        const sel = document.createElement("select"); sel.dataset.correct = pair[1];
        sel.innerHTML = '<option value="">Choose</option>' + right.map((item) => '<option value="' + item + '">' + item + '</option>').join("");
        row.appendChild(left); row.appendChild(sel); byId("matchingBox").appendChild(row);
      });
      const submit = document.createElement("button"); submit.type = "button"; submit.textContent = "Submit Matching";
      submit.addEventListener("click", () => submitAnswer([...document.querySelectorAll("#matchingBox select")].every((s) => s.value === s.dataset.correct)));
      byId("matchingBox").appendChild(submit);
    }
  }
  function submitTyped() {
    const q = active[index], guess = byId("typedAnswer").value.trim().toLowerCase();
    if (!guess) return alert("Type an answer first.");
    byId("typedAnswer").value = ""; submitAnswer(guess === q.answer.toLowerCase());
  }
  let answerLocked = false;

  function submitAnswer(ok, btn = null) {
    if (answerLocked) return;
    answerLocked = true;

    document.querySelectorAll(".answer-btn").forEach((b) => b.disabled = true);
    document.querySelectorAll("#matchingBox select").forEach((s) => s.disabled = true);
    const typedInput = byId("typedAnswer");
    if (typedInput) typedInput.disabled = true;

    if (btn) btn.classList.add(ok ? "correct" : "wrong");
    if (ok) score += 10;

    byId("feedback").textContent = ok ? "Correct! Score: " + score : "Not quite. Score: " + score;

    setTimeout(() => {
      nextQuestion();
    }, 900);
  }

  function nextQuestion() {
    answerLocked = false;
    const typedInput = byId("typedAnswer");
    if (typedInput) typedInput.disabled = false;

    index++;
    if (index < active.length) return renderQuestion();

    score += 5;
    saveScore();

    byId("questionText").textContent = "Game complete! Final score: " + score;
    byId("answers").innerHTML = "";
    byId("typedBox").classList.add("hidden");
    byId("matchingBox").classList.add("hidden");
    byId("nextBtn").disabled = true;
    byId("entryPanel").classList.remove("hidden");
  }
  function saveScore() {
    const scores = JSON.parse(localStorage.getItem("mhiFunScores") || "[]");
    scores.push({ name: player, score, date: new Date().toLocaleDateString(), game: byId("gameSelect").value });
    localStorage.setItem("mhiFunScores", JSON.stringify(scores.slice(-100))); updateLeaderboard();
  }
  function updateLeaderboard() {
    const scores = JSON.parse(localStorage.getItem("mhiFunScores") || "[]").sort((a, b) => b.score - a.score).slice(0, 20);
    byId("leaderboard").innerHTML = "";
    scores.forEach((e) => {
      const item = document.createElement("li");
      item.innerHTML = "<strong>" + e.name + "</strong> — " + e.score + " pts<br><small>" + e.game + " • " + e.date + "</small>";
      byId("leaderboard").appendChild(item);
    });
  }
  function adminCodeOK() { return byId("funAdminCode").value === ADMIN_CODE; }
  function setKahoot(open) { if (!adminCodeOK()) return alert("Invalid admin code."); localStorage.setItem("mhiKahootOpen", open ? "true" : "false"); updateKahootStatus(); }
  function resetScores() { if (!confirm("Reset the local MHI Mini Games leaderboard on this browser?")) return; localStorage.removeItem("mhiFunScores"); updateLeaderboard(); }
  function deleteFunUser() {
    if (!adminCodeOK()) return alert("Invalid admin code.");
    const name = byId("deleteFunUserName").value.trim().toLowerCase();
    if (!name) return alert("Enter a nickname to delete.");
    const scores = JSON.parse(localStorage.getItem("mhiFunScores") || "[]").filter((e) => String(e.name || "").trim().toLowerCase() !== name);
    localStorage.setItem("mhiFunScores", JSON.stringify(scores));
    updateLeaderboard();
    alert("User deleted from this browser's fun leaderboard.");
  }
  function backToMenu() { byId("activePanel").classList.add("hidden"); byId("entryPanel").classList.remove("hidden"); }
  document.addEventListener("DOMContentLoaded", () => {
    byId("startBtn").addEventListener("click", startGame);
    byId("submitTypedBtn").addEventListener("click", submitTyped);
    byId("nextBtn").style.display = "none";
    byId("backBtn").addEventListener("click", backToMenu);
    byId("resetBtn").addEventListener("click", resetScores);
    byId("openKahootBtn").addEventListener("click", () => setKahoot(true));
    byId("closeKahootBtn").addEventListener("click", () => setKahoot(false));
    byId("deleteFunUserBtn").addEventListener("click", deleteFunUser);
    updateLeaderboard(); updateKahootStatus();
  });
})();