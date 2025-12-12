require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const prisma = new PrismaClient();
const port = 3000;
const sel = 10;

app.use(express.json());

// --- ROUTES ---

// 1. Récupérer toutes les annonces
app.get("/annonces", async (req, res) => {
  try {
    const annonces = await prisma.annonce.findMany();
    res.json(annonces);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 2. Créer une annonce
app.post("/annonces", async (req, res) => {
  const { titre, description, prix, utilisateurId } = req.body;
  try {
    const result = await prisma.annonce.create({
      data: {
        titre,
        description,
        prix: parseFloat(prix),
        utilisateurId: parseInt(utilisateurId),
      },
    });
    res.status(201).json(result);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erreur création (Vérifiez que l'utilisateur existe)" });
  }
});

// 3. Créer un utilisateur (Pour pouvoir créer des annonces ensuite)
app.post("/utilisateurs", async (req, res) => {
  const { email, nom, password } = req.body;
  try {
    const user = await prisma.utilisateur.create({
      data: { email, nom, password },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: "Email déjà pris ou données invalides" });
  }
});

app.post("/auth/register", async (req, res) => {
  const { email, nom, password } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, sel);
    const user = await prisma.utilisateur.create({
      data: { email, nom, hashPassword },
    });
    console.log(user);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: "Email déjà pris ou données invalides" });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const egale = await bcrypt.compare(password, hashPassword);
    const user = await prisma.utilisateur.findUnique({
      where: { email },
    });
    if (!user || !egale) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Connexion réussie", user });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get("/test", (req, res) => {
  res.json({ message: "Test réussi", status: "ok" });
});

// --- DÉMARRAGE ---
app.listen(port, () => {
  console.log(`🚀 Serveur ETNAir démarré sur http://localhost:${port}`);
});
