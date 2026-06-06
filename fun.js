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
      { type: "choice", q: "What does box office measure?", a: ["Ticket sales", "Movie length", "Actor height", "Snack prices"], c: 0 },
      { type: "choice", q: "What is a movie preview called?", a: ["Trailer", "Receipt", "Spreadsheet", "Invoice"], c: 0 },
      { type: "choice", q: "Who leads the overall creative vision of a movie?", a: ["Director", "Audience", "Ticket clerk", "Composer only"], c: 0 },
      { type: "choice", q: "A sequel is...", a: ["A follow-up movie", "A receipt", "A soundtrack", "A camera"], c: 0 },
      { type: "choice", q: "A cameo is...", a: ["A brief appearance", "A theater room", "A snack size", "A ticket booth"], c: 0 },
      { type: "choice", q: "What does pacing describe?", a: ["How fast or slow the story feels", "The ticket line speed", "The actor's height", "The number of posters"], c: 0 }
    ],
    Emoji: [
      { type: "choice", q: "Guess: 🦁👑", a: ["The Lion King", "Frozen", "Jaws", "Cars"], c: 0 },
      { type: "choice", q: "Guess: 🧊👸❄️", a: ["Frozen", "Titanic", "Up", "Shrek"], c: 0 },
      { type: "choice", q: "Guess: 🐠🌊🔍", a: ["Finding Nemo", "Cars", "Rocky", "Scream"], c: 0 },
      { type: "choice", q: "Guess: 🧸🤠🚀", a: ["Toy Story", "Jaws", "Avatar", "Grease"], c: 0 },
      { type: "choice", q: "Guess: 🧌🫏👸", a: ["Shrek", "Titanic", "Up", "Coco"], c: 0 },
      { type: "choice", q: "Guess: 🦖🏝️🚙", a: ["Jurassic Park", "Titanic", "Up", "Elf"], c: 0 }
    ],
    Scramble: [
      { type: "typed", q: "Unscramble: MLIF", answer: "film" },
      { type: "typed", q: "Unscramble: COPONPR", answer: "popcorn" },
      { type: "typed", q: "Unscramble: COTAR", answer: "actor" },
      { type: "typed", q: "Unscramble: ROHROR", answer: "horror" },
      { type: "typed", q: "Unscramble: OECYDM", answer: "comedy" },
      { type: "typed", q: "Unscramble: LIVALNI", answer: "villain" },
      { type: "typed", q: "Unscramble: WRVPWIE", answer: "preview" },
      { type: "typed", q: "Unscramble: TRDROCTEI", answer: "director" },
      { type: "typed", q: "Unscramble: BSRUTECKOBL", answer: "blockbuster" }
    ],
    SelectAll: [
      { type: "selectAll", q: "Select all movie snacks.", a: ["Popcorn", "Candy", "Soda", "Keyboard"], c: [0, 1, 2] },
      { type: "selectAll", q: "Select all movie jobs.", a: ["Director", "Actor", "Editor", "Printer"], c: [0, 1, 2] },
      { type: "selectAll", q: "Select all genres.", a: ["Horror", "Comedy", "Drama", "Stapler"], c: [0, 1, 2] },
      { type: "selectAll", q: "Select all story pieces.", a: ["Character", "Setting", "Conflict", "Mousepad"], c: [0, 1, 2] }
    ],
    Matching: [
      { type: "matching", q: "Match the terms.", pairs: [["Trailer", "Preview"], ["Genre", "Type"], ["Actor", "Performer"], ["Credits", "Worker list"], ["Scene", "Movie section"]] },
      { type: "matching", q: "Match the story words.", pairs: [["Hero", "Main good character"], ["Villain", "Main bad character"], ["Plot", "Story events"], ["Setting", "Where/when story happens"], ["Conflict", "Main problem"]] },
      { type: "matching", q: "Match movie sequence terms.", pairs: [["Sequel", "Follow-up movie"], ["Prequel", "Story before original"], ["Trilogy", "Three related movies"], ["Remake", "New version"], ["Spin-off", "Related side story"]] }
    ],
    Kahoot: [
      { type: "choice", q: "Kahoot: Which is a movie award?", a: ["Oscar", "Receipt", "Stapler", "Keyboard"], c: 0 },
      { type: "choice", q: "Kahoot: Which is a movie job?", a: ["Director", "Dentist only", "Bank teller only", "Pilot only"], c: 0 },
      { type: "choice", q: "Kahoot: Which means first showing?", a: ["Premiere", "Invoice", "Spreadsheet", "Receipt"], c: 0 },
      { type: "choice", q: "Kahoot: Which term means hidden meaning beneath dialogue/actions?", a: ["Subtext", "Subtitle", "Soundtrack", "Synopsis"], c: 0 }
    ]
  };

  let player = "", active = [], index = 0, score = 0, selected = new Set(), currentGameName = "", answerLocked = false;

  function sessionKey(name, gameName) { return "mhiMiniSession_" + String(name || "Guest").trim().toLowerCase() + "_" + String(gameName || "Random").trim().toLowerCase(); }
  function saveSession() { if (!player || !currentGameName || !active.length) return; localStorage.setItem(sessionKey(player, currentGameName), JSON.stringify({ player, currentGameName, active, index, score })); }
  function clearSession() { if (player && currentGameName) localStorage.removeItem(sessionKey(player, currentGameName)); }
  function getSavedSession(name, gameName) { try { return JSON.parse(localStorage.getItem(sessionKey(name, gameName))); } catch(e) { return null; } }
  function isKahootOpen() { return localStorage.getItem("mhiKahootOpen") === "true"; }
  function updateKahootStatus() { const s = byId("kahootStatus"); if (s) s.textContent = isKahootOpen() ? "Kahoot is OPEN" : "Kahoot is CLOSED"; }
  function shuffle(items) { return [...items].sort(() => Math.random() - 0.5); }
  function shuffledChoices(q) { return q.a.map((text, index) => ({ text, index })).sort(() => Math.random() - 0.5); }
  function difficultyLabel(i) { if (i < 3) return "Easy"; if (i < 6) return "Medium"; if (i < 9) return "Hard"; return "Very Hard"; }
  function prepareProgressive(qs) { return qs.map((q, i) => ({ ...q, progressiveDifficulty: difficultyLabel(i) })); }

  function pickGame() {
    const gameName = byId("gameSelect").value;
    if (gameName === "Kahoot" && !isKahootOpen()) { alert("Kahoot is closed. Admin must open it first."); return null; }
    if (gameName === "Random") {
      const all = Object.keys(GAMES).filter((name) => name !== "Kahoot").flatMap((name) => GAMES[name]);
      return prepareProgressive(shuffle(all).slice(0, 10));
    }
    return prepareProgressive(shuffle(GAMES[gameName]).slice(0, 10));
  }

  function startGame() {
    player = byId("playerName").value.trim() || "Guest";
    currentGameName = byId("gameSelect").value;
    const saved = getSavedSession(player, currentGameName);
    if (saved && saved.active && saved.index < saved.active.length) {
      if (confirm("You have an unfinished game saved. Continue where you left off?")) {
        active = saved.active; index = Number(saved.index || 0); score = Number(saved.score || 0);
        byId("entryPanel").classList.add("hidden"); byId("activePanel").classList.remove("hidden"); renderQuestion(); return;
      }
      localStorage.removeItem(sessionKey(player, currentGameName));
    }
    active = pickGame(); if (!active || !active.length) return;
    index = 0; score = 0; saveSession();
    byId("entryPanel").classList.add("hidden"); byId("activePanel").classList.remove("hidden"); renderQuestion();
  }

  function renderQuestion() {
    answerLocked = false;
    const q = active[index];
    byId("questionText").textContent = "[" + (q.progressiveDifficulty || "Game") + "] " + q.q;
    byId("answers").innerHTML = ""; byId("matchingBox").innerHTML = "";
    byId("typedBox").classList.add("hidden"); byId("matchingBox").classList.add("hidden");
    byId("nextBtn").style.display = "none"; byId("feedback").textContent = "Score: " + score;
    selected = new Set(); saveSession();

    if (q.type === "choice") {
      shuffledChoices(q).forEach((choice) => {
        const b = document.createElement("button"); b.type = "button"; b.className = "answer-btn"; b.textContent = choice.text;
        b.onclick = () => submitAnswer(choice.index === q.c, b); byId("answers").appendChild(b);
      });
    }

    if (q.type === "typed") byId("typedBox").classList.remove("hidden");

    if (q.type === "selectAll") {
      shuffledChoices(q).forEach((choice) => {
        const b = document.createElement("button"); b.type = "button"; b.className = "answer-btn"; b.textContent = choice.text;
        b.onclick = () => { if (selected.has(choice.index)) { selected.delete(choice.index); b.classList.remove("correct"); } else { selected.add(choice.index); b.classList.add("correct"); } };
        byId("answers").appendChild(b);
      });
      const submit = document.createElement("button"); submit.type = "button"; submit.textContent = "Submit Selected";
      submit.onclick = () => submitAnswer([...selected].sort().join(",") === [...q.c].sort().join(","));
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
      submit.onclick = () => submitAnswer([...document.querySelectorAll("#matchingBox select")].every((s) => s.value === s.dataset.correct));
      byId("matchingBox").appendChild(submit);
    }
  }

  function submitTyped() {
    if (answerLocked) return;
    const q = active[index], guess = byId("typedAnswer").value.trim().toLowerCase();
    if (!guess) return alert("Type an answer first.");
    byId("typedAnswer").value = ""; submitAnswer(guess === q.answer.toLowerCase());
  }

  function submitAnswer(ok, btn = null) {
    if (answerLocked) return; answerLocked = true;
    document.querySelectorAll(".answer-btn").forEach((b) => b.disabled = true);
    document.querySelectorAll("#matchingBox select").forEach((s) => s.disabled = true);
    if (btn) btn.classList.add(ok ? "correct" : "wrong");
    if (ok) score += 10;
    saveSession();
    byId("feedback").textContent = ok ? "Correct! Score: " + score : "Not quite. Score: " + score;
    setTimeout(() => nextQuestion(), 900);
  }

  async function nextQuestion() {
    answerLocked = false; index++; saveSession();
    if (index < active.length) return renderQuestion();
    score += 5; await saveScore(); clearSession();
    byId("questionText").textContent = "Game complete! Final score: " + score;
    byId("answers").innerHTML = ""; byId("typedBox").classList.add("hidden"); byId("matchingBox").classList.add("hidden"); byId("entryPanel").classList.remove("hidden");
  }

  async function saveScore() {
    const entry = { name: player, score, date: new Date().toLocaleDateString(), game: byId("gameSelect").value };
    try { await api("submitFunScore", entry); byId("leaderboardStatus").textContent = "Shared leaderboard is live. Score saved for everyone to see."; }
    catch(e) { const scores = JSON.parse(localStorage.getItem("mhiFunScores") || "[]"); scores.push(entry); localStorage.setItem("mhiFunScores", JSON.stringify(scores.slice(-100))); byId("leaderboardStatus").textContent = "Shared leaderboard is not connected. Score saved only on this browser."; }
    updateLeaderboard();
  }

  async function updateLeaderboard() {
    let scores = [];
    try { const result = await api("funLeaderboard", {}); scores = result.ok ? result.leaderboard : []; byId("leaderboardStatus").textContent = "Shared leaderboard is live. Updates every 15 seconds."; }
    catch(e) { byId("leaderboardStatus").textContent = "Shared leaderboard is not connected yet. Showing only this browser's local backup scores."; scores = JSON.parse(localStorage.getItem("mhiFunScores") || "[]").sort((a,b)=>b.score-a.score).slice(0,20); }
    byId("leaderboard").innerHTML = "";
    if (!scores.length) { const empty = document.createElement("li"); empty.innerHTML = "<strong>No scores yet</strong><br><small>Scores will appear here once players finish a game.</small>"; byId("leaderboard").appendChild(empty); return; }
    scores.forEach((e) => { const item = document.createElement("li"); const adj = e.adjustmentPoints ? " • Adjustments: " + e.adjustmentPoints : ""; item.innerHTML = "<strong>" + (e.rank ? "#" + e.rank + " " : "") + e.name + "</strong> — " + e.score + " pts<br><small>" + e.game + adj + " • " + (e.date || "") + "</small>"; byId("leaderboard").appendChild(item); });
  }

  function adminCodeOK() { return byId("funAdminCode").value === ADMIN_CODE; }

  async function adminLogin() {
    try { const result = await api("adminVerify", { code: byId("funAdminCode").value }); if (!result.ok) { byId("adminStatus").textContent = "Invalid admin code."; return; } }
    catch(e) { if (!adminCodeOK()) { byId("adminStatus").textContent = "Invalid admin code or backend not connected."; return; } }
    byId("adminPanel").classList.remove("hidden"); byId("adminStatus").textContent = "Admin functions unlocked."; byId("adminOutput").textContent = "Admin functions unlocked.";
  }

  function setKahoot(open) { if (!adminCodeOK()) return alert("Invalid admin code."); localStorage.setItem("mhiKahootOpen", open ? "true" : "false"); updateKahootStatus(); }
  function resetScores() { if (!confirm("This only clears your browser's local backup scores. Shared leaderboard remains on the site.")) return; localStorage.removeItem("mhiFunScores"); updateLeaderboard(); }

  async function deleteFunUser() {
    if (!adminCodeOK()) return alert("Invalid admin code.");
    const name = byId("deleteFunUserName").value.trim(); if (!name) return alert("Enter a nickname to delete.");
    if (!confirm("Delete all leaderboard records for " + name + "?")) return;
    try { const result = await api("deleteFunUser", { code: byId("funAdminCode").value, name }); byId("adminOutput").textContent = JSON.stringify(result, null, 2); }
    catch(e) { byId("adminOutput").textContent = "Backend not connected. Delete could not be saved to shared leaderboard."; }
    updateLeaderboard();
  }

  async function adjustFunScore() {
    if (!adminCodeOK()) return alert("Invalid admin code.");
    const name = byId("adjustFunUserName").value.trim();
    const points = Number(byId("adjustFunPoints").value || 0);
    const reason = byId("adjustFunReason").value.trim() || "Admin score correction";
    if (!name) return alert("Enter the player nickname.");
    if (!points) return alert("Enter points. Use positive to add or negative to remove.");
    try { const result = await api("adjustFunScore", { code: byId("funAdminCode").value, name, points, reason }); byId("adminOutput").textContent = JSON.stringify(result, null, 2); }
    catch(e) { byId("adminOutput").textContent = "Backend not connected. Score correction could not be saved."; }
    updateLeaderboard();
  }

  function backToMenu() { saveSession(); byId("activePanel").classList.add("hidden"); byId("entryPanel").classList.remove("hidden"); }

  document.addEventListener("DOMContentLoaded", () => {
    byId("startBtn").addEventListener("click", startGame);
    byId("submitTypedBtn").addEventListener("click", submitTyped);
    byId("backBtn").addEventListener("click", backToMenu);
    byId("resetBtn").addEventListener("click", resetScores);
    byId("adminLoginBtn").addEventListener("click", adminLogin);
    byId("openKahootBtn").addEventListener("click", () => setKahoot(true));
    byId("closeKahootBtn").addEventListener("click", () => setKahoot(false));
    byId("deleteFunUserBtn").addEventListener("click", deleteFunUser);
    byId("adjustFunScoreBtn").addEventListener("click", adjustFunScore);
    updateLeaderboard(); updateKahootStatus(); setInterval(updateLeaderboard, 15000);
  });
})();
