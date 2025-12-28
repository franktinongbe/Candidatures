require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// 1. Configuration CORS précise
// On autorise ton frontend spécifique à appeler ce backend
app.use(cors({
  origin: ["https://appel-candidatures.vercel.app", "https://candidatures-vbs.vercel.app"],
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connecté"))
  .catch(err => console.error("❌ Erreur MongoDB:", err));

// 3. Routes
const candidatRoutes = require('./routes/candidatRoutes');
// On s'assure que le préfixe correspond à ton URL React
app.use('/api/candidats', candidatRoutes);

// Route de test pour vérifier si le backend répond
app.get("/", (req, res) => res.send("Backend MJB opérationnel 🚀"));

// 4. Export pour Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Serveur local sur le port ${PORT}`));
}

module.exports = app;