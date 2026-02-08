const User = require("../models/User");
const Payment = require("../models/Payment");
const Attendance = require("../models/Attendance");
const Class = require("../models/Class");


// STATS GLOBALES (SELON RÔLE)

exports.getGlobalStats = async (req, res) => {
  try {
    const role = req.user.role;

    const stats = {};

   
    // ADMIN
    
    if (role === "Admin") {
      stats.totalStudents = await User.countDocuments({ role: "Eleve" });
      stats.totalTeachers = await User.countDocuments({ role: "Enseignant" });
      stats.totalClasses = await Class.countDocuments();

      const totalPayments = await Payment.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      stats.totalRevenue = totalPayments[0]?.total || 0;
    }

    
    // COMPTABLE
   
    if (role === "Comptable") {
      const totalPayments = await Payment.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      stats.totalRevenue = totalPayments[0]?.total || 0;
      stats.totalPayments = await Payment.countDocuments();
    }

    
    // ENSEIGNANT
    
    if (role === "Enseignant") {
      stats.totalStudents = await User.countDocuments({ role: "Eleve" });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      stats.attendanceToday = await Attendance.countDocuments({
        date: { $gte: today },
      });
    }

    return res.status(200).json({
      success: true,
      role,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur récupération dashboard",
      error: error.message,
    });
  }
};
