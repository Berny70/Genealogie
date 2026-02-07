let DATA = {};

fetch("gene.json")
  .then(r => r.json())
  .then(d => {
    DATA = d;
    renderList(Object.values(DATA));
  });

const listDiv = document.getElementById("list");
const personDiv = document.getElementById("person");
const searchInput = document.getElementById("search");

searchInput.addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  const people = Object.values(DATA).filter(p =>
    (p.nom || "").toLowerCase().includes(q) ||
    (p.prenom || "").toLowerCase().includes(q)
  );
  renderList(people);
});

function renderList(people) {
  listDiv.innerHTML = people.map(p => `
    <div class="item" onclick="showPerson('${p.id}')">
      ${p.prenom || ""} ${p.nom || ""}
    </div>
  `).join("");
}

function showPerson(id) {
  const p = DATA[id];
  if (!p) return;

  const link = (ids) =>
    ids.map(i =>
      DATA[i]
        ? `<span onclick="showPerson('${i}')">${DATA[i].prenom} ${DATA[i].nom}</span>`
        : ""
    ).join(", ");

  personDiv.innerHTML = `
    <h2>${p.prenom} ${p.nom}</h2>
    <p>Naissance : ${p.naissance || "?"}</p>
    <p>Décès : ${p.deces || ""}</p>
    <p><strong>Parents :</strong> ${link(p.parents || [])}</p>
    <p><strong>Conjoints :</strong> ${link(p.conjoints || [])}</p>
    <p><strong>Enfants :</strong> ${link(p.enfants || [])}</p>
  `;
}
