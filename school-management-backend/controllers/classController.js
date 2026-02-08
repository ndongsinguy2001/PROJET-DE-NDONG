
const Class = require("../models/Class");
const User = require("../models/User");


// GET ALL CLASSES

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate("teacher", "firstName lastName email subject")
      .populate("students", "firstName lastName matricule")
      .sort({ level: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des classes",
      error: error.message,
    });
  }
};

// GET CLASS BY ID

exports.getClassById = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate("teacher", "firstName lastName email subject phone")
      .populate("students", "firstName lastName matricule gender");

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Classe non trouvée",
      });
    }

    res.status(200).json({
      success: true,
      data: classData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la classe",
      error: error.message,
    });
  }
};


// CREATE CLASS

exports.createClass = async (req, res) => {
  try {
    const { name, level, capacity, teacher, schedule, room, academicYear } =
      req.body;

    const existingClass = await Class.findOne({ name, academicYear });
    if (existingClass) {
      return res.status(400).json({
        success: false,
        message:
          "Une classe avec ce nom existe déjà pour cette année académique",
      });
    }

    if (teacher) {
      const teacherExists = await User.findOne({
        _id: teacher,
        role: "Enseignant",
      });

      if (!teacherExists) {
        return res.status(404).json({
          success: false,
          message: "Enseignant non trouvé",
        });
      }
    }

    const newClass = await Class.create({
      name,
      level,
      capacity,
      teacher,
      schedule,
      room,
      academicYear,
    });

    const populatedClass = await Class.findById(newClass._id).populate(
      "teacher",
      "firstName lastName email subject"
    );

    res.status(201).json({
      success: true,
      message: "Classe créée avec succès",
      data: populatedClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la classe",
      error: error.message,
    });
  }
};


// UPDATE CLASS

exports.updateClass = async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("teacher", "firstName lastName email subject")
      .populate("students", "firstName lastName matricule");

    if (!updatedClass) {
      return res.status(404).json({
        success: false,
        message: "Classe non trouvée",
      });
    }

    res.status(200).json({
      success: true,
      message: "Classe mise à jour avec succès",
      data: updatedClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de la classe",
      error: error.message,
    });
  }
};


// DELETE CLASS

exports.deleteClass = async (req, res) => {
  try {
    const classData = await Class.findByIdAndDelete(req.params.id);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Classe non trouvée",
      });
    }

    // Retirer la classe des élèves
    await User.updateMany(
      { studentClass: classData._id },
      { $unset: { studentClass: "" } }
    );

    res.status(200).json({
      success: true,
      message: "Classe supprimée avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de la classe",
      error: error.message,
    });
  }
};


// ADD STUDENT TO CLASS

exports.addStudentToClass = async (req, res) => {
  try {
    const { studentId } = req.body;

    const student = await User.findOne({
      _id: studentId,
      role: "Eleve",
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Élève non trouvé",
      });
    }

    const classData = await Class.findById(req.params.id);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Classe non trouvée",
      });
    }

    //  Synchronisation BIDIRECTIONNELLE
    classData.students.addToSet(studentId);
    await classData.save();

    student.studentClass = classData._id;
    await student.save();

    const populatedClass = await Class.findById(classData._id).populate(
      "students",
      "firstName lastName matricule"
    );

    res.status(200).json({
      success: true,
      message: "Élève ajouté à la classe avec succès",
      data: populatedClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout de l'élève",
      error: error.message,
    });
  }
};


// REMOVE STUDENT FROM CLASS

exports.removeStudentFromClass = async (req, res) => {
  try {
    const { id, studentId } = req.params;

    const classData = await Class.findById(id);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Classe non trouvée",
      });
    }

    classData.students.pull(studentId);
    await classData.save();

    await User.findByIdAndUpdate(studentId, {
      $unset: { studentClass: "" },
    });

    const populatedClass = await Class.findById(id).populate(
      "students",
      "firstName lastName matricule"
    );

    res.status(200).json({
      success: true,
      message: "Élève retiré de la classe avec succès",
      data: populatedClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors du retrait de l'élève",
      error: error.message,
    });
  }
};
