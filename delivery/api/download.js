const { verify } = require("../lib/token");

const DOWNLOAD_URL = process.env.DOWNLOAD_URL; // GitHub release .zip URL

module.exports = async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: "Missing token" });

  const payload = verify(token);
  if (!payload) return res.status(403).json({ error: "Invalid or expired token" });

  res.redirect(302, DOWNLOAD_URL);
};
