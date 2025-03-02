import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import { showToast } from "../utils/toastUtils";

interface Renter {
  firstName: string;
  lastName: string;
  gender: "Male" | "Female";
  phone: string;
  email: string;
  property?: string;
  paymentStatus?: "Paid" | "Pending" | "Overdue" | "Partially Paid";
  activeStatus: "Active" | "Inactive" | "Past";
  profilePhoto?: string;
}

const EditTenant: React.FC = () => {
  const { renterId } = useParams(); // Get renter ID     from URL params
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Renter>({
    firstName: "",
    lastName: "",
    gender: "Male",
    phone: "",
    email: "",
    property: "",
    paymentStatus: "Pending",
    activeStatus: "Active",
    profilePhoto: "",
  });

  // Fetch renter details when component loads
  useEffect(() => {
    const fetchRenter = async () => {
      try {
        const response = await axios.get(`/api/admin/renter/${renterId}`);
        setFormData(response.data); // Set the fetched data in the form
      } catch (error) {
        showToast("Error fetching renter details", "error");
        console.error("Error fetching renter details:", error);
      }
    };

    if (renterId) {
      fetchRenter();
    }
  }, [renterId]);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        profilePhoto: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  // Handle profile photo removal
  const handleRemovePhoto = () => {
    setFormData({
      ...formData,
      profilePhoto: "", // Clear the profile photo
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.put(`/api/admin/updaterenter/${renterId}`, formData);
      showToast("Tenant Updated Successfully!", "success");
      navigate("/tenants"); // Redirect to tenants list after successful update
    } catch (error) {
      showToast("Error updating Tenant", "error");
      console.error("Error updating renter:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white shadow-md p-6 md:p-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Edit Renter
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* First Name */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
              placeholder="Enter first name"
              onChange={handleChange}
              required
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
              placeholder="Enter last name"
              onChange={handleChange}
              required
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
              onChange={handleChange}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
              placeholder="Enter phone number"
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
              placeholder="Enter email"
              onChange={handleChange}
              required
            />
          </div>

          {/* Property */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Property</label>
            <select
              name="property"
              value={formData.property || ""}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
              onChange={handleChange}
              disabled={formData.activeStatus === "Inactive"}
            >
              <option value="">Select Property</option>
              <option value="House 1">House 1</option>
              <option value="House 2">House 2</option>
            </select>
          </div>

          {/* Payment Status */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">
              Payment Status
            </label>
            <select
              name="paymentStatus"
              value={formData.paymentStatus}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
              onChange={handleChange}
              disabled={formData.activeStatus === "Inactive"}
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
              <option value="Partially Paid">Partially Paid</option>
            </select>
          </div>

          {/* Active Status */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Active Status</label>
            <select
              name="activeStatus"
              value={formData.activeStatus}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Past">Past</option>
            </select>
          </div>

          {/* Profile Photo */}
          <div className="flex flex-col md:col-span-2">
            <label className="font-semibold text-gray-700">Profile Photo</label>
            {formData.profilePhoto ? (
              <div className="flex flex-col items-center">
                <img
                  src={`http://localhost:8000${formData.profilePhoto}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover mb-2"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition duration-200 w-full"
                >
                  Remove Photo
                </button>
              </div>
            ) : (
              <input
                type="file"
                accept="image/*"
                className="p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
                onChange={handleFileChange}
              />
            )}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-violet-500 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-violet-600 transition duration-200 w-full"
            >
              Update Renter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTenant;
