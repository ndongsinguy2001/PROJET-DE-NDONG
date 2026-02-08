
const Payment = require("../models/Payment");
const User = require("../models/User");

/* 
   GET ALL PAYMENTS
 */
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("student", "firstName lastName matricule")
      .populate("class", "name level")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur récupération paiements",
      error: error.message,
    });
  }
};


  // CREATE PAYMENT

exports.createPayment = async (req, res) => {
  try {
    const { student, feeType, amount, method, reference, academicYear } =
      req.body;

    if (!student || !feeType || !amount || !method) {
      return res.status(400).json({
        success: false,
        message: "Champs obligatoires manquants",
      });
    }

    const studentDoc = await User.findOne({
      _id: student,
      role: "Eleve",
    }).populate("studentClass");

    if (!studentDoc || !studentDoc.studentClass) {
      return res.status(400).json({
        success: false,
        message: "Élève ou classe invalide",
      });
    }

    const payment = await Payment.create({
      student,
      class: studentDoc.studentClass._id,
      feeType,
      amount,
      method,
      reference,
      academicYear,
      status: "Payé",
    });

    res.status(201).json({
      success: true,
      message: "Paiement enregistré avec succès",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur création paiement",
      error: error.message,
    });
  }
};


   //DELETE PAYMENT

exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Paiement introuvable" });
    }

    res.status(200).json({
      success: true,
      message: "Paiement supprimé",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur suppression paiement",
      error: error.message,
    });
  }
};
