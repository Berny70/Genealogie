let personnes = [];

fetch("genealogie.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("Erreur chargement JSON");
    }
    return response.json();
  })
  .then(data => {
    personnes = data;
    console.log("Personnes chargées :", personnes.length);

    const h1 = document.querySelector("h1");
    h1.textContent = `Descendants de Lucien & Pauline (${personnes.length} personnes)`;
  })
  .catch(err => {
    console.error(err);
    document.body.innerHTML += "<p style='color:red'>Erreur de chargement des données</p>";
  });
