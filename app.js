/* =========================================================
   UNDERCOVER - Jeu local sur un seul téléphone
   ========================================================= */

/* =========================================================
   DUOS DE MOTS PAR CATÉGORIE
   ========================================================= */
const WORD_PAIRS = {
  classique: [
    ["chat", "chien"],
    ["lion", "tigre"],
    ["cheval", "âne"],
    ["lapin", "hamster"],
    ["dauphin", "requin"],
    ["aigle", "faucon"],
    ["abeille", "guêpe"],
    ["crocodile", "alligator"],
    ["pigeon", "moineau"],
    ["loup", "renard"],
    ["pizza", "burger"],
    ["pâtes", "riz"],
    ["frites", "chips"],
    ["café", "thé"],
    ["chocolat", "vanille"],
    ["pain", "brioche"],
    ["beurre", "margarine"],
    ["sucre", "sel"],
    ["citron", "orange"],
    ["fraise", "framboise"],
    ["glace", "sorbet"],
    ["crêpe", "gaufre"],
    ["sushi", "maki"],
    ["kebab", "tacos"],
    ["coca", "pepsi"],
    ["téléphone", "tablette"],
    ["livre", "magazine"],
    ["stylo", "crayon"],
    ["voiture", "moto"],
    ["train", "métro"],
    ["avion", "hélicoptère"],
    ["lit", "canapé"],
    ["douche", "bain"],
    ["lunettes", "lentilles"],
    ["montre", "bracelet"],
    ["sac", "valise"],
    ["clé", "cadenas"],
    ["soleil", "lune"],
    ["mer", "océan"],
    ["montagne", "colline"],
    ["forêt", "jungle"],
    ["plage", "désert"],
    ["rivière", "fleuve"],
    ["pluie", "neige"],
    ["étoile", "planète"],
    ["jardin", "parc"],
    ["ville", "village"],
    ["football", "rugby"],
    ["tennis", "badminton"],
    ["basket", "handball"],
    ["natation", "plongée"],
    ["boxe", "MMA"],
    ["ski", "snowboard"],
    ["vélo", "trottinette"]
  ],

  popculture: [
    ["Harry Potter", "Le Seigneur des Anneaux"],
    ["Batman", "Superman"],
    ["Iron Man", "Captain America"],
    ["Thor", "Hulk"],
    ["Spider-Man", "Deadpool"],
    ["Game of Thrones", "House of the Dragon"],
    ["Breaking Bad", "Better Call Saul"],
    ["Stranger Things", "Dark"],
    ["La Casa de Papel", "Lupin"],
    ["Peaky Blinders", "Narcos"],
    ["Squid Game", "Alice in Borderland"],
    ["The Witcher", "Vikings"],
    ["Joker", "Dark Knight"],
    ["Avatar", "Titanic"],
    ["Inception", "Interstellar"],
    ["Avengers", "Justice League"],
    ["Star Wars", "Star Trek"],
    ["Frozen", "Raiponce"],
    ["Fortnite", "PUBG"],
    ["Minecraft", "Roblox"],
    ["FIFA", "PES"],
    ["GTA", "Red Dead"],
    ["Mario", "Sonic"],
    ["Zelda", "Pokémon"],
    ["Call of Duty", "Battlefield"],
    ["League of Legends", "Dota"],
    ["Valorant", "CS:GO"],
    ["Among Us", "Fall Guys"],
    ["Instagram", "Snapchat"],
    ["TikTok", "Reels"],
    ["YouTube", "Twitch"],
    ["WhatsApp", "Telegram"],
    ["Netflix", "Prime Video"],
    ["Spotify", "Deezer"],
    ["Uber", "Bolt"],
    ["Airbnb", "Booking"],
    ["iPhone", "Samsung"],
    ["Mac", "PC"],
    ["Google", "Bing"],
    ["ChatGPT", "Gemini"],
    ["Booba", "Kaaris"],
    ["PNL", "Nekfeu"],
    ["Damso", "Orelsan"],
    ["Jul", "Naps"],
    ["Aya Nakamura", "Wejdene"],
    ["Ninho", "Niska"],
    ["SCH", "Lacrim"],
    ["Stromae", "Angèle"]
  ],

  france: [
    ["baguette", "croissant"],
    ["camembert", "brie"],
    ["raclette", "fondue"],
    ["Paris", "Marseille"],
    ["Tour Eiffel", "Arc de Triomphe"],
    ["TGV", "RER"],
    ["Carrefour", "Leclerc"],
    ["McDo", "Burger King"],
    ["Renault", "Peugeot"],
    ["PSG", "OM"],
    ["Mbappé", "Griezmann"],
    ["Zidane", "Henry"]
  ],

  maroc: [
    ["tajine", "couscous"],
    ["msemen", "baghrir"],
    ["harira", "bissara"],
    ["thé à la menthe", "café noss-noss"],
    ["pastilla", "rfissa"],
    ["chebakia", "briouates"],
    ["zaalouk", "taktouka"],
    ["khobz", "batbout"],
    ["Casablanca", "Rabat"],
    ["Marrakech", "Fès"],
    ["Tanger", "Agadir"],
    ["Chefchaouen", "Essaouira"],
    ["Atlas", "Rif"],
    ["djellaba", "kaftan"],
    ["babouches", "belgha"],
    ["hammam", "spa"],
    ["souk", "médina"],
    ["Raja", "Wydad"],
    ["Hakimi", "Ziyech"],
    ["dirham", "euro"],
    ["3la slamtek", "bsahtek"]
  ]
};

