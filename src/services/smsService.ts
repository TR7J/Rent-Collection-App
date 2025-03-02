import axios from "../axiosConfig";

export const sendSMS = async (phone: string, message: string) => {
  try {
    const response = await axios.post("/api/admin/send-sms", {
      phone,
      message,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw error;
  }
};
