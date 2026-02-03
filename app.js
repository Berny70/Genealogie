let personnes = [];

// 🔹 IDs des parents racine
const ID_LUCIEN = 1;
const ID_PAULINE = 2;

fetch("genealogie_clean.json")
  .then(r => {
    if (!r.ok) throw new Error("Erreur HTTP " + r.status);
    return r.json();
  })
  .then(data => {
    console.log("JSON brut :", data);

    // 🛡️ Normalisation : tableau quoi qu’il arrive
    if (Array.isArray(data)) {
      personnes = data;
    } else if (data.personnes && Array.isArray(data.personnes)) {
      personnes = data.personnes;
    } else {
      throw new Error("Format JSON inattendu");
    }

    console.log("Personnes chargées :", personnes.length);

    // 🏷️ Titre
    document.querySelector("h1").textContent =
      `Descendants de Lucien & Pauline (${personnes.length} personnes)`;

    // 🌳 AFFICHAGE DU PREMIER RANG
    afficherPremierRang();
  })
  .catch(err => {
    console.error("Erreur chargement :", err);
    document.body.innerHTML +=
      "<p style='color:red;font-weight:bold'>Erreur de chargement des données</p>";
  });


// =========================
// 🌿 FONCTIONS
// =========================

function afficherPremierRang() {
  const enfantsBruts = personnes.filter(p =>
    p.ID_Père === ID_LUCIEN && p.ID_Mère === ID_PAULINE
  );

  // 🧹 Déduplication
  const seen = new Set();
  const enfants = enfantsBruts.filter(e => {
    const key = `${e.Prénom}|${e.Nom}|${e.Naissance}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log("Enfants uniques :", enfants);

  const container = document.createElement("div");
  container.id = "premier-rang";

  const h2 = document.createElement("h2");
  h2.textContent = "Enfants de Lucien & Pauline";
  container.appendChild(h2);

  const ul = document.createElement("ul");

  enfants.forEach(e => {
    const li = document.createElement("li");
    const naissance = e.Naissance ?? "?";
    const deces = e.Décès ?? "";
    li.textContent = `${e.Prénom} ${e.Nom} (${naissance}–${deces})`;
    ul.appendChild(li);
  });

  container.appendChild(ul);
  document.body.appendChild(container);
}
