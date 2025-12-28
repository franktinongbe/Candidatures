const express = require('express');
const router = express.Router();
const multer = require('multer');
const Candidat = require('../models/Candidat');

// CONFIGURATION : On utilise la mémoire (RAM) au lieu du disque dur
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Limite à 5Mo par fichier
});

// ROUTE POSTULER
router.post('/postuler', upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'identite', maxCount: 1 }
]), async (req, res) => {
  try {
    const { nom, telephone, email, poste } = req.body;

    // Sur Vercel, on ne stocke pas le fichier physiquement ici
    // On enregistre les infos dans MongoDB
    const nouvelleCandidature = new Candidat({
      nom,
      telephone,
      email,
      poste,
      cvPath: "Fichier reçu en mémoire", // Tu pourras plus tard lier un service comme Cloudinary
      idPath: "Fichier reçu en mémoire"
    });

    await nouvelleCandidature.save();
    
    res.status(201).json({ 
      message: "Candidature enregistrée avec succès dans la base de données !" 
    });

  } catch (error) {
    console.error("Erreur Backend:", error);
    res.status(500).json({ message: "Erreur lors de l'enregistrement." });
  }
});

// ROUTE LISTE
router.get('/liste', async (req, res) => {
  try {
    const candidats = await Candidat.find().sort({ createdAt: -1 });
    res.json(candidats);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;