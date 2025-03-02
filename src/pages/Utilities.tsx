import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "../axiosConfig";
import Loading from "../components/Loading";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { useDashboard } from "../context/DashboardContext";

interface Utility {
  _id: string;
  renter: { _id: string; firstName: string; lastName: string };
  property: { _id: string; name: string };
  type: string;
  date: string;
  amount: number;
  description: string;
}

const Utilities = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [utilities, setUtilities] = useState<Utility[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { deleteUtility } = useDashboard();

  useEffect(() => {
    const getUtilities = async () => {
      try {
        const response = await axios.get("/api/admin/utilities");
        setUtilities(response.data);
      } catch (error) {
        setError("Failed to fetch Utilities");
      } finally {
        setLoading(false);
      }
    };

    getUtilities();
  }, []);

  const handleDeleteUtility = async (utilityId: string) => {
    try {
      await deleteUtility(utilityId);
      setUtilities((prevUtilities) =>
        prevUtilities.filter((utility) => utility._id !== utilityId)
      );
    } catch (error) {
      console.error("Error deleting utility", error);
    }
  };
  return (
    <div className="px-12 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold mr-3">
          Utilities History
        </h1>
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
        <h1 className="text-center text-2xl font-bold">Utilities Center</h1>
        <div className="flex justify-center">
          <p className="text-center text-base md:text-base">
            The Utilities Center helps you track and manage utility expenses for
            rentals. You can view, add, edit, or delete utility records and
            search by property. It also allows exporting data for better
            financial management.
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
          to={"/addutility"}
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
          <p className="whitespace-nowrap">Add Utility</p>
        </Link>
      </div>
      {loading ? (
        <Loading />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : utilities.length === 0 ? (
        <p className="text-center">No Utilities Found</p>
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
                  Type
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
                  Amount
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
              {utilities.map((utility) => (
                <tr key={utility._id} className="border-b border-gray-200">
                  <td className="py-3 px-4 whitespace-nowrap">
                    {utility.renter.firstName} {utility.renter.lastName}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {utility.property.name}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {utility.type}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {format(new Date(utility.date), "dd-MM-yyyy")}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    KES {utility.amount}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {utility.description}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <button className="text-violet-500 hover:text-violet-700">
                        <Edit
                          size={18}
                          onClick={() => navigate(`editutility/${utility._id}`)}
                        />
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <Trash2
                          size={18}
                          onClick={() => handleDeleteUtility(utility._id)}
                        />
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

export default Utilities;
