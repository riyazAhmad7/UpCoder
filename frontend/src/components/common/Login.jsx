import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginUser, getProfile } from "../../slice/authSlice";
import { ArrowLeft, EyeOff, Eye } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await dispatch(loginUser(data)).unwrap();

      // If we reach here, login was successful
      if (res?.token) {
        navigate("/"); // Redirect to home after successful login
        toast.success("Logged In Successfully");
        await dispatch(getProfile());
      } else {
        const errorMsg = res?.message || "Login failed";
        toast.error(errorMsg);
      }
    } catch (err) {
      // Handle the rejected case - wrong credentials
      const errorMsg = err?.message || "Invalid email or password";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative">
      {/* Background gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_50%)]"></div>

      {/* Back to Home button */}
      <NavLink to="/">
        <button className="absolute top-6 left-6 hover:text-orange-400 flex items-center text-gray-400 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>
      </NavLink>

      <form
        className="relative w-full max-w-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="relative w-full max-w-md">
          <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-t-2xl"></div>

          <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-b-2xl p-8 shadow-2xl">
            <div className="flex justify-center mb-6"></div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-400">Join UpCoder for Challenges</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  {...register("emailId")}
                  placeholder="2143008@sliet.ac.in"
                />
                {errors.emailId && (
                  <span className="text-red-400 text-sm mt-1 block">
                    {errors.emailId.message}
                  </span>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <Link
                    to="/forgotpassword"
                    className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 pr-12"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-400 text-sm mt-1 block">
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* Sign In button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>

            <p className="mt-8 text-center text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
              >
                Sign up 
              </Link>
            </p>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
