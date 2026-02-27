export const showToast = (message, type = "success", duration = 3000) => {
  setToast({ show: true, message, type });
  setTimeout(() => setToast({ show: false, message: "", type: "success" }), duration);
};