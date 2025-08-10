const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProblemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    constraints: {
      type: String,
      default: "",
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    companyAsked: {
      type: String,
      default: "",
    },
    tags: {
      type: [String],
      enum: [
        // Core Concepts
        "array",
        "string",
        "linkedList",
        "stack",
        "queue",
        "hashmap",
        "set",
        "tree",
        "graph",
        "binary search",
        "binary tree",
        "binary search tree",

        // Algorithms
        "sorting",
        "searching",
        "recursion",
        "backtracking",
        "greedy",
        "dynamic programming",
        "dp",
        "two pointers",
        "sliding window",
        "expand around center",

        // Advanced Data Structures
        "heap",
        "priority queue",
        "AVL tree",
        "red-black tree",
        "B-tree",
        "segment tree",
        "Fenwick tree",
        "trie",
        "disjoint set union",

        // Bit Manipulation
        "bit manipulation",
        "bitwise operations",

        // Math & Number Theory
        "math",
        "number manipulation",
        "number theory",
        "geometry",
        "combinatorics",
        "probability",

        // Paradigms & Techniques
        "function",
        "loop",
        "hashing",
        "combinatorial optimization",
        "game theory",

        // Broader Fields (use with caution)
        "data structures",
        "algorithms",
        "optimization",
        "machine learning",
        "artificial intelligence",
        "natural language processing",
        "computer vision",
        "deep learning",
        "reinforcement learning",
        "networking",
        "security",
        "cryptography",
        "parallel processing",
        "distributed systems",
        "conditional",
        "condition",
        "digits",
        "parsing",
        "explanation",
      ],
      required: true,
    },
    visibleTestCases: [
      {
        input: {
          type: String,
          default: "",
        },
        output: {
          type: String,
          default: "",
        },
        explanation: {
          type: String,
          required: true,
          default: "",
        },
      },
    ],
    hiddenTestCases: [
      {
        input: {
          type: String,
          default: "",
        },
        output: {
          type: String,
          default: "",
        },
      },
    ],
    startCode: [
      {
        language: {
          type: String,
          required: true,
        },
        initialCode: {
          type: String,
          required: true,
        },
      },
    ],

    referenceSolution: [
      // actual solution.
      {
        language: {
          type: String,
          required: true,
        },
        completeCode: {
          type: String,
          required: true,
        },
        default: [],
      },
    ],

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
      required: true,
    },

    problemCreator: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const Problem = mongoose.model("problem", ProblemSchema);
module.exports = Problem;
