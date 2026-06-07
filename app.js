/* =========================================================
   UNDERCOVER - Jeu local sur un seul téléphone
   ========================================================= */

// === LISTE DES DUOS DE MOTS ===
// Format : [mot_principal, mot_undercover]
// Modifiable librement.
const WORD_PAIRS = [
  ["chat", "chien"],
  ["pizza", "burger"],
  ["soleil", "lune"],
  ["café", "thé"],
  ["vélo", "moto"],
  ["mer", "océan"],
  ["livre", "magazine"],
  ["pomme", "poire"],
  ["football", "rugby"],
  ["guitare", "piano"],
  ["train", "métro"],
  ["roi", "reine"],
  ["docteur", "infirmier"],
  ["bière", "vin"],
  ["étoile", "planète"],
  ["chaise", "tabouret"],
  ["fleur", "arbre"],
  ["neige", "pluie"],
  ["acteur", "chanteur"],
  ["pizza", "tarte"],
];

// === ÉTAT GLOBAL DU JEU ===
const state = {
  players: [],            // [{ name, word, isUndercover }]
  currentIndex: 0,        // index du joueur en cours de distribution
  mainWord: "",
  undercoverWord: "",
  undercoverIndex: -1,
  firstPlayerName: "",
};

// === HELPERS ===

/** Sélectionne un élément par ID */
const $ = (id) => document.getElementById(id);

/** Change l'écran actif */
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $(id).classList.add("active");
}

/** Entier aléatoire entre 0 et max-1 */
function randInt(max) {
  return Math.floor(Math.random() * max);
}

/* =========================================================
   ÉCRAN 1 : ACCUEIL / GESTION DES JOUEURS
   ========================================================= */

const playerInput = $("player-input");
const playersList = $("players-list");
const btnAdd = $("btn-add-player");
const btnStart = $("btn-start");

/** Ajoute un joueur à la liste */
function addPlayer() {
  const name = playerInput.value.trim();
  if (!name) return;

  // évite les doublons (insensible à la casse)
  const exists = state.players.some(
    (p) => p.name.toLowerCase() === name.toLowerCase()
  );
  if (exists) {
    playerInput.value = "";
    return;
  }

  state.players.push({ name, word: "", isUndercover: false });
  playerInput.value = "";
  renderPlayers();
  playerInput.focus();
}

/** Supprime un joueur */
function removePlayer(index) {
  state.players.splice(index, 1);
  renderPlayers();
}

/** Affiche la liste et active/désactive le bouton "Commencer" */
function renderPlayers() {
  playersList.innerHTML = "";
  state.players.forEach((p, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${escapeHtml(p.name)}</span>
      <button class="remove" data-index="${i}" aria-label="Supprimer">✕</button>
    `;
    playersList.appendChild(li);
  });

  // active "Commencer" si au moins 3 joueurs
  btnStart.disabled = state.players.length < 3;
}

/** Échappe le HTML pour éviter toute injection */
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;"
  }[c]));
}

// === Listeners écran accueil ===
btnAdd.addEventListener("click", addPlayer);
playerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addPlayer();
});
playersList.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove")) {
    removePlayer(parseInt(e.target.dataset.index, 10));
  }
});
btnStart.addEventListener("click", startGame);

/* =========================================================
   DÉMARRAGE DE LA PARTIE
   ========================================================= */

function startGame() {
  // 1. choisir un duo de mots
  const pair = WORD_PAIRS[randInt(WORD_PAIRS.length)];
  state.mainWord = pair[0];
  state.undercoverWord = pair[1];

  // 2. choisir l'undercover
  state.undercoverIndex = randInt(state.players.length);

  // 3. attribuer les mots
  state.players.forEach((p, i) => {
    p.isUndercover = i === state.undercoverIndex;
    p.word = p.isUndercover ? state.undercoverWord : state.mainWord;
  });

  // 4. lancer la distribution
  state.currentIndex = 0;
  showPassScreen();
}

/* =========================================================
   ÉCRAN 2 : DISTRIBUTION DES MOTS
   ========================================================= */

/** A : "Donner le téléphone à X" */
function showPassScreen() {
  const player = state.players[state.currentIndex];
  $("pass-player-name").textContent = player.name;
  showScreen("screen-pass");
}

/** B : Affiche le mot du joueur */
function showWordScreen() {
  const player = state.players[state.currentIndex];
  $("word-display").textContent = player.word;
  showScreen("screen-word");
}

/** C : Écran neutre entre 2 joueurs, ou démarrage du jeu */
function showNextOrStart() {
  state.currentIndex++;

  if (state.currentIndex >= state.players.length) {
    // tous les joueurs ont vu leur mot → désigner qui commence
    const starter = state.players[randInt(state.players.length)];
    state.firstPlayerName = starter.name;
    $("first-player-name").textContent = starter.name;
    showScreen("screen-first");
  } else {
    showScreen("screen-next");
  }
}

// === Listeners écran distribution ===
$("btn-see-word").addEventListener("click", showWordScreen);
$("btn-word-seen").addEventListener("click", showNextOrStart);
$("btn-next-player").addEventListener("click", showPassScreen);
$("btn-start-vote").addEventListener("click", showVoteScreen);

/* =========================================================
   ÉCRAN 3 : PHASE DE VOTE
   ========================================================= */

function showVoteScreen() {
  const container = $("vote-buttons");
  container.innerHTML = "";

  state.players.forEach((p, i) => {
    const btn = document.createElement("button");
    btn.className = "vote-btn";
    btn.textContent = p.name;
    btn.dataset.index = i;
    btn.addEventListener("click", () => handleVote(i));
    container.appendChild(btn);
  });

  showScreen("screen-vote");
}

/** Gère le clic sur un joueur éliminé */
function handleVote(index) {
  const eliminated = state.players[index];
  const undercover = state.players[state.undercoverIndex];
  const wasUndercover = eliminated.isUndercover;

  $("result-title").textContent = wasUndercover
    ? "🎉 Bravo, les civils gagnent !"
    : "😈 L'Undercover s'en sort !";

  $("result-text").innerHTML = `
    Vous avez éliminé <strong>${escapeHtml(eliminated.name)}</strong>.<br />
    ${wasUndercover
      ? "C'était bien l'Undercover !"
      : "Ce n'était pas l'Undercover…"}
  `;

  $("reveal-main").textContent = state.mainWord;
  $("reveal-undercover").textContent = state.undercoverWord;
  $("reveal-uc-name").textContent = undercover.name;

  showScreen("screen-result");
}

/* =========================================================
   ÉCRAN 4 : FIN / REJOUER
   ========================================================= */

$("btn-replay").addEventListener("click", () => {
  // garde les mêmes joueurs, redémarre une partie
  startGame();
});

$("btn-home").addEventListener("click", () => {
  // reset complet
  state.players = [];
  renderPlayers();
  showScreen("screen-home");
});

/* =========================================================
   INITIALISATION
   ========================================================= */

renderPlayers();
showScreen("screen-home");