/** Métadonnées d'affichage des catégories (label + emoji) */
const CATEGORIES = [
  { id: "classique",  label: "Classique",   emoji: "🎯" },
  { id: "popculture", label: "Pop Culture", emoji: "🎬" },
  { id: "france",     label: "France",      emoji: "🇫🇷" },
  { id: "maroc",      label: "Maroc",       emoji: "🇲🇦" }
];


// === ÉTAT GLOBAL DU JEU ===
const state = {
  players: [],            // [{ name, word, isUndercover }]
  selectedCategories: ["classique", "popculture", "france", "maroc"], // toutes par défaut
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
/** Génère les boutons de catégories sur l'écran d'accueil */
function renderCategories() {
  const container = $("categories-list");
  container.innerHTML = "";

  CATEGORIES.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "category-btn";
    btn.textContent = `${cat.emoji} ${cat.label}`;
    btn.dataset.id = cat.id;

    if (state.selectedCategories.includes(cat.id)) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", () => toggleCategory(cat.id));
    container.appendChild(btn);
  });

  updateStartButton();
}

/** Active/désactive une catégorie */
function toggleCategory(id) {
  const idx = state.selectedCategories.indexOf(id);
  if (idx >= 0) {
    state.selectedCategories.splice(idx, 1);
  } else {
    state.selectedCategories.push(id);
  }
  renderCategories();
}

/** Retourne tous les duos des catégories sélectionnées */
function getActiveWordPairs() {
  const pairs = [];
  state.selectedCategories.forEach(catId => {
    if (WORD_PAIRS[catId]) pairs.push(...WORD_PAIRS[catId]);
  });
  return pairs;
}

/** Met à jour l'état du bouton "Commencer" */
function updateStartButton() {
  const enoughPlayers   = state.players.length >= 3;
  const hasCategory     = state.selectedCategories.length > 0;
  $("btn-start").disabled = !(enoughPlayers && hasCategory);
}

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
  updateStartButton();
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
  const pairs = getActiveWordPairs();
  const pair  = pairs[randInt(pairs.length)];
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
/** Passe au joueur suivant, ou démarre le jeu si tous ont vu leur mot */
function showNextOrStart() {
  state.currentIndex++;

  if (state.currentIndex >= state.players.length) {
    // tous les joueurs ont vu leur mot → désigner qui commence
    const starter = state.players[randInt(state.players.length)];
    state.firstPlayerName = starter.name;
    $("first-player-name").textContent = starter.name;
    showScreen("screen-first");
  } else {
    // on enchaîne directement sur "Donner le téléphone à X"
    showPassScreen();
  }
}


// === Listeners écran distribution ===
$("btn-see-word").addEventListener("click", showWordScreen);
$("btn-word-seen").addEventListener("click", showNextOrStart);
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
  renderCategories();
  renderPlayers();
  showScreen("screen-home");
});

/* =========================================================
   INITIALISATION
   ========================================================= */

renderPlayers();
showScreen("screen-home");
