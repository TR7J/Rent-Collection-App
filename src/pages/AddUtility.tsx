import { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import { showToast } from "../utils/toastUtils";
import { useDashboard } from "../context/DashboardContext";

interface Property {
  _id: string;
  name: string;
}

interface Rental {
  _id: string;
  property: {
    _id: string;
    name: string;
  };
  renter: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

interface Tenant {
  _id: string;
  firstName: string;
  lastName: string;
}

const predefinedUtilityTypes = [
  "Garbage",
  "Electricity",
  "Water",
  "Service Charge",
  "Security Fees",
];

const AddUtility = () => {
  const { rentalId } = useParams();

  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [selectedRenterFirstName, setSelectedRenterFirstName] =
    useState<string>("");
  const [selectedRenterLastName, setSelectedRenterLastName] =
    useState<string>("");
  const [type, setType] = useState<string>("");
  const [customType, setCustomType] = useState<string>(""); // New state for custom input
  const [date, setDate] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const navigate = useNavigate();
  const {
    fetchChartSummary,
    fetchDashboardSummary,
    fetchRentals,
    fetchPaymentsSummary,
  } = useDashboard();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (rentalId) {
          const response = await axios.get(`/api/admin/rentals/${rentalId}`);
          const { rental } = response.data;
          setSelectedProperty(rental.property.name);
          setSelectedRenterFirstName(rental.renter.firstName);
          setSelectedRenterLastName(rental.renter.lastName);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, [rentalId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalType = type === "Custom" ? customType : type;
    try {
      await axios.post(`/api/admin/addutility/${rentalId}`, {
        amount: Number(amount),
        date,
        description,
        type: finalType,
        property: selectedProperty,
      });

      showToast("Utility paid successfully!", "success");
      fetchDashboardSummary();
      fetchChartSummary();
      fetchPaymentsSummary(
        "month",
        new Date().getMonth() + 1,
        new Date().getFullYear()
      );
      fetchRentals();
      // ✅ Reset form fields
      setType("");
      setCustomType("");
      setDate("");
      setAmount("");
      setDescription("");
      navigate("/rentals");
    } catch (error) {
      showToast("Error adding utility", "error");
      console.error("Error adding utility", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 p-4">
      <div className="p-6 max-w-lg mx-auto bg-white shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Add Utility</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Property:</label>
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={!!rentalId}
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
            disabled={!!rentalId}
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
          />

          <label className="block mt-4 mb-2">Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <label className="block mt-4 mb-2">Description (Optional):</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <button className="w-full mt-4 bg-violet-500 text-white p-2 rounded">
            Add Utility
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUtility;
