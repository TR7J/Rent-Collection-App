import { useContext, useEffect, useRef, useState } from "react";
import { useDashboard } from "../context/DashboardContext"; // Import the context
import { Store } from "../context/UserContext";
import { format } from "date-fns";
import axios from "../axiosConfig";
import { showToast } from "../utils/toastUtils";

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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import Payments from "./Payments";
import Utilities from "./Utilities";

const Dashboard = () => {
  type Active = "Month" | "Year";
  const [activePart, setActivePart] = useState<Active>("Month");
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
    overdueCount,
    earnings,
    expenses,
    utilities,
    overdues,
    deposits,
    paymentsEarnings,
    paymentsPastDue,
    rentals,
    fetchPaymentsSummary,
  } = useDashboard();

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
  const total = [earnings, expenses, utilities, overdues, deposits].reduce(
    (sum, value) => sum + value,
    0
  );

  // Pie chart data
  const data = [
    { name: "Earnings", value: earnings, color: "#4F46E5" },
    { name: "Expenses", value: expenses, color: "#EF4444" },
    { name: "Utilities", value: utilities, color: "#10B981" },
    { name: "Overdues", value: overdues, color: "#F59E0B" },
    { name: "Deposits", value: deposits, color: "#6366F1" },
  ];

  return (
    <div className="px-3 md:px-12 py-4 min-h-screen">
      <h1 className="text-3xl font-bold mt-2">
        Jambo, <span className="text-violet-500">{userInfo?.name}</span>
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        <div className="lg:col-span-2">
          <div>
            <h2 className="text-base uppercase text-gray-500 font-semibold">
              Summary
            </h2>

            <div className="grid grid-cols-2 w-full md:grid-cols-4 gap-0 shadow-sm h-44 bg-gray-50">
              <div className="flex flex-col items-center justify-center border border-gray-300 p-2">
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
                <span className="text-2xl font-bold mt-1">{totalRenters}</span>
              </div>
              <div className="flex flex-col items-center justify-center border border-gray-300 p-2">
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
                <span className="text-2xl font-bold mt-1">
                  {totalProperties}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center border border-gray-300 p-2">
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
                <span className="text-base md:text-xl font-bold mt-1 text-green-500">
                  KES {totalEarnings.toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center border border-gray-300 p-2">
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
                    d="m4.5 4.5 15 15m0 0V8.25m0 11.25H8.25"
                  />
                </svg>
                <span className="text-sm uppercase font-semibold text-violet-500 whitespace-nowrap">
                  Rent Overdue
                </span>
                <span className="text-2xl font-bold mt-1">{overdueCount}</span>
              </div>
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
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
                            />
                          </svg>
                        </div>
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
          <Card className="sm:w-full md:w-2/3 lg:w-full border border-gray-300 bg-gray-50 shadow-sm rounded-none">
            <CardHeader className="py-3">
              <CardTitle className="text-2xl font-bold text-center text-gray-800 ">
                Total breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius="60%"
                      outerRadius="100%"
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-base md:text-xl lg:text-2xl font-bold">
                      {total.toLocaleString("en-US", {
                        style: "currency",
                        currency: "KES",
                        minimumFractionDigits: 0,
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <Table className="mt-4">
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
