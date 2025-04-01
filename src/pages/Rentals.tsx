import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import Loading from "../components/Loading";
import { format } from "date-fns";
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
import { useDashboard } from "../context/DashboardContext";

type PaymentStatus = "Paid" | "Pending" | "Overdue" | "Partially Paid";
interface Rental {
  _id: string;
  property: { name: string };
  renter: {
    firstName: string;
    lastName: string;
    location: string;
    property: string;
    email: string;
    phone: string;
    activeStatus: string;
    paymentStatus: PaymentStatus;
    profilePhoto?: string;
  };
  amount: number;
  deposit: number;
  status: "Rented" | "Past";
  rentalStartDate: string;
  rentalEndDate: string;
  paidAmount: number; // Tracks rent payments
  dues: number; // Tracks rent dues
  deadline: string; // Payment deadline
  utilitiesTotal: number; // Total utility cost
  utilityPaidAmount: number; // Paid utilities
}

const Rentals = () => {
  type Active = "Current" | "Past";
  const [activePart, setActivePart] = useState<Active>("Current");
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isReminderModalOpen, setReminderModalOpen] = useState(false);
  const [selectedRentalId, setSelectedRentalId] = useState<string | null>(null);
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const {
    fetchDashboardSummary,
    fetchRentals,
    fetchChartSummary,
    fetchPaymentsSummary,
  } = useDashboard();

  // Function to open modal
  const openReminderModal = () => {
    setReminderModalOpen(true);
  };

  // Function to close modal
  const closeReminderModal = () => {
    setReminderModalOpen(false);
  };

  // Function to handle reminder selection
  const handleReminder = (type: string) => {
    console.log(type);
    closeReminderModal();
  };

  // Function to get selected rental object
  const getSelectedRental = () =>
    rentals.find((rental) => rental._id === selectedRentalId) || null;

  // Function to handle button clicks
  const handleSelectRental = (_id: string) => {
    setSelectedRentalId(_id); // Store only the rental ID
  };

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await axios.get<Rental[]>("/api/admin/rentals");
        console.log(response.data);
        setRentals(response.data);
      } catch (err) {
        setError("Failed to fetch rentals");
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
    // Refresh rentals every 60 seconds
    const interval = setInterval(fetchRentals, 60000);

    return () => clearInterval(interval);
  }, []);

  const filteredRentals = rentals.filter((rental) =>
    activePart === "Current"
      ? rental.status === "Rented"
      : rental.status === "Past"
  );

  const deleteRental = async (rentalId: any) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this rental?"
    );
    if (!confirmDelete) return;
    try {
      const response = await axios.delete(`/api/admin/rentals/${rentalId}`);
      if (response.status === 200) {
        showToast("Rental deleted successfully", "success");
        // Update state to remove the deleted rental
        setRentals(rentals.filter((rental) => rental._id !== rentalId));
        fetchDashboardSummary();
        fetchRentals();
        fetchChartSummary();
        fetchPaymentsSummary(
          "month",
          new Date().getMonth() + 1,
          new Date().getFullYear()
        );
      }
    } catch (error: any) {
      console.error("Error deleting rental:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Error deleting rental. Please try again.";
      showToast(errorMessage, "error");
    }
  };
  const handleEmail = () => {
    const rental = getSelectedRental();
    console.log(rental);
    if (!rental) return alert("No rental selected!");
    let message = "";

    switch (rental.renter.paymentStatus) {
      case "Paid":
        message =
          `Subject: Payment Confirmation for ${rental.property.name}\n\n` +
          `Dear ${rental.renter.firstName},\n\n` +
          `We confirm that your rent payment for ${rental.property.name} has been successfully received. Thank you for your timely payment.\n\n` +
          `If you need any further assistance, feel free to reach out.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;

      case "Partially Paid":
        message =
          `Subject: Partial Rent Payment for ${rental.property.name}\n\n` +
          `Dear ${rental.renter.firstName},\n\n` +
          `We have received a partial payment for your rent at ${
            rental.property.name
          }. The remaining balance is KES ${rental.dues}, due by ${format(
            new Date(rental.deadline),
            "dd-MM-yyyy"
          )}.\n\n` +
          `Kindly complete the payment to avoid penalties. If you have any concerns, please reach out.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;

      case "Pending":
        message =
          `Subject: Rent Payment Reminder for ${rental.property.name}\n\n` +
          `Dear ${rental.renter.firstName},\n\n` +
          `This is a gentle reminder that your rent payment for ${rental.property.name} is pending.\n\n` +
          `Amount Due: KES ${rental.dues}\n` +
          `Due Date: ${format(new Date(rental.deadline), "dd-MM-yyyy")}\n\n` +
          `Kindly ensure payment is made on time to avoid any late fees.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;

      case "Overdue":
        message =
          `Subject: Urgent - Overdue Rent Payment for ${rental.property.name}\n\n` +
          `Dear ${rental.renter.firstName},\n\n` +
          `We would like to inform you that your rent payment for ${rental.property.name} is overdue.\n\n` +
          `Outstanding Amount: KES ${rental.dues}\n` +
          `Due Date: ${format(new Date(rental.deadline), "dd-MM-yyyy")}\n\n` +
          `To avoid further penalties or legal action, please settle the payment immediately. If you have already made the payment, kindly disregard this message.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;

      default:
        message =
          `Subject: Rent Payment Status for ${rental.property.name}\n\n` +
          `Dear ${rental.renter.firstName},\n\n` +
          `Please be informed that your rent payment status for ${rental.property.name} is recorded as ${rental.renter.paymentStatus}.\n\n` +
          `If you have any questions or need assistance, feel free to reach out.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;
    }

    window.location.href = `mailto:${
      rental.renter.email
    }?body=${encodeURIComponent(message)}`;
  };

  const handleMessage = () => {
    const rental = getSelectedRental();
    if (!rental) return alert("No rental selected!");
    let message = "";

    switch (rental.renter.paymentStatus) {
      case "Paid":
        message =
          `Subject: Payment Confirmation for ${rental.property.name}\n\n` +
          `Dear ${rental.renter.firstName},\n\n` +
          `We confirm that your rent payment for ${rental.property.name} has been successfully received. Thank you for your timely payment.\n\n` +
          `If you need any further assistance, feel free to reach out.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;

      case "Partially Paid":
        message =
          `Subject: Partial Rent Payment for ${rental.property.name}\n\n` +
          `Dear ${rental.renter.firstName},\n\n` +
          `We have received a partial payment for your rent at ${
            rental.property.name
          }. The remaining balance is KES ${rental.dues}, due by ${format(
            new Date(rental.deadline),
            "dd-MM-yyyy"
          )}.\n\n` +
          `Kindly complete the payment to avoid penalties. If you have any concerns, please reach out.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;

      case "Pending":
        message =
          `Subject: Rent Payment Reminder for ${rental.property.name}\n\n` +
          `Dear ${rental.renter.firstName},\n\n` +
          `This is a gentle reminder that your rent payment for ${rental.property.name} is pending.\n\n` +
          `Amount Due: KES ${rental.dues}\n` +
          `Due Date: ${format(new Date(rental.deadline), "dd-MM-yyyy")}\n\n` +
          `Kindly ensure payment is made on time to avoid any late fees.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;

      case "Overdue":
        message =
          `Subject: Urgent - Overdue Rent Payment for ${rental.property.name}\n\n` +
          `Dear ${rental.renter.firstName},\n\n` +
          `We would like to inform you that your rent payment for ${rental.property.name} is overdue.\n\n` +
          `Outstanding Amount: KES ${rental.dues}\n` +
          `Due Date: ${format(new Date(rental.deadline), "dd-MM-yyyy")}\n\n` +
          `To avoid further penalties or legal action, please settle the payment immediately. If you have already made the payment, kindly disregard this message.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;

      default:
        message =
          `Subject: Rent Payment Status for ${rental.property.name}\n\n` +
          `Dear ${rental.renter.firstName},\n\n` +
          `Please be informed that your rent payment status for ${rental.property.name} is recorded as ${rental.renter.paymentStatus}.\n\n` +
          `If you have any questions or need assistance, feel free to reach out.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;
    }

    // Open SMS with pre-filled message
    window.location.href = `sms:${
      rental.renter.phone
    }?body=${encodeURIComponent(message)}`;
  };

  const handleWhatsApp = () => {
    const rental = getSelectedRental();
    console.log("the rental:", rental);
    if (!rental) return alert("No rental selected!");
    let message = "";

    switch (rental.renter.paymentStatus) {
      case "Paid":
        message =
          `Subject: Payment Confirmation for ${rental.property.name}\n\n` +
          `Dear ${rental.renter.firstName},\n\n` +
          `We confirm that your rent payment for ${rental.property.name} has been successfully received. Thank you for your timely payment.\n\n` +
          `If you need any further assistance, feel free to reach out.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;

      case "Partially Paid":
        message =
          `Subject: Partial Rent Payment for ${rental.property.name}\n\n` +
          `Dear ${rental.renter.firstName},\n\n` +
          `We have received a partial payment for your rent at ${
            rental.property.name
          }. The remaining balance is KES ${rental.dues}, due by ${format(
            new Date(rental.deadline),
            "dd-MM-yyyy"
          )}.\n\n` +
          `Kindly complete the payment to avoid penalties. If you have any concerns, please reach out.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;

      case "Pending":
        message =
          `Subject: Rent Payment Reminder for ${rental.property.name}\n\n` +
          `Dear ${rental.renter.firstName},\n\n` +
          `This is a gentle reminder that your rent payment for ${rental.property.name} is pending.\n\n` +
          `Amount Due: KES ${rental.dues}\n` +
          `Due Date: ${format(new Date(rental.deadline), "dd-MM-yyyy")}\n\n` +
          `Kindly ensure payment is made on time to avoid any late fees.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;

      case "Overdue":
        message =
          `Subject: Urgent - Overdue Rent Payment for ${rental.property.name}\n\n` +
          `Dear ${rental.renter.firstName},\n\n` +
          `We would like to inform you that your rent payment for ${rental.property.name} is overdue.\n\n` +
          `Outstanding Amount: KES ${rental.dues}\n` +
          `Due Date: ${format(new Date(rental.deadline), "dd-MM-yyyy")}\n\n` +
          `To avoid further penalties or legal action, please settle the payment immediately. If you have already made the payment, kindly disregard this message.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;

      default:
        message =
          `Subject: Rent Payment Status for ${rental.property.name}\n\n` +
          `Dear ${rental.renter.firstName},\n\n` +
          `Please be informed that your rent payment status for ${rental.property.name} is recorded as ${rental.renter.paymentStatus}.\n\n` +
          `If you have any questions or need assistance, feel free to reach out.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;
    }

    // Encode and open WhatsApp
    window.open(
      `https://wa.me/${rental.renter.phone}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
  };

  return (
    <div className="px-6 py-4 w-screen sm:w-full min-h-screen">
      <div className="flex justify-between items-center flex-wrap gap-2 sm:gap-0 p-1 sm:p-0">
        <div className="flex justify-center items-center gap-1 sm:gap-2">
          <h1 className="text-xl md:text-2xl font-bold">
            Rentals({filteredRentals.length})
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <ExpandCircleDownIcon className="text-violet-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>View</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/payments")}>
                Payments
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/utilities")}>
                Utilities
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="p-1 sm:p-2 flex gap-1 border border-gray-300 rounded-sm">
          <span
            className={`${
              activePart === "Current"
                ? "bg-violet-500  text-white"
                : "bg-transparent"
            } p-1  rounded-sm cursor-pointer text-gray-500 text-xs sm:text-sm flex items-center justify-center min-w-[40px] sm:min-w-[50px] text-center`}
            onClick={() => setActivePart("Current")}
          >
            Rented
          </span>
          <span
            className={`${
              activePart === "Past"
                ? "bg-violet-500 text-white"
                : "bg-transparent"
            } p-1 rounded-sm cursor-pointer text-gray-500 text-xs sm:text-sm flex items-center justify-center min-w-[40px] sm:min-w-[50px] text-center`}
            onClick={() => setActivePart("Past")}
          >
            Past
          </span>
        </div>
      </div>

      <div className="mt-2">
        <h1 className="text-center text-2xl font-bold">Rentals Center</h1>
        <div className="flex md:justify-center mt-1">
          <p className="text-left md:text-center text-base md:text-xl">
            View and manage both active and past rentals. Track rental details,
            payment status to stay on top of your rental properties.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center my-6 gap-2 sm:gap-3 overflow-x-auto px-1 w-full">
        <div className="flex items-center justify-center flex-shrink h-9">
          <input
            type="search"
            name="search"
            id="search"
            placeholder="Search Rental"
            className="p-2 rounded-l-md w-[150px] xs:w-[180px] sm:min-w-52 md:min-w-96 text-sm sm:text-base h-full"
          />
          <button className="p-2 bg-violet-500 rounded-r-md flex-shrink-0 h-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-5 md:size-6 text-white"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        </div>

        <Link to={"/addrental"} className="flex-shrink-0 h-10">
          <div className="flex items-center justify-center gap-1 text-xs sm:text-sm font-semibold border rounded-md bg-gray-300 hover:bg-violet-500 hover:text-white duration-75 ease-in-out cursor-pointer px-2 h-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-5 sm:size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <p className="whitespace-nowrap">Add Rental</p>
          </div>
        </Link>
      </div>

      {loading && <Loading />}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && filteredRentals.length === 0 && (
        <p className="text-center">No rentals found.</p>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 mt-4 gap-9">
        {filteredRentals.map((rental) => {
          console.log(rental);

          let rentStatus = "";

          // ✅ Rent status logic considering both rent and utilities
          if (rental.dues === 0 && rental.renter.paymentStatus === "Paid") {
            rentStatus = "RENT PAID";
          } else if (
            rental.dues > 0 &&
            rental.renter.paymentStatus === "Overdue"
          ) {
            rentStatus = "RENT OVERDUE";
          } else {
            rentStatus = "RENT PENDING";
          }
          return (
            <div
              key={rental._id}
              className="text-xxs md:text-sm uppercase bg-white border border-gray-300 rounded-sm p-2 md:p-3 overflow-hidden"
            >
              <div className="flex justify-between items-center flex-wrap gap-1">
                {rentStatus && (
                  <span
                    className={`text-center  text-xs font-bold px-2 py-1 rounded ${
                      rentStatus === "RENT OVERDUE"
                        ? "bg-red-500 text-white"
                        : rentStatus === "RENT PENDING"
                        ? "bg-yellow-500 text-black"
                        : "bg-green-500 text-black"
                    }`}
                  >
                    {rentStatus}
                  </span>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <ExpandCircleDownIcon className="text-violet-500" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => navigate(`/rental/${rental._id}`)}
                    >
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate(`/editrental/${rental._id}`)}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteRental(rental._id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex justify-between pb-1 mt-1 flex-wrap gap-1">
                <span className=" font-bold  text-violet-500 text-xs md:text-sm">
                  {rental.property.name}
                </span>
                <span className=" font-bold text-xs md:text-sm">
                  UTILITIES: KES {rental.utilitiesTotal}
                </span>
              </div>

              <div className="flex justify-between pb-1 mt-1 flex-wrap gap-1">
                <div className="flex items-center">
                  <span className=" font-bold text-xs md:text-sm">
                    {rental.renter.firstName} {rental.renter.lastName}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-4 md:size-5 ml-1 md:ml-2"
                    onClick={() => {
                      openReminderModal();
                      handleSelectRental(rental._id);
                    }}
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
                    />
                  </svg>
                </div>
                {/* Reminder Modal */}
                {isReminderModalOpen && selectedRentalId && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 flex flex-col rounded shadow-lg w-80">
                      <h2 className="text-lg font-bold mb-3 text-center">
                        Send Payment Reminder
                      </h2>

                      <button
                        className="bg-violet-500 text-white py-2 mb-2 rounded"
                        onClick={() => {
                          handleReminder("Email");
                          handleEmail();
                        }}
                      >
                        Send via Email
                      </button>

                      <button
                        className="bg-green-500 text-white  py-2 mb-2 rounded"
                        onClick={() => {
                          handleReminder("WhatsApp");
                          handleWhatsApp();
                        }}
                      >
                        Send via WhatsApp
                      </button>

                      <button
                        className="bg-blue-500 text-white  py-2 rounded"
                        onClick={() => {
                          handleReminder("SMS");
                          handleMessage();
                        }}
                      >
                        Send via SMS
                      </button>

                      <button
                        className="mt-4 bg-gray-300  py-2 rounded"
                        onClick={closeReminderModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                <span className=" font-bold text-xs md:text-sm">
                  Paid:{" "}
                  <span className="text-green-600 font-extrabold">
                    KES {rental.paidAmount + rental.utilityPaidAmount}
                  </span>
                </span>
              </div>

              <div className="flex justify-between pb-1 mt-1 flex-wrap gap-1">
                <span className=" font-bold text-xs md:text-sm">
                  Monthly:{" "}
                  <span className="font-extrabold">KES {rental.amount}</span>
                </span>
                <span className=" font-bold text-xs md:text-sm">
                  Due:{" "}
                  <span className="text-red-600 font-extrabold">
                    KES {rental.dues}
                  </span>
                </span>
              </div>

              <div className="flex justify-between pb-1 mt-1 flex-wrap gap-1">
                <span className=" font-bold text-xs md:text-sm">
                  DATES:{" "}
                  <span className="text-violet-500 mr-2">
                    {format(new Date(rental.rentalStartDate), "dd-MM-yyyy")} -{" "}
                    {format(new Date(rental.rentalEndDate), "dd-MM-yyyy")}
                  </span>
                </span>
                <span className=" font-bold text-xs md:text-sm">
                  Deadline:{" "}
                  <span className="text-red-600 font-extrabold">
                    {format(new Date(rental.deadline), "dd-MM-yyyy")}
                  </span>
                </span>
              </div>

              <div className="flex justify-between mt-2 flex-wrap gap-2">
                <Link to={`/addpayment/${rental._id}`}>
                  <button className="bg-violet-500 text-white font-bold px-2 py-1 rounded-sm text-xs md:text-sm">
                    Add Payment
                  </button>
                </Link>
                <Link to={`/addUtility/${rental._id}`}>
                  <button className="bg-violet-500 text-white font-bold px-2 py-1 rounded-sm text-xs md:text-sm">
                    Pay Utility
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Rentals;
