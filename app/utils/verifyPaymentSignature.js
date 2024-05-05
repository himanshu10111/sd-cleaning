const crypto = require('crypto');

exports.verifyPaymentSignature = (orderCreationId, razorpayPaymentId, razorpaySignature) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const generatedSignature = crypto.createHmac('sha256', secret)
                                     .update(`${orderCreationId}|${razorpayPaymentId}`)
                                     .digest('hex');
  return generatedSignature === razorpaySignature;
};
