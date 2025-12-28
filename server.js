require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 1. Configuration CORS dynamique
const allowedOrigins = [
  "https://appel-candidatures.vercel.app",
  "https://candidatures-one.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Autorise si :
    // 1. Pas d'origine (Postman/Mobile)
    // 2. L'origine est dans la liste fixe
    // 3. L'origine contient "vercel.app" (pour gérer les URLs de déploiement dynamiques)
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error('Action bloquée par CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connecté"))
  .catch(err => console.error("❌ Erreur MongoDB:", err));

// 3. Routes
const candidatRoutes = require('./routes/candidatRoutes');

// Route de test racine
app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend MJB opérationnel 🚀" });
});

// Préfixe de tes routes API
app.use('/api/candidats', candidatRoutes);

// Gestion des erreurs 404 pour les routes inconnues
app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

// 4. Export pour Vercel (Important)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Serveur local sur le port ${PORT}`));
}

module.exports = app;