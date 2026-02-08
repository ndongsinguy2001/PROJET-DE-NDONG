
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/", paymentController.getAllPayments);
router.post("/", paymentController.createPayment);
router.delete("/:id", paymentController.deletePayment);

module.exports = router;

