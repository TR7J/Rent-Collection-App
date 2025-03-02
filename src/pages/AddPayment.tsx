import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../axiosConfig";
import { showToast } from "../utils/toastUtils";
import { useDashboard } from "../context/DashboardContext";

const AddPayment = () => {
  const { rentalId } = useParams<{ rentalId: string }>();
  const navigate = useNavigate();

  const [amount, setAmount] = useState<number | "">("");
  const [date, setDate] = useState<string>("");
  const [isLateFee, setIsLateFee] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    fetchDashboardSummary,
    fetchChartSummary,
    fetchPaymentsSummary,
    fetchRentals,
  } = useDashboard();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !date) {
      setError("Amount and Date are required.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`/api/admin/payment/${rentalId}`, {
        amount,
        date,
        isLateFee,
        description,
      });
      showToast("Payment Added Successfully", "success");
      fetchDashboardSummary();
      fetchChartSummary();
      fetchPaymentsSummary(
        "month",
        new Date().getMonth() + 1,
        new Date().getFullYear()
      );
      fetchRentals();
      navigate("/rentals"); // Redirect to rentals page after successful payment
    } catch (err) {
      showToast("Failed to add payment. Please try again.", "error");
      setError("Failed to add payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md mx-auto p-6 bg-white shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Add Payment</h1>
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
            {loading ? "Processing..." : "Add Payment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPayment;
