const express = require("express");
const router = express.Router();
const annonceController = require("../controllers/annonces.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/", annonceController.getAll);
router.post("/", verifyToken, annonceController.create);

module.exports = router;