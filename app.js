let personnes = [];

// 🔹 IDs des parents racine
const ID_LUCIEN = 1;
const ID_PAULINE = 2;

fetch("genealogie.json")
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
  const enfants = personnes.filter(p =>
    p.pere === ID_LUCIEN && p.mere === ID_PAULINE
  );

  console.log("Enfants :", enfants);

  const container = document.createElement("div");
  container.id = "premier-rang";

  const h2 = document.createElement("h2");
  h2.textContent = "Enfants de Lucien & Pauline";
  container.appendChild(h2);

  const ul = document.createElement("ul");

  enfants.forEach(e => {
    const li = document.createElement("li");

    const btn = document.createElement("button");
    const naissance = e.naissance ?? "?";
    const deces = e.deces ?? "";

    btn.textContent = `${e.prenom} ${e.nom} (${naissance}–${deces})`;

    // ✅ CLIC
    btn.addEventListener("click", () => {
      afficherDescendance(e.id);
    });

    li.appendChild(btn);
    ul.appendChild(li);
  });

  container.appendChild(ul);
  document.body.appendChild(container);
}
function afficherDescendance(idParent) {
  console.log("Afficher descendance de", idParent);

  // 🔄 Nettoyage ancien affichage
  document.querySelectorAll(".descendance").forEach(e => e.remove());

  const enfants = personnes.filter(p =>
    p.pere === idParent || p.mere === idParent
  );

  if (enfants.length === 0) return;

  const div = document.createElement("div");
  div.className = "descendance";

  const ul = document.createElement("ul");

  enfants.forEach(e => {
    const li = document.createElement("li");
    li.textContent = `${e.prenom} ${e.nom}`;
    ul.appendChild(li);
  });

  div.appendChild(ul);
  document.body.appendChild(div);
}

