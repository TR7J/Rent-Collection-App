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
    <div className="px-12 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold mr-3">
          Properties ({filteredProperties.length})
        </h1>
        <div className="p-2 flex gap-1 border border-gray-300 rounded-sm">
          {["Rented", "Vacant", "U.M"].map((tab) => (
            <span
              key={tab}
              className={`${
                activePart === tab
                  ? "bg-violet-500  text-white"
                  : "bg-transparent"
              } p-1  rounded-sm cursor-pointer text-gray-500`}
              onClick={() => setActivePart(tab as Active)}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h1 className="text-center text-2xl font-bold">Property Center</h1>
        <div className="flex justify-center">
          <p className="text-center text-base md:text-xl">
            Manage all rental units in one place. Add, view, and update property
            details, including locations, types, sizes, and rent prices. Track
            occupancy, and link tenants for streamlined management.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center my-6 gap-3">
        <div className="flex items-center justify-center">
          <input
            type="search"
            name="search"
            id="search"
            placeholder="Search for your Property"
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
        <Link to={"/addproperty"}>
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
            <div className="relative bg-white border border-gray-300 rounded-sm flex justify-center items-center p-1">
              <div className="absolute top-0 right-0 p-2">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <ExpandCircleDownIcon className="text-violet-500" />
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
                <div className="w-1/3">
                  <img
                    src={`http://localhost:8000${property.image}`}
                    alt="Image"
                    className="size-44"
                  />
                </div>
              ) : (
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="0.5"
                    stroke="currentColor"
                    className="size-44 w-50 text-gray-500"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819"
                    />
                  </svg>
                </div>
              )}

              <div className="flex flex-col px-2 w-2/3">
                <div className="flex items-center gap-6 mt-1">
                  <span className="font-bold">{property.name}</span>
                  <span className="text-gray-500 font-semibold text-sm">
                    {property.rentPaid} KSH
                  </span>
                </div>
                <p className="text-xs mt-2">
                  <span className={`${status[property.status]}`}>
                    {property.status}
                  </span>
                  : <span className="text-gray-500">{property.rentalType}</span>
                </p>
                <p className="text-xs italic mt-2 text-gray-500 font-extrabold min-h-9 flex items-center">
                  {property.address}
                </p>

                <button
                  className="bg-violet-500 text-white font-bold rounded-md mt-2 text-base py-1 hover:bg-violet-600 hover:scale-[1.01] active:scale-[0.98] active:duration-75 ease-in-out"
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
