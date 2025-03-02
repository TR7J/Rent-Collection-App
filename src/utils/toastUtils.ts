import { toast } from "react-toastify";

export const showToast = (message: string, type: "success" | "error") => {
  toast(message, {
    type,
    style: {
      color: type === "success" ? "#7c3aed" : "#dc2626",
      backgroundColor: type === "success" ? "#f3e8ff" : "#fee2e2",
    },
    progressClassName: type === "success" ? "bg-violet-500" : "bg-red-500",
  });
};
