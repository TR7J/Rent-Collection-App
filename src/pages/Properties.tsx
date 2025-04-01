import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import Loading from "../components/Loading";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import { showToast } from "../utils/toastUtils";

type Status = "Rented" | "Vacant" | "Under Maintenance";

interface Property {
  _id: string;
  name: string;
  type: string;
  address: string;
  status: Status;
  rentalType: "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Yearly";
  rentPaid: number;
  description: string;
  image?: string;
}

const status: Record<Status, string> = {
  Rented: "text-red-500 font-semibold",
  Vacant: "text-green-500 font-semibold",
  "Under Maintenance": "text-yellow-500  font-semibold",
};

const Properties = () => {
  type Active = "Rented" | "Vacant" | "U.M";
  const [activePart, setActivePart] = useState<Active>("Rented");
  const [loading, setLoading] = useState<boolean>(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get<Property[]>("/api/admin/properties");
        setProperties(response.data);
      } catch (err) {
        setError("Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((property) => {
    if (activePart === "Rented") return property.status === "Rented";
    if (activePart === "Vacant") return property.status === "Vacant";
    if (activePart === "U.M") return property.status === "Under Maintenance";
    return false;
  });

  const deleteProperty = async (propertyId: any) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?"
    );
    if (!confirmDelete) return;
    try {
      const response = await axios.delete(
        `/api/admin/properties/${propertyId}`
      );
      if (response.status === 200) {
        showToast("Property deleted successfully", "success");
        // Update state to remove the deleted property
        setProperties(
          properties.filter((property) => property._id !== propertyId)
        );
      } else {
        showToast("Failed to delete property", "error");
      }
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Error deleting property",
        "error"
      );
      console.error("Error deleting property:", error);
    }
  };
  return (
    <div className="px-6 py-4 min-h-screen w-screen sm:w-full">
      <div className="flex justify-between items-center flex-wrap gap-2 sm:gap-0 p-1 sm:p-0">
        <h1 className="text-xl sm:text-xl md:text-2xl font-bold">
          Properties ({filteredProperties.length})
        </h1>
        <div className="p-1 sm:p-2 flex gap-1 border border-gray-300 rounded-sm">
          {["Rented", "Vacant", "U.M"].map((tab) => (
            <span
              key={tab}
              className={`${
                activePart === tab
                  ? "bg-violet-500 text-white"
                  : "bg-transparent"
              } p-1 rounded-sm cursor-pointer text-gray-500 text-xs sm:text-sm flex items-center justify-center min-w-[40px] sm:min-w-[50px] text-center`}
              onClick={() => setActivePart(tab as Active)}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-2">
        <h1 className="text-center text-2xl font-bold">Property Center</h1>
        <div className="flex md:justify-center mt-1">
          <p className="text-left md:text-center text-base md:text-xl">
            Manage all rental units in one place. Add, view, and update property
            details, including locations, types, sizes, and rent prices. Track
            occupancy, and link tenants for streamlined management.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center my-6 gap-2 sm:gap-3 overflow-x-auto px-1 w-full">
        <div className="flex items-center justify-center flex-shrink h-9">
          <input
            type="search"
            name="search"
            id="search"
            placeholder="Search Property"
            className="p-2 rounded-l-md w-[150px] xs:w-[180px] sm:min-w-52 md:min-w-96 text-sm sm:text-base h-full"
          />
          <button className="p-2 bg-violet-500 rounded-r-md flex-shrink-0 h-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5 sm:size-6 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        </div>
        <Link to={"/addproperty"} className="flex-shrink-0 h-10">
          <div className="flex items-center justify-center gap-1 text-xs sm:text-sm font-semibold border rounded-md bg-gray-300 hover:bg-violet-500 hover:text-white duration-75 ease-in-out cursor-pointer px-2 h-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5 sm:size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <p className="whitespace-nowrap">Add Property</p>
          </div>
        </Link>
      </div>

      {/* Loading & Error States */}
      {loading ? (
        <Loading />
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : filteredProperties.length === 0 ? (
        <p className="text-center">No Properties Found.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-3">
          {filteredProperties.map((property) => (
            <div className="relative bg-white border border-gray-300 rounded-sm flex justify-center items-center p-1 h-full">
              <div className="absolute top-0 right-0 p-1 sm:p-2 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <ExpandCircleDownIcon className="text-violet-500 h-5 w-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => navigate(`/editproperty/${property._id}`)}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteProperty(property._id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {property.image ? (
                <div className="w-1/3 flex-shrink-0 flex justify-center items-center">
                  <img
                    src={`https://rent-collection-app-api.onrender.com${property.image}`}
                    alt="Image"
                    className="max-w-full h-auto max-h-32 sm:max-h-44 object-contain"
                  />
                </div>
              ) : (
                <div className="w-1/3 flex-shrink-0 flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="0.5"
                    stroke="currentColor"
                    className="w-full max-w-[100px] h-auto max-h-32 sm:max-h-44 text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819"
                    />
                  </svg>
                </div>
              )}

              <div className="flex flex-col px-1 mb-1 sm:px-2 w-2/3 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-3 sm:gap-6 mt-1 flex-wrap">
                  <span className="font-bold text-sm sm:text-base truncate max-w-full">
                    {property.name}
                  </span>
                  <span className="text-gray-500 font-semibold text-xs sm:text-sm">
                    {property.rentPaid} KSH
                  </span>
                </div>
                <p className="text-xs">
                  <span className={`${status[property.status]}`}>
                    {property.status}
                  </span>
                  : <span className="text-gray-500">{property.rentalType}</span>
                </p>
                <p className="text-xs italic text-gray-500 font-extrabold min-h-6 sm:min-h-9 flex items-center line-clamp-2">
                  {property.address}
                </p>

                <button
                  className="bg-violet-500 text-white font-bold rounded-md text-xs sm:text-base py-1 hover:bg-violet-600 hover:scale-[1.01] active:scale-[0.98] active:duration-75 ease-in-out w-full mt-1"
                  onClick={() => navigate(`/property/${property._id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Properties;
