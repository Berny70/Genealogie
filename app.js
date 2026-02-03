document.addEventListener("DOMContentLoaded", () => {

  let PERSONS = {};
  let CHILDREN = {};

  const treeDiv = document.getElementById("tree");

  document.getElementById("showTree").onclick = () => {
    treeDiv.style.display = "block";
    document.getElementById("searchView").style.display = "none";
  };

  document.getElementById("showSearch").onclick = () => {
    treeDiv.style.display = "none";
    document.getElementById("searchView").style.display = "block";
  };

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

      buildTree();
      initSearch();
    });

  // 🌳 arbre principal
  function buildTree() {
    treeDiv.innerHTML = "";

    const lucien = renderPerson(1, true);
    treeDiv.appendChild(lucien);

    // ouvrir automatiquement les enfants de Lucien
    lucien.classList.add("open");
  }

  function renderPerson(id, isRoot = false) {
    const p = PERSONS[id];
    const container = document.createElement("div");
    container.className = "person";

    // nom + dates
    const name = document.createElement("div");
    name.className = "name";
    name.textContent = `${p.prenom} ${p.nom}`;
    container.appendChild(name);

    if (p.naissance || p.deces) {
      const dates = document.createElement("div");
      dates.className = "dates";
      dates.textContent =
        `(${p.naissance || "?"}–${p.deces || "?"})`;
      container.appendChild(dates);
    }

    // conjoints
    (p.conjoints || []).forEach(cid => {
      const c = PERSONS[cid];
      if (!c) return;
      const conj = document.createElement("div");
      conj.className = "conjoint";
      conj.textContent = `💍 ${c.prenom} ${c.nom}`;
      container.appendChild(conj);
    });

    // enfants
    const childrenDiv = document.createElement("div");
    childrenDiv.className = "children";
    container.appendChild(childrenDiv);

    (CHILDREN[id] || []).forEach(cid => {
      childrenDiv.appendChild(renderPerson(cid));
    });

    // clic = ouvrir / fermer
    name.onclick = () => {
      container.classList.toggle("open");
    };

    // clic long = fiche personne
    let pressTimer;
    name.onmousedown = () => {
      pressTimer = setTimeout(() => showPerson(p), 600);
    };
    name.onmouseup = () => clearTimeout(pressTimer);
    name.onmouseleave = () => clearTimeout(pressTimer);

    return container;
  }

  // 📄 fiche personne
  function showPerson(p) {
    alert(
      `${p.prenom} ${p.nom}\n\n` +
      `Naissance : ${p.naissance || "?"}\n` +
      `Décès : ${p.deces || "?"}\n` +
      `Génération : ${p.generation}`
    );
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
          li.onclick = () => showPerson(p);
          results.appendChild(li);
        });
    });
  }

  // PWA
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/Genealogie/service-worker.js");
  }

});
