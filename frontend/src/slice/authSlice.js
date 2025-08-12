import {
  register,
  login,
  logout,
  checkAuth as checkAuthApi,
  getProfile as getProfileApi,
} from "../utils/apis/userApi";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { updateProfile as updateProfileApi } from "../utils/apis/userApi";

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await register(userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      // Return user and token
      return { user: response.data.user, token: response.data.token };
    } catch (err) {
      // Normalize error into serializable shape
      const message =
        err.response?.data?.message || err.message || "Login failed";
      const status = err.response?.status;
      return rejectWithValue({ message, status });
    }
  }
);

export const logutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await logout();
      return response.data.user;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Logout failed";
      return rejectWithValue({ message });
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/check",
  async (_, { rejectWithValue }) => {
    try {
      const response = await checkAuthApi();
      return response.data.user;
    } catch (err) {
      const status = err.response?.status;
      const message =
        err.response?.data?.message ||
        (status === 401
          ? "Not authenticated"
          : status === 403
          ? "Forbidden"
          : err.message || "Auth check failed");
      return rejectWithValue({ message, status });
    }
  },
  {
    condition: () => {
      // Skip calling API if no token yet; prevents noisy 401 on fresh load
      return !!localStorage.getItem("authToken");
    },
  }
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProfileApi();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await updateProfileApi(formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

import {
  forgotPassword,
  resetPassword,
  changePassword,
} from "../utils/apis/userApi";

export const forgotPasswordThunk = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await forgotPassword(email);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const resetPasswordThunk = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await resetPassword(token, newPassword);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const changePasswordThunk = createAsyncThunk(
  "auth/changePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await changePassword(oldPassword, newPassword);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteProfileThunk = createAsyncThunk(
  "auth/deleteProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await deleteProfile();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

//slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("authToken") || null,
    loading: false,
    isAuthenticated: !!localStorage.getItem("authToken"),
    error: null,
    profile: null,
    profileLoading: false,
    profileError: null,
    updateProfileLoading: false,
    updateProfileError: null,
    updateProfileSuccess: false,
    forgotPasswordLoading: false,
    forgotPasswordError: null,
    forgotPasswordSuccess: false,
    resetPasswordLoading: false,
    resetPasswordError: null,
    resetPasswordSuccess: false,
    changePasswordLoading: false,
    changePasswordError: null,
    changePasswordSuccess: false,
  },
  reducers: {
    resetDeleteProfileState: (state) => {
      state.deleteProfileLoading = false;
      state.deleteProfileError = null;
      state.deleteProfileSuccess = false;
    },
    resetUpdateProfileState: (state) => {
      state.updateProfileLoading = false;
      state.updateProfileError = null;
      state.updateProfileSuccess = false;
    },
    resetPasswordResetState: (state) => {
      state.requestPasswordResetOTPLoading = false;
      state.requestPasswordResetOTPError = null;
      state.requestPasswordResetOTPSuccess = false;
      state.resetPasswordLoading = false;
      state.resetPasswordError = null;
      state.resetPasswordSuccess = false;
    },
    resetChangePasswordState: (state) => {
      state.changePasswordLoading = false;
      state.changePasswordError = null;
      state.changePasswordSuccess = false;
    },
    // New reducer to update user stats from socket
    setUserStats: (state, action) => {
      if (state.user) {
        state.user.points = action.payload.points;
        state.user.streak = action.payload.streak;
      }
    },
    updateTokens: (state, action) => {
      if (state.user) {
        state.user.tokensLeft = action.payload.tokensLeft;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      //login user cases
      .addCase(loginUser.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload.user;
        state.token = action.payload.token;
        // Update localStorage for token and user
        console.log("LOGIN SUCCESSFUL, SETTING TOKEN:", action.payload.token);
        localStorage.setItem("authToken", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
        state.isAuthenticated = false;
        state.user = null;
      })

      //logout user
      .addCase(logutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      })
      .addCase(logutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Logout failed";
        state.user = null;
        state.isAuthenticated = false;
      })

      //check auth
      .addCase(checkAuth.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        (state.loading = false),
          (state.error = action.payload?.message || "Auth check failed");
        state.isAuthenticated = false;
        state.user = null;
      })

      .addCase(getProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile = action.payload.user;
        state.user = {
          ...state.user,
          ...action.payload.user,
          emailId: action.payload.user.emailId,
          paymentHistory: action.payload.user.paymentHistory || [],
        };
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      })

      // update profile
      .addCase(updateProfile.pending, (state) => {
        state.updateProfileLoading = true;
        state.updateProfileError = null;
        state.updateProfileSuccess = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateProfileLoading = false;
        state.updateProfileSuccess = true;
        state.profile = action.payload.user;
        state.user = {
          ...state.user,
          ...action.payload.user,
          emailId: action.payload.user.emailId,
        };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateProfileLoading = false;
        state.updateProfileError = action.payload;
        state.updateProfileSuccess = false;
      })

      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("authToken", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })

      // forgotPassword
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.requestPasswordResetOTPSuccess = true;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Password reset request failed";
      })

      // resetPassword
      .addCase(resetPasswordThunk.pending, (state) => {
        state.resetPasswordLoading = true;
        state.resetPasswordError = null;
        state.resetPasswordSuccess = false;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.resetPasswordLoading = false;
        state.resetPasswordSuccess = true;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.resetPasswordLoading = false;
        state.resetPasswordError = action.payload;
        state.resetPasswordSuccess = false;
      })

      // changePassword
      .addCase(changePasswordThunk.pending, (state) => {
        state.changePasswordLoading = true;
        state.changePasswordError = null;
        state.changePasswordSuccess = false;
      })
      .addCase(changePasswordThunk.fulfilled, (state) => {
        state.changePasswordLoading = false;
        state.changePasswordSuccess = true;
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.changePasswordLoading = false;
        state.changePasswordError = action.payload;
        state.changePasswordSuccess = false;
      })

      // delete profile
      .addCase(deleteProfileThunk.pending, (state) => {
        state.deleteProfileLoading = true;
        state.deleteProfileError = null;
        state.deleteProfileSuccess = false;
      })
      .addCase(deleteProfileThunk.fulfilled, (state) => {
        state.deleteProfileLoading = false;
        state.deleteProfileSuccess = true;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      })
      .addCase(deleteProfileThunk.rejected, (state, action) => {
        state.deleteProfileLoading = false;
        state.deleteProfileError = action.payload;
        state.deleteProfileSuccess = false;
      });
  },
});

export const {
  resetUpdateProfileState,
  resetPasswordResetState,
  resetChangePasswordState,
  setUserStats,
  updateTokens,
  resetDeleteProfileState,
} = authSlice.actions;

export default authSlice.reducer;
