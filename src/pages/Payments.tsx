import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "../axiosConfig";
import Loading from "../components/Loading";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { useDashboard } from "../context/DashboardContext";

interface Payment {
  _id: string;
  renter: { _id: string; firstName: string; lastName: string };
  property: { _id: string; name: string };
  amount: number;
  date: string;
  isLateFee: boolean;
  description: string;
}

const Payments = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { deletePayment } = useDashboard();

  useEffect(() => {
    const getPayments = async () => {
      try {
        const response = await axios.get("/api/admin/payments");
        setPayments(response.data);
      } catch (error) {
        setError("Failed to fetch Payments");
      } finally {
        setLoading(false);
      }
    };

    getPayments();
  }, []);
  const handleDeletePayment = async (paymentId: string) => {
    try {
      await deletePayment(paymentId.toString()); // Call the deletePayment function from context
      // Update the local state to remove the deleted payment
      setPayments((prevPayments) =>
        prevPayments.filter((payment) => payment._id !== paymentId)
      );
    } catch (error) {
      console.error("Error deleting payment", error);
    }
  };
  return (
    <div className="px-12 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold mr-3">Payment History</h1>
        <div className="flex items-center justify-center gap-1 text-sm font-semibold border rounded-md bg-gray-300 hover:bg-violet-500 hover:text-white duration-75 ease-in-out cursor-pointer p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>

          <p className="whitespace-nowrap">Download All</p>
        </div>
      </div>

      <div>
        <h1 className="text-center text-2xl font-bold">Payments Center</h1>
        <div className="flex justify-center">
          <p className="text-center text-base md:text-base">
            Track and manage rental payments efficiently. View payment history,
            add new payments, edit or delete entries, and search by property.
            Export records for easy financial tracking.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center my-6 gap-3">
        <div className="flex items-center justify-center">
          <input
            type="search"
            name="search"
            id="search"
            placeholder="Search for your Payments"
            className="p-2 rounded-l-md min-w-52 md:min-w-96"
          />
          <button className="p-2 bg-violet-500 rounded-r-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6 text-white"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        </div>

        <Link
          to={"/addpayment"}
          className="flex items-center justify-center gap-1 text-sm font-semibold border rounded-md bg-gray-300 hover:bg-violet-500 hover:text-white duration-75 ease-in-out cursor-pointer p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <p className="whitespace-nowrap">Add Payment</p>
        </Link>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : payments.length === 0 ? (
        <p className="text-center">No Payments Found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full whitespace-nowrap bg-white">
            <thead className="bg-gray-100 text-gray-600 text-xs font-semibold">
              <tr>
                <th
                  className="py-3 px-4 text-left whitespace-nowrap"
                  style={{ width: "150px" }}
                >
                  Renter
                </th>
                <th
                  className="py-3 px-4 text-left whitespace-nowrap"
                  style={{ width: "150px" }}
                >
                  Property
                </th>
                <th
                  className="py-3 px-4 text-left whitespace-nowrap"
                  style={{ width: "100px" }}
                >
                  Amount
                </th>
                <th
                  className="py-3 px-4 text-left whitespace-nowrap"
                  style={{ width: "100px" }}
                >
                  Date
                </th>
                <th
                  className="py-3 px-4 text-left whitespace-nowrap"
                  style={{ width: "100px" }}
                >
                  Late Fee
                </th>
                <th
                  className="py-3 px-4 text-left whitespace-nowrap"
                  style={{ width: "200px" }}
                >
                  Description
                </th>
                <th
                  className="py-3 px-4 text-left whitespace-nowrap"
                  style={{ width: "100px" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {payments.map((payment) => (
                <tr key={payment._id} className="border-b border-gray-200">
                  <td className="py-3 px-4 whitespace-nowrap">
                    {payment.renter.firstName} {payment.renter.lastName}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {payment.property.name}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    KES {payment.amount}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {format(new Date(payment.date), "dd-MM-yyyy")}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.isLateFee
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {payment.isLateFee ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {payment.description}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <button className="text-violet-500 hover:text-violet-700">
                        <Edit
                          size={18}
                          onClick={() =>
                            navigate(`/editpayment/${payment._id}`)
                          }
                        />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeletePayment(payment._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Payments;
