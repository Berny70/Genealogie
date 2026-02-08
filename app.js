// Chargement du fichier JSON
fetch("genealogie_valide.json")
  .then(res => res.json())
  .then(data => initTree(data))
  .catch(err => console.error("Erreur JSON :", err));

/**
 * Initialisation de l'arbre
 * Point de départ : Lucien Marchant + conjointe
 */
function initTree(data) {
  const root = document.getElementById("tree");
  root.innerHTML = "";

  const lucien = data["LUCIEN_MARCHANT_1873"];
  if (!lucien) {
    console.error("Lucien Marchant introuvable dans le JSON");
    return;
  }

  // Récupération du premier conjoint (s'il existe)
  const conjointId = lucien.conjoints?.[0];
  const conjointe = data[conjointId] ?? {
    prenom: "Pauline",
    nom: "BIESWAL",
    naissance: "?",
    deces: "?"
  };

  // Bloc couple fondateur
  const coupleDiv = document.createElement("div");
  coupleDiv.className = "couple";

  coupleDiv.innerHTML = `
    <div class="name">
      ${formatPerson(lucien)}
      <br>✚<br>
      ${formatPerson(conjointe)}
    </div>
    <button>Afficher les enfants</button>
  `;

  const childrenDiv = document.createElement("div");
  childrenDiv.className = "children";
  childrenDiv.style.display = "none";

  coupleDiv.appendChild(childrenDiv);
  root.appendChild(coupleDiv);

  coupleDiv.querySelector("button").onclick = () => {
    toggleChildren(childrenDiv, lucien.enfants, data);
  };
}

/**
 * Affiche / masque les enfants d'une personne
 */
function toggleChildren(container, childrenIds, data) {
  if (!Array.isArray(childrenIds) || childrenIds.length === 0) {
    return;
  }

  if (container.childElementCount === 0) {
    childrenIds.forEach(id => {
      const person = data[id];
      if (!person) {
        console.warn("Personne absente du JSON :", id);
        return;
      }
      renderPerson(person, data, container);
    });
  }

  container.style.display =
    container.style.display === "none" ? "block" : "none";
}

/**
 * Affichage d'une personne et de son bouton "Afficher les enfants"
 */
function renderPerson(person, data, container) {
  if (!person) return;

  const div = document.createElement("div");
  div.className = "person";

  div.innerHTML = `
    <div class="name">
      ${formatPerson(person)}
    </div>
  `;

  container.appendChild(div);

  if (Array.isArray(person.enfants) && person.enfants.length > 0) {
    const btn = document.createElement("button");
    btn.textContent = "Afficher les enfants";

    const childrenDiv = document.createElement("div");
    childrenDiv.className = "children";
    childrenDiv.style.display = "none";

    btn.onclick = () => {
      toggleChildren(childrenDiv, person.enfants, data);
    };

    div.appendChild(btn);
    div.appendChild(childrenDiv);
  }
}

/**
 * Formatage d'une personne (nom + dates)
 */
function formatPerson(p) {
  if (!p) return "?";

  const prenom = p.prenom ?? "?";
  const nom = p.nom ?? "";
  const naissance = p.naissance ?? "?";
  const deces = p.deces ?? "";

  return `${prenom} ${nom} (${naissance}${deces ? "–" + deces : ""})`;
}
