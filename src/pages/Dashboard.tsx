import { useContext, useEffect, useRef, useState } from "react";
import { useDashboard } from "../context/DashboardContext"; // Import the context
import { Store } from "../context/UserContext";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { calculateBalance } from "../utils/calculateBalance";
import { Link } from "react-router-dom";

const Dashboard = () => {
  type Active = "Month" | "Year";
  const [activePart, setActivePart] = useState<Active>("Month");
  const [isReminderModalOpen, setReminderModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  // Use the Dashboard Context
  const {
    totalRenters,
    totalProperties,
    totalEarnings,
    earnings,
    expenses,
    utilities,
    overdues,
    deposits,
    paymentsEarnings,
    paymentsPastDue,
    rentals,
    fetchDashboardSummary,
    fetchChartSummary,
    fetchPaymentsSummary,
    fetchRentals,
  } = useDashboard();

  // Function to open modal
  const openReminderModal = () => {
    console.log(openReminderModal);
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

  useEffect(() => {
    fetchDashboardSummary(), fetchChartSummary(), fetchRentals();
  }, []);

  const { state } = useContext(Store);
  const { userInfo } = state;

  // Fetch payments summary when activePart, selectedMonth, or selectedYear changes
  useEffect(() => {
    fetchPaymentsSummary(
      activePart.toLowerCase(),
      selectedMonth + 1,
      selectedYear
    );
  }, [activePart, selectedMonth, selectedYear, fetchPaymentsSummary]);

  const getTitle = () => {
    if (activePart === "Month") {
      return `${new Date(selectedYear, selectedMonth).toLocaleString(
        "default",
        {
          month: "long",
        }
      )} Payments`;
    } else {
      return `${selectedYear} Payments`;
    }
  };

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Scroll left
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollWidth = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollBy({
        left: -scrollWidth - 7,
        behavior: "smooth",
      });
    }
  };

  // Scroll right
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollWidth = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollBy({
        left: scrollWidth + 7,
        behavior: "smooth",
      });
    }
  };

  // Calculate total for the pie chart

  const balance: number = calculateBalance(
    earnings,
    deposits,
    expenses,
    utilities
  );

  // All data
  const data = [
    { name: "Earnings", value: earnings, color: "#4F46E5" },
    { name: "Expenses", value: expenses, color: "#EF4444" },
    { name: "Utilities", value: utilities, color: "#10B981" },
    { name: "Overdues", value: overdues, color: "#F59E0B" },
    { name: "Deposits", value: deposits, color: "#6366F1" },
  ];

  // Pie chart data
  const pieChartData = [
    { name: "Earnings", value: earnings, color: "#4F46E5" },
    { name: "Expenses", value: expenses, color: "#EF4444" },
    { name: "Utilities", value: utilities, color: "#10B981" },
    { name: "Deposits", value: deposits, color: "#6366F1" },
  ];

  const handleEmail = (
    email: string,
    firstName: string,
    propertyName: string,
    paymentStatus: string,
    due: number,
    dueDate: string
  ) => {
    let message = "";

    switch (paymentStatus) {
      case "Paid":
        message =
          `Subject: Payment Confirmation for ${propertyName}\n\n` +
          `Dear ${firstName},\n\n` +
          `We confirm that your rent payment for ${propertyName} has been successfully received. Thank you for your timely payment.\n\n` +
          `If you need any further assistance, feel free to reach out.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;

      case "Partially Paid":
        message =
          `Subject: Partial Rent Payment for ${propertyName}\n\n` +
          `Dear ${firstName},\n\n` +
          `We have received a partial payment for your rent at ${propertyName}. The remaining balance is KES ${due}, due by ${dueDate}.\n\n` +
          `Kindly complete the payment to avoid penalties. If you have any concerns, please reach out.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;

      case "Pending":
        message =
          `Subject: Rent Payment Reminder for ${propertyName}\n\n` +
          `Dear ${firstName},\n\n` +
          `This is a gentle reminder that your rent payment for ${propertyName} is pending.\n\n` +
          `Amount Due: KES ${due}\n` +
          `Due Date: ${dueDate}\n\n` +
          `Kindly ensure payment is made on time to avoid any late fees.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;

      case "Overdue":
        message =
          `Subject: Urgent - Overdue Rent Payment for ${propertyName}\n\n` +
          `Dear ${firstName},\n\n` +
          `We would like to inform you that your rent payment for ${propertyName} is overdue.\n\n` +
          `Outstanding Amount: KES ${due}\n` +
          `Due Date: ${dueDate}\n\n` +
          `To avoid further penalties or legal action, please settle the payment immediately. If you have already made the payment, kindly disregard this message.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;

      default:
        message =
          `Subject: Rent Payment Status for ${propertyName}\n\n` +
          `Dear ${firstName},\n\n` +
          `Please be informed that your rent payment status for ${propertyName} is recorded as ${paymentStatus}.\n\n` +
          `If you have any questions or need assistance, feel free to reach out.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;
    }

    window.location.href = `mailto:${email}?body=${encodeURIComponent(
      message
    )}`;
  };

  const handleMessage = (
    phoneNumber: string,
    firstName: string,
    propertyName: string,
    paymentStatus: string,
    due: number,
    dueDate: string
  ) => {
    let message = "";

    switch (paymentStatus) {
      case "Paid":
        message =
          `Subject: Payment Confirmation for ${propertyName}\n\n` +
          `Dear ${firstName},\n\n` +
          `Your rent payment for ${propertyName} has been successfully received. Thank you for your timely payment.\n\n` +
          `If you need any assistance, feel free to reach out.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;

      case "Partially Paid":
        message =
          `Subject: Partial Rent Payment for ${propertyName}\n\n` +
          `Dear ${firstName},\n\n` +
          `We have received a partial payment for your rent at ${propertyName}. The remaining balance is KES ${due}, due by ${dueDate}.\n\n` +
          `Kindly complete the payment to avoid penalties. If you have any concerns, please reach out.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;

      case "Pending":
        message =
          `Subject: Rent Payment Reminder for ${propertyName}\n\n` +
          `Dear ${firstName},\n\n` +
          `This is a reminder that your rent payment for ${propertyName} is still pending.\n\n` +
          `Amount Due: KES ${due}\n` +
          `Due Date: ${dueDate}\n\n` +
          `Please ensure payment is made on time to avoid any late fees.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;

      case "Overdue":
        message =
          ` Subject: Urgent - Overdue Rent Payment for ${propertyName}\n\n` +
          `Dear ${firstName},\n\n` +
          `Your rent payment for ${propertyName} is overdue.\n\n` +
          `Outstanding Amount: KES ${due}\n` +
          `Due Date: ${dueDate}\n\n` +
          `To avoid penalties or legal action, please settle the payment immediately. If you have already made the payment, kindly disregard this message.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;

      default:
        message =
          `Subject: Rent Payment Status for ${propertyName}\n\n` +
          `Dear ${firstName},\n\n` +
          `Your rent payment status for ${propertyName} is recorded as ${paymentStatus}.\n\n` +
          `If you have any questions or need assistance, feel free to reach out.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;
    }

    // Open SMS with pre-filled message
    window.location.href = `sms:${phoneNumber}?body=${encodeURIComponent(
      message
    )}`;
  };

  const handleWhatsApp = (
    phoneNumber: string,
    firstName: string,
    propertyName: string,
    paymentStatus: string,
    due: number,
    dueDate: string
  ) => {
    let message = "";

    switch (paymentStatus) {
      case "Paid":
        message =
          `Subject: Payment Confirmation for ${propertyName}\n\n` +
          `Dear ${firstName},\n\n` +
          `We confirm that your rent payment for ${propertyName} has been successfully received. Thank you for your timely payment.\n\n` +
          `If you need any further assistance, feel free to reach out.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;

      case "Partially Paid":
        message =
          `Subject: Partial Rent Payment for ${propertyName}\n\n` +
          `Dear ${firstName},\n\n` +
          `We have received a partial payment for your rent at ${propertyName}. The remaining balance is KES ${due}, due by ${dueDate}.\n\n` +
          `Kindly complete the payment to avoid penalties. If you have any concerns, please reach out.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;

      case "Pending":
        message =
          `Subject: Rent Payment Reminder for ${propertyName}\n\n` +
          `Dear ${firstName},\n\n` +
          `This is a gentle reminder that your rent payment for ${propertyName} is pending.\n\n` +
          `Amount Due: KES ${due}\n` +
          `Due Date: ${dueDate}\n\n` +
          `Kindly ensure payment is made on time to avoid any late fees.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;

      case "Overdue":
        message =
          `Subject: Urgent - Overdue Rent Payment for ${propertyName}\n\n` +
          `Dear ${firstName},\n\n` +
          `We would like to inform you that your rent payment for ${propertyName} is overdue.\n\n` +
          `Outstanding Amount: KES ${due}\n` +
          `Due Date: ${dueDate}\n\n` +
          `To avoid further penalties or legal action, please settle the payment immediately. If you have already made the payment, kindly disregard this message.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;

      default:
        message =
          `Subject: Rent Payment Status for ${propertyName}\n\n` +
          `Dear ${firstName},\n\n` +
          `Please be informed that your rent payment status for ${propertyName} is recorded as ${paymentStatus}.\n\n` +
          `If you have any questions or need assistance, feel free to reach out.\n\n` +
          `Best regards,\n` +
          `${userInfo?.name}\n` +
          `RentaHub`;
        break;
    }

    // Encode and open WhatsApp
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="px-6 py-4 min-h-screen">
      <h1 className="text-3xl font-bold mt-2">
        Jambo, <span className="text-violet-500">{userInfo?.name}</span>
      </h1>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-4">
        <div className="xl:col-span-2">
          <div>
            <h2 className="text-base uppercase text-gray-500 font-semibold">
              Summary
            </h2>

            <div className="grid grid-cols-2 w-full md:grid-cols-4 gap-0 shadow-sm h-44 bg-gray-50">
              <Link
                to="/tenants"
                className="flex flex-col items-center justify-center border border-gray-300 p-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                  />
                </svg>

                <span className="text-sm uppercase font-semibold text-violet-500">
                  Tenants
                </span>
                <span className="text-base font-bold mt-1">{totalRenters}</span>
              </Link>
              <Link
                to="/properties"
                className="flex flex-col items-center justify-center border border-gray-300 p-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                  />
                </svg>
                <span className="text-sm uppercase font-semibold text-violet-500">
                  Properties
                </span>
                <span className="text-base font-bold mt-1">
                  {totalProperties}
                </span>
              </Link>

              <Link
                to="#"
                className="flex flex-col items-center justify-center border border-gray-300 p-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
                  />
                </svg>

                <span className="text-sm uppercase font-semibold text-violet-500">
                  Earnings
                </span>
                <span className="text-base font-bold mt-1 text-green-500">
                  KES {totalEarnings.toLocaleString()}
                </span>
              </Link>

              <Link
                to="/expenses"
                className="flex flex-col items-center justify-center border border-gray-300 p-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-12"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                  />
                </svg>

                <span className="text-sm uppercase font-semibold text-violet-500 whitespace-nowrap">
                  Expenses
                </span>
                <span className="text-base font-bold mt-1 text-red-500">
                  KES {expenses}
                </span>
              </Link>
            </div>
          </div>

          {/* Income Section */}
          <div className="mt-24 md:mt-4">
            <h2 className="text-base uppercase text-gray-500 font-semibold">
              Income
            </h2>

            <div className="bg-gray-50 border border-gray-300 w-full p-3 ">
              <div className="mt-2 flex justify-between items-center">
                <p className="text-xl font-bold">{getTitle()}</p>

                <div className="p-2 flex gap-1 border border-gray-300 rounded-sm">
                  <span
                    className={`${
                      activePart === "Month"
                        ? "bg-violet-500  text-white"
                        : "bg-transparent"
                    } p-1  rounded-sm cursor-pointer text-gray-500`}
                    onClick={() => setActivePart("Month")}
                  >
                    Month
                  </span>
                  <span
                    className={`${
                      activePart === "Year"
                        ? "bg-violet-500 text-white"
                        : "bg-transparent"
                    } p-1 rounded-sm cursor-pointer text-gray-500`}
                    onClick={() => setActivePart("Year")}
                  >
                    Year
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mt-0 text-xxs md:text-xs">
                {activePart === "Month" && (
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="border border-gray-300 p-1 rounded-sm"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>
                        {new Date(0, i).toLocaleString("default", {
                          month: "long",
                        })}
                      </option>
                    ))}
                  </select>
                )}

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="border border-gray-300 p-1 rounded-sm"
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <option key={i} value={new Date().getFullYear() - i}>
                      {new Date().getFullYear() - i}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 mt-2">
                <div className="flex flex-col border border-gray-300 rounded-sm w-1/2 p-4">
                  <span className="text-sm uppercase text-gray-400 font-bold">
                    EARNINGS
                  </span>
                  <span className="text-green-600 font-extrabold">
                    KES {paymentsEarnings.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col border border-gray-300 rounded-sm w-1/2 p-4">
                  <span className="text-sm uppercase text-gray-400 font-bold">
                    PAST DUE
                  </span>
                  <span className="text-red-600 font-extrabold">
                    KES {paymentsPastDue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Rentals Section */}
          <div className="mt-4 ">
            <h2 className="text-base uppercase text-gray-500 font-semibold">
              Current Rentals
            </h2>
            <div className="flex w-full mt-2">
              {/* Left Arrow */}
              <button
                onClick={scrollLeft}
                className="bg-gray-200 text-gray-600 hover:bg-gray-300 "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <div
                ref={scrollContainerRef}
                className="w-full flex gap-4 overflow-x-scroll scroll whitespace-nowrap scroll-smooth bg-gray-100 border border-gray-300 p-1"
              >
                {rentals.length > 0 ? (
                  rentals.map((rental: any) => (
                    <div
                      key={rental._id}
                      className="w-full text-xxs md:text-sm uppercase bg-white border border-white-300 rounded-sm p-2 min-w-full"
                    >
                      <div className="flex flex-wrap justify-between pb-1">
                        <span className="font-bold text-violet-500 whitespace-normal">
                          {rental.property.name}
                        </span>
                        <span className="font-bold whitespace-normal">
                          UTILITIES: KES {rental.utilitiesTotal}
                        </span>
                      </div>
                      <div className="flex flex-wrap justify-between pb-1">
                        <div className="flex flex-wrap items-center">
                          <span className="font-bold whitespace-normal">
                            {rental.renter.firstName} {rental.renter.lastName}
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-5 ml-2 flex-shrink-0"
                            onClick={openReminderModal}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
                            />
                          </svg>
                        </div>
                        {/* Reminder Modal */}
                        {isReminderModalOpen && (
                          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-5 flex flex-col rounded shadow-lg w-80">
                              <h2 className="text-lg font-bold mb-3 text-center">
                                Send Payment Reminder
                              </h2>

                              <button
                                className="bg-violet-500 text-white py-2 mb-2 rounded"
                                onClick={() => {
                                  handleReminder("Email");
                                  handleEmail(
                                    rental.renter.email,
                                    rental.renter.firstName,
                                    rental.property.name,
                                    rental.renter.paymentStatus,
                                    rental.dues,
                                    format(
                                      new Date(rental.deadline),
                                      "dd-MM-yyyy"
                                    )
                                  );
                                }}
                              >
                                Send via Email
                              </button>

                              <button
                                className="bg-green-500 text-white  py-2 mb-2 rounded"
                                onClick={() => {
                                  handleReminder("WhatsApp");
                                  handleWhatsApp(
                                    rental.renter.phone,
                                    rental.renter.firstName,
                                    rental.property.name,
                                    rental.renter.paymentStatus,
                                    rental.dues,
                                    format(
                                      new Date(rental.deadline),
                                      "dd-MM-yyyy"
                                    )
                                  );
                                }}
                              >
                                Send via WhatsApp
                              </button>

                              <button
                                className="bg-blue-500 text-white  py-2 rounded"
                                onClick={() => {
                                  handleReminder("SMS");
                                  handleMessage(
                                    rental.renter.phone,
                                    rental.renter.firstName,
                                    rental.property.name,
                                    rental.renter.paymentStatus,
                                    rental.dues,
                                    format(
                                      new Date(rental.deadline),
                                      "dd-MM-yyy"
                                    )
                                  );
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
                        <span className="font-bold whitespace-normal">
                          Paid:{" "}
                          <span className="text-green-600 font-extrabold">
                            KES {rental.paidAmount + rental.utilityPaidAmount}
                          </span>
                        </span>
                      </div>
                      <div className="flex flex-wrap justify-between pb-1">
                        <span className="font-bold whitespace-normal">
                          Monthly:{" "}
                          <span className="text-green-600 font-extrabold">
                            KES {rental.amount}
                          </span>
                        </span>
                        <span className="font-bold whitespace-normal">
                          Due:{" "}
                          <span className="text-red-600 font-extrabold">
                            KES {rental.dues}
                          </span>
                        </span>
                      </div>
                      <div className="flex flex-col md:flex-row justify-between pb-1 ">
                        <span className="font-bold whitespace-normal">
                          DATES:{" "}
                          <span className="text-violet-500">
                            {format(
                              new Date(rental.rentalStartDate),
                              "dd-MM-yyyy"
                            )}{" "}
                            -{" "}
                            {format(
                              new Date(rental.rentalEndDate),
                              "dd-MM-yyyy"
                            )}
                          </span>
                        </span>
                        <span className="font-bold whitespace-normal">
                          Deadline:{" "}
                          <span className="text-red-600 font-extrabold">
                            {format(new Date(rental.deadline), "dd-MM-yyyy")}
                          </span>
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="flex justify-center items-center h-28 w-full">
                    No active rentals found.
                  </p>
                )}
              </div>
              {/* Right Arrow */}
              <button
                onClick={scrollRight}
                className=" bg-gray-200 text-gray-600 hover:bg-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-base uppercase text-gray-500 font-semibold">
            CHART
          </h2>
          <Card className="w-full border border-gray-300 bg-gray-50 shadow-sm rounded-none">
            <CardHeader className="py-3">
              <CardTitle className="text-2xl font-bold text-center text-gray-800 ">
                Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius="60%"
                      outerRadius="100%"
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-base md:text-xl lg:text-2xl font-bold">
                      {balance.toLocaleString("en-US", {
                        style: "currency",
                        currency: "KES",
                        minimumFractionDigits: 0,
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <Table className="mt-4 p-0">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]"></TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell>
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">
                        {item.value.toLocaleString("en-US", {
                          style: "currency",
                          currency: "KES",
                          minimumFractionDigits: 0,
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="text-xs text-center mt-1 ml-2 text-gray-500">
                Overdues are not part of the balance
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* <div className="mt-4">
        <h2 className="text-base uppercase text-gray-500 font-semibold">
          PAYMENTS
        </h2>
        <div className="">
          <Payments />
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-base uppercase text-gray-500 font-semibold">
          UTILITIES
        </h2>
        <div className="">
          <Utilities />
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
