import { createHmac } from "node:crypto";

const SECRET = process.env.SECRET || "dev-secret";

function hashPassword(password) {
  const hmac = createHmac("sha256", SECRET);
  hmac.update(password);
  return hmac.digest("hex");
}

export default function securityAudit(req, res, next) {
  if (req.body?.password) {
    const password = req.body.password;

    const hashedPassword = hashPassword(password);

    delete req.body.password;

    req.securePassword = hashedPassword;
  }

  next();
}
