// Modèle Grade - Pour les notes des élèves

const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ← Changé à User
    required: [true, 'L\'élève est requis']
  },
  subject: {
    type: String,
    required: [true, 'La matière est requise']
  },
  examType: {
    type: String,
    required: [true, 'Le type d\'examen est requis'],
    enum: ['Devoir', 'Composition 1', 'Composition 2', 'Composition 3', 'Examen final']
  },
  score: {
    type: Number,
    required: [true, 'La note est requise'],
    min: [0, 'La note ne peut pas être négative'],
    max: [20, 'La note ne peut pas dépasser 20']
  },
  maxScore: {
    type: Number,
    default: 20
  },
  coefficient: {
    type: Number,
    default: 1
  },
  term: {
    type: String,
    required: [true, 'Le trimestre est requis'],
    enum: ['Trimestre 1', 'Trimestre 2', 'Trimestre 3']
  },
  academicYear: {
    type: String,
    required: [true, 'L\'année académique est requise'],
    default: '2024-2025'
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Référence à User avec role='Enseignant'
  },
  class: {
    type: String,
    required: [true, 'La classe est requise']
  },
  remarks: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

gradeSchema.virtual('weightedScore').get(function() {
  return (this.score / this.maxScore) * 20 * this.coefficient;
});

module.exports = mongoose.model('Grade', gradeSchema);