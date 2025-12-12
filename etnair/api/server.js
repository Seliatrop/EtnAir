require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./swaggerOption");
const swaggerDocs = swaggerJsdoc(swaggerOptions);

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
    res.status(500).json({ error: "error server." });
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
    .json({ error: "Erreur de création(verifiez que l'utilisateur existe)" });
  }
});

//3. Creer un utilisateur
/**
* @swagger
* post:
* summary: Créer un nouvel utilisateur
* tags: [Utilisateurs]
* requestBody:
*  required: true
*   content:
*   application/json:
*    schema:
*    $ref: '#/components/schemas/Utilisateur'
* responses:
*  201:
*     description: Utilisateur créé avec succès
*    content:
*     application/json:
*      schema:
*      $ref: '#/components/schemas/Utilisateur'
* 400:
*    description: Erreur de validation ou données manquantes
*/

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
