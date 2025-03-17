import { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { showToast } from "../utils/toastUtils";
import PhoneInput from "react-phone-input-2";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../context/DashboardContext";

interface TenantData {
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  email: string;
  property: string;
  paymentStatus: "Paid" | "Unpaid";
  activeStatus: "Active" | "Inactive";
  profilePhoto: File | null;
}

interface Property {
  _id: string;
  name: string;
  rentPaid: number;
  rentalType: "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Yearly";
}

const AddTenant = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [formData, setFormData] = useState<TenantData>({
    firstName: "",
    lastName: "",
    gender: "",
    phone: "",
    email: "",
    property: "",
    paymentStatus: "Unpaid",
    activeStatus: "Active",
    profilePhoto: null,
  });
  const { fetchDashboardSummary } = useDashboard();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propertyRes = await axios.get("/api/admin/properties");
        console.log(propertyRes.data);
        setProperties(propertyRes.data);
        // Automatically select the first property if available
        if (propertyRes.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            property: propertyRes.data[0]._id,
          }));
        }
      } catch (error) {
        showToast("Error fetching data", "error");
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset property and payment status when inactive
      ...(name === "activeStatus" && value === "Inactive"
        ? { property: "", paymentStatus: "Unpaid" }
        : {}),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, profilePhoto: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tenantData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      tenantData.append(key, value as string | Blob);
    });

    try {
      setLoading(true);
      await axios.post("/api/admin/addrenter", tenantData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("Tenant added successfully!", "success");
      setFormData({
        firstName: "",
        lastName: "",
        gender: "",
        phone: "",
        email: "",
        property: "",
        paymentStatus: "Unpaid",
        activeStatus: "Active",
        profilePhoto: null,
      });
      fetchDashboardSummary();
      navigate("/tenants");
    } catch (error: any) {
      console.error("Error adding tenant:", error);
      const errorMessage =
        error.response.data.message || "Failed to add tenant";
      showToast(errorMessage, "error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="w-full max-w-3xl bg-white shadow-md p-6 md:p-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Add Tenant
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
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Phone */}
          <div className="flex flex-col ">
            <PhoneInput
              country={"ke"} // Kenya as default
              value={formData.phone}
              onChange={(phone) => setFormData({ ...formData, phone })}
              inputClass=" p-3 border rounded-lg w-full focus:ring-2 focus:ring-violet-500"
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
              value={formData.property}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-violet-500"
              onChange={handleChange}
              disabled={formData.activeStatus === "Inactive"}
            >
              {properties.map((property) => (
                <option key={property._id} value={property._id}>
                  {property.name}
                </option>
              ))}
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
              disabled={loading}
            >
              {loading ? "Processing..." : "Add Tenant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTenant;
