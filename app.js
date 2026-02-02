fetch("/Genealogie/genealogie.json")
  .then(r => {
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  })
  .then(data => {
    document.getElementById("app").textContent =
      Object.keys(data.persons).length + " personnes chargées";
  })
  .catch(err => {
    document.getElementById("app").textContent =
      "Erreur de chargement des données";
    console.error(err);
  });

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/Genealogie/service-worker.js");
}

