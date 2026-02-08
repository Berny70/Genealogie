fetch("genealogie_valide.json")
  .then(res => res.json())
  .then(data => initTree(data))
  .catch(err => console.error("Erreur JSON :", err));

function initTree(data) {
  const root = document.getElementById("tree");

  const lucien = data["LUCIEN_MARCHANT_1873"];
   console.log("Lucien :", lucien);
  if (!lucien) {
    console.error("Lucien introuvable");
    return;
  }

  const paulineId = lucien.conjoints?.[0];
  const pauline = data[paulineId];

  if (!pauline) {
    console.warn("Conjointe introuvable pour Lucien :", paulineId);
  }

  const coupleDiv = document.createElement("div");
  coupleDiv.className = "couple";

  coupleDiv.innerHTML = `
    <div class="name">
      ${lucien.prenom} ${lucien.nom}
      (${lucien.naissance ?? "?"}–${lucien.deces ?? "?"})
      <br>✚<br>
      ${
        pauline
          ? `${pauline.prenom} ${pauline.nom}
             (${pauline.naissance ?? "?"}–${pauline.deces ?? "?"})`
          : "Conjointe inconnue"
      }
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


function toggleChildren(container, childrenIds, data) {
  if (container.childElementCount === 0) {
    childrenIds.forEach(id => {
      renderPerson(data[id], data, container);
    });
  }
  container.style.display =
    container.style.display === "none" ? "block" : "none";
}

function renderPerson(person, data, container) {
  const div = document.createElement("div");
  div.className = "person";

  div.innerHTML = `
    <div class="name">
      ${person.prenom} ${person.nom}
      ${person.naissance ? `(${person.naissance}–${person.deces ?? ""})` : ""}
    </div>
  `;

  container.appendChild(div);

  if (person.enfants && person.enfants.length > 0) {
    const btn = document.createElement("button");
    btn.textContent = "Afficher les enfants";

    const childrenDiv = document.createElement("div");
    childrenDiv.className = "children";

    btn.onclick = () => {
      toggleChildren(childrenDiv, person.enfants, data);
    };

    div.appendChild(btn);
    div.appendChild(childrenDiv);
  }
}
