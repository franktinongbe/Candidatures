require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// 1. Middlewares de base
app.use(cors());
app.use(express.json());

// 2. Connexion MongoDB
// Assure-toi que MONGO_URI est bien configuré dans les settings de Vercel
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connecté"))
  .catch(err => console.error("❌ Erreur MongoDB:", err));

// 3. Importation de tes routes corrigées
const candidatRoutes = require('./routes/candidatRoutes');
app.use('/api/candidats', candidatRoutes);

// 4. IMPORTANT : Ne PAS utiliser app.listen() si tu es sur Vercel
// Vercel gère le démarrage tout seul.
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Serveur local sur le port ${PORT}`));
}

module.exports = app;