let personnes = [];

fetch("genealogie.json")
  .then(r => {
    if (!r.ok) throw new Error("Erreur HTTP " + r.status);
    return r.json();
  })
  .then(data => {
    console.log("JSON brut :", data);

    // 🛡️ Normalisation : tableau quoi qu’il arrive
    if (Array.isArray(data)) {
      personnes = data;
    } else if (data.personnes && Array.isArray(data.personnes)) {
      personnes = data.personnes;
    } else {
      throw new Error("Format JSON inattendu");
    }

    document.querySelector("h1").textContent =
      `Descendants de Lucien & Pauline (${personnes.length} personnes)`;

    console.log("Personnes chargées :", personnes.length);
  })
  .catch(err => {
    console.error("Erreur chargement :", err);
    document.body.innerHTML +=
      "<p style='color:red;font-weight:bold'>Erreur de chargement des données</p>";
  });
