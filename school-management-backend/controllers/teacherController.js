
// controllers/teacherController.js

const User = require("../models/User");


// GET ALL TEACHERS

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "Enseignant" })
      .select("-password") // 🔒 sécurité
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des enseignants",
      error: error.message,
    });
  }
};


// GET TEACHER BY ID

exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await User.findOne({
      _id: req.params.id,
      role: "Enseignant",
    }).select("-password");

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Enseignant non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      data: teacher,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'enseignant",
      error: error.message,
    });
  }
};


// CREATE TEACHER

exports.createTeacher = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      subject,
      qualification,
      dateOfBirth,
      gender,
      address,
      hireDate,
      password,
    } = req.body;

    //  email unique TOUS rôles confondus
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email déjà utilisé",
      });
    }

    const teacher = await User.create({
      role: "Enseignant",
      firstName,
      lastName,
      email,
      phone,
      subject,
      qualification,
      dateOfBirth,
      gender,
      address,
      hireDate: hireDate || Date.now(),
      password,
      status: "Actif",
    });

    res.status(201).json({
      success: true,
      message: "Enseignant créé avec succès",
      data: teacher,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l'enseignant",
      error: error.message,
    });
  }
};


// UPDATE TEACHER

exports.updateTeacher = async (req, res) => {
  try {
    const teacher = await User.findOneAndUpdate(
      { _id: req.params.id, role: "Enseignant" },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Enseignant non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enseignant mis à jour avec succès",
      data: teacher,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de l'enseignant",
      error: error.message,
    });
  }
};


// DELETE TEACHER

exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await User.findOneAndDelete({
      _id: req.params.id,
      role: "Enseignant",
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Enseignant non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enseignant supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de l'enseignant",
      error: error.message,
    });
  }
};
