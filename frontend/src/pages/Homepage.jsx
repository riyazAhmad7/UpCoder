import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import AiAssistant from "../components/common/AiAssistant";
import UpCoder from "../utils/logo/UpCoder .png";
import slietBuilding from "../utils/logo/SLIET building image.jpg";
import {
  ArrowRight,
  CheckCircle,
  Github,
  Globe,
  HelpCircle,
  Instagram,
  Zap as Lightning,
  Linkedin,
  MessageSquare,
  Rocket,
  Trophy,
  Twitter,
  Youtube,
  Shield,
  BrainCircuit,
  Code2,
} from "lucide-react";

const Homepage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeFeature, setActiveFeature] = useState("interview-ai");
  const [isVisible, setIsVisible] = useState(false);

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);

  // Entry animation
  useEffect(() => {
    setIsVisible(true);
    // No timers/metrics for resume project
    return () => {};
  }, []);

  // Enhanced features data with your projects
  const features = {
    "interview-ai": {
      title: "Interview AI",
      icon: BrainCircuit,
      description: "AI-powered mock interviews",
      details:
        "Practice coding interviews with our AI interviewer. Get helpful feedback, simple suggestions, and track your learning progress.",
      color: "from-purple-500 to-indigo-500",
      stats: "",
      badge: "AI POWERED",
      features: [
        "Industry-style questions",
        "Real-time feedback",
        "Performance analytics",
        "Voice interaction",
      ],
    },
    "doubt-assistant": {
      title: "Doubt Assistant",
      icon: HelpCircle,
      description: "24/7 coding help",
      details:
        "Get help with your coding doubts from our AI assistant. Whether it's debugging, algorithm steps, or concept clarification - we've got you covered.",
      color: "from-green-500 to-emerald-500",
      stats: "",
      badge: "INSTANT HELP",
      features: [
        "Code debugging",
        "Concept explanations",
        "Best practices",
        "Multiple languages",
      ],
    },
    discuss: {
      title: "Discussion Forum",
      icon: MessageSquare,
      description: "Community-driven learning",
      details:
        "Connect with fellow coders, share solutions, discuss algorithms, and learn from the community. Upvote best answers and build your reputation.",
      color: "from-blue-500 to-cyan-500",
      stats: "",
      badge: "COMMUNITY",
      features: [
        "Q&A format",
        "Expert answers",
        "Code sharing",
        "Reputation system",
      ],
    },

    contests: {
      title: "Global Contests",
      icon: Trophy,
      description: "Friendly coding challenges",
      details:
        "Join periodic coding challenges with leaderboards and simple performance insights. Great for practice under time limits.",
      color: "from-amber-500 to-yellow-500",
      stats: "",
      badge: "CHALLENGES",
      features: [
        "Timed challenges",
        "Ranked leaderboards",
        "Performance insights",
        "Practice under pressure",
      ],
    },
    problems: {
      title: "Problems",
      icon: Code2,
      description: "Practice across topics",
      details:
        "Solve a vast collection of curated coding problems across data structures, algorithms, and systems. Filter by topic, difficulty, and company tags to build mastery step by step.",
      color: "from-rose-500 to-pink-500",
      stats: "Vast problem library",
      badge: "PRACTICE",
      features: [
        "Topics: Arrays, Trees, Graphs, DP, and more",
        "All difficulty levels",
        "Company-wise tags",
        "Editorials and test cases",
      ],
    },
  };

  // No testimonials/contests on resume version

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Navbar */}
      <Navbar />
      <AiAssistant />

      {/* Enhanced Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/3 w-64 h-64 bg-green-500/5 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "6s" }}
        ></div>
      </div>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className={`relative min-h-[70vh] md:min-h-[75vh] flex items-center justify-center px-4 py-10 pt-24 transition-all duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
              Code. Learn. Compete.
            </span>
            <br />
            <span className="text-white">Conquer Interviews.</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Master coding with AI-powered interviews, instant doubt resolution,
            and friendly coding challenges.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/problems">
              <button
                onClick={() => setIsAuthenticated(true)}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all duration-300 flex items-center gap-2 group"
              >
                {isAuthenticated ? "Continue Learning" : "Start Free Journey"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SLIET PPP Section (moved before features) */}
      <section id="sliet-ppp" className=" pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* SLIET Banner with overlay text */}
          <motion.div
            className="relative mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="relative h-64 md:h-80 lg:h-96 rounded-xl md:rounded-2xl overflow-hidden shadow-lg">
              <img
                src={slietBuilding}
                alt="SLIET Front Building"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-3xl md:text-5xl font-extrabold text-white tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  Making future Engineers
                </h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              SLIET PPP — Placement Preparation Program
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Curated by the Department of Training & Placement (TNP) for SLIET
              students. Practice consistently, track progress, and get
              interview-ready.
            </p>
          </motion.div>

          {/* Tracks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              {
                title: "DSA Practice",
                desc: "Topic-wise problems for placement rounds.",
                to: "/problems",
                Icon: Code2,
              },
              {
                title: "Mock Interviews",
                desc: "Practice with guided, AI-driven sessions.",
                to: "/interview",
                Icon: BrainCircuit,
              },
              {
                title: "Weekly Contests",
                desc: "Simulate real test pressure and timing.",
                to: "/contest",
                Icon: Trophy,
              },
              {
                title: "Discuss & Doubts",
                desc: "Ask, learn, and collaborate with peers.",
                to: "/discuss",
                Icon: MessageSquare,
              },
            ].map(({ title, desc, to, Icon }, idx) => (
              <motion.div
                key={title}
                className="backdrop-blur-sm bg-gray-800/80 border border-gray-700/50 rounded-2xl p-5 h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 mb-3 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
                <p className="text-gray-400 text-sm mb-4">{desc}</p>
                <Link
                  to={to}
                  className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm font-medium"
                >
                  Go to {title}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* How it works */}
          <div className="backdrop-blur-sm bg-gray-800/60 border border-gray-700/50 rounded-2xl p-6">
            <h4 className="text-white text-xl font-semibold mb-4 text-center">
              How SLIET PPP Works
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                
                "Practice sets + editorial guidance",
                "Weekly contest",
                "Mock interviews and doubt support",
              
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 bg-gray-900/40 rounded-xl p-4"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <span className="text-gray-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section ref={featuresRef} className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                Complete Coding Ecosystem
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Everything you need to master coding - from AI-powered
                interviews.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {Object.entries(features).map(([key, feature], index) => (
              <motion.div
                key={key}
                className={`relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 ${
                  activeFeature === key
                    ? "ring-2 ring-offset-4 ring-offset-gray-900 ring-orange-500 scale-105"
                    : "hover:scale-102"
                }`}
                onClick={() => setActiveFeature(key)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                {/* Background gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
                ></div>

                {/* Glass card */}
                <div className="relative z-10 backdrop-blur-sm bg-gray-800/80 border border-gray-700/50 p-6 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${feature.color} shadow-lg`}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div
                        className={`bg-gradient-to-r ${feature.color} text-white text-xs font-bold px-2 py-1 rounded-full`}
                      >
                        {feature.badge}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-orange-400 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 mb-3">{feature.description}</p>

                  <div className="text-sm text-orange-400 font-medium mb-4">
                    {feature.stats}
                  </div>

                  <AnimatePresence>
                    {activeFeature === key && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-300 mb-4 text-sm">
                          {feature.details}
                        </p>

                        <div className="space-y-2 mb-4">
                          {feature.features.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-xs text-gray-400"
                            >
                              <CheckCircle className="w-3 h-3 text-green-400" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>

                        <Link
                          to={`/${key.toLowerCase()}`}
                          className="w-full py-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 hover:from-orange-500/30 hover:to-amber-500/30 text-orange-400 hover:text-orange-300 rounded-lg transition-all duration-300 text-sm font-medium text-center"
                        >
                          Explore {feature.title}
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contest section removed for resume project */}

      {/* Enhanced CTA Section */}
      <section ref={ctaRef} className="py-20 px-4">
        <div className="max-w-5xl mx-auto relative">
          {/* Enhanced glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-amber-500/30 rounded-2xl blur-xl"></div>

          {/* CTA card */}
          <motion.div
            className="relative backdrop-blur-md bg-gray-800/90 border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl p-8 md:p-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Ready to Transform Your Coding Journey?
              </h2>

              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Explore problems and practice at your own pace. This is a demo
                project showcasing core flows without marketing claims.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Link to="/problems">
                  <button
                    onClick={() => setIsAuthenticated(true)}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    <Rocket className="w-5 h-5" />
                    {isAuthenticated
                      ? "Continue Your Journey"
                      : "Start Free Today"}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </Link>
                {/* Premium upsell removed for resume project */}
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center justify-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Free forever plan</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>No credit card required</span>
                </div>
                {/* Keep copy neutral and simple */}
                <div className="flex items-center justify-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Join in 30 seconds</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-16 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8  flex items-center justify-center">
                  <img
                    src={UpCoder}
                    height={30}
                    width={40}
                    alt="UpCoder-logo"
                  />
                </div>
                <span className="text-xl font-bold text-white">UpCoder</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The ultimate platform for competitive programmers and interview
                preparation. Master algorithms, ace interviews, and win
                competitions.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Twitter, href: "#", color: "hover:text-blue-400" },
                  { icon: Github, href: "#", color: "hover:text-gray-300" },
                  { icon: Linkedin, href: "#", color: "hover:text-blue-600" },
                  { icon: Youtube, href: "#", color: "hover:text-red-500" },
                  { icon: Instagram, href: "#", color: "hover:text-pink-500" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 ${social.color}`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Platform</h3>
              <ul className="space-y-3">
                {[
                  { name: "Interview AI", path: "/interview" },
                  { name: "Doubt Assistant", path: "/doubt-ai" },
                  { name: "Discussion Forum", path: "/discuss" },
                  { name: "Contests", path: "/contest" },
                  { name: "Problems", path: "/problems" },
                ].map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className="text-gray-400 hover:text-orange-400 transition-colors duration-300 flex items-center gap-2"
                    >
                      <ArrowRight className="w-3 h-3" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Learning</h3>
              <ul className="space-y-3">
                {[
                  "Learning Paths",
                  "Practice Problems",
                  "Mock Interviews",
                  "Tutorials",
                  "Blog",
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-orange-400 transition-colors duration-300 flex items-center gap-2"
                    >
                      <ArrowRight className="w-3 h-3" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Company</h3>
              <ul className="space-y-3">
                {[
                  "About Us",
                  "Careers",
                  "Contact",
                  "Help Center",
                  "Privacy Policy",
                  "Terms of Service",
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-orange-400 transition-colors duration-300 flex items-center gap-2"
                    >
                      <ArrowRight className="w-3 h-3" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} UpCoder. All rights reserved.{" "}
              <span className="font-bold">Riyaz Ahmad</span> - Developer
            </p>

            <div className="flex items-center space-x-6">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>Global Community</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Lightning className="w-4 h-4 text-yellow-400" />
                <span>Lightning Fast</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
