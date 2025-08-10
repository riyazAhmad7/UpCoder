import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Code,
  TestTube,
  FileText,
  Settings,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import axiosClient from "../../utils/axiosClient";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
NavLink;

// Zod schema matching the problem schema
const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  constraints: z.string().min(1, "Constraints are required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  companyAsked: z.string().optional(),
  tags: z.enum([
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
    "heap",
    "priority queue",
    "AVL tree",
    "red-black tree",
    "B-tree",
    "segment tree",
    "Fenwick tree",
    "trie",
    "disjoint set union",
    "bit manipulation",
    "bitwise operations",
    "math",
    "number manipulation",
    "number theory",
    "geometry",
    "combinatorics",
    "probability",
    "function",
    "loop",
    "hashing",
    "combinatorial optimization",
    "game theory",
    "data structures",
    "algorithms",
    "optimization",
  ]),
  visibility: z.enum(["public", "private"]),
  visibleTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
        explanation: z.string().min(1, "Explanation is required"),
      })
    )
    .min(1, "At least one visible test case required"),
  hiddenTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .min(1, "At least one hidden test case required"),
  startCode: z
    .array(
      z.object({
        language: z.enum(["cpp", "java", "python"]),
        initialCode: z.string().min(1, "Initial code is required"),
      })
    )
    .length(3, "All three languages required"),
  referenceSolution: z
    .array(
      z.object({
        language: z.enum(["cpp", "java", "python"]),
        completeCode: z.string().min(1, "Complete code is required"),
      })
    )
    .length(3, "All three languages required"),
});

const steps = [
  {
    id: 1,
    title: "Problem Details",
    icon: FileText,
    description: "Basic information and description",
  },
  {
    id: 2,
    title: "Test Cases",
    icon: TestTube,
    description: "Visible and hidden test cases",
  },
  {
    id: 3,
    title: "Code Templates",
    icon: Code,
    description: "Initial code and solutions",
  },
  {
    id: 4,
    title: "Review & Submit",
    icon: Settings,
    description: "Final review and submission",
  },
];

const difficultyColors = {
  easy: "bg-green-500",
  medium: "bg-yellow-500",
  hard: "bg-red-500",
};

const tagColors = {
  array: "bg-blue-500",
  string: "bg-green-500",
  linkedList: "bg-purple-500",
  stack: "bg-indigo-500",
  queue: "bg-pink-500",
  hashmap: "bg-red-500",
  set: "bg-yellow-500",
  tree: "bg-emerald-500",
  graph: "bg-indigo-500",
  "binary search": "bg-cyan-500",
  "binary tree": "bg-teal-500",
  "binary search tree": "bg-orange-500",
  sorting: "bg-violet-500",
  searching: "bg-rose-500",
  recursion: "bg-sky-500",
  backtracking: "bg-lime-500",
  greedy: "bg-amber-500",
  "dynamic programming": "bg-pink-500",
  dp: "bg-pink-500",
  "two pointers": "bg-blue-500",
  "sliding window": "bg-green-500",
  "expand around center": "bg-purple-500",
  heap: "bg-indigo-500",
  "priority queue": "bg-pink-500",
  "AVL tree": "bg-red-500",
  "red-black tree": "bg-yellow-500",
  "B-tree": "bg-emerald-500",
  "segment tree": "bg-cyan-500",
  "Fenwick tree": "bg-teal-500",
  trie: "bg-orange-500",
  "disjoint set union": "bg-violet-500",
  "bit manipulation": "bg-rose-500",
  "bitwise operations": "bg-sky-500",
  math: "bg-lime-500",
  "number manipulation": "bg-amber-500",
  "number theory": "bg-blue-500",
  geometry: "bg-green-500",
  combinatorics: "bg-purple-500",
  probability: "bg-indigo-500",
  function: "bg-pink-500",
  loop: "bg-red-500",
  hashing: "bg-yellow-500",
  "combinatorial optimization": "bg-emerald-500",
  "game theory": "bg-cyan-500",
  "data structures": "bg-teal-500",
  algorithms: "bg-orange-500",
  optimization: "bg-violet-500",
};

