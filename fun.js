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
      { type: "choice", q: "Who leads the overall creative vision of a movie?", a: ["Director", "Audience", "Ticket clerk", "Composer only"], c: 0 },
      { type: "choice", q: "A movie premiere is the...", a: ["First public showing", "Final scene", "Poster", "Snack counter"], c: 0 },
      { type: "choice", q: "What is a trailer?", a: ["A preview", "A full movie only", "A theater seat", "A camera"], c: 0 },
      { type: "choice", q: "What do credits list?", a: ["People who worked on the movie", "Ticket prices", "Only snacks", "Weather"], c: 0 },
      { type: "choice", q: "Redemption-style: A plot twist is...", a: ["Unexpected story change", "Snack deal", "Actor costume", "Poster size"], c: 0 },
      { type: "choice", q: "Redemption-style: A sequel is...", a: ["A follow-up movie", "A receipt", "A soundtrack", "A camera"], c: 0 },
      { type: "choice", q: "Redemption-style: A cameo is...", a: ["A brief appearance", "A theater room", "A snack size", "A ticket booth"], c: 0 },
      { type: "choice", q: "Redemption-style: A genre means...", a: ["Type/category of movie", "Ticket number", "Actor age", "Screen size"], c: 0 },
      { type: "choice", q: "Redemption-style: A soundtrack is...", a: ["Music from the movie", "The ticket", "The ending only", "The snack list"], c: 0 }
    ],
    Emoji: [
      { type: "choice", q: "Guess: 🦁👑", a: ["The Lion King", "Frozen", "Jaws", "Cars"], c: 0 },
      { type: "choice", q: "Guess: 🧊👸❄️", a: ["Frozen", "Titanic", "Up", "Shrek"], c: 0 },
      { type: "choice", q: "Guess: 🐠🌊🔍", a: ["Finding Nemo", "Cars", "Rocky", "Scream"], c: 0 },
      { type: "choice", q: "Guess: 🧸🤠🚀", a: ["Toy Story", "Jaws", "Avatar", "Grease"], c: 0 },
      { type: "choice", q: "Guess: 🧌🫏👸", a: ["Shrek", "Titanic", "Up", "Coco"], c: 0 },
      { type: "choice", q: "Redemption-style: 👽🚲🌕", a: ["E.T.", "Titanic", "Elf", "Grease"], c: 0 },
      { type: "choice", q: "Redemption-style: 🏠🎈👴", a: ["Up", "Jumanji", "Moana", "Avatar"], c: 0 },
      { type: "choice", q: "Redemption-style: 🕷️🧑‍🦱🏙️", a: ["Spider-Man", "Batman", "Superman", "Frozen"], c: 0 },
      { type: "choice", q: "Redemption-style: 🦖🏝️🚙", a: ["Jurassic Park", "Titanic", "Up", "Elf"], c: 0 },
      { type: "choice", q: "Redemption-style: 🦈🌊🚤", a: ["Jaws", "Moana", "Avatar", "Finding Nemo"], c: 0 }
    ],
    Scramble: [
      { type: "typed", q: "Unscramble: MLIF", answer: "film" },
      { type: "typed", q: "Unscramble: POCORPN", answer: "popcorn" },
      { type: "typed", q: "Unscramble: CESEN", answer: "scene" },
      { type: "typed", q: "Unscramble: POLT", answer: "plot" },
      { type: "typed", q: "Unscramble: COTAR", answer: "actor" },
      { type: "typed", q: "Redemption-style unscramble: ORREHR", answer: "horror" },
      { type: "typed", q: "Redemption-style unscramble: CIMNEA", answer: "cinema" },
      { type: "typed", q: "Redemption-style unscramble: OREH", answer: "hero" },
      { type: "typed", q: "Redemption-style unscramble: ANILELIV", answer: "villain" },
      { type: "typed", q: "Redemption-style unscramble: MECOADY", answer: "comedy" }
    ],
    SelectAll: [
      { type: "selectAll", q: "Select all movie snacks.", a: ["Popcorn", "Candy", "Soda", "Keyboard"], c: [0, 1, 2] },
      { type: "selectAll", q: "Select all movie jobs.", a: ["Director", "Actor", "Editor", "Printer"], c: [0, 1, 2] },
      { type: "selectAll", q: "Select all genres.", a: ["Horror", "Comedy", "Drama", "Stapler"], c: [0, 1, 2] },
      { type: "selectAll", q: "Select all movie terms.", a: ["Scene", "Plot", "Trailer", "Receipt"], c: [0, 1, 2] },
      { type: "selectAll", q: "Select all story pieces.", a: ["Character", "Setting", "Conflict", "Mousepad"], c: [0, 1, 2] },
      { type: "selectAll", q: "Redemption-style: Select all production terms.", a: ["Script", "Scene", "Take", "Microwave"], c: [0, 1, 2] },
      { type: "selectAll", q: "Redemption-style: Select all film crew areas.", a: ["Lighting", "Sound", "Editing", "Payroll tax"], c: [0, 1, 2] },
      { type: "selectAll", q: "Redemption-style: Select all theater items.", a: ["Screen", "Seats", "Tickets", "Toothbrush"], c: [0, 1, 2] },
      { type: "selectAll", q: "Redemption-style: Select all story roles.", a: ["Hero", "Villain", "Sidekick", "Receipt"], c: [0, 1, 2] },
      { type: "selectAll", q: "Redemption-style: Select all movie formats.", a: ["Sequel", "Prequel", "Short film", "Spreadsheet"], c: [0, 1, 2] }
    ],
    Matching: [
      { type: "matching", q: "Match the terms.", pairs: [["Trailer", "Preview"], ["Genre", "Type"], ["Actor", "Performer"], ["Credits", "Worker list"], ["Scene", "Movie section"]] },
      { type: "matching", q: "Match the production roles.", pairs: [["Director", "Leads vision"], ["Editor", "Arranges footage"], ["Composer", "Creates music"], ["Critic", "Reviews movies"], ["Producer", "Manages project"]] },
      { type: "matching", q: "Match the story words.", pairs: [["Hero", "Main good character"], ["Villain", "Main bad character"], ["Plot", "Story events"], ["Setting", "Where/when story happens"], ["Conflict", "Main problem"]] },
      { type: "matching", q: "Redemption-style: Match movie sequence terms.", pairs: [["Sequel", "Follow-up movie"], ["Prequel", "Story before original"], ["Trilogy", "Three related movies"], ["Remake", "New version"], ["Spin-off", "Related side story"]] },
      { type: "matching", q: "Redemption-style: Match theater terms.", pairs: [["Concession", "Snack area"], ["Matinee", "Earlier showing"], ["Aisle", "Walkway"], ["Seat", "Where you sit"], ["Poster", "Movie advertisement"]] },
      { type: "matching", q: "Redemption-style: Match story structure.", pairs: [["Beginning", "Introduces story"], ["Middle", "Builds conflict"], ["Climax", "Big turning point"], ["Ending", "Wraps story"], ["Theme", "Main message"]] }
    ],
    Kahoot: [
      { type: "choice", q: "Kahoot: Which is a movie award?", a: ["Oscar", "Receipt", "Stapler", "Keyboard"], c: 0 },
      { type: "choice", q: "Kahoot: Which is a movie job?", a: ["Director", "Dentist only", "Bank teller only", "Pilot only"], c: 0 },
      { type: "choice", q: "Kahoot: Which is a theater snack?", a: ["Popcorn", "Printer ink", "Notebook", "Mouse"], c: 0 },
      { type: "choice", q: "Kahoot: Which means first showing?", a: ["Premiere", "Invoice", "Spreadsheet", "Receipt"], c: 0 },
      { type: "choice", q: "Kahoot: Which is a preview?", a: ["Trailer", "Credits", "Payroll", "Calendar"], c: 0 },
      { type: "choice", q: "Kahoot redemption-style: Which is a movie genre?", a: ["Drama", "Printer", "Pencil", "Folder"], c: 0 },
      { type: "choice", q: "Kahoot redemption-style: Which is part of a story?", a: ["Plot", "Keyboard", "Stapler", "Receipt"], c: 0 },
      { type: "choice", q: "Kahoot redemption-style: Which person performs in a movie?", a: ["Actor", "Cash register", "Spreadsheet", "Calendar"], c: 0 },
      { type: "choice", q: "Kahoot redemption-style: Which means music from a movie?", a: ["Soundtrack", "Invoice", "Name tag", "Mousepad"], c: 0 },
      { type: "choice", q: "Kahoot redemption-style: Which is a follow-up movie?", a: ["Sequel", "Ticket booth", "Seat row", "Poster only"], c: 0 }
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
  function difficultyLabel(position) {
    if (position < 3) return "Easy";
    if (position < 6) return "Medium";
    if (position < 9) return "Hard";
    return "Very Hard";
  }
  function prepareProgressive(questions) {
    return questions.map((q, i) => ({ ...q, progressiveDifficulty: difficultyLabel(i) }));
  }
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
    byId("questionText").textContent = (q.progressiveDifficulty ? "[" + q.progressiveDifficulty + "] " : "") + q.q;
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