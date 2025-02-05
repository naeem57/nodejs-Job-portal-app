const JWT = require("jsonwebtoken");

const protect = async (req, res, next) => {
  const token = await req
    .header("Authorization" || "authorization")
    ?.split(" ")[1];
  if (!token) return res.status(401).json("Access denied: No token provided");

  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = protect;
