import React, { useState, useEffect, FormEvent } from "react";
import axios from "../axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import { showToast } from "../utils/toastUtils";

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

const EditExpense: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { expenseId } = useParams();
  const navigate = useNavigate();
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

  const [isOtherType, setIsOtherType] = useState(false);

  const expenseTypes = [
    "Plumbing",
    "Electricals",
    "Paint Works",
    "Caretaker Salary",
    "Cleaning Services",
    "Security",
  ];

  // Fetch properties, renters, and expense data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertyRes, renterRes, expenseRes] = await Promise.all([
          axios.get("/api/admin/properties"),
          axios.get("/api/admin/renters"),
          axios.get(`/api/admin/expenses/${expenseId}`),
        ]);
        setProperties(propertyRes.data);
        setRenters(renterRes.data);

        // Pre-fill form with expense data
        const { property, renter, type, amount, date, description } =
          expenseRes.data;
        setExpenseData({
          property: property._id,
          renter: renter._id,
          type,
          amount,
          date: date.split("T")[0],
          description,
        });
        setIsOtherType(!expenseTypes.includes(type));
      } catch (error) {
        showToast("Error fetching data", "error");
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [expenseId]);

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
    setLoading(true);
    try {
      await axios.put(`/api/admin/expenses/${expenseId}`, expenseData);
      showToast("Expense updated successfully", "success");
      navigate("/expenses");
    } catch (error) {
      showToast("Error updating expense", "error");
      console.error("Error updating expense:", error);
    }
  };

  return (
    <div className="max-w-2xl mt-2 mx-auto p-6 bg-white shadow-md">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Edit Expense
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
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Expense"}
        </button>
      </form>
    </div>
  );
};

export default EditExpense;
