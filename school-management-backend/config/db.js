// Configuration de la connexion à MongoDB

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connexion à MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
    console.log(`📊 Base de données : ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Erreur de connexion MongoDB : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;