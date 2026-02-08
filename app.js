fetch("genealogie_valide.json")
  .then(r => r.json())
  .then(data => initTree(data))
  .catch(e => console.error("Erreur JSON :", e));

function initTree(data) {
  const root = document.getElementById("tree");
  root.innerHTML = "";

  const lucien = data["LUCIEN_MARCHANT_1873"];
  console.log("Lucien :", lucien);

  if (!lucien) {
    console.error("Lucien introuvable");
    return;
  }

  const conjointId = lucien.conjoints?.[0];
  const conjointe = data[conjointId] || {
    prenom: "Pauline",
    nom: "BIESWAL",
    naissance: "?",
    deces: "?"
  };

  const coupleDiv = document.createElement("div");
  coupleDiv.className = "couple";
  coupleDiv.innerHTML = `
    <div class="name">
      ${safeFormat(lucien)}
      <br>✚<br>
      ${safeFormat(conjointe)}
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
  if (!Array.isArray(childrenIds)) return;

  if (container.childElementCount === 0) {
    childrenIds.forEach(id => {
      const person = data[id];
      if (!person) {
        console.warn("Personne absente du JSON :", id);
        return; // ⛔ PAS de renderPerson
      }
      renderPerson(person, data, container);
    });
  }

  container.style.display =
    container.style.display === "none" ? "block" : "none";
}

function renderPerson(person, data, container) {
  if (!person || typeof person !== "object") return;

  const div = document.createElement("div");
  div.className = "person";
  div.innerHTML = `<div class="name">${safeFormat(person)}</div>`;
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

function safeFormat(p) {
  if (!p || typeof p !== "object") return "❓ Personne inconnue";

  const prenom = p.prenom || "?";
  const nom = p.nom || "";
  const naissance = p.naissance || "?";
  const deces = p.deces || "";

  return `${prenom} ${nom} (${naissance}${deces ? "–" + deces : ""})`;
}
