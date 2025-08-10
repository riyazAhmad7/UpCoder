require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const redisWrapper = require("./config/redis");
const { initializeSocket } = require("./config/socket");
const authRouter = require("./routes/userAuth");
const problemRouter = require("../src/routes/problemRoutes");
const rateLimiter = require("./middleware/rateLimiter");
const submissionRouter = require("./routes/submit");
const cors = require("cors");
const aiRouter = require("./routes/AiChat");

const payRoute = require("./routes/payment");
const interviewRouter = require("./routes/aiInterview");
const contestRouter = require("./routes/contestRoute");
const playlistRouter = require("./routes/playlistRoute");
const discussionRouter = require("./routes/discussionRoute");

const {
  autoFinalizeContestRankings,
} = require("./controllers/leaderboardController");
const cron = require("node-cron");

const PORT_NO = process.env.PORT_NO || 3000;
const USE_RATE_LIMITER = process.env.ENABLE_RATE_LIMITER === "true";

// Parse allowed origins from env (comma-separated), fallback to localhost and existing domain
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS || "http://localhost:5173,https://UpCoder.live"
)
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

// CORS options with function-based origin check and explicit preflight
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser clients (no Origin header)
    if (!origin) return callback(null, true);
    const normalized = origin.replace(/\/$/, "");
    if (allowedOrigins.includes(normalized)) return callback(null, true);
    return callback(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Trust proxy if behind load balancer / reverse proxy (needed for correct req.ip and secure cookies)
if (process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1);
}

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
if (USE_RATE_LIMITER) {
  app.use(rateLimiter);
}

// routing.
app.use("/api/user", authRouter);
app.use("/api/problem", problemRouter);
app.use("/api/submission", submissionRouter);
app.use("/api/ai", aiRouter);

app.use("/api/payments", payRoute);
app.use("/api/ai", interviewRouter);
app.use("/api/contest", contestRouter);
app.use("/api/playlists", playlistRouter);
app.use("/api/discussions", discussionRouter);

// Health check route
app.get("/", (req, res) => {
  res.send("Backend is running!!");
});

const initialConnection = async () => {
  try {
    // Connect to MongoDB
    await database();

    // Initialize Socket.IO
    const io = initializeSocket(server);

    // Schedule leaderboard auto-finalization every 5 minutes
    cron.schedule("*/5 * * * *", () => {
      autoFinalizeContestRankings();
    });

    // Start the server regardless of Redis connection status
    server.listen(PORT_NO, () => {
      console.log(`Server is running on port ${PORT_NO}`);
    });

    // Try to connect to Redis, but don't block server startup
    try {
      await redisWrapper.connect();
      // Redis connection success is logged by the event handler in redis.js
    } catch (redisErr) {
      // The application will continue running, and Redis will attempt to reconnect
    }
  } catch (err) {
    process.exit(1); // Exit if MongoDB connection fails
  }
};

initialConnection();
