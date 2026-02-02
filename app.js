let PERSONS = {};

fetch("/Genealogie/genealogie.json")
  .then(r => r.json())
  .then(data => {
    PERSONS = data.persons;
    document.getElementById("results").innerHTML =
      `<li><em>${Object.keys(PERSONS).length} personnes chargées</em></li>`;
  })
  .catch(err => {
    document.getElementById("results").innerHTML =
      "<li>Erreur de chargement</li>";
    console.error(err);
  });

const input = document.getElementById("search");
const results = document.getElementById("results");

input.addEventListener("input", () => {
  const q = input.value.trim().toLowerCase();
  results.innerHTML = "";

  if (q.length < 2) return;

  const matches = Object.values(PERSONS)
    .filter(p =>
      p.nom.toLowerCase().includes(q) ||
      p.prenom.toLowerCase().includes(q)
    )
    .slice(0, 50); // limite mobile

  if (matches.length === 0) {
    results.innerHTML = "<li>Aucun résultat</li>";
    return;
  }

  matches.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.prenom} ${p.nom}`;
    li.style.cursor = "pointer";
    li.onclick = () => alert(
      `${p.prenom} ${p.nom}\n\nID: ${p.id}\nGénération: ${p.generation}`
    );
    results.appendChild(li);
  });
});

// PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/Genealogie/service-worker.js");
}

