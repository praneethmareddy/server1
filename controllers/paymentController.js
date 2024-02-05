const crypto = require("crypto");
const { Payment } = require("../models/paymentModel.js");
const Razorpay = require("razorpay");
const Service =require("../models/service-model");

const checkout = async (req, res) => {
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_APT_SECRET,
  });
  console.log(req.body);
  const options = {
    amount: Number(req.body.customAmount * 100),
    currency: "INR",
  };

  const order = await instance.orders.create(options);
  console.log('order',order);
  res.status(200).json({
    success: true,
    order,
  });
};
const checkout1 = async (req, res) => {
  console.log(req.body);
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_APT_SECRET,
  });
  
  const price1 = await Service.findOne({ _id: req.body.serviceId});
  console.log(price1);
  const options = {
    amount: Number(price1.price),
    currency: "INR",
  };

  const order = await instance.orders.create(options);
  console.log('order',order);
  res.status(200).json({
    success: true,
    order,
  });
};

const paymentVerification = async (req, res) => {
  console.log('req.body',req.body );
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  console.log('req.body',req.body );
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;
  console.log('isauthentic',isAuthentic );
  if (isAuthentic) {
    // Database operations come here

    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    res.redirect(`http://localhost:5173/about`);
  } else {
    res.status(400).json({
      success: false,
    });
  }
};
const paymentVerification1 = async (req, res) => {
  console.log('req.body',req.body );
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  console.log('req.body',req.body );
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;
  console.log('isauthentic',isAuthentic );
  if (isAuthentic) {
    // Database operations come here
    const id = req.params.id;
    const email = req.params.email;
    const updatedService = await Service.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          payment: { email },
        },
      },
      { new: true }
    );

    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    res.redirect(`http://localhost:5173/service`);
  } else {
    res.status(400).json({
      success: false,
    });
  }
};
const updatepayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    
    await Payment.create({
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      paymentDone: true,
    });

    res.json({ success: true, message: 'Payment details updated successfully.' });
  } catch (error) {
    console.error('Error updating payment details:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

module.exports = {
  checkout,
  paymentVerification,
  checkout1,
  updatepayment,
  paymentVerification1,
};
