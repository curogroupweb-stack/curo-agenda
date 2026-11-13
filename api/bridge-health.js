// CURO Agenda -> Automation Manager: private, read-only connection probe.
// This endpoint never reads tasks, sends notifications, or runs automations.
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "METHOD_NOT_ALLOWED" });
  const secret = process.env.CURO_BRIDGE_SECRET;
  if (!secret) return res.status(503).json({ ok: false, error: "BRIDGE_NOT_CONFIGURED" });
  const supplied = req.headers["x-curo-bridge-secret"];
  const { timingSafeEqual } = require("node:crypto");
  const a = Buffer.from(typeof supplied === "string" ? supplied : "");
  const b = Buffer.from(secret);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return res.status(401).json({ ok: false, error: "UNAUTHORIZED" });
  return res.status(200).json({ ok: true, service: "curo-agenda", mode: "read-only", version: 1 });
};
