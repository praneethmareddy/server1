const express = require("express");
const paymentController = require("../controllers/paymentController.js");

const router = express.Router();

router.route("/checkout").post(paymentController.checkout);
router.route("/checkoutservice").post(paymentController.checkout1);
router.route("/updatepayment").post(paymentController.updatepayment);
router.route("/paymentverification").post( paymentController.paymentVerification);
router.route("/paymentverification1/:id/:email").post( paymentController.paymentVerification1);
module.exports = router;

