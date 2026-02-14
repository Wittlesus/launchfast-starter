const Stripe = require("stripe");
const { Resend } = require("resend");
const { generateDownloadToken } = require("../lib/token");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const BASE_URL = process.env.BASE_URL; // e.g. https://your-app.vercel.app
const FROM_EMAIL = process.env.FROM_EMAIL || "sales@yourdomain.com";
const PRODUCT_NAME = process.env.PRODUCT_NAME || "LaunchFast Starter";

// Vercel sends the raw body as a Buffer when configured correctly.
// For express, use express.raw({type: "application/json"}) on this route.
module.exports = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).json({ error: "Invalid signature" });
  }

  if (event.type !== "checkout.session.completed") {
    return res.status(200).json({ received: true });
  }

  const session = event.data.object;
  const email = session.customer_details?.email;
  if (!email) {
    console.error("No customer email in session", session.id);
    return res.status(200).json({ received: true });
  }

  const token = generateDownloadToken(email);
  const downloadUrl = `${BASE_URL}/api/download?token=${token}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Your ${PRODUCT_NAME} download is ready`,
    html: [
      `<h2>Thank you for purchasing ${PRODUCT_NAME}!</h2>`,
      `<p>Click the link below to download your files. This link expires in 7 days.</p>`,
      `<p><a href="${downloadUrl}">Download ${PRODUCT_NAME}</a></p>`,
      `<p>If you have any issues, reply to this email.</p>`,
    ].join("\n"),
  });

  console.log(`Delivery email sent to ${email}`);
  res.status(200).json({ received: true });
};
