const ADMIN_CODE = "MHI-ADMIN-FRIDAY-2026";

const GAMES = {
  Trivia: [
    { type: "choice", q: "What is a movie preview called?", a: ["Trailer", "Receipt", "Spreadsheet", "Invoice"], c: 0 },
    { type: "choice", q: "What do you call the music from a movie?", a: ["Soundtrack", "Memo", "Ledger", "Subtitle"], c: 0 },
    { type: "choice", q: "Which is a movie genre?", a: ["Comedy", "Keyboard", "Stapler", "Calendar"], c: 0 },
    { type: "choice", q: "What is a sequel?", a: ["A follow-up movie", "A snack", "A theater chair", "A poster only"], c: 0 },
    { type: "choice", q: "Who acts in movies?", a: ["Actor", "Mechanic only", "Cashier only", "Pilot only"], c: 0 }
  ],
  Emoji: [
    { type: "choice", q: "Guess: 🦁👑", a: ["The Lion King", "Frozen", "Jaws", "Cars"], c: 0 },
    { type: "choice", q: "Guess: 🧊👸❄️", a: ["Frozen", "Titanic", "Up", "Shrek"], c: 0 },
    { type: "choice", q: "Guess: 🐠🌊🔍", a: ["Finding Nemo", "Cars", "Rocky", "Scream"], c: 0 },
    { type: "choice", q: "Guess: 🧸🤠🚀", a: ["Toy Story", "Jaws", "Avatar", "Grease"], c: 0 },
    { type: "choice", q: "Guess: 🧌🫏👸", a: ["Shrek", "Titanic", "Up", "Coco"], c: 0 }
  ],
  Scramble: [
    { type: "typed", q: "Unscramble: MLIF", answer: "film" },
    { type: "typed", q: "Unscramble: POCORPN", answer: "popcorn" },
    { type: "typed", q: "Unscramble: CESEN", answer: "scene" },
    { type: "typed", q: "Unscramble: POLT", answer: "plot" },
    { type: "typed", q: "Unscramble: COTAR", answer: "actor" }
  ],
  SelectAll: [
    { type: "selectAll", q: "Select all movie snacks.", a: ["Popcorn", "Candy", "Soda", "Keyboard"], c: [0, 1, 2] },
    { type: "selectAll", q: "Select all movie jobs.", a: ["Director", "Actor", "Editor", "Printer"], c: [0, 1, 2] },
    { type: "selectAll", q: "Select all genres.", a: ["Horror", "Comedy", "Drama", "Stapler"], c: [0, 1, 2] },
    { type: "selectAll", q: "Select all movie terms.", a: ["Scene", "Plot", "Trailer", "Receipt"], c: [0, 1, 2] }
  ],
  Matching: [
    { type: "matching", q: "Match the terms.", pairs: [["Trailer", "Preview"], ["Genre", "Type"], ["Actor", "Performer"], ["Credits", "Worker list"], ["Scene", "Movie section"]] }
  ],
  Kahoot: [
    { type: "choice", q: "Kahoot: Which is a movie award?", a: ["Oscar", "Receipt", "Stapler", "Keyboard"], c: 0 },
    { type: "choice", q: "Kahoot: Which is a movie job?", a: ["Director", "Dentist only", "Bank teller only", "Pilot only"], c: 0 },
    { type: "choice", q: "Kahoot: Which is a theater snack?", a: ["Popcorn", "Printer ink", "Notebook", "Mouse"], c: 0 },
    { type: "choice", q: "Kahoot: Which means first showing?", a: ["Premiere", "Invoice", "Spreadsheet", "Receipt"], c: 0 },
    { type: "choice", q: "Kahoot: Which is a preview?", a: ["Trailer", "Credits", "Payroll", "Calendar"], c: 0 }
  ]
};

let player = "";
let active = [];
let index = 0;
let score = 0;
let selected = new Set();

const $ = (id) => document.getElementById(id);

function kahootOpen() {
  return localStorage.getItem("mhiKahootOpen") === "true";
}

function updateKahootStatus() {
  const el = $("kahootStatus");
  if (el) el.textContent = kahootOpen() ? "Kahoot is OPEN" : "Kahoot is CLOSED";
}

function pickGame() {
  const gameName = $("gameSelect").value;

  if (gameName === "Kahoot" && !kahootOpen()) {
    alert("Kahoot is closed. Admin must open it first.");
    return null;
  }

  if (gameName === "Random") {
    const allowed = Object.keys(GAMES).filter((name) => name !== "Kahoot");
    const allQuestions = allowed.flatMap((name) => GAMES[name]);
    return allQuestions.sort(() => Math.random() - 0.5).slice(0, 7);
  }

  return [...GAMES[gameName]].sort(() => Math.random() - 0.5).slice(0, 7);
}

function start() {
  player = $("playerName").value.trim() || "Guest";
  active = pickGame();
  if (!active || active.length === 0) return;

  index = 0;
  score = 0;
  $("entryPanel").classList.add("hidden");
  $("activePanel").classList.remove("hidden");
  render();
}

