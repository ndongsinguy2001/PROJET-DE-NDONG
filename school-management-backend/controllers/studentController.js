
const User = require("../models/User");


// GET ALL STUDENTS

exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "Eleve" })
      .populate("studentClass", "name level");

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des élèves",
      error: error.message,
    });
  }
};


// CREATE STUDENT

exports.createStudent = async (req, res) => {
  try {
    const student = await User.create({
      ...req.body,
      role: "Eleve",
    });

    const populatedStudent = await User.findById(student._id)
      .populate("studentClass", "name level");

    res.status(201).json({
      success: true,
      data: populatedStudent,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Erreur lors de l’ajout de l’élève",
      error: error.message,
    });
  }
};


// UPDATE STUDENT

exports.updateStudent = async (req, res) => {
  try {
    const student = await User.findOneAndUpdate(
      { _id: req.params.id, role: "Eleve" },
      req.body,
      { new: true, runValidators: true }
    ).populate("studentClass", "name level");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Élève non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Élève mis à jour",
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur mise à jour élève",
      error: error.message,
    });
  }
};


// DELETE STUDENT

exports.deleteStudent = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Élève supprimé",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur suppression élève",
      error: error.message,
    });
  }
};

