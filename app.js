fetch("genealogie_valide.json")
  .then(r => r.text())
  .then(t => {
    console.log("DÉBUT :", t.slice(0, 100));
  });
function initTree(data) {
  const root = document.getElementById("tree");

  const lucien = data["LUCIEN_MARCHANT_1873"];
  const pauline = data["PAULINE_BIESWAL_1879"];

  const coupleDiv = document.createElement("div");
  coupleDiv.className = "couple";

  coupleDiv.innerHTML = `
    <div class="name">
      ${lucien.prenom} ${lucien.nom} (${lucien.naissance}–${lucien.deces})
      <br>✚
      <br>${pauline.prenom} ${pauline.nom} (${pauline.naissance}–${pauline.deces})
    </div>
    <button>Afficher les enfants</button>
  `;

  const childrenDiv = document.createElement("div");
  childrenDiv.className = "children";

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
