// Contrôleur Grades

const Grade = require('../models/Grade');
const User = require('../models/User');

// @desc    Obtenir toutes les notes
// @route   GET /api/grades
// @access  Private
exports.getAllGrades = async (req, res) => {
  try {
    const grades = await Grade.find()
      .populate('student', 'firstName lastName matricule class')
      .populate('teacher', 'firstName lastName subject')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: grades.length,
      data: grades
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des notes',
      error: error.message
    });
  }
};

// @desc    Obtenir une note par ID
// @route   GET /api/grades/:id
// @access  Private
exports.getGradeById = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id)
      .populate('student', 'firstName lastName matricule class')
      .populate('teacher', 'firstName lastName subject');
    
    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Note non trouvée'
      });
    }
    
    res.status(200).json({
      success: true,
      data: grade
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la note',
      error: error.message
    });
  }
};

// @desc    Obtenir les notes d'un élève
// @route   GET /api/grades/student/:studentId
// @access  Private
exports.getGradesByStudent = async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.params.studentId })
      .populate('teacher', 'firstName lastName subject')
      .sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      count: grades.length,
      data: grades
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des notes',
      error: error.message
    });
  }
};

// @desc    Obtenir les notes par classe
// @route   GET /api/grades/class/:className
// @access  Private
exports.getGradesByClass = async (req, res) => {
  try {
    const grades = await Grade.find({ class: req.params.className })
      .populate('student', 'firstName lastName matricule')
      .populate('teacher', 'firstName lastName subject')
      .sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      count: grades.length,
      data: grades
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des notes',
      error: error.message
    });
  }
};

// @desc    Créer une nouvelle note
// @route   POST /api/grades
// @access  Private
exports.createGrade = async (req, res) => {
  try {
    const { 
      student, 
      subject, 
      examType, 
      score, 
      maxScore, 
      coefficient, 
      term, 
      academicYear, 
      teacher, 
      class: studentClass,
      remarks 
    } = req.body;
    
    // Vérifier si l'élève existe
    const studentExists = await User.findOne({ _id: student, role: 'Eleve' });
    if (!studentExists) {
      return res.status(404).json({
        success: false,
        message: 'Élève non trouvé'
      });
    }
    
    // Vérifier si l'enseignant existe (si fourni)
    if (teacher) {
      const teacherExists = await User.findOne({ _id: teacher, role: 'Enseignant' });
      if (!teacherExists) {
        return res.status(404).json({
          success: false,
          message: 'Enseignant non trouvé'
        });
      }
    }
    
    // Créer la note
    const grade = await Grade.create({
      student,
      subject,
      examType,
      score,
      maxScore,
      coefficient,
      term,
      academicYear,
      teacher,
      class: studentClass,
      remarks
    });
    
    // Peupler les données
    await grade.populate('student', 'firstName lastName matricule class');
    await grade.populate('teacher', 'firstName lastName subject');
    
    res.status(201).json({
      success: true,
      message: 'Note enregistrée avec succès',
      data: grade
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement de la note',
      error: error.message
    });
  }
};

//     Mettre à jour une note
//    PUT /api/grades/:id
//  Private
exports.updateGrade = async (req, res) => {
  try {
    const grade = await Grade.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
    .populate('student', 'firstName lastName matricule class')
    .populate('teacher', 'firstName lastName subject');
    
    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Note non trouvée'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Note mise à jour avec succès',
      data: grade
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la note',
      error: error.message
    });
  }
};

//    Supprimer une note
//    DELETE /api/grades/:id
//   Private
exports.deleteGrade = async (req, res) => {
  try {
    const grade = await Grade.findByIdAndDelete(req.params.id);
    
    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Note non trouvée'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Note supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la note',
      error: error.message
    });
  }
};

//    Calculer la moyenne d'un élève
//    GET /api/grades/student/:studentId/average
//   Private
exports.calculateStudentAverage = async (req, res) => {
  try {
    const { term, academicYear } = req.query;
    
    const filter = { student: req.params.studentId };
    if (term) filter.term = term;
    if (academicYear) filter.academicYear = academicYear;
    
    const grades = await Grade.find(filter);
    
    if (grades.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Aucune note trouvée pour cet élève'
      });
    }
    
    // Calculer la moyenne pondérée
    let totalWeightedScore = 0;
    let totalCoefficient = 0;
    
    grades.forEach(grade => {
      const normalizedScore = (grade.score / grade.maxScore) * 20;
      totalWeightedScore += normalizedScore * grade.coefficient;
      totalCoefficient += grade.coefficient;
    });
    
    const average = totalWeightedScore / totalCoefficient;
    
    res.status(200).json({
      success: true,
      data: {
        studentId: req.params.studentId,
        term: term || 'Tous les trimestres',
        academicYear: academicYear || 'Toutes les années',
        gradesCount: grades.length,
        average: average.toFixed(2),
        totalCoefficient
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du calcul de la moyenne',
      error: error.message
    });
  }
};