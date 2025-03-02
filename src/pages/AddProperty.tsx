import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import { showToast } from "../utils/toastUtils";
import { useDashboard } from "../context/DashboardContext";

const AddProperty: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    type: "House",
    address: "",
    status: "Vacant",
    description: "",
    rentalType: "Monthly",
    rentPaid: "",
    image: "",
  });
  const { fetchDashboardSummary } = useDashboard();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setFormData({
        ...formData,
        image: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Append text fields
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key as keyof typeof formData]);
      });

      // Append file if selected
      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
      }

      await axios.post("/api/admin/addproperty", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showToast("Property added successfully!", "success");
      fetchDashboardSummary();
      navigate("/properties");
    } catch (error) {
      showToast("Error adding property.", "error");
      console.error("Error adding property:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white shadow-md p-6 md:p-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Add Property
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Name */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
              placeholder="Enter property name"
              onChange={handleChange}
              required
            />
          </div>

          {/* Type */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Type</label>
            <select
              name="type"
              value={formData.type}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
              onChange={handleChange}
              required
            >
              <option value="House">House</option>
              <option value="Shop">Shop</option>
              <option value="Flat">Flat</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Address */}
          <div className="flex flex-col md:col-span-2">
            <label className="font-semibold text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
              placeholder="Enter full address"
              onChange={handleChange}
              required
            />
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
              onChange={handleChange}
              required
            >
              <option value="Vacant">Vacant</option>
              <option value="Rented">Rented</option>
              <option value="Under Maintenance">Under Maintenance</option>
            </select>
          </div>

          {/* Rental Type */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Rental Type</label>
            <select
              name="rentalType"
              value={formData.rentalType}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
              onChange={handleChange}
              required
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>

          {/* Rent Paid */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Rent Paid</label>
            <input
              type="number"
              name="rentPaid"
              value={formData.rentPaid}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
              placeholder="Enter rent amount"
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col md:col-span-2">
            <label className="font-semibold text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-violet-500 h-24 resize-none"
              placeholder="Enter a brief description"
              onChange={handleChange}
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col md:col-span-2">
            <label className="font-semibold text-gray-700">
              Property Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              className="p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
              onChange={handleFileChange}
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-violet-500 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-violet-600 transition duration-200 w-full"
            >
              Add Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
