// Modèle Class - Pour les classes/salles

const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de la classe est requis'],
    unique: true,
    trim: true
  },
  level: {
    type: String,
    required: [true, 'Le niveau est requis'],
    enum: ['CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2', '6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale']
  },
  capacity: {
    type: Number,
    required: [true, 'La capacité est requise'],
    min: [1, 'La capacité doit être au moins 1']
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // ← Référence à User avec role='Enseignant'
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // ← Référence à User avec role='Eleve'
  }],
  schedule: {
    type: String
  },
  room: {
    type: String
  },
  academicYear: {
    type: String,
    required: [true, 'L\'année académique est requise'],
    default: '2024-2025'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Class', classSchema);
