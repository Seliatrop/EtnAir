const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res. json({ message: 'Hello, ETNAir!' });
});

const PORT = process.env. PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.post("/utilisateurs", (req, res) => {
  // Logique pour créer un utilisateur
  res.json({ message: "Utilisateur créé" });
});
app.get("/utilisateurs", (req, res) => {
  // Logique pour récupérer les utilisateurs
  res.json({ utilisateurs: [] });
});
app.post("/annonces", (req, res) => {
  // Logique pour créer une annonce
  res.json({ message: "Annonce créée" });
}
);
app.get("/annonces", (req, res) => {
  // Logique pour récupérer les annonces
  res.json({ annonces: [] });
});
app.get("/annonces/:id", (req, res) => {
  // Logique pour récupérer une annonce par ID
  res.json({ annonce: { id: req.params.id } });
});