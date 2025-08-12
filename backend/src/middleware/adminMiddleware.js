const jwt = require("jsonwebtoken");
const redisWrapper = require("../config/redis");
const User = require("../models/user");

const adminMiddleware = async (req, res, next) => {
  try {
    // Accept token from cookie, query, or Authorization header (Bearer)
    let token = req.cookies.token || req.query.token;
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication token missing" });
    }

    // Validate token
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token", error: e.message });
    }

    if (payload.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Admin access required" });
    }

    const { _id } = payload;
    if (!_id) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token payload" });
    }

    const result = await User.findById(_id);
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isBlocked = await redisWrapper.exists(`token:${token}`);
    if (isBlocked) {
      return res
        .status(401)
        .json({ success: false, message: "Session expired" });
    }

    req.result = result;
    next();
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Admin authentication failed",
        error: err.message,
      });
  }
};

module.exports = adminMiddleware;
