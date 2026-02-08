
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    feeType: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    method: {
      type: String,
      enum: ["Espèces", "Mobile Money", "Virement", "Chèque"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Payé", "Partiel", "Impayé"],
      default: "Payé",
    },

    academicYear: {
      type: String,
      default: "2025-2026",
      required: true,
    },

    receiptNumber: {
      type: String,
      unique: true,
      default: () =>
        `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    },

    reference: String,

    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
