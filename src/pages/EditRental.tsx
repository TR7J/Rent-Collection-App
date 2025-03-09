import { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import { showToast } from "../utils/toastUtils";

interface Property {
  _id: string;
  name: string;
  rentPaid: number;
  rentalType: "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Yearly";
}

interface Renter {
  _id: string;
  firstName: string;
  lastName: string;
}

interface Utility {
  type: string;
  amount: number;
  [key: string]: string | number;
}

const EditRental = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { rentalId } = useParams();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [renters, setRenters] = useState<Renter[]>([]);
  const [utilities, setUtilities] = useState<Utility[]>([]);

  const [formData, setFormData] = useState({
    property: "",
    renter: "",
    rentalStartDate: "",
    rentalEndDate: "",
    paymentCycle: "",
    rentalFrequency: "Monthly",
    duration: "",
    amount: "",
    deposit: "",
    description: "",
    status: "Rented",
    utilitiesTotal: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertyRes, renterRes, rentalRes] = await Promise.all([
          axios.get("/api/admin/properties"),
          axios.get("/api/admin/renters"),
          axios.get(`/api/admin/rentals/${rentalId}`),
        ]);
        setProperties(propertyRes.data);
        setRenters(renterRes.data);

        // Pre-fill form with rental data
        console.log(rentalRes.data);
        const { rental } = rentalRes.data;
        setFormData({
          property: rental.property._id,
          renter: rental.renter._id,
          rentalStartDate: rental.rentalStartDate.split("T")[0],
          rentalEndDate: rental.rentalEndDate.split("T")[0],
          paymentCycle: rental.paymentCycle.split("T")[0],
          rentalFrequency: rental.rentalFrequency,
          duration: rental.duration,
          amount: rental.amount.toString(),
          deposit: rental.deposit.toString(),
          description: rental.description,
          status: rental.status,
          utilitiesTotal: rental.utilitiesTotal,
        });
        setUtilities(rental.utilities);
      } catch (error) {
        showToast("Error fetching data", "error");
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [rentalId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUtility = () => {
    setUtilities([...utilities, { type: "", amount: 0 }]);
  };

  const handleUtilityChange = (
    index: number,
    field: keyof Utility,
    value: string | number
  ) => {
    setUtilities((prevUtilities) => {
      const updatedUtilities = [...prevUtilities];
      updatedUtilities[index] = {
        ...updatedUtilities[index],
        [field]: field === "amount" ? Number(value) : value,
      };

      // Update total utilities amount
      const total = updatedUtilities.reduce(
        (sum, utility) => sum + (utility.amount || 0),
        0
      );
      setFormData((prev) => ({ ...prev, utilitiesTotal: total }));

      return updatedUtilities;
    });
  };

  const handleRemoveUtility = (index: number) => {
    const updatedUtilities = utilities.filter((_, i) => i !== index);
    setUtilities(updatedUtilities);

    // Update total utilities amount
    const total = updatedUtilities.reduce(
      (sum, utility) => sum + utility.amount,
      0
    );
    setFormData((prev) => ({ ...prev, utilitiesTotal: total }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(`/api/admin/updaterentals/${rentalId}`, {
        ...formData,
        utilities,
      });
      console.log(response);
      showToast("Rental updated successfully!", "success");
      navigate("/rentals");
    } catch (error) {
      showToast("Error updating rental", "error");
      console.error("Error updating rental", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="w-full max-w-3xl bg-white shadow-md p-6 md:p-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Edit Rental
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Property */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Property</label>
            <select
              name="property"
              value={formData.property}
              onChange={handleChange}
              required
              className="p-3 border rounded-lg"
            >
              <option value="">Select Property</option>
              {properties.map((property) => (
                <option key={property._id} value={property._id}>
                  {property.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tenant */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Tenant</label>
            <select
              name="renter"
              value={formData.renter}
              onChange={handleChange}
              required
              className="p-3 border rounded-lg"
            >
              <option value="">Select Tenant</option>
              {renters.map((renter) => (
                <option key={renter._id} value={renter._id}>
                  {renter.firstName} {renter.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Rental Start Date */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">
              Rental Start Date
            </label>
            <input
              type="date"
              name="rentalStartDate"
              value={formData.rentalStartDate}
              onChange={handleChange}
              required
              className="p-3 border rounded-lg"
            />
          </div>

          {/* Rental End Date */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">
              Rental End Date
            </label>
            <input
              type="date"
              name="rentalEndDate"
              value={formData.rentalEndDate}
              onChange={handleChange}
              required
              className="p-3 border rounded-lg"
            />
          </div>

          {/* Payment Cycle */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Payment Cycle</label>
            <input
              type="date"
              name="paymentCycle"
              value={formData.paymentCycle}
              onChange={handleChange}
              className="p-3 border rounded-lg"
              disabled={!formData.rentalStartDate}
            />
          </div>

          {/* Rental Frequency */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">
              Rental Frequency
            </label>
            <select
              name="rentalFrequency"
              value={formData.rentalFrequency}
              onChange={handleChange}
              required
              className="p-3 border rounded-lg"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>

          {/* Amount */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="p-3 border rounded-lg"
            />
          </div>

          {/* Deposit */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Deposit</label>
            <input
              type="number"
              name="deposit"
              value={formData.deposit}
              onChange={handleChange}
              required
              className="p-3 border rounded-lg"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col md:col-span-2">
            <label className="font-semibold text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="p-3 border rounded-lg h-24 resize-none"
            ></textarea>
          </div>

          {/* Utilities Section */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Utilities
            </h2>
            {utilities.length === 0 ? (
              <p className="text-gray-500">No utilities found.</p>
            ) : (
              utilities.map((utility, index) => (
                <div key={index} className="flex gap-3 items-center mb-2">
                  <select
                    value={utility.type}
                    onChange={(e) =>
                      handleUtilityChange(index, "type", e.target.value)
                    }
                    required
                    className="p-3 border rounded-lg flex-1"
                  >
                    <option value="">Select Utility Type</option>
                    <option value="Garbage">Garbage</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Water">Water</option>
                    <option value="Service Charge">Service Charge</option>
                    <option value="Security Fees">Security Fees</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="number"
                    value={utility.amount}
                    onChange={(e) =>
                      handleUtilityChange(index, "amount", e.target.value)
                    }
                    required
                    className="p-3 border rounded-lg w-24"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveUtility(index)}
                    className="text-red-500"
                  >
                    ✖
                  </button>
                </div>
              ))
            )}

            <button
              type="button"
              onClick={handleAddUtility}
              className="text-blue-500"
            >
              + Add Utility
            </button>

            <div className="mt-3 font-semibold">
              Total Utilities: {formData.utilitiesTotal} Ksh
            </div>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-violet-500 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-violet-600 w-full"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Rental"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRental;
