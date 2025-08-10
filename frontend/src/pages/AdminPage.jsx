import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Home,
  RefreshCw,
  Zap,
  Settings,
  Users,
  BarChart3,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import axiosClient from "../utils/axiosClient";

function AdminPage() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [userCount, setUserCount] = useState(0);

  const adminOptions = [
    {
      id: "create",
      title: "Create Problem",
      description: "Add new coding challenges to expand your problem set",
      icon: Plus,
      color: "from-emerald-500 to-teal-600",
      hoverColor: "hover:from-emerald-600 hover:to-teal-700",
      route: "/admin/create",
    },
    {
      id: "update",
      title: "Update Problem",
      description: "Modify existing problems and enhance their quality",
      icon: Edit,
      color: "from-amber-500 to-orange-600",
      hoverColor: "hover:from-amber-600 hover:to-orange-700",
      route: "/admin/update",
    },
    {
      id: "delete",
      title: "Delete Problem",
      description: "Remove outdated or duplicate problems safely",
      icon: Trash2,
      color: "from-red-500 to-rose-600",
      hoverColor: "hover:from-red-600 hover:to-rose-700",
      route: "/admin/delete",
    },

    {
      id: "users",
      title: "User Management",
      description: "Monitor user activity and manage accounts",
      icon: Users,
      color: "from-blue-500 to-cyan-600",
      hoverColor: "hover:from-blue-600 hover:to-cyan-700",
      route: "/admin/users",
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "View platform statistics and performance metrics",
      icon: BarChart3,
      color: "from-pink-500 to-rose-600",
      hoverColor: "hover:from-pink-600 hover:to-rose-700",
      route: "/admin/analytics",
    },
    {
      id: "analytics",
      title: "Contest Management",
      description: "Creating , Updating the contests",
      icon: BarChart3,
      color: "from-purple-500 to-rose-600",
      hoverColor: "hover:from-pink-600 hover:to-rose-700",
      route: "/admin/contest",
    },
  ];

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
        {/* Header Section */}
        <NavLink to="/">
          <button className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-gray-300 hover:text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-600 hover:border-slate-500">
            <ArrowLeft
              size={20}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            <span className="relative">
              Back to Home
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-300 group-hover:w-full"></div>
            </span>
          </button>
        </NavLink>
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-6 shadow-xl">
            <Settings className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Manage your coding platform with powerful administrative tools
          </p>

          {/* Orange accent line */}
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Admin Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            const isHovered = hoveredCard === option.id;

            return (
              <div
                key={option.id}
                className="group relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 hover:bg-slate-800/60 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:shadow-2xl"
                onMouseEnter={() => setHoveredCard(option.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}
                ></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon with gradient background */}
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${option.color} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors duration-300">
                    {option.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-base leading-relaxed mb-6 group-hover:text-gray-300 transition-colors duration-300">
                    {option.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 font-medium">
                      {option.stats}
                    </span>

                    {/* Action Button */}
                    <NavLink to={option.route}>
                      <button
                        className={`px-6 py-3 bg-gradient-to-r ${option.color} ${option.hoverColor} text-white font-semibold rounded-xl transform transition-all duration-300 group-hover:scale-105 hover:shadow-lg`}
                      >
                        Open
                      </button>
                    </NavLink>
                  </div>
                </div>

                {/* Hover effect border */}
                <div
                  className={`absolute inset-0 border-2 border-transparent group-hover:border-orange-500/30 rounded-3xl transition-all duration-300 ${
                    isHovered ? "border-orange-500/30" : ""
                  }`}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
