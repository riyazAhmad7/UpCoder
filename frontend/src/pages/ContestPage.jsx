import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Clock,
  Users,
  Zap,
  Calendar,
  ArrowRight,
  Timer,
  Star,
  Target,
  PlayCircle,
  TrendingUp,
  Award,
  Flame,
  CalendarDays,
  Play,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import axiosClient from "../utils/axiosClient";
import LoadingSpinner from "../components/common/LoadingSpinner";

const ContestPage = () => {
  const [contests, setContests] = useState([]);
  const [upcomingContests, setUpcomingContests] = useState([]);
  const [ongoingContests, setOngoingContests] = useState([]);
  const [pastContests, setPastContests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAllContests = async () => {
      try {
        const res = await axiosClient.get("/contest", {
          signal: controller.signal,
        });

        if (res.data && Array.isArray(res.data)) {
          setContests(res.data);
          categorizeContests(res.data);
        } else {
          console.log("No contests found or invalid response:", res.data);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.log("Error fetching contests:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllContests();

    return () => {
      controller.abort();
    };
  }, []);

  const categorizeContests = (allContests) => {
    const now = new Date();
    const upcoming = [];
    const ongoing = [];
    const past = [];

    allContests.forEach((contest) => {
      const startTime = new Date(contest.startTime);
      const endTime = new Date(contest.endTime);

      if (now < startTime) {
        upcoming.push(contest);
      } else if (now >= startTime && now <= endTime) {
        ongoing.push(contest);
      } else {
        past.push(contest);
      }
    });

    setUpcomingContests(upcoming);
    setOngoingContests(ongoing);
    setPastContests(past);
  };

  const formatTimeLeft = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const distance = end - now;

    if (distance <= 0) return "Ended";

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m ${seconds}s`;
    }
  };

  const formatTimeUntilStart = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const distance = start - now;

    if (distance <= 0) return "Started";

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const getContestStatus = (contest) => {
    const now = new Date();
    const startTime = new Date(contest.startTime);
    const endTime = new Date(contest.endTime);

    if (now < startTime) {
      return {
        status: "upcoming",
        color: "text-yellow-400",
        bg: "bg-yellow-500/20",
      };
    } else if (now >= startTime && now <= endTime) {
      return {
        status: "ongoing",
        color: "text-green-400",
        bg: "bg-green-500/20",
      };
    } else {
      return { status: "ended", color: "text-red-400", bg: "bg-red-500/20" };
    }
  };

  const ContestCard = ({ contest, type }) => {
    const status = getContestStatus(contest);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-3 h-3 rounded-full ${status.bg}`} />
                <span className={`font-semibold ${status.color}`}>
                  {status.status.toUpperCase()}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {contest.name}
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                {contest.description || "No description available"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-slate-400" />
              <span className="text-slate-400 text-sm">
                {contest.participants?.length || 0} participants
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" />
              <span className="text-slate-300 text-sm">
                {new Date(contest.startTime).toLocaleDateString("en-GB")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-slate-400" />
              <span className="text-slate-300 text-sm">
                {new Date(contest.startTime).toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-slate-400" />
              <span className="text-slate-300 text-sm">
                {contest.problems?.length || 0} problems
              </span>
            </div>
            <div className="flex items-center gap-2">
              {type === "ongoing" && (
                <div className="flex items-center gap-1">
                  <Timer size={16} className="text-orange-400" />
                  <span className="text-orange-400 text-sm font-medium">
                    {formatTimeLeft(contest.endTime)}
                  </span>
                </div>
              )}
              {type === "upcoming" && (
                <div className="flex items-center gap-1">
                  <Clock size={16} className="text-yellow-400" />
                  <span className="text-yellow-400 text-sm font-medium">
                    {formatTimeUntilStart(contest.startTime)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <Link
              to={`/contest/${contest._id}`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
            >
              {type === "ongoing"
                ? "Join Contest"
                : type === "upcoming"
                ? "View Details"
                : "View Results"}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                         radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)`,
        }}
      ></div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Back to Home Button */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-6 shadow-xl">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            Coding Contests
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Compete with programmers worldwide in exciting coding challenges
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Ongoing Contests */}
        {ongoingContests.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <h2 className="text-2xl font-bold text-white">
                Ongoing Contests
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ongoingContests.map((contest) => (
                <ContestCard
                  key={contest._id}
                  contest={contest}
                  type="ongoing"
                />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Contests */}
        {upcomingContests.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-yellow-400 rounded-full" />
              <h2 className="text-2xl font-bold text-white">
                Upcoming Contests
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingContests.map((contest) => (
                <ContestCard
                  key={contest._id}
                  contest={contest}
                  type="upcoming"
                />
              ))}
            </div>
          </div>
        )}

        {/* Past Contests */}
        {pastContests.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-red-400 rounded-full" />
              <h2 className="text-2xl font-bold text-white">Past Contests</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastContests.map((contest) => (
                <ContestCard key={contest._id} contest={contest} type="past" />
              ))}
            </div>
          </div>
        )}

        {/* No Contests Message */}
        {contests.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800 rounded-2xl mb-6">
              <Trophy className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              No Contests Available
            </h3>
            <p className="text-slate-400 text-lg">
              Check back later for exciting coding challenges!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestPage;