function render() {
  const question = active[index];

  $("questionText").textContent = question.q;
  $("answers").innerHTML = "";
  $("matchingBox").innerHTML = "";
  $("typedBox").classList.add("hidden");
  $("matchingBox").classList.add("hidden");
  $("nextBtn").disabled = true;
  $("feedback").textContent = "Score: " + score;
  selected = new Set();

  if (question.type === "choice") {
    question.a.forEach((answerText, answerIndex) => {
      const button = document.createElement("button");
      button.className = "answer-btn";
      button.textContent = answerText;
      button.onclick = () => answer(answerIndex === question.c, button);
      $("answers").appendChild(button);
    });
  }

  if (question.type === "typed") {
    $("typedBox").classList.remove("hidden");
  }

  if (question.type === "selectAll") {
    question.a.forEach((answerText, answerIndex) => {
      const button = document.createElement("button");
      button.className = "answer-btn";
      button.textContent = answerText;
      button.onclick = () => {
        if (selected.has(answerIndex)) {
          selected.delete(answerIndex);
          button.classList.remove("correct");
        } else {
          selected.add(answerIndex);
          button.classList.add("correct");
        }
      };
      $("answers").appendChild(button);
    });

    const submit = document.createElement("button");
    submit.textContent = "Submit Selected";
    submit.onclick = () => {
      const chosen = [...selected].sort().join(",");
      const correct = [...question.c].sort().join(",");
      answer(chosen === correct);
    };
    $("answers").appendChild(submit);
  }

  if (question.type === "matching") {
    $("matchingBox").classList.remove("hidden");
    const rightAnswers = question.pairs.map((pair) => pair[1]).sort(() => Math.random() - 0.5);

    question.pairs.forEach((pair) => {
      const row = document.createElement("div");
      row.className = "match-row";

      const left = document.createElement("strong");
      left.textContent = pair[0];

      const select = document.createElement("select");
      select.dataset.correct = pair[1];
      select.innerHTML = '<option value="">Choose</option>' + rightAnswers.map((item) => '<option value="' + item + '">' + item + '</option>').join("");

      row.appendChild(left);
      row.appendChild(select);
      $("matchingBox").appendChild(row);
    });

    const submit = document.createElement("button");
    submit.textContent = "Submit Matching";
    submit.onclick = () => {
      const allCorrect = [...document.querySelectorAll("#matchingBox select")].every((select) => select.value === select.dataset.correct);
      answer(allCorrect);
    };
    $("matchingBox").appendChild(submit);
  }
}

function submitTyped() {
  const question = active[index];
  const guess = $("typedAnswer").value.trim().toLowerCase();

  if (!guess) {
    alert("Type an answer first.");
    return;
  }

  $("typedAnswer").value = "";
  answer(guess === question.answer.toLowerCase());
}

function answer(isCorrect, button = null) {
  [...document.querySelectorAll(".answer-btn")].forEach((btn) => btn.disabled = true);

  if (button) button.classList.add(isCorrect ? "correct" : "wrong");
  if (isCorrect) score += 10;

  $("feedback").textContent = isCorrect ? "Correct! Score: " + score : "Not quite. Score: " + score;
  $("nextBtn").disabled = false;
}

function next() {
  index += 1;

  if (index < active.length) {
    render();
    return;
  }

  score += 5;
  saveScore();
  $("questionText").textContent = "Game complete! Final score: " + score;
  $("answers").innerHTML = "";
  $("typedBox").classList.add("hidden");
  $("matchingBox").classList.add("hidden");
  $("nextBtn").disabled = true;
  $("entryPanel").classList.remove("hidden");
}

function saveScore() {
  const scores = JSON.parse(localStorage.getItem("mhiFunScores") || "[]");
  scores.push({
    name: player,
    score,
    date: new Date().toLocaleDateString(),
    game: $("gameSelect").value
  });
  localStorage.setItem("mhiFunScores", JSON.stringify(scores.slice(-100)));
  updateLeaderboard();
}

function updateLeaderboard() {
  const scores = JSON.parse(localStorage.getItem("mhiFunScores") || "[]")
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  $("leaderboard").innerHTML = "";

  scores.forEach((entry) => {
    const item = document.createElement("li");
    item.innerHTML = "<strong>" + entry.name + "</strong> — " + entry.score + " pts<br><small>" + entry.game + " • " + entry.date + "</small>";
    $("leaderboard").appendChild(item);
  });
}

function adminSetKahoot(open) {
  if ($("funAdminCode").value !== ADMIN_CODE) {
    alert("Invalid admin code.");
    return;
  }

  localStorage.setItem("mhiKahootOpen", open ? "true" : "false");
  updateKahootStatus();
}

function resetScores() {
  if (!confirm("Reset the local MHI Mini Games leaderboard on this browser?")) return;
  localStorage.removeItem("mhiFunScores");
  updateLeaderboard();
}

$("startBtn").onclick = start;
$("submitTypedBtn").onclick = submitTyped;
$("nextBtn").onclick = next;
$("resetBtn").onclick = resetScores;
$("openKahootBtn").onclick = () => adminSetKahoot(true);
$("closeKahootBtn").onclick = () => adminSetKahoot(false);

updateLeaderboard();
updateKahootStatus();
