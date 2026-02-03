const fs = require("fs");

// ===== CONFIG =====
const INPUT = "genealogie.json";
const OUTPUT = "genealogie_clean.json";

// ===== CHARGEMENT =====
const personnes = JSON.parse(fs.readFileSync(INPUT, "utf8"));

// ===== INDEXATION =====
const map = new Map();      // clé → ID canonique
const idMap = new Map();   // ancien ID → nouvel ID
const uniques = [];

// ===== DÉDUPLICATION =====
for (const p of personnes) {
  const key = [
    p.Prénom,
    p.Nom,
    p.Naissance ?? "",
    p.ID_Père ?? "",
    p.ID_Mère ?? ""
  ].join("|");

  if (!map.has(key)) {
    map.set(key, p.ID);
    idMap.set(p.ID, p.ID);
    uniques.push({ ...p });
  } else {
    // doublon → redirection vers l’ID canonique
    idMap.set(p.ID, map.get(key));
  }
}

// ===== RÉÉCRITURE DES LIENS =====
for (const p of uniques) {
  if (p.ID_Père !== null && idMap.has(p.ID_Père)) {
    p.ID_Père = idMap.get(p.ID_Père);
  }
  if (p.ID_Mère !== null && idMap.has(p.ID_Mère)) {
    p.ID_Mère = idMap.get(p.ID_Mère);
  }

  if (Array.isArray(p.conjoints)) {
    p.conjoints = [...new Set(
      p.conjoints
        .map(id => idMap.get(id) ?? id)
        .filter(id => id !== p.ID)
    )];
  }
}

// ===== SAUVEGARDE =====
fs.writeFileSync(OUTPUT, JSON.stringify(uniques, null, 2), "utf8");

console.log("✅ Nettoyage terminé");
console.log("➡️ Avant :", personnes.length, "personnes");
console.log("➡️ Après :", uniques.length, "personnes");
console.log("📁 Fichier généré :", OUTPUT);
