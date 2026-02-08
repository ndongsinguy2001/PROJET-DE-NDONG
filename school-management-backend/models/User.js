const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function(){
        return this.isNew;
      },
      select: false
    },
    role: {
      type: String,
      enum: ['Admin', 'Directeur', 'Comptable', 'Enseignant', 'Eleve'],
      required: true,
    },
    phone: String,
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['M', 'F'],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Actif', 'Inactif', 'Suspendu', 'Congé'],
      default: 'Actif',
    },

    // Élève
    matricule: {
      type: String,
      unique: true,
      sparse: true,
    },
    studentClass: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Class', 
      required: false // ou true si obligatoire
    },
    parentPhone: String,

    // Enseignant
    subject: String,
    qualification: String,
    hireDate: Date,
  },
  { timestamps: true }
);


// HASH PASSWORD

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
