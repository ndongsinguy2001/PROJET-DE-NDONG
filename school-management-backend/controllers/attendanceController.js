
const Attendance = require("../models/Attendance");
const Class = require("../models/Class");


// GET ATTENDANCE

exports.getAttendanceByClassAndDate = async (req, res) => {
  try {
    const { classId, date } = req.query;

    if (!classId || !date) {
      return res.status(400).json({
        success: false,
        message: "classId et date sont requis",
      });
    }

    const day = new Date(date);
    day.setHours(0, 0, 0, 0);

    const attendances = await Attendance.find({
      classId,
      date: day,
    }).populate("student", "firstName lastName matricule");

    res.status(200).json({
      success: true,
      data: attendances,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur récupération présences",
      error: error.message,
    });
  }
};


// CREATE / UPDATE ATTENDANCE

exports.markAttendance = async (req, res) => {
  try {
    const { student, classId, date, status, remark } = req.body;

    if (!student || !classId || !date) {
      return res.status(400).json({
        success: false,
        message: "student, classId et date sont requis",
      });
    }

    //  Vérifier que l'élève appartient à la classe
    const classData = await Class.findById(classId);
    if (!classData.students.includes(student)) {
      return res.status(403).json({
        success: false,
        message: "Cet élève n'appartient pas à cette classe",
      });
    }

    const day = new Date(date);
    day.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOneAndUpdate(
      {
        student,
        classId,
        date: day,
      },
      {
        student,
        classId,
        date: day,
        status,
        remark,
      },
      {
        upsert: true,
        new: true,
      }
    ).populate("student", "firstName lastName matricule");

    res.status(200).json({
      success: true,
      message: "Présence enregistrée",
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur enregistrement présence",
      error: error.message,
    });
  }
};
