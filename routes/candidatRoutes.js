const express = require('express');
const router = express.Router();
const multer = require('multer');
const Candidat = require('../models/Candidat');

// 1. Configuration de Multer en mémoire (RAM)
// Indispensable pour Vercel car le système de fichiers est en lecture seule
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Limite à 5Mo par fichier
});

// 2. ROUTE : Postuler (Envoi du formulaire)
// URL: POST /api/candidats/postuler
router.post('/postuler', upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'identite', maxCount: 1 }
]), async (req, res) => {
    try {
        const { nom, telephone, email, poste } = req.body;

        // Vérification des fichiers
        if (!req.files || !req.files['cv'] || !req.files['identite']) {
            return res.status(400).json({ message: "Veuillez joindre tous les documents (CV et Pièce d'identité)." });
        }

        // Création de l'objet candidat
        // Note : On ne peut pas stocker le "path" car il n'y a pas de dossier.
        // On enregistre les données de base pour l'instant.
        const nouvelleCandidature = new Candidat({
            nom,
            telephone,
            email,
            poste,
            // Si ton modèle supporte les Buffers, tu peux stocker req.files['cv'][0].buffer
            // Sinon, pour ce projet, on stocke une mention ou on utilise un service tiers
            cvPath: `En attente (Fichier : ${req.files['cv'][0].originalname})`,
            idPath: `En attente (Fichier : ${req.files['identite'][0].originalname})`,
            createdAt: new Date()
        });

        await nouvelleCandidature.save();

        res.status(201).json({ 
            message: "Candidature enregistrée avec succès !",
            candidat: { nom, poste }
        });
    } catch (error) {
        console.error("Erreur Backend:", error);
        res.status(500).json({ message: "Erreur lors de l'enregistrement sur le serveur." });
    }
});

// 3. ROUTE : Liste Privée (Pour le Dashboard Admin)
// URL: GET /api/candidats/liste-privee
router.get('/liste-privee', async (req, res) => {
    try {
        // Récupère tous les candidats triés du plus récent au plus ancien
        const candidats = await Candidat.find().sort({ createdAt: -1 });
        res.status(200).json(candidats);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des données." });
    }
});

module.exports = router;