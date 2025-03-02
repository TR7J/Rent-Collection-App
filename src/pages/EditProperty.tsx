import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import { showToast } from "../utils/toastUtils";
import Loading from "../components/Loading";

interface Property {
  name: string;
  type: string;
  address: string;
  status: string;
  rentalType: string;
  rentPaid: number;
  description: string;
  image?: string;
}

const EditProperty = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Property>({
    name: "",
    type: "",
    address: "",
    status: "",
    rentalType: "",
    rentPaid: 0,
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get<Property>(
          `/api/admin/property/${propertyId}`
        );
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        showToast("Error fetching property details", "error");
        console.error("Error fetching property details", error);
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (!formData) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        image: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      image: "", // Clear the profile photo
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.put(`/api/admin/updateproperty/${propertyId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("Property updated successfully!", "success");
      navigate("/properties");
    } catch (error) {
      showToast("Error updating property", "error");
      console.error("Error updating property", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-semibold text-red-500">
          Failed to load property details.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white shadow-md p-6 md:p-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Edit Property
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          key={propertyId} // Force re-render when new data loads
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
            {formData.image ? (
              <div className="flex flex-col items-center">
                <img
                  src={
                    typeof formData.image === "string"
                      ? `http://localhost:8000${formData.image}`
                      : URL.createObjectURL(formData.image)
                  }
                  alt="Property"
                  className="w-32 h-32 object-cover rounded-lg mb-2"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition duration-200 w-full"
                >
                  Remove Image
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;
