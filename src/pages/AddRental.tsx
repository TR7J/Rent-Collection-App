import { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toastUtils";
import { useDashboard } from "../context/DashboardContext";

export interface Property {
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

const AddRental = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [renters, setRenters] = useState<Renter[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [utilities, setUtilities] = useState<Utility[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  ); // Track selected property
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
  const {
    fetchChartSummary,
    fetchDashboardSummary,
    fetchRentals,
    fetchPaymentsSummary,
  } = useDashboard();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertyRes, renterRes] = await Promise.all([
          axios.get("/api/admin/properties"),
          axios.get("/api/admin/renters"),
        ]);
        setProperties(propertyRes.data);
        setRenters(renterRes.data);
      } catch (error) {
        showToast("Error fetching data", "error");
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  // Fetch property details when a property is selected
  useEffect(() => {
    if (formData.property) {
      const property = properties.find((p) => p._id === formData.property);
      if (property) {
        setSelectedProperty(property);
        // Set rental frequency and amount based on property
        setFormData((prev) => ({
          ...prev,
          rentalFrequency: property.rentalType,
          amount: property.rentPaid.toString(),
        }));
      }
    }
  }, [formData.property, properties]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updatedData = { ...prev, [name]: value };

      // If rentalStartDate changes and paymentCycle is still empty or matches rentalStartDate, update it
      if (name === "rentalStartDate") {
        if (!prev.paymentCycle || prev.paymentCycle === prev.rentalStartDate) {
          updatedData.paymentCycle = value;
        }
      }

      // Update Duration
      if (
        ["rentalStartDate", "rentalEndDate", "rentalFrequency"].includes(name)
      ) {
        updateDuration(
          updatedData.rentalStartDate,
          updatedData.rentalEndDate,
          updatedData.rentalFrequency
        );
      }

      return updatedData;
    });
  };

  const updateDuration = (start: string, end: string, frequency: string) => {
    if (!start || !end) return;

    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffInDays = Math.max(
      0,
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    let duration = "";
    switch (frequency) {
      case "Daily":
        duration = `${diffInDays} days`;
        break;
      case "Weekly":
        duration = `${Math.ceil(diffInDays / 7)} weeks`;
        break;
      case "Monthly":
        duration = `${Math.ceil(diffInDays / 30)} months`;
        break;
      case "Quarterly":
        duration = `${Math.ceil(diffInDays / 90)} quarters`;
        break;
      case "Yearly":
        duration = `${Math.ceil(diffInDays / 365)} years`;
        break;
    }

    setFormData((prev) => ({ ...prev, duration }));
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

    // Validate rental amount and frequency
    if (selectedProperty) {
      if (parseFloat(formData.amount) !== selectedProperty.rentPaid) {
        showToast(
          "Rental amount must match the property's rent price",
          "error"
        );
        return;
      }

      if (formData.rentalFrequency !== selectedProperty.rentalType) {
        showToast(
          "Rental frequency must match the property's rental type",
          "error"
        );
        return;
      }
    }

    // Convert amount and deposit to numbers
    const finalFormData = {
      ...formData,
      amount: Number(formData.amount), // Convert amount to number
      deposit: Number(formData.deposit), // Convert deposit to number
      utilities,
      utilitiesTotal: utilities.reduce(
        (sum, utility) => sum + utility.amount,
        0
      ),
    };

    // Debugging: Log final form data
    console.log("Final Form Data:", finalFormData);

    try {
      setLoading(true);
      await axios.post("/api/admin/addrental", finalFormData);
      showToast("Rental added successfully!", "success");
      fetchDashboardSummary();
      fetchChartSummary();
      fetchPaymentsSummary(
        "month",
        new Date().getMonth() + 1,
        new Date().getFullYear()
      );
      fetchRentals();
      navigate("/rentals");
    } catch (error: any) {
      console.error("Error adding rental", error);
      const errorMessage =
        error.response?.data?.message || "Failed to Add Rental";
      showToast(errorMessage, "error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="w-full max-w-3xl bg-white shadow-md p-6 md:p-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Add Rental
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
              disabled={!!selectedProperty} // Disable if property is selected
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
              disabled={!!selectedProperty} // Disable if property is selected
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
            {utilities.map((utility, index) => (
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
            ))}

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
              {loading ? "Processing..." : "Add Rental"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRental;