function CreateProblem() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      visibility: "public",
      startCode: [
        { language: "cpp", initialCode: "" },
        { language: "java", initialCode: "" },
        { language: "python", initialCode: "" },
      ],
      referenceSolution: [
        { language: "cpp", completeCode: "" },
        { language: "java", completeCode: "" },
        { language: "python", completeCode: "" },
      ],
      visibleTestCases: [{ input: "", output: "", explanation: "" }],
      hiddenTestCases: [{ input: "", output: "" }],
    },
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({
    control,
    name: "visibleTestCases",
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({
    control,
    name: "hiddenTestCases",
  });

  const watchedValues = watch();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await axiosClient.post("/problem/create", data);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Problem Created Successfully");
      navigate("/problems");
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step) => {
    switch (step) {
      case 1:
        return ["title", "description", "difficulty", "tags", "visibility"];
      case 2:
        return ["visibleTestCases", "hiddenTestCases"];
      case 3:
        return ["startCode", "referenceSolution"];
      default:
        return [];
    }
  };

  const isStepValid = (step) => {
    const fields = getFieldsForStep(step);
    return fields.every((field) => !errors[field]);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProblemDetailsStep
            register={register}
            errors={errors}
            watchedValues={watchedValues}
          />
        );
      case 2:
        return (
          <TestCasesStep
            register={register}
            errors={errors}
            visibleFields={visibleFields}
            hiddenFields={hiddenFields}
            appendVisible={appendVisible}
            appendHidden={appendHidden}
            removeVisible={removeVisible}
            removeHidden={removeHidden}
          />
        );
      case 3:
        return <CodeTemplatesStep register={register} errors={errors} />;
      case 4:
        return <ReviewStep watchedValues={watchedValues} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <NavLink to="/">
          <button className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors">
            <ArrowLeft size={20} />
            Back to Home
          </button>
        </NavLink>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Create New Problem
          </h1>
          <p className="text-slate-400">
            Design challenging problems for the coding community
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          {/* Step indicators with connecting lines */}
          <div className="relative">
            <div className="flex items-center  justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center relative z-10">
                    <div
                      className={`
                      flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                      ${
                        currentStep >= step.id
                          ? "bg-orange-500 border-orange-500 text-white"
                          : "border-slate-600 text-slate-400"
                      }
                    `}
                    >
                      {currentStep > step.id ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <step.icon className="w-6 h-6" />
                      )}
                    </div>
                  </div>
                  {/* Connection line - only between steps, not after the last one */}
                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-4">
                      <div
                        className={`
                        h-1 rounded transition-all duration-300
                        ${
                          currentStep > step.id
                            ? "bg-orange-500"
                            : "bg-slate-600"
                        }
                      `}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Step labels */}
            <div className="flex items-start gap-10 justify-between mt-4">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="flex flex-col items-center text-center max-w-[200px]"
                >
                  <h3
                    className={`font-medium text-sm mb-1 ${
                      currentStep >= step.id ? "text-white" : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-tight">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-slate-800 rounded-xl shadow-2xl p-8 mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center px-6 py-3 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  "Create Problem"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// Step Components
function ProblemDetailsStep({ register, errors, watchedValues }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6 flex items-center">
        <FileText className="w-6 h-6 mr-3 text-orange-500" />
        Problem Details
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            Problem Title
          </label>
          <input
            {...register("title")}
            placeholder="Enter a descriptive problem title..."
            className={`w-full px-4 py-3 bg-slate-700 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
              errors.title ? "border-red-500" : "border-slate-600"
            }`}
          />
          {errors.title && (
            <p className="text-red-400 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            Problem Description
          </label>
          <textarea
            {...register("description")}
            placeholder="Provide a detailed description of the problem, including constraints and examples..."
            rows={6}
            className={`w-full px-4 py-3 bg-slate-700 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none ${
              errors.description ? "border-red-500" : "border-slate-600"
            }`}
          />
          {errors.description && (
            <p className="text-red-400 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Constraints</label>
          <textarea
            {...register("constraints")}
            placeholder="e.g. 1 ≤ N ≤ 10^5\n1 ≤ A[i] ≤ 10^9\nTime limit: 1s\nMemory limit: 256MB"
            rows={3}
            className={`w-full px-4 py-3 bg-slate-700 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none ${
              errors.constraints ? "border-red-500" : "border-slate-600"
            }`}
          />
          {errors.constraints && (
            <p className="text-red-400 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.constraints.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            Company Asked (Optional)
          </label>
          <input
            {...register("companyAsked")}
            placeholder="e.g., Google, Microsoft, Amazon, Facebook, Apple, Netflix, Uber, Airbnb, Twitter, LinkedIn, etc."
            className={`w-full px-4 py-3 bg-slate-700 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
              errors.companyAsked ? "border-red-500" : "border-slate-600"
            }`}
          />
          {errors.companyAsked && (
            <p className="text-red-400 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.companyAsked.message}
            </p>
          )}
          <p className="text-slate-400 text-sm mt-1">
            Leave empty if not asked by any specific company
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Difficulty Level
          </label>
          <select
            {...register("difficulty")}
            className={`w-full px-4 py-3 bg-slate-700 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.difficulty ? "border-red-500" : "border-slate-600"
            }`}
          >
            <option value="easy">🟢 Easy</option>
            <option value="medium">🟡 Medium</option>
            <option value="hard">🔴 Hard</option>
          </select>
          {watchedValues.difficulty && (
            <div className="mt-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${
                  difficultyColors[watchedValues.difficulty]
                }`}
              >
                {watchedValues.difficulty.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Problem Category
          </label>
          <select
            {...register("tags")}
            className={`w-full px-4 py-3 bg-slate-700 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.tags ? "border-red-500" : "border-slate-600"
            }`}
          >
            <optgroup label="📊 Data Structures">
              <option value="array">📊 Array</option>
              <option value="string">📝 String</option>
              <option value="linkedList">🔗 Linked List</option>
              <option value="stack">📚 Stack</option>
              <option value="queue">📋 Queue</option>
              <option value="hashmap">🗂️ Hash Map</option>
              <option value="set">📦 Set</option>
              <option value="tree">🌳 Tree</option>
              <option value="graph">🕸️ Graph</option>
              <option value="heap">📚 Heap</option>
              <option value="priority queue">⚡ Priority Queue</option>
              <option value="trie">🔤 Trie</option>
            </optgroup>

            <optgroup label="🔍 Search & Sort">
              <option value="binary search">🔍 Binary Search</option>
              <option value="sorting">📊 Sorting</option>
              <option value="searching">🔎 Searching</option>
            </optgroup>

            <optgroup label="🌳 Tree Variants">
              <option value="binary tree">🌳 Binary Tree</option>
              <option value="binary search tree">🌲 Binary Search Tree</option>
              <option value="AVL tree">🌴 AVL Tree</option>
              <option value="red-black tree">🌳 Red-Black Tree</option>
              <option value="B-tree">🌲 B-Tree</option>
            </optgroup>

            <optgroup label="⚡ Algorithms">
              <option value="recursion">🔄 Recursion</option>
              <option value="backtracking">🔙 Backtracking</option>
              <option value="greedy">💰 Greedy</option>
              <option value="dynamic programming">
                ⚡ Dynamic Programming
              </option>
              <option value="dp">⚡ DP</option>
              <option value="two pointers">👆 Two Pointers</option>
              <option value="sliding window">🪟 Sliding Window</option>
              <option value="expand around center">
                🎯 Expand Around Center
              </option>
            </optgroup>

            <optgroup label="🔧 Advanced Structures">
              <option value="segment tree">🌳 Segment Tree</option>
              <option value="Fenwick tree">📊 Fenwick Tree</option>
              <option value="disjoint set union">🔗 Disjoint Set Union</option>
            </optgroup>

            <optgroup label="🔢 Bit Operations">
              <option value="bit manipulation">🔧 Bit Manipulation</option>
              <option value="bitwise operations">⚙️ Bitwise Operations</option>
            </optgroup>

            <optgroup label="📐 Math & Theory">
              <option value="math">🧮 Math</option>
              <option value="number manipulation">
                🔢 Number Manipulation
              </option>
              <option value="number theory">📊 Number Theory</option>
              <option value="geometry">📐 Geometry</option>
              <option value="combinatorics">🎲 Combinatorics</option>
              <option value="probability">🎯 Probability</option>
            </optgroup>

            <optgroup label="🔄 Programming">
              <option value="function">⚙️ Function</option>
              <option value="loop">🔄 Loop</option>
              <option value="hashing">🔐 Hashing</option>
            </optgroup>

            <optgroup label="🎯 Advanced">
              <option value="combinatorial optimization">
                🎯 Combinatorial Optimization
              </option>
              <option value="game theory">🎮 Game Theory</option>
              <option value="data structures">📊 Data Structures</option>
              <option value="algorithms">⚡ Algorithms</option>
              <option value="optimization">🚀 Optimization</option>
            </optgroup>
          </select>
          {watchedValues.tags && (
            <div className="mt-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${
                  tagColors[watchedValues.tags]
                }`}
              >
                {watchedValues.tags === "linkedList"
                  ? "LINKED LIST"
                  : watchedValues.tags === "dp"
                  ? "DYNAMIC PROGRAMMING"
                  : watchedValues.tags === "binary search"
                  ? "BINARY SEARCH"
                  : watchedValues.tags === "binary tree"
                  ? "BINARY TREE"
                  : watchedValues.tags === "binary search tree"
                  ? "BINARY SEARCH TREE"
                  : watchedValues.tags === "AVL tree"
                  ? "AVL TREE"
                  : watchedValues.tags === "red-black tree"
                  ? "RED-BLACK TREE"
                  : watchedValues.tags === "B-tree"
                  ? "B-TREE"
                  : watchedValues.tags === "segment tree"
                  ? "SEGMENT TREE"
                  : watchedValues.tags === "Fenwick tree"
                  ? "FENWICK TREE"
                  : watchedValues.tags === "disjoint set union"
                  ? "DISJOINT SET UNION"
                  : watchedValues.tags === "bit manipulation"
                  ? "BIT MANIPULATION"
                  : watchedValues.tags === "bitwise operations"
                  ? "BITWISE OPERATIONS"
                  : watchedValues.tags === "number manipulation"
                  ? "NUMBER MANIPULATION"
                  : watchedValues.tags === "number theory"
                  ? "NUMBER THEORY"
                  : watchedValues.tags === "combinatorial optimization"
                  ? "COMBINATORIAL OPTIMIZATION"
                  : watchedValues.tags === "game theory"
                  ? "GAME THEORY"
                  : watchedValues.tags === "data structures"
                  ? "DATA STRUCTURES"
                  : watchedValues.tags === "dynamic programming"
                  ? "DYNAMIC PROGRAMMING"
                  : watchedValues.tags === "two pointers"
                  ? "TWO POINTERS"
                  : watchedValues.tags === "sliding window"
                  ? "SLIDING WINDOW"
                  : watchedValues.tags === "expand around center"
                  ? "EXPAND AROUND CENTER"
                  : watchedValues.tags === "priority queue"
                  ? "PRIORITY QUEUE"
                  : watchedValues.tags.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Problem Visibility
          </label>
          <select
            {...register("visibility")}
            className={`w-full px-4 py-3 bg-slate-700 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.visibility ? "border-red-500" : "border-slate-600"
            }`}
          >
            <option value="public">🌐 Public - Available for practice</option>
            <option value="private">🔒 Private - Contest only</option>
          </select>
          {watchedValues.visibility && (
            <div className="mt-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${
                  watchedValues.visibility === "public"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                }`}
              >
                {watchedValues.visibility === "public" ? "PUBLIC" : "PRIVATE"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TestCasesStep({
  register,
  errors,
  visibleFields,
  hiddenFields,
  appendVisible,
  appendHidden,
  removeVisible,
  removeHidden,
}) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-6 flex items-center">
        <TestTube className="w-6 h-6 mr-3 text-orange-500" />
        Test Cases
      </h2>

      {/* Visible Test Cases */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Eye className="w-5 h-5 mr-2 text-green-400" />
            <h3 className="text-lg font-medium">Visible Test Cases</h3>
            <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
              Public
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              appendVisible({ input: "", output: "", explanation: "" })
            }
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Case
          </button>
        </div>

        {visibleFields.map((field, index) => (
          <div key={field.id} className="bg-slate-700 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Test Case {index + 1}</h4>
              {visibleFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVisible(index)}
                  className="flex items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Input</label>
                <textarea
                  {...register(`visibleTestCases.${index}.input`)}
                  placeholder="Enter input data..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Expected Output
                </label>
                <textarea
                  {...register(`visibleTestCases.${index}.output`)}
                  placeholder="Enter expected output..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Explanation
              </label>
              <textarea
                {...register(`visibleTestCases.${index}.explanation`)}
                placeholder="Explain how the output is derived from the input..."
                rows={2}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Hidden Test Cases */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <EyeOff className="w-5 h-5 mr-2 text-blue-400" />
            <h3 className="text-lg font-medium">Hidden Test Cases</h3>
            <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
              Private
            </span>
          </div>
          <button
            type="button"
            onClick={() => appendHidden({ input: "", output: "" })}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Case
          </button>
        </div>

        {hiddenFields.map((field, index) => (
          <div key={field.id} className="bg-slate-700 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Hidden Test Case {index + 1}</h4>
              {hiddenFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeHidden(index)}
                  className="flex items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Input</label>
                <textarea
                  {...register(`hiddenTestCases.${index}.input`)}
                  placeholder="Enter input data..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Expected Output
                </label>
                <textarea
                  {...register(`hiddenTestCases.${index}.output`)}
                  placeholder="Enter expected output..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CodeTemplatesStep({ register, errors }) {
  const languages = [
    { name: "cpp", icon: "🔧", color: "border-blue-500" },
    { name: "java", icon: "☕", color: "border-red-500" },
    { name: "python", icon: "🐍", color: "border-green-500" },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-6 flex items-center">
        <Code className="w-6 h-6 mr-3 text-orange-500" />
        Code Templates
      </h2>

      {languages.map((lang, index) => (
        <div
          key={lang.name}
          className={`border-l-4 ${lang.color} bg-slate-700 rounded-lg p-6`}
        >
          <h3 className="text-xl font-medium mb-4 flex items-center">
            <span className="text-2xl mr-3">{lang.icon}</span>
            {lang.name}
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Initial Code Template
              </label>
              <p className="text-sm text-slate-400 mb-3">
                Provide the starting code structure that users will see
              </p>
              <div className="bg-slate-800 rounded-lg p-4">
                <textarea
                  {...register(`startCode.${index}.initialCode`)}
                  placeholder={`// ${lang.name} starter code\n// Define your function here...`}
                  rows={8}
                  className="w-full bg-transparent font-mono text-sm text-white resize-none focus:outline-none"
                  style={{
                    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Reference Solution
              </label>
              <p className="text-sm text-slate-400 mb-3">
                Complete working solution for validation and testing
              </p>
              <div className="bg-slate-800 rounded-lg p-4">
                <textarea
                  {...register(`referenceSolution.${index}.completeCode`)}
                  placeholder={`// ${lang.name} complete solution\n// Implement the full solution here...`}
                  rows={10}
                  className="w-full bg-transparent font-mono text-sm text-white resize-none focus:outline-none"
                  style={{
                    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReviewStep({ watchedValues }) {
  const getDifficultyBadge = (difficulty) => {
    const config = {
      easy: { color: "bg-green-500", emoji: "🟢" },
      medium: { color: "bg-yellow-500", emoji: "🟡" },
      hard: { color: "bg-red-500", emoji: "🔴" },
    };
    return config[difficulty] || config.easy;
  };

  const getTagBadge = (tag) => {
    const config = {
      array: { color: "bg-blue-500", emoji: "📊", label: "Array" },
      string: { color: "bg-green-500", emoji: "📝", label: "String" },
      linkedList: { color: "bg-purple-500", emoji: "🔗", label: "Linked List" },
      stack: { color: "bg-indigo-500", emoji: "📚", label: "Stack" },
      queue: { color: "bg-pink-500", emoji: "📋", label: "Queue" },
      hashmap: { color: "bg-red-500", emoji: "🗂️", label: "Hash Map" },
      set: { color: "bg-yellow-500", emoji: "📦", label: "Set" },
      tree: { color: "bg-emerald-500", emoji: "🌳", label: "Tree" },
      graph: { color: "bg-indigo-500", emoji: "🕸️", label: "Graph" },
      "binary search": {
        color: "bg-cyan-500",
        emoji: "🔍",
        label: "Binary Search",
      },
      "binary tree": {
        color: "bg-teal-500",
        emoji: "🌳",
        label: "Binary Tree",
      },
      "binary search tree": {
        color: "bg-orange-500",
        emoji: "🌲",
        label: "Binary Search Tree",
      },
      sorting: { color: "bg-violet-500", emoji: "📊", label: "Sorting" },
      searching: { color: "bg-rose-500", emoji: "🔎", label: "Searching" },
      recursion: { color: "bg-sky-500", emoji: "🔄", label: "Recursion" },
      backtracking: {
        color: "bg-lime-500",
        emoji: "🔙",
        label: "Backtracking",
      },
      greedy: { color: "bg-amber-500", emoji: "💰", label: "Greedy" },
      "dynamic programming": {
        color: "bg-pink-500",
        emoji: "⚡",
        label: "Dynamic Programming",
      },
      dp: { color: "bg-pink-500", emoji: "⚡", label: "Dynamic Programming" },
      "two pointers": {
        color: "bg-blue-500",
        emoji: "👆",
        label: "Two Pointers",
      },
      "sliding window": {
        color: "bg-green-500",
        emoji: "🪟",
        label: "Sliding Window",
      },
      "expand around center": {
        color: "bg-purple-500",
        emoji: "🎯",
        label: "Expand Around Center",
      },
      heap: { color: "bg-indigo-500", emoji: "📚", label: "Heap" },
      "priority queue": {
        color: "bg-pink-500",
        emoji: "⚡",
        label: "Priority Queue",
      },
      "AVL tree": { color: "bg-red-500", emoji: "🌴", label: "AVL Tree" },
      "red-black tree": {
        color: "bg-yellow-500",
        emoji: "🌳",
        label: "Red-Black Tree",
      },
      "B-tree": { color: "bg-emerald-500", emoji: "🌲", label: "B-Tree" },
      "segment tree": {
        color: "bg-cyan-500",
        emoji: "🌳",
        label: "Segment Tree",
      },
      "Fenwick tree": {
        color: "bg-teal-500",
        emoji: "📊",
        label: "Fenwick Tree",
      },
      trie: { color: "bg-orange-500", emoji: "🔤", label: "Trie" },
      "disjoint set union": {
        color: "bg-violet-500",
        emoji: "🔗",
        label: "Disjoint Set Union",
      },
      "bit manipulation": {
        color: "bg-rose-500",
        emoji: "🔧",
        label: "Bit Manipulation",
      },
      "bitwise operations": {
        color: "bg-sky-500",
        emoji: "⚙️",
        label: "Bitwise Operations",
      },
      math: { color: "bg-lime-500", emoji: "🧮", label: "Math" },
      "number manipulation": {
        color: "bg-amber-500",
        emoji: "🔢",
        label: "Number Manipulation",
      },
      "number theory": {
        color: "bg-blue-500",
        emoji: "📊",
        label: "Number Theory",
      },
      geometry: { color: "bg-green-500", emoji: "📐", label: "Geometry" },
      combinatorics: {
        color: "bg-purple-500",
        emoji: "🎲",
        label: "Combinatorics",
      },
      probability: {
        color: "bg-indigo-500",
        emoji: "🎯",
        label: "Probability",
      },
      function: { color: "bg-pink-500", emoji: "⚙️", label: "Function" },
      loop: { color: "bg-red-500", emoji: "🔄", label: "Loop" },
      hashing: { color: "bg-yellow-500", emoji: "🔐", label: "Hashing" },
      "combinatorial optimization": {
        color: "bg-emerald-500",
        emoji: "🎯",
        label: "Combinatorial Optimization",
      },
      "game theory": {
        color: "bg-cyan-500",
        emoji: "🎮",
        label: "Game Theory",
      },
      "data structures": {
        color: "bg-teal-500",
        emoji: "📊",
        label: "Data Structures",
      },
      algorithms: { color: "bg-orange-500", emoji: "⚡", label: "Algorithms" },
      optimization: {
        color: "bg-violet-500",
        emoji: "🚀",
        label: "Optimization",
      },
    };
    return config[tag] || config.array;
  };

  const difficultyBadge = getDifficultyBadge(watchedValues.difficulty);
  const tagBadge = getTagBadge(watchedValues.tags);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-6 flex items-center">
        <Settings className="w-6 h-6 mr-3 text-orange-500" />
        Review & Submit
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Problem Overview */}
        <div className="space-y-6">
          <div className="bg-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Problem Overview</h3>
            <div className="space-y-3">
              <div>
                <span className="text-slate-400 text-sm">Title:</span>
                <p className="font-medium">
                  {watchedValues.title || "Untitled Problem"}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Description:</span>
                <p className="text-sm mt-1">
                  {watchedValues.description || "No description provided"}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Constraints:</span>
                <p className="text-sm mt-1">
                  {watchedValues.constraints || "No constraints provided"}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Company Asked:</span>
                <p className="text-sm mt-1">
                  {watchedValues.companyAsked || "Not specified"}
                </p>
              </div>
              <div className="flex gap-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${difficultyBadge.color}`}
                >
                  {difficultyBadge.emoji}{" "}
                  {watchedValues.difficulty?.toUpperCase()}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${tagBadge.color}`}
                >
                  {tagBadge.emoji} {tagBadge.label.toUpperCase()}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${
                    watchedValues.visibility === "public"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  }`}
                >
                  {watchedValues.visibility === "public"
                    ? "🌐 PUBLIC"
                    : "🔒 PRIVATE"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Test Cases Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Visible Test Cases:</span>
                <span className="font-medium">
                  {watchedValues.visibleTestCases?.length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hidden Test Cases:</span>
                <span className="font-medium">
                  {watchedValues.hiddenTestCases?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Code Templates Summary */}
        <div className="space-y-6">
          <div className="bg-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Code Templates</h3>
            <div className="space-y-3">
              {["cpp", "java", "python"].map((lang, index) => (
                <div key={lang} className="flex items-center justify-between">
                  <span className="text-slate-400">{lang}:</span>
                  <div className="flex gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        watchedValues.startCode?.[index]?.initialCode
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></span>
                    <span
                      className={`w-3 h-3 rounded-full ${
                        watchedValues.referenceSolution?.[index]?.completeCode
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              🟢 Complete • 🔴 Incomplete
            </p>
          </div>

          <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-2 text-orange-400">
              Ready to Submit?
            </h3>
            <p className="text-sm text-slate-300">
              Please review all the information above. Once submitted, the
              problem will be available for users to solve. Make sure all test
              cases are correct and code templates are properly formatted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProblem;
