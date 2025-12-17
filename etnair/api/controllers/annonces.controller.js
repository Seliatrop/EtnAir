const prisma = require("../config/database");

const getAll = async (req, res) => {
  try {
    const annonces = await prisma.annonce.findMany();
    res.json(annonces);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const create = async (req, res) => {
  const { titre, description, prix } = req.body;
  try {
    const result = await prisma.annonce.create({
      data: {
        titre,
        description,
        prix: parseFloat(prix),
        utilisateurId: req.userId, 
      },
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: "Erreur création" });
  }
};

module.exports = { getAll, create };