let PERSONS = {};
let CHILDREN = {};

const treeDiv = document.getElementById("tree");
const searchView = document.getElementById("searchView");

document.getElementById("showTree").onclick = () => {
  treeDiv.style.display = "block";
  searchView.style.display = "none";
};

document.getElementById("showSearch").onclick = () => {
  treeDiv.style.display = "none";
  searchView.style.display = "block";
};

// Charger les données
fetch("/Genealogie/genealogie.json")
  .then(r => r.json())
  .then(data => {
    PERSONS = data.persons;

    // index enfants
    Object.values(PERSONS).forEach(p => {
      if (p.pere) {
        CHILDREN[p.pere] = CHILDREN[p.pere] || [];
        CHILDREN[p.pere].push(p.id);
      }
      if (p.mere) {
        CHILDREN[p.mere] = CHILDREN[p.mere] || [];
        CHILDREN[p.mere].push(p.id);
      }
    });

    initSearch();
    buildTree();
  });

// 🌳 construire l’arbre
function buildTree() {
  treeDiv.innerHTML = "";
  const root = 1; // Lucien
  treeDiv.appendChild(renderPerson(root, 0));
}

function renderPerson(id, level) {
  const p = PERSONS[id];
  const container = document.createElement("div");
  container.style.marginLeft = level * 20 + "px";

  const label = document.createElement("div");
  label.textContent = `${p.prenom} ${p.nom}`;
  label.style.cursor = "pointer";
  label.style.fontWeight = "bold";

  container.appendChild(label);

  const childrenDiv = document.createElement("div");
  childrenDiv.style.display = "none";
  container.appendChild(childrenDiv);

  label.onclick = () => {
    if (childrenDiv.childElementCount === 0) {
      (CHILDREN[id] || []).forEach(cid => {
        childrenDiv.appendChild(renderPerson(cid, level + 1));
      });
    }
    childrenDiv.style.display =
      childrenDiv.style.display === "none" ? "block" : "none";
  };

  return container;
}

// 🔎 recherche (inchangée)
function initSearch() {
  const input = document.getElementById("search");
  const results = document.getElementById("results");

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    results.innerHTML = "";

    if (q.length < 2) return;

    Object.values(PERSONS)
      .filter(p =>
        p.nom.toLowerCase().includes(q) ||
        p.prenom.toLowerCase().includes(q)
      )
      .slice(0, 50)
      .forEach(p => {
        const li = document.createElement("li");
        li.textContent = `${p.prenom} ${p.nom}`;
        results.appendChild(li);
      });
  });
}

// PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/Genealogie/service-worker.js");
}
