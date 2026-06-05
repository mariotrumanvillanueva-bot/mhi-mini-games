(() => {
  const ADMIN_CODE = "MHI-ADMIN-FRIDAY-2026";
  const byId = (id) => document.getElementById(id);
  async function api(action, payload = {}) {
    if (typeof API_URL === "undefined" || !API_URL || API_URL.includes("PASTE_")) {
      throw new Error("API_URL is not set.");
    }
    const res = await fetch(API_URL, { method: "POST", body: JSON.stringify({ action, ...payload }) });
    return await res.json();
  }
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
  let player = "", active = [], index = 0, score = 0, selected = new Set(), currentGameName = "";
  function sessionKey(name, gameName) {
    return "mhiMiniSession_" + String(name || "Guest").trim().toLowerCase() + "_" + String(gameName || "Random").trim().toLowerCase();
  }
  function saveSession() {
    if (!player || !currentGameName || !active || active.length === 0) return;
    localStorage.setItem(sessionKey(player, currentGameName), JSON.stringify({
      player,
      currentGameName,
      active,
      index,
      score,
      savedAt: new Date().toISOString()
    }));
  }
  function clearSession() {
    if (!player || !currentGameName) return;
    localStorage.removeItem(sessionKey(player, currentGameName));
  }
  function getSavedSession(name, gameName) {
    const raw = localStorage.getItem(sessionKey(name, gameName));
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }
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
    currentGameName = byId("gameSelect").value;

    const saved = getSavedSession(player, currentGameName);
    if (saved && saved.active && saved.active.length > 0 && saved.index < saved.active.length) {
      const resume = confirm("You have an unfinished game saved. Continue where you left off?");
      if (resume) {
        active = saved.active;
        index = Number(saved.index || 0);
        score = Number(saved.score || 0);
        byId("entryPanel").classList.add("hidden");
        byId("activePanel").classList.remove("hidden");
        renderQuestion();
        return;
      } else {
        localStorage.removeItem(sessionKey(player, currentGameName));
      }
    }

    active = pickGame();
    if (!active || active.length === 0) return;
    index = 0; score = 0;
    saveSession();
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
    saveSession();
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
    saveSession();
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
  async function saveScore() {
    const entry = {
      name: player,
      score,
      date: new Date().toLocaleDateString(),
      game: byId("gameSelect").value
    };

    try {
      await api("submitFunScore", entry);
    } catch (e) {
      const scores = JSON.parse(localStorage.getItem("mhiFunScores") || "[]");
      scores.push(entry);
      localStorage.setItem("mhiFunScores", JSON.stringify(scores.slice(-100)));
    }

    updateLeaderboard();
  }

  async function updateLeaderboard() {
    let scores = [];

    try {
      const result = await api("funLeaderboard", {});
      scores = result.ok ? result.leaderboard : [];
    } catch (e) {
      scores = JSON.parse(localStorage.getItem("mhiFunScores") || "[]")
        .sort((a, b) => b.score - a.score)
        .slice(0, 20);
    }

    byId("leaderboard").innerHTML = "";
    scores.forEach((e) => {
      const item = document.createElement("li");
      item.innerHTML = "<strong>" + e.name + "</strong> — " + e.score + " pts<br><small>" + e.game + " • " + (e.date || "") + "</small>";
      byId("leaderboard").appendChild(item);
    });
  }

  function adminCodeOK() { return byId("funAdminCode").value === ADMIN_CODE; }
  function setKahoot(open) { if (!adminCodeOK()) return alert("Invalid admin code."); localStorage.setItem("mhiKahootOpen", open ? "true" : "false"); updateKahootStatus(); }
  function resetScores() {
    if (!confirm("This only clears your browser's local backup scores. Shared leaderboard remains on the site.")) return;
    localStorage.removeItem("mhiFunScores");
    updateLeaderboard();
  }

  async function deleteFunUser() {
    if (!adminCodeOK()) return alert("Invalid admin code.");
    const name = byId("deleteFunUserName").value.trim();
    if (!name) return alert("Enter a nickname to delete.");

    try {
      const result = await api("deleteFunUser", { code: byId("funAdminCode").value, name });
      alert(result.message || "User deleted from fun leaderboard.");
    } catch (e) {
      const target = name.toLowerCase();
      const scores = JSON.parse(localStorage.getItem("mhiFunScores") || "[]")
        .filter((entry) => String(entry.name || "").trim().toLowerCase() !== target);
      localStorage.setItem("mhiFunScores", JSON.stringify(scores));
      alert("User deleted from this browser's local backup leaderboard.");
    }

    updateLeaderboard();
  }

  function backToMenu() { saveSession(); byId("activePanel").classList.add("hidden"); byId("entryPanel").classList.remove("hidden"); }
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