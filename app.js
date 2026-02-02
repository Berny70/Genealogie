fetch("./genealogie.json")
  .then(r => r.json())
  .then(data => {
    const persons = data.persons;
    document.getElementById("app").innerHTML =
      Object.keys(persons).length + " personnes chargées";
  })
  .catch(err => {
    document.getElementById("app").textContent =
      "Erreur de chargement des données";
    console.error(err);
  });

// PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js");
}
