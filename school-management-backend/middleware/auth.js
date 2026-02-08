
// middleware/auth.js


const jwt = require("jsonwebtoken");
const User = require("../models/User");


// PROTECT ROUTES (JWT)

const protect = async (req, res, next) => {
  let token;

  // Vérifier le header Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extraire le token
      token = req.headers.authorization.split(" ")[1];

      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Utilisateur non trouvé",
        });
      }

      // Attacher l'utilisateur à la requête
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token invalide ou expiré",
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Accès refusé, token manquant",
    });
  }
};


// AUTHORIZE ROLES

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Accès interdit pour ce rôle",
      });
    }
    next();
  };
};

module.exports = { protect, authorize };