const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sel = 10;


app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

app.post("/utilisateurs", (req, res) => {
  // Logique pour créer un utilisateur
  res.json({ message: "Utilisateur créé" });
});
app.get("/utilisateurs", (req, res) => {
  db.all("SELECT id, email FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
    res.json({ utilisateurs: rows });
  });
});
app.post("/annonces", (req, res) => {
  // Logique pour créer une annonce
  res.json({ message: "Annonce créée" });
});
app.get("/annonces", (req, res) => {
  // Logique pour récupérer les annonces
  res.json({ annonces: [] });
});
app.get("/annonces/:id", (req, res) => {
  // Logique pour récupérer une annonce par ID
  res.json({ annonce: { id: req.params.id } });
});

app.post("/auth/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }
  try {
    const hash = bcrypt.hashSync(password, sel);
    db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, hash]);
    if (err) {
      return res.status(500).json({ error: "Erreur lors de l'enregistrement" });
    }
    return res.status(201).json({ message: "Utilisateur enregistré" });
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de l'enregistrement" });
  }
});
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: "Utilisateur non trouvé" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    return res.json({ message: "Utilisateur connecté", token });
  });
});

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.json({ message: "Hello, ETNAir!" }));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));