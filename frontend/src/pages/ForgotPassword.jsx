import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  forgotPasswordThunk,
  resetPasswordResetState,
} from "../slice/authSlice";
import { useEffect } from "react";

const forgotPasswordSchema = z.object({
  emailId: z.string().email("Invalid Email"),
});

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { loading, error, requestPasswordResetOTPSuccess } = useSelector(
    (state) => state.auth
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Clear any previous success/error state when this screen mounts
  useEffect(() => {
    return () => {
      // Reset flags when leaving the screen
      dispatch(resetPasswordResetState());
    };
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data) => {
    try {
      // unwrap throws on rejection giving us the serialized payload
      const res = await dispatch(forgotPasswordThunk(data.emailId)).unwrap();
      const msg =
        res?.message ||
        "Password reset link sent to your email. Please check your inbox and spam folder";
      toast.success(msg, { autoClose: 4000 });
      setIsSubmitted(true);
    } catch (err) {
      const msg = err?.message || err?.error || "Failed to send reset link.";
      toast.error(msg, { autoClose: 5000 });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_50%)]"></div>

      <Link to="/login">
        <button className="absolute top-6 left-6 hover:text-orange-400 flex items-center text-gray-400 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </button>
      </Link>

      <div className="relative w-full max-w-md">
        <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-t-2xl"></div>
        <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-b-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Forgot Your Password?
            </h1>
            <p className="text-gray-400">
              {isSubmitted
                ? "If an account with that email exists, a reset link has been sent."
                : "Enter your email and we'll send you a link to reset it."}
            </p>
          </div>

          {isSubmitted || requestPasswordResetOTPSuccess ? (
            <div className="text-center">
              <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-green-400 font-medium mb-2">
                  Email sent successfully!
                </p>
                <p className="text-gray-300 text-sm">
                  Please check your inbox and spam folder for the password reset
                  link.
                </p>
              </div>
              <Link
                to="/login"
                className="inline-block text-orange-400 hover:text-orange-300 font-semibold transition-colors"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  {...register("emailId")}
                  placeholder="name@company.com"
                />
                {errors.emailId && (
                  <span className="text-red-400 text-sm mt-1 block">
                    {errors.emailId.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
