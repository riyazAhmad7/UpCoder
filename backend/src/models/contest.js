const mongoose = require("mongoose");
const { Schema } = mongoose;

const ContestSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    problems: [
      {
        type: Schema.Types.ObjectId,
        ref: "problem",
        required: true,
      },
    ],
    startTime: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          if (!v) return false;
          // Skip validation for query-based updates; controller enforces on update
          if (this && this.constructor && this.constructor.name === "Query") {
            return true;
          }
          // For document saves: only enforce future constraint on create or when startTime is being changed
          if (
            this &&
            typeof this.isNew !== "undefined" &&
            typeof this.isModified === "function"
          ) {
            if (this.isNew || this.isModified("startTime")) {
              return v.getTime() > Date.now();
            }
            return true; // not changing startTime
          }
          return true;
        },
        message: "Start time must be in the future",
      },
    },
    endTime: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          if (!v) return false;
          // On updates (query validators), skip here; controller enforces rules
          if (this && this.constructor && this.constructor.name === "Query") {
            return true;
          }
          // 'this' refers to the document on save; ensure end > start
          return this.startTime && v.getTime() > this.startTime.getTime();
        },
        message: "End time must be after start time",
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    date: String,
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Contest = mongoose.model("contest", ContestSchema);
module.exports = Contest;
