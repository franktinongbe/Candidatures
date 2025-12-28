const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Candidat = require('../models/Candidat');

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) !== '.pdf') {
      return cb(new Error('Seuls les fichiers PDF sont autorisés'));
    }
    cb(null, true);
  }
});

// Route POST : Recevoir une candidature
router.post('/postuler', upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'identite', maxCount: 1 }
]), async (req, res) => {
  try {
    const { nom, telephone, email, poste } = req.body;
    
    const nouvelleCandidature = new Candidat({
      nom,
      telephone,
      email,
      poste,
      cvPath: req.files['cv'][0].path,
      idPath: req.files['identite'][0].path
    });

    await nouvelleCandidature.save();
    res.status(201).json({ message: "Candidature enregistrée avec succès !" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'enregistrement." });
  }
});

module.exports = router;