require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./swaggerOption");
const swaggerDocs = swaggerJsdoc(swaggerOptions);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const sel = 10;

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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

/**
* @swagger
* components:
*   schemas:
*     Utilisateur:
*       type: object
*       required:
*         - nom
*         - email
*       password:
*       properties:
*         id:
*           type: integer
*           description: ID unique généré automatiquement
*         nom:
*           type: string
*           description: Nom de l'utilisateur
*         email:
*           type: string
*           description: Email de l'utilisateur
*         password:
*           type: string
*           description: Mot de passe de l'utilisateur
*       example:
*         nom: "Jean Dupont"
*         email: "jean.dupont@example.com"
*         password: "motdepasse123"
*     Annonce:
*       type: object
*       required:
*         - titre
*         - prix
*         - utilisateurId
*       properties:
*         id:
*           type: integer
*           description: ID unique généré automatiquement
*         titre:
*           type: string
*           description: Titre de l'annonce
*         description:
*           type: string
*           description: Détails du logement
*         prix:
*           type: number
*           description: Prix par nuit
*         utilisateurId:
*           type: integer
*           description: ID du propriétaire (Clé étrangère)
*       example:
*         titre: "Loft vue Tour Eiffel"
*         description: "Superbe appartement de 80m2..."
*         prix: 150.00
*         utilisateurId: 1
*/

/**
* @swagger
* /annonces:
*   get:
*     summary: Récupérer la liste des annonces
*     tags: [Annonces]
*     responses:
*       200:
*         description: Liste récupérée avec succès
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Annonce'
*/

app.get("/annonces", async (req, res) => {
  try {
    const annonces = await prisma.annonce.findMany();
    res.json(annonces);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
* @swagger
* /annonces:
*   post:
*     summary: Créer une nouvelle annonce
*     tags: [Annonces]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Annonce'
*     responses:
*       201:
*         description: Annonce créée avec succès
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Annonce'
*       400:
*         description: Erreur de validation ou données manquantes
*/
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
/**
* @swagger
* /utilisateurs:
*   post:
*     summary: Créer un nouvel utilisateur
*     tags: [Utilisateurs]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Utilisateur'
*     responses:
*       201:
*         description: Utilisateur créé avec succès
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Utilisateur'
*       400:
*         description: Erreur de validation ou données manquantes
*/
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

app.listen(PORT, () => {
  console.log(`🚀 Serveur ETNAir démarré sur http://localhost:${PORT}`);
});
