const mongoose = require('mongoose');

const CandidatSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  telephone: { type: String, required: true },
  email: { type: String, required: true },
  poste: { type: String, required: true },
  cvPath: { type: String, required: true },      // Chemin du fichier CV
  idPath: { type: String, required: true },      // Chemin du fichier Identité
  dateInscription: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidat', CandidatSchema);
