const razorpay = require('../config/razorpayConfig');
const { verifyPaymentSignature } = require('../utils/verifyPaymentSignature');

exports.createOrder = async (req, res) => {
  const { amount } = req.body; // Amount should be in paise

  try {
    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${new Date().getTime()}`,
      payment_capture: '1',
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error creating order" });
  }
};

exports.verifyPayment = (req, res) => {
  try {
    const { orderCreationId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
    const isValidSignature = verifyPaymentSignature(orderCreationId, razorpayPaymentId, razorpaySignature);

    if (isValidSignature) {
      // Process the payment on your server (e.g., update order status, send confirmation email)
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error verifying payment" });
  }
};
