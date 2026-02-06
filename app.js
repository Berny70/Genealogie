/*************************************************
 *  GÉNÉALOGIE – ARBRE INFINI (clic sur clic)
 *  Compatible genealogie.json (format actuel)
 *************************************************/

let personnes = [];

// Racines : Lucien & Pauline
const ID_LUCIEN = 1;
const ID_PAULINE = 2;

// =========================
// CHARGEMENT DU JSON
// =========================
fetch("genealogie.json")
  .then(r => {
    if (!r.ok) throw new Error("Erreur HTTP " + r.status);
    return r.json();
  })
  .then(data => {
    console.log("JSON chargé :", data.length, "personnes");
    personnes = data;

    const h1 = document.querySelector("h1");
    if (h1) {
      h1.textContent =
        `Descendants de Lucien & Pauline (${personnes.length} personnes)`;
    }

    afficherRacine();
  })
  .catch(err => {
    console.error("Erreur chargement JSON :", err);
    document.body.innerHTML +=
      "<p style='color:red;font-weight:bold'>Erreur de chargement de genealogie.json</p>";
  });

// =========================
// AFFICHAGE RACINE
// =========================
function afficherRacine() {
  const container = document.getElementById("arbre");
  container.innerHTML = "";

  const enfants = personnes.filter(p =>
    p["ID_Père"] === ID_LUCIEN && p["ID_Mère"] === ID_PAULINE
  );

  enfants.forEach(e => {
    container.appendChild(creerNoeud(e));
  });
}

// =========================
// CRÉATION D’UN NŒUD CLIQUABLE
// =========================
function creerNoeud(personne) {
  const wrapper = document.createElement("div");
  wrapper.className = "noeud";

  const bouton = document.createElement("button");
  bouton.className = "personne";
  bouton.textContent = formatPersonne(personne);

  const enfantsDiv = document.createElement("div");
  enfantsDiv.className = "enfants";
  enfantsDiv.style.display = "none";

  bouton.addEventListener("click", () => {
    // Chargement paresseux (une seule fois)
    if (enfantsDiv.childElementCount === 0) {
      const enfants = personnes.filter(p =>
        p["ID_Père"] === personne.ID || p["ID_Mère"] === personne.ID
      );

      enfants.forEach(enfant => {
        enfantsDiv.appendChild(creerNoeud(enfant));
      });
    }

    // Toggle afficher / masquer
    enfantsDiv.style.display =
      enfantsDiv.style.display === "none" ? "block" : "none";
  });

  wrapper.appendChild(bouton);
  wrapper.appendChild(enfantsDiv);

  return wrapper;
}

// =========================
// FORMAT TEXTE PERSONNE
// =========================
function formatPersonne(p) {
  const naissance = p["Naissance"] ?? "?";
  const deces = p["Décès"] ? `–${p["Décès"]}` : "";
  return `${p["Prénom"]} ${p["Nom"]} (${naissance}${deces})`;
}
