fetch("genealogie.json")
  .then(res => res.json())
  .then(data => {
    const rootId = "LUCIEN_MARCHANT_1873";
    const root = data[rootId];
    renderPerson(root, data, document.getElementById("tree"));
  });

function renderPerson(person, data, container) {
  const div = document.createElement("div");
  div.className = "person";

  div.innerHTML = `
    <strong>${person.prenom} ${person.nom}</strong><br>
    ${person.naissance ?? "?"} – ${person.deces ?? "?"}
  `;

  container.appendChild(div);

  if (person.enfants && person.enfants.length) {
    const childrenDiv = document.createElement("div");
    childrenDiv.className = "children";
    div.appendChild(childrenDiv);

    person.enfants.forEach(id => {
      if (data[id]) {
        renderPerson(data[id], data, childrenDiv);
      }
    });
  }
}
