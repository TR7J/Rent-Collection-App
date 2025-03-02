import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import { showToast } from "../utils/toastUtils";
import Loading from "../components/Loading";
import { format } from "date-fns";

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
  rentalStartDate: string;
  rentalEndDate: string;
  paymentCycle: string;
  rentalFrequency: "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Yearly";
  duration: string;
  amount: number;
  deposit: number;
  description: string;
  status: "Rented" | "Past";
  dues: number;
  paidAmount: number;
  deadline: Date;
  utilitiesTotal: number;
  utilityDues: number;
  utilityPaidAmount: number;
  utilities: { type: string; amount: number }[];
}

interface Utility {
  type: string;
  amount: number;
  [key: string]: string | number;
}

const RentalDetails = () => {
  const { rentalId } = useParams();
  const navigate = useNavigate();
  const [rental, setRental] = useState<Rental | null>(null);
  const [utilities, setUtilities] = useState<Utility[]>([]);

  useEffect(() => {
    const fetchRentalDetails = async () => {
      try {
        const response = await axios.get(`/api/admin/rentals/${rentalId}`);
        const { rental } = response.data; // Extracting rental and utilities
        setRental({ ...rental }); // Merging utilities into rental
        setUtilities(rental.utilities);
      } catch (error) {
        showToast("Error fetching rental details", "error");
        console.error("Error fetching rental details", error);
      }
    };

    fetchRentalDetails();
  }, [rentalId]);

  if (!rental) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="w-full max-w-3xl bg-white shadow-md p-6 md:p-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Rental Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">Property</span>
            <p className="p-3 border rounded-lg">{rental.property.name}</p>
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">Tenant</span>
            <p className="p-3 border rounded-lg">
              {rental.renter.firstName} {rental.renter.lastName}
            </p>
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">
              Rental Start Date
            </span>
            <p className="p-3 border rounded-lg">
              {format(new Date(rental.rentalStartDate), "dd-MM-yyyy")}
            </p>
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">Rental End Date</span>
            <p className="p-3 border rounded-lg">
              {format(new Date(rental.rentalEndDate), "dd-MM-yyyy")}
            </p>
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">Payment Cycle</span>
            <p className="p-3 border rounded-lg">
              {format(new Date(rental.paymentCycle), "dd-MM-yyyy")}
            </p>
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">
              Rental Frequency
            </span>
            <p className="p-3 border rounded-lg">{rental.rentalFrequency}</p>
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">Duration</span>
            <p className="p-3 border rounded-lg">{rental.duration}</p>
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">Amount</span>
            <p className="p-3 border rounded-lg">KES {rental.amount}</p>
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">Deposit</span>
            <p className="p-3 border rounded-lg">KES {rental.deposit}</p>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">Status</span>
            <p className="p-3 border rounded-lg">{rental.status}</p>
          </div>

          <div className="flex flex-col md:col-span-2">
            <span className="font-semibold text-gray-700">Description</span>
            <p className="p-3 border rounded-lg h-24 resize-none">
              {rental.description || "N/A"}
            </p>
          </div>

          <div className="flex flex-col md:col-span-2">
            <span className="font-semibold text-gray-700">Utilities</span>
            {utilities.length > 0 ? (
              utilities.map((utility, index) => (
                <div
                  key={index}
                  className="flex justify-between py-2 border-b last:border-b-0"
                >
                  <span className="text-sm text-gray-800">{utility.type}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    KES {utility.amount}
                  </span>
                </div>
              ))
            ) : (
              <p className="p-3 border rounded-lg">No utilities</p>
            )}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Rent Dues</span>
            <p className="p-3 border rounded-lg">
              KES {rental.dues - rental.utilityDues}
            </p>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Utility Dues</span>
            <p className="p-3 border rounded-lg">KES {rental.utilityDues}</p>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/rentals")}
            className="bg-violet-500 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-violet-600 w-full"
          >
            Back to Rentals
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentalDetails;
