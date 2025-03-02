import React, { useState, useEffect, FormEvent } from "react";
import axios from "../axiosConfig";
import { showToast } from "../utils/toastUtils";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../context/DashboardContext";

// Types for expense data, property, and renter
interface Property {
  _id: string;
  name: string;
}

interface Renter {
  _id: string;
  firstName: string;
  lastName: string;
}

interface ExpenseData {
  property: string;
  renter: string;
  type: string;
  amount: number;
  date: string;
  description: string;
}

const AddExpense: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [renters, setRenters] = useState<Renter[]>([]);
  const [expenseData, setExpenseData] = useState<ExpenseData>({
    property: "",
    renter: "",
    type: "",
    amount: 0,
    date: "",
    description: "",
  });
  const { fetchChartSummary } = useDashboard();

  const [isOtherType, setIsOtherType] = useState(false);

  const expenseTypes = [
    "Plumbing",
    "Electricals",
    "Paint Works",
    "Caretaker Salary",
    "Cleaning Services",
    "Security",
  ];
  const navigate = useNavigate();

  // Fetch properties and renters
  useEffect(() => {
    axios
      .get("/api/admin/properties")
      .then((response) => setProperties(response.data))
      .catch((error) => console.error("Error fetching properties:", error));

    axios
      .get("/api/admin/renters")
      .then((response) => setRenters(response.data))
      .catch((error) => console.error("Error fetching renters:", error));
  }, []);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ): void => {
    const { name, value } = e.target;
    setExpenseData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle type change to toggle "Other" option
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = e.target;
    setExpenseData((prev) => ({ ...prev, type: value }));
    setIsOtherType(value === "Other");
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await axios.post("/api/admin/addexpense", expenseData);
      showToast("Expense Added Successfully", "success");
      fetchChartSummary();
      setExpenseData({
        property: "",
        renter: "",
        type: "",
        amount: 0,
        date: "",
        description: "",
      });
      navigate("/expenses");
    } catch (error) {
      showToast("Error adding expense", "error");
      console.error("Error adding expense: ", error);
    }
  };

  return (
    <div className="max-w-2xl mt-2 mx-auto p-6 bg-white shadow-md">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Add Expense
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Property
          </label>
          <select
            name="property"
            value={expenseData.property}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
          >
            <option value="">Select Property</option>
            {properties.map((property) => (
              <option key={property._id} value={property._id}>
                {property.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Renter
          </label>
          <select
            name="renter"
            value={expenseData.renter}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-violet-500 w-full"
          >
            <option value="">Select Renter</option>
            {renters.map((renter) => (
              <option key={renter._id} value={renter._id}>
                {renter.firstName} {renter.lastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type of Expense
          </label>
          <select
            name="type"
            value={expenseData.type}
            onChange={handleTypeChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
          >
            <option value="">Select Expense Type</option>
            {expenseTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
        </div>

        {isOtherType && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Custom Expense Type
            </label>
            <input
              type="text"
              name="type"
              value={expenseData.type}
              onChange={handleChange}
              placeholder="Enter custom type"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            value={expenseData.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={expenseData.date}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={expenseData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <button
          type="submit"
          className="bg-violet-500 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-violet-600 transition duration-200 w-full"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
