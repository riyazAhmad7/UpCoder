const mongoose = require("mongoose");
const Contest = require("../models/contest");
const Problem = require("../models/problem");
const User = require("../models/user");

exports.createContest = async (req, res) => {
  try {
    // Ensure problems is an array of ObjectIds, not a stringified array
    let problems = req.body.problems;
    if (typeof problems === "string") {
      try {
        problems = JSON.parse(problems);
      } catch (e) {
        // If parsing fails, keep as is
      }
    }
    if (!Array.isArray(problems)) {
      return res
        .status(400)
        .json({ success: false, message: "Problems must be an array" });
    }

    // Convert each problem ID to mongoose ObjectId using 'new' keyword
    problems = problems.map((id) => new mongoose.Types.ObjectId(id));

    // Validate dates
    const start = new Date(req.body.startTime);
    const end = new Date(req.body.endTime);
    if (isNaN(start.getTime())) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid start time" });
    }
    if (isNaN(end.getTime())) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid end time" });
    }
    const now = new Date();
    if (start < now) {
      return res.status(400).json({
        success: false,
        message: "Start time must be in the future",
      });
    }
    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    const contest = new Contest({
      name: req.body.name,
      description: req.body.description || "", // optional
      problems: problems,
      startTime: start,
      endTime: end,
      createdBy: req.result._id,
      isPublic: req.body.isPublic,
      date: new Date(req.body.startTime).toISOString().split("T")[0],
    });

    await contest.save();
    res.status(201).json({ success: true, contest });
  } catch (error) {
    console.error("❌ Error creating contest:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Register for a contest
exports.registerForContest = async (req, res) => {
  try {
    const contestId = req.params.contestId;
    const userId = req.result._id;

    if (!mongoose.Types.ObjectId.isValid(contestId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid contest ID" });
    }

    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res
        .status(404)
        .json({ success: false, message: "Contest not found" });
    }

    // Check if contest is public or user has access
    if (!contest.isPublic) {
      // Add private contest access check logic here
      return res
        .status(403)
        .json({ success: false, message: "No access to this contest" });
    }

    // Allow registration when upcoming or active; block after end
    const now = new Date();
    if (now > new Date(contest.endTime)) {
      return res
        .status(400)
        .json({ success: false, message: "Contest has ended" });
    }

    // Ensure participants array exists
    contest.participants = contest.participants || [];
    // Check if already registered (robust string comparison)
    if (contest.participants.some((p) => p.toString() === userId.toString())) {
      return res
        .status(200)
        .json({ success: true, message: "Already registered" });
    }

    const user = await User.findById(userId);
    if (user.contestsCompleted.some((c) => c.toString() === contestId)) {
      return res.status(400).json({
        success: false,
        message: "You have already completed this contest",
      });
    }

    // Add to participants
    // Normalize to ObjectId
    const oid = new mongoose.Types.ObjectId(userId);
    contest.participants.push(oid);
    await contest.save();

    res.status(200).json({
      success: true,
      message: "Registered successfully",
      contest: {
        id: contest._id,
        name: contest.name,
        startTime: contest.startTime,
        endTime: contest.endTime,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

// Add contest status check middleware
exports.validateContestAccess = async (req, res, next) => {
  try {
    const contestId = req.params.contestId;
    const contest = await Contest.findById(contestId);

    if (!contest) {
      return res
        .status(404)
        .json({ success: false, message: "Contest not found" });
    }

    // Add to req object for later use
    req.contest = contest;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error validating contest access" });
  }
};

// Add API to fetch active contests
exports.getActiveContests = async (req, res) => {
  try {
    const now = new Date();
    const contests = await Contest.find({
      startTime: { $lte: now },
      endTime: { $gte: now },
      isPublic: true,
    }).populate("problems", "title difficulty");

    res.json({ success: true, contests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllContests = async (req, res) => {
  try {
    const contests = await Contest.find().populate("problems");
    res.json(contests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getContestById = async (req, res) => {
  try {
    let contest = await Contest.findById(req.params.id);
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    // Only populate problems after contest has started
    const now = new Date();
    if (now >= new Date(contest.startTime)) {
      contest = await Contest.findById(req.params.id).populate("problems");
    }

    // Get user contest registration and completion status if user is authenticated
    let userStatus = null;
    if (req.result && req.result._id) {
      const User = require("../models/user");
      const user = await User.findById(req.result._id);
      if (user) {
        const isRegistered = contest.participants?.some(
          (p) => p.toString() === user._id.toString()
        );
        const isCompleted = user.contestsCompleted.some(
          (cId) => cId.toString() === contest._id.toString()
        );
        userStatus = {
          isRegistered,
          isCompleted,
        };
      }
    }

    res.json({ contest, userStatus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateContest = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    const updateData = { ...req.body };
    const now = new Date();

    // Parse incoming times if provided
    const incomingStart =
      req.body.startTime !== undefined ? new Date(req.body.startTime) : null;
    const incomingEnd =
      req.body.endTime !== undefined ? new Date(req.body.endTime) : null;

    if (incomingStart && isNaN(incomingStart.getTime())) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid start time" });
    }
    if (incomingEnd && isNaN(incomingEnd.getTime())) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid end time" });
    }

    // Determine resulting times for validation
    const newStart = incomingStart || contest.startTime;
    const newEnd = incomingEnd || contest.endTime;

    // If start time is being changed, ensure it's not in the past
    if (incomingStart && newStart < now) {
      return res.status(400).json({
        success: false,
        message: "Start time must be in the future",
      });
    }

    // Ensure end > start with resulting values
    if (newEnd <= newStart) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    if (incomingStart) updateData.startTime = newStart;
    if (incomingEnd) updateData.endTime = newEnd;
    if (incomingStart) {
      updateData.date = newStart.toISOString().split("T")[0];
    }

    const updated = await Contest.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteContest = async (req, res) => {
  try {
    const deleted = await Contest.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Contest not found" });
    res.json({ message: "Contest deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getContestStatus = async (req, res) => {
  try {
    const { contestId } = req.params;
    const userId = req.result._id;

    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res
        .status(404)
        .json({ success: false, message: "Contest not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isRegistered = contest.participants?.some(
      (p) => p.toString() === user._id.toString()
    );
    const isCompleted = user.contestsCompleted.some(
      (cId) => cId.toString() === contest._id.toString()
    );

    res.json({
      success: true,
      status: {
        isRegistered,
        isCompleted,
      },
    });
  } catch (error) {
    console.error("Error fetching contest status:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching contest status" });
  }
};

// Pick a random problem for "problem of the day"
exports.getProblemOfTheDay = async (req, res) => {
  try {
    const problems = await Problem.find({ visibility: "public" });
    const randomIndex = Math.floor(Math.random() * problems.length);
    res.json(problems[randomIndex]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTodayContest = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const contest = await Contest.findOne({ date: today });

    if (!contest) {
      return res.status(404).json({ error: "No contest found for today" });
    }

    res.json(contest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get problems for a specific contest
exports.getContestProblems = async (req, res) => {
  try {
    const contestId = req.params.contestId;
    const contest = await Contest.findById(contestId).populate(
      "problems",
      "_id title difficulty description startCode visibleTestCases constraints"
    );
    if (!contest) {
      return res
        .status(404)
        .json({ success: false, message: "Contest not found" });
    }
    // Hide problems before the contest starts
    const now = new Date();
    if (now < new Date(contest.startTime)) {
      return res.status(200).json({
        success: true,
        problems: [],
        message: "Problems will be revealed when the contest starts",
      });
    }
    res.status(200).json({ success: true, problems: contest.problems });
  } catch (error) {
    console.error("❌ Error fetching contest problems:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch a single problem by contestId and problemId
exports.getContestProblem = async (req, res) => {
  try {
    const { contestId, problemId } = req.params;

    // Verify contest exists
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    // Block access before contest start
    const now = new Date();
    if (now < new Date(contest.startTime)) {
      return res.status(403).json({ message: "Contest has not started yet" });
    }

    // Verify problem belongs to contest
    if (!contest.problems.includes(problemId)) {
      return res
        .status(404)
        .json({ message: "Problem not found in this contest" });
    }

    // Fetch problem
    const problem = await Problem.findById(problemId).lean(); // Use .lean() for a plain JS object
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.json({ problem });
  } catch (err) {
    console.error("Error in getContestProblem:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find({}, "_id title visibility"); // Fetch _id, title, and visibility
    res.json({ success: true, problems });
  } catch (error) {
    console.error("Error fetching all problems:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching all problems" });
  }
};
