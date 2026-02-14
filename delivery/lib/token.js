const crypto = require("crypto");

const SECRET = process.env.DOWNLOAD_SECRET;
const EXPIRY_DAYS = 7;

function sign(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(data)
    .digest("base64url");
  return `${data}.${sig}`;
}

function verify(token) {
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;

  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(data)
    .digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)))
    return null;

  const payload = JSON.parse(Buffer.from(data, "base64url").toString());
  if (Date.now() > payload.exp) return null;
  return payload;
}

function generateDownloadToken(email) {
  return sign({
    email,
    exp: Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  });
}

module.exports = { generateDownloadToken, verify };
