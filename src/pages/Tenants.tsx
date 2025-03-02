import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import Loading from "../components/Loading";
import { Store } from "../context/UserContext";
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

type PaymentStatus = "Paid" | "Pending" | "Overdue" | "Partially Paid";

interface Renter {
  _id: string;
  firstName: string;
  lastName: string;
  location: string;
  property: string;
  email: string;
  phone: string;
  paymentStatus: PaymentStatus;
  activeStatus: string;
  profilePhoto?: string;
}

const paymentStatusStyles: Record<PaymentStatus, string> = {
  Paid: "text-green-500 border border-green-500",
  Pending: "text-yellow-500 border border-yellow-500",
  Overdue: "text-red-500 border border-red-500",
  "Partially Paid": "text-orange-500 border border-orange-500",
};

const Tenants = () => {
  type ActivePart = "Active" | "Past";
  const [activePart, setActivePart] = useState<ActivePart>("Active");
  const [loading, setLoading] = useState<boolean>(true);
  const [renters, setRenters] = useState<Renter[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchRenters = async () => {
      try {
        const response = await axios.get<Renter[]>("/api/admin/renters");
        setRenters(response.data);
      } catch (err) {
        setError("Failed to fetch renters.");
      } finally {
        setLoading(false);
      }
    };

    fetchRenters();
  }, []);

  const deleteRenter = async (renterId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this renter?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`/api/admin/renters/${renterId}`);

      if (response.status === 200) {
        showToast("Renter deleted successfully", "success");
        setRenters((prevRenters) =>
          prevRenters.filter((renter) => renter._id !== renterId)
        );
      }
    } catch (error: any) {
      console.error("Error deleting renter:", error);

      const errorMessage =
        error.response?.data?.message || "Failed to delete renter";
      showToast(errorMessage, "error");
    }
  };
  const filteredRenters = renters.filter((renter) => {
    if (activePart === "Active") return renter.activeStatus === "Active";
    if (activePart === "Past") return renter.activeStatus === "Past";
    if (activePart === "Inactive") return renter.activeStatus === "Inactive";
    return false;
  });

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleMessage = (
    phoneNumber: string,
    firstName: string,
    propertyName: string,
    paymentStatus: string
  ) => {
    const message = encodeURIComponent(
      `Subject: Urgent: Outstanding Rent Payment for Your Property\n\n` +
        `Dear ${firstName},\n\n` +
        `I hope this message finds you well. We would like to remind you that your rent payment for ${propertyName} is currently ${paymentStatus}.\n\n` +
        `To avoid penalties or further action, please make the payment as soon as possible. If you have already made the payment, kindly disregard this message.\n\n` +
        `Best regards,\n` +
        `${userInfo?.name} \n` +
        `RentaHub`
    );

    // Open SMS
    window.location.href = `sms:${phoneNumber}?body=${message}`;
  };

  const handleWhatsApp = (
    phoneNumber: string,
    firstName: string,
    propertyName: string,
    paymentStatus: string
  ) => {
    const message = encodeURIComponent(
      `Subject: Urgent: Outstanding Rent Payment for ${propertyName}\n\n` +
        `Dear ${firstName},\n\n` +
        `I hope this message finds you well. We would like to remind you that your rent payment for ${propertyName} is currently ${paymentStatus}.\n\n` +
        `To avoid penalties or further action, please make the payment as soon as possible. If you have already made the payment, kindly disregard this message.\n\n` +
        `If you have any questions or require assistance, feel free to reach out.\n\n` +
        `Best regards,\n` +
        `${userInfo?.name} \n` +
        `RentaHub`
    );

    // Open WhatsApp
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  const handleEmail = (
    email: string,
    firstName: string,
    propertyName: string,
    paymentStatus: string
  ) => {
    const subject = encodeURIComponent(
      `Urgent: Outstanding Rent Payment for ${propertyName}`
    );

    const body = encodeURIComponent(
      `Dear ${firstName},\n\n` +
        `I hope this message finds you well. We would like to remind you that your rent payment for ${propertyName} is currently ${paymentStatus}.\n\n` +
        `To avoid penalties or further action, please make the payment as soon as possible. If you have already made the payment, kindly disregard this message.\n\n` +
        `If you have any questions or require assistance, feel free to reach out.\n\n` +
        `Best regards,\n` +
        `${userInfo?.name}\n` +
        `RentaHub`
    );

    // Open the default email app with the pre-filled message
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="px-12 py-4 mx-2 ">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold mr-3">
          {activePart} Tenants ({filteredRenters.length})
        </h1>
        <div className="p-2 flex gap-1 border border-gray-300 rounded-sm">
          {["Active", "Inactive", "Past"].map((tab) => (
            <span
              key={tab}
              className={`p-1 rounded-sm cursor-pointer text-gray-500 ${
                activePart === tab ? "bg-violet-500 text-white" : ""
              }`}
              onClick={() => setActivePart(tab as ActivePart)}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h1 className="text-center text-2xl font-bold">Tenants Center</h1>
        <div className="flex justify-center">
          <p className="text-center text-base md:text-xl">
            Add, View and Manage Tenants and Tenant Information. Keep track of
            rental agreements, contact details and tenant status all in one
            organized and easy-to-use interface.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center my-6 gap-3">
        <div className="flex items-center justify-center">
          <input
            type="search"
            name="search"
            id="search"
            placeholder="Search for a Tenant"
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
          to={"/addtenant"}
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
          <p className="whitespace-nowrap">Add Tenant</p>
        </Link>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredRenters.length === 0 ? (
        <p className="text-center text-gray-500">No renters found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRenters.map((renter) => (
            <div
              key={renter._id}
              className="bg-white mt-5 rounded-sm border border-gray-30 pb-4"
            >
              <div className="relative">
                <div className="absolute top-2 right-2 p-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <ExpandCircleDownIcon className="text-violet-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => navigate(`/edittenant/${renter._id}`)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteRenter(renter._id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center">
                {renter.profilePhoto ? (
                  <div className="py-4">
                    <img
                      src={`http://localhost:8000${renter.profilePhoto}`}
                      alt="Profile"
                      className="size-36 rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="0.5"
                    stroke="currentColor"
                    className="size-44 text-gray-500"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                )}

                <p className="font-semibold text-gray-800 text-xl">
                  {renter.firstName} {renter.lastName}
                </p>
                <p className="text-sm uppercase text-gray-500 font-bold">
                  {renter.location}
                </p>
              </div>
              <div className="flex justify-between items-center px-2 mt-2">
                <div>
                  <p className="text-sm uppercase text-gray-800 font-bold">
                    Payment Status
                  </p>
                  <p className="text-sm text-violet-500">{renter.property}</p>
                </div>

                <div
                  className={`py-1 px-1 text-center min-w-16 ${
                    paymentStatusStyles[renter.paymentStatus]
                  }`}
                >
                  {renter.paymentStatus}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center mt-2">
                <p className="text-violet-500 mt-1">Communicate Via</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-6"
                    onClick={() => handleCall(renter.phone)}
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-6"
                    onClick={() =>
                      handleMessage(
                        renter.phone,
                        renter.firstName,
                        renter.property,
                        renter.paymentStatus
                      )
                    }
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"
                    onClick={() =>
                      handleWhatsApp(
                        renter.phone,
                        renter.firstName,
                        renter.property,
                        renter.paymentStatus
                      )
                    }
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M18.403 5.633A8.919 8.919 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.198 4.488L3 21.116l4.759-1.249a8.981 8.981 0 0 0 4.29 1.093h.004c4.947 0 8.975-4.027 8.977-8.977a8.926 8.926 0 0 0-2.627-6.35m-6.35 13.812h-.003a7.446 7.446 0 0 1-3.798-1.041l-.272-.162-2.824.741.753-2.753-.177-.282a7.448 7.448 0 0 1-1.141-3.971c.002-4.114 3.349-7.461 7.465-7.461a7.413 7.413 0 0 1 5.275 2.188 7.42 7.42 0 0 1 2.183 5.279c-.002 4.114-3.349 7.462-7.461 7.462m4.093-5.589c-.225-.113-1.327-.655-1.533-.73-.205-.075-.354-.112-.504.112s-.58.729-.711.879-.262.168-.486.056-.947-.349-1.804-1.113c-.667-.595-1.117-1.329-1.248-1.554s-.014-.346.099-.458c.101-.1.224-.262.336-.393.112-.131.149-.224.224-.374s.038-.281-.019-.393c-.056-.113-.505-1.217-.692-1.666-.181-.435-.366-.377-.504-.383a9.65 9.65 0 0 0-.429-.008.826.826 0 0 0-.599.28c-.206.225-.785.767-.785 1.871s.804 2.171.916 2.321c.112.15 1.582 2.415 3.832 3.387.536.231.954.369 1.279.473.537.171 1.026.146 1.413.089.431-.064 1.327-.542 1.514-1.066.187-.524.187-.973.131-1.067-.056-.094-.207-.151-.43-.263"
                    ></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-6"
                    onClick={() =>
                      handleEmail(
                        renter.email,
                        renter.firstName,
                        renter.property,
                        renter.paymentStatus
                      )
                    }
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tenants;
