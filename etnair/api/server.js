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

// middleware https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs
function verifToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token manquant ou invalide" });
  }
  
  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expiré" });
    }
    return res.status(403).json({ error: "Token invalide" });
  }
}
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
app.post("/annonces", verifToken, async (req, res) => {
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
  
  if (!email || !nom || !password) {
    return res.status(400).json({ error: "Email, nom et mot de passe requis" });
  }
  
  try {
    const hashPassword = await bcrypt.hash(password, sel);
    const user = await prisma.utilisateur.create({
      data: { email, nom, hashPassword },
    });
    
    const { hashPassword: _, ...userWithoutPassword } = user;
    res.status(201).json({ 
      message: "Utilisateur créé avec succès",
      user: userWithoutPassword 
    });
  } catch (error) {
    res.status(400).json({ error: "Email déjà pris ou données invalides" });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }
  
  try {
    const user = await prisma.utilisateur.findUnique({
      where: { email },
    });
    
    if (!user || !user.hashPassword) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.hashPassword);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    
    // Ne pas renvoyer le mot de passe hashé dans la réponse
    const { hashPassword: _, password: __, ...userWithoutPassword } = user;
    
    res.json({ 
      message: "Connexion réussie", 
      token,
      user: userWithoutPassword 
    });
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
