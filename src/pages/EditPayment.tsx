import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../axiosConfig";
import { showToast } from "../utils/toastUtils";
import { useDashboard } from "../context/DashboardContext";

const EditPayment = () => {
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();

  // State variables
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>("");
  const [isLateFee, setIsLateFee] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const {
    fetchChartSummary,
    fetchDashboardSummary,
    fetchRentals,
    fetchPaymentsSummary,
  } = useDashboard();

  // Fetch payment details
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get(`/api/admin/payment/${paymentId}`);
        const payment = response.data;
        setAmount(payment.amount);
        setDate(payment.date.split("T")[0]); // Format date for input
        setIsLateFee(payment.isLateFee);
        setDescription(payment.description);
      } catch (err) {
        setError("Failed to fetch payment details.");
        console.error("Fetch Payment Error:", err);
      }
    };

    if (paymentId) {
      fetchPaymentDetails();
    }
  }, [paymentId]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.put(`/api/admin/updatepayment/${paymentId}`, {
        amount,
        date,
        isLateFee,
        description,
      });

      showToast("Payment updated successfully!", "success");
      fetchDashboardSummary();
      fetchChartSummary();
      fetchPaymentsSummary(
        "month",
        new Date().getMonth() + 1,
        new Date().getFullYear()
      );
      fetchRentals();
      navigate("/payments");
    } catch (err) {
      setError("Failed to update payment.");
      console.error("Update Payment Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md mx-auto p-6 bg-white shadow-md">
        <h1 className="text-2xl font-bold mb-4">Edit Payment</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Amount (KES)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isLateFee}
              onChange={() => setIsLateFee(!isLateFee)}
            />
            <label className="text-sm">Late/Overdue Fee?</label>
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-violet-500 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Payment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPayment;
