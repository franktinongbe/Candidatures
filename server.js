require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Rend les fichiers accessibles

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch(err => console.error("❌ Erreur de connexion:", err));

// Routes
app.use('/api/candidats', require('./routes/candidatRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));