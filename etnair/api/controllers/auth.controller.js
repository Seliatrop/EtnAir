const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/database");

const register = async (req, res) => {
  const { email, nom, password } = req.body;

  if (!email || !nom || !password) {
    return res.status(400).json({ error: "Email, nom et mot de passe requis" });
  }

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await prisma.utilisateur.create({
      data: { email, nom, hashPassword },
    });

    const { hashPassword: _, ...userWithoutPassword } = user;
    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(400).json({ error: "Email déjà pris ou données invalides" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }

  try {
    const user = await prisma.utilisateur.findUnique({ where: { email } });

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

    const { hashPassword: _, ...userWithoutPassword } = user;

    res.json({
      message: "Connexion réussie",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

module.exports = { register, login };