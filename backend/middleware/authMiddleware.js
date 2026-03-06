const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;

    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = { id: userId, role: decoded.role };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};