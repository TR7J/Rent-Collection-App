import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../axiosConfig";
import Loading from "../components/Loading";

interface Property {
  _id: string;
  name: string;
  type: string;
  address: string;
  status: string;
  description: string;
  rentalType: string;
  rentPaid: number;
  image?: string;
}

const PropertyDetails = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`/api/admin/property/${propertyId}`);
        setProperty(response.data);
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  if (loading) return <Loading />;

  if (!property) return <p className="text-center">Property not found.</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white shadow-md p-6 md:p-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Property Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-gray-700">Name</p>
            <p className="p-3 border rounded-lg bg-gray-50">{property.name}</p>
          </div>

          <div>
            <p className="font-semibold text-gray-700">Type</p>
            <p className="p-3 border rounded-lg bg-gray-50">{property.type}</p>
          </div>

          <div className="md:col-span-2">
            <p className="font-semibold text-gray-700">Address</p>
            <p className="p-3 border rounded-lg bg-gray-50">
              {property.address}
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-700">Status</p>
            <p className="p-3 border rounded-lg bg-gray-50">
              {property.status}
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-700">Rental Type</p>
            <p className="p-3 border rounded-lg bg-gray-50">
              {property.rentalType}
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-700">Rent Paid</p>
            <p className="p-3 border rounded-lg bg-gray-50">
              {property.rentPaid}
            </p>
          </div>

          <div className="md:col-span-2 ">
            <p className="font-semibold text-gray-700">Description</p>
            <p className="p-3 border rounded-lg bg-gray-50 ">
              {property.description}
            </p>
          </div>

          {property.image && (
            <div className="md:col-span-2 flex justify-center">
              <img
                src={`https://rent-collection-app-api.onrender.com${property.image}`}
                alt="Property"
                className="max-w-full h-auto shadow-md size-56"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
