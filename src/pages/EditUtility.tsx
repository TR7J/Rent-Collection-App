import { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import { showToast } from "../utils/toastUtils";
import { useDashboard } from "../context/DashboardContext";

const predefinedUtilityTypes = [
  "Garbage",
  "Electricity",
  "Water",
  "Service Charge",
  "Security Fees",
];

const EditUtility = () => {
  const { utilityId } = useParams<{ utilityId: string }>();
  const navigate = useNavigate();

  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [selectedRenterFirstName, setSelectedRenterFirstName] =
    useState<string>("");
  const [selectedRenterLastName, setSelectedRenterLastName] =
    useState<string>("");
  const [type, setType] = useState<string>("");
  const [customType, setCustomType] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const {
    fetchChartSummary,
    fetchDashboardSummary,
    fetchRentals,
    fetchPaymentsSummary,
  } = useDashboard();

  useEffect(() => {
    const fetchUtilityDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/admin/utility/${utilityId}`);
        const utility = response.data;
        setSelectedProperty(utility.property.name);
        setSelectedRenterFirstName(utility.renter.firstName);
        setSelectedRenterLastName(utility.renter.lastName);
        setType(utility.type);
        setDate(utility.date.split("T")[0]);
        setAmount(utility.amount);
        setDescription(utility.description);
      } catch (error) {
        showToast(
          "Failed to fetch utility details. Please try again.",
          "error"
        );
        setError("Failed to fetch utility details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUtilityDetails();
  }, [utilityId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalType = type === "Custom" ? customType : type;
    if (!finalType || !date || !amount) {
      setError("Type, Date, and Amount are required.");
      return;
    }

    try {
      setLoading(true);
      await axios.put(`/api/admin/updateutility/${utilityId}`, {
        amount: Number(amount),
        date,
        description,
        type: finalType,
        property: selectedProperty,
      });

      showToast("Utility updated successfully!", "success");
      fetchDashboardSummary();
      fetchChartSummary();
      fetchPaymentsSummary(
        "month",
        new Date().getMonth() + 1,
        new Date().getFullYear()
      );
      fetchRentals();
      navigate("/rentals");
    } catch (error) {
      showToast("Error updating utility", "error");
      setError("Error updating utility. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 p-4">
      <div className="p-6 max-w-lg mx-auto bg-white shadow-md">
        <h2 className="text-2xl font-bold mb-4">Edit Utility</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Property:</label>
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="w-full p-2 border rounded"
            disabled
          >
            <option value="">Select Property</option>
            {selectedProperty && (
              <option value={selectedProperty}>{selectedProperty}</option>
            )}
          </select>

          <label className="block mt-4 mb-2">Tenant:</label>
          <select
            value={selectedRenterFirstName}
            className="w-full p-2 border rounded"
            disabled
          >
            <option value="">Select Tenant</option>
            {selectedRenterFirstName && selectedRenterLastName && (
              <option value={selectedRenterFirstName}>
                {selectedRenterFirstName} {selectedRenterLastName}
              </option>
            )}
          </select>

          <label className="block mt-4 mb-2">Type of Utility:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Utility Type</option>
            {predefinedUtilityTypes.map((util) => (
              <option key={util} value={util}>
                {util}
              </option>
            ))}
            <option value="Custom">Other (Enter Custom Type)</option>
          </select>

          {type === "Custom" && (
            <>
              <label className="block mt-4 mb-2">Custom Type:</label>
              <input
                type="text"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter custom type"
              />
            </>
          )}

          <label className="block mt-4 mb-2">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          <label className="block mt-4 mb-2">Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          <label className="block mt-4 mb-2">Description (Optional):</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            className="w-full mt-4 bg-violet-500 text-white p-2 rounded"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Utility"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUtility;
