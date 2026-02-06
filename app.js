/*************************************************
 *  GÉNÉALOGIE – ARBRE INFINI (clic sur clic)
 *  Compatible genealogie.json (format actuel)
 *************************************************/

let personnes = [];

// Racines
const ID_LUCIEN = 1;
const ID_PAULINE = 2;

// =========================
// ATTENTE DOM
// =========================
document.addEventListener("DOMContentLoaded", () => {

  // Boutons de navigation
  document.getElementById("showTree").addEventListener("click", () => {
    document.getElementById("tree").style.display = "block";
    document.getElementById("searchView").style.display = "none";
  });

  document.getElementById("showSearch").addEventListener("click", () => {
    document.getElementById("tree").style.display = "none";
    document.getElementById("searchView").style.display = "block";
  });

  chargerJSON();
});

// =========================
// CHARGEMENT JSON
// =========================
function chargerJSON() {
  fetch("genealogie.json")
    .then(r => {
      if (!r.ok) throw new Error("Erreur HTTP " + r.status);
      return r.json();
    })
    .then(data => {
      personnes = data;

      document.querySelector("h1").textContent =
        `Descendants de Lucien & Pauline (${personnes.length} personnes)`;

      afficherRacine();
    })
    .catch(err => {
      console.error("Erreur chargement JSON :", err);
      document.body.innerHTML +=
        "<p style='color:red;font-weight:bold'>Erreur de chargement genealogie.json</p>";
    });
}

// =========================
// AFFICHAGE RACINE
// =========================
function afficherRacine() {
  const container = document.getElementById("tree");

  if (!container) {
    console.error("❌ <div id='tree'> introuvable dans le HTML");
    return;
  }

  container.innerHTML = "";
  container.style.display = "block";

  const enfants = personnes.filter(p =>
    p["ID_Père"] === ID_LUCIEN && p["ID_Mère"] === ID_PAULINE
  );

  enfants.forEach(e => {
    container.appendChild(creerNoeud(e));
  });
}

// =========================
// CRÉATION NŒUD (ARBRE INFINI)
// =========================
function creerNoeud(personne) {
  const wrapper = document.createElement("div");
  wrapper.className = "person";

  const nom = document.createElement("div");
  nom.className = "name";
  nom.textContent = formatPersonne(personne);

  const enfantsDiv = document.createElement("div");
  enfantsDiv.className = "children";

  nom.addEventListener("click", () => {
    if (enfantsDiv.childElementCount === 0) {
      const enfants = personnes.filter(p =>
        p["ID_Père"] === personne.ID || p["ID_Mère"] === personne.ID
      );

      enfants.forEach(e => enfantsDiv.appendChild(creerNoeud(e)));
    }

    wrapper.classList.toggle("open");
  });

  wrapper.appendChild(nom);
  wrapper.appendChild(enfantsDiv);

  return wrapper;
}

// =========================
// FORMAT AFFICHAGE
// =========================
function formatPersonne(p) {
  const n = p.Naissance ?? "?";
  const d = p["Décès"] ? `–${p["Décès"]}` : "";
  return `${p["Prénom"]} ${p["Nom"]} (${n}${d})`;
}
