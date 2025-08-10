import axiosClient from "../axiosClient";

export const updateProfile = (formData) => {
  return axiosClient.put("/user/updateProfile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const register = (data) => {
  return axiosClient.post("/user/register", data);
};



export const requestPasswordResetOTP = (email) => {
  return axiosClient.post("/user/forgot-password", { email });
};

export const forgotPassword = (email) => {
  return axiosClient.post("/user/forgot-password", { email });
};

export const resetPassword = (token, newPassword) => {
  return axiosClient.post(`/user/reset-password/${token}`, { newPassword });
};

export const changePassword = (oldPassword, newPassword) => {
  return axiosClient.post("/user/changePassword", { oldPassword, newPassword });
};

export const getProfile = () => {
  return axiosClient.get("/user/getProfile");
};

export const deleteProfile = () => {
  return axiosClient.delete("/user/deleteProfile");
};

export const login = (credentials) => {
  return axiosClient.post("/user/login", credentials);
};

export const logout = () => {
  return axiosClient.post("/user/logout");
};

export const checkAuth = () => {
  return axiosClient.get("/user/check");
};
