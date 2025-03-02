import { Link } from "react-router-dom";

import { ChevronDown, Minus, Plus } from "lucide-react";

interface ExpenseItem {
id: string;
date: string;
category: string;
icon: string;
amount: number;
type: "expense" | "income";
}

const expenses: ExpenseItem[] = [
{
id: "1",
date: "SATURDAY, 25 JAN",
category: "Food",
icon: "🍽️",
amount: -70,
type: "expense",
},
{
id: "2",
date: "SATURDAY, 25 JAN",
category: "Clothes",
icon: "👕",
amount: -250,
type: "expense",
},
{
id: "3",
date: "SATURDAY, 25 JAN",
category: "Rent",
icon: "🏠",
amount: -250,
type: "expense",
},
{
id: "4",
date: "SATURDAY, 25 JAN",
category: "Salary",
icon: "💰",
amount: 3800,
type: "income",
},
{
id: "5",
date: "SATURDAY, 25 JAN",
category: "Housing",
icon: "🏘️",
amount: -850,
type: "expense",
},
];

const iconColors = {
Food: "bg-cyan-100",
Clothes: "bg-yellow-100",
Rent: "bg-pink-100",
Salary: "bg-green-100",
Housing: "bg-rose-100",
};

const Expenses = () => {
let currentDate = "";
const totalIncome = 31563;
const totalExpense = 16372;
const totalBalance = totalIncome - totalExpense;
const progressPercentage = (totalIncome / (totalIncome + totalExpense)) \* 100;

return (

<div className="px-12 py-4">
<div>
<h1 className="text-center text-2xl font-bold">Expenses Center</h1>
<div className="flex justify-center">
<p className="text-center text-base md:text-xl">
Track and manage all property-related expenses in one place. Easily
record maintenance costs, utilities, and other expenditures to stay
organized and maintain a clear financial overview.
</p>
</div>
</div>
<div className="flex items-center justify-center my-6 gap-3">
<div className="flex items-center justify-center">
<input
            type="search"
            name="search"
            id="search"
            placeholder="Search for an Expense"
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
          to={"/addexpense"}
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
          <p className="whitespace-nowrap">Add Expense</p>
        </Link>
      </div>

      {/* Balance Section */}
      <div className=" w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl mx-auto shadow-sm font-sans px-4 sm:px-6 pb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Balance</h2>
          <button className="text-violet-500 text-sm font-medium">
            SEE MORE
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-amber-400 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-purple-600 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Income and Expense */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Plus className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">INCOME</div>
              <div className="text-lg font-semibold">
                {totalIncome.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <Minus className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">EXPENSE</div>
              <div className="text-lg font-semibold">
                {totalExpense.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl  mx-auto bg-white rounded-xl shadow-sm font-sans">
        {expenses.map((expense, index) => {
          const showDate = currentDate !== expense.date;
          if (showDate) {
            currentDate = expense.date;
          }

          return (
            <div key={expense.id}>
              {showDate && (
                <div className="px-4 sm:px-6 py-4 text-sm sm:text-base text-gray-500 flex justify-between items-center">
                  <span>
                    <span>
                      {new Date(expense.date)
                        .toLocaleString("en-US", {
                          weekday: "long",
                          day: "numeric",
                          month: "short",
                        })
                        .toUpperCase()}
                    </span>
                  </span>

                  {expense.type === "expense" && (
                    <span>
                      {expense.amount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "EUR",
                        minimumFractionDigits: 0,
                      })}
                    </span>
                  )}
                </div>
              )}
              <hr className="border-gray-200" />
              <div className="flex items-center px-4 sm:px-6 py-4 hover:bg-gray-50 group transition-colors">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    iconColors[expense.category as keyof typeof iconColors]
                  }`}
                >
                  <span className="text-lg sm:text-xl">{expense.icon}</span>
                </div>
                <div className="ml-4 sm:ml-6 flex-grow">
                  <span className="text-gray-900 text-base sm:text-lg block">
                    {expense.category}
                  </span>
                  <span className="text-gray-500 text-xs">{expense.date}</span>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <span
                    className={`${
                      expense.type === "income"
                        ? "text-green-500"
                        : "text-gray-900"
                    } text-base sm:text-lg`}
                  >
                    {expense.amount.toLocaleString("en-US", {
                      style: "currency",
                      currency: "EUR",
                      minimumFractionDigits: 0,
                      signDisplay: "always",
                    })}
                  </span>
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </div>
              {index < expenses.length - 1 && (
                <hr className="border-gray-200" />
              )}
            </div>
          );
        })}
      </div>
    </div>

);
};

export default Expenses;

("use client");
import { useState, useEffect } from "react";
import { ChevronDown, Plus, Minus, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "../axiosConfig";

interface IExpense {
\_id: string;
property: {
\_id: string;
name: string;
};
renter: {
\_id: string;
name: string;
};
type: string;
amount: number;
date: string;
description?: string;
}

export default function ExpenseList() {
const [expenses, setExpenses] = useState<IExpense[]>([]);
const [totalBalance, setTotalBalance] = useState(0);
const [totalExpenses, setTotalExpenses] = useState(0);
const [expandedExpense, setExpandedExpense] = useState<string | null>(null);

useEffect(() => {
// Fetch expenses from your API using Axios
const fetchExpenses = async () => {
try {
const response = await axios.get("/api/admin/expenses");
const data = response.data;
setExpenses(data);

        // Calculate total expenses
        const total = data.reduce(
          (sum: number, expense: IExpense) => sum + expense.amount,
          0
        );
        setTotalExpenses(total);

        // For demo purposes, let's set a fixed total balance
        setTotalBalance(50000);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();

}, []);

const toggleExpand = (id: string) => {
setExpandedExpense(expandedExpense === id ? null : id);
};

const progressPercentage =
(totalBalance / (totalBalance + totalExpenses)) \* 100;

return (

<div className="px-12 py-4">
<div>
<h1 className="text-center text-2xl font-bold">Expenses Center</h1>
<div className="flex justify-center">
<p className="text-center text-base md:text-xl">
Track and manage all property-related expenses in one place. Easily
record maintenance costs, utilities, and other expenditures to stay
organized and maintain a clear financial overview.
</p>
</div>
</div>
<div className="flex items-center justify-center my-6 gap-3">
<div className="flex items-center justify-center">
<input
            type="search"
            name="search"
            id="search"
            placeholder="Search for an Expense"
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
          to={"/addexpense"}
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
          <p className="whitespace-nowrap">Add Expense</p>
        </Link>
      </div>
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl mx-auto space-y-4">
        {/* Balance Section - Separate Card */}
        <div className="bg-white rounded-xl shadow-sm font-sans">
          <div className="px-4 sm:px-6 pt-6 pb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Balance</h2>
              <button className="text-purple-600 text-sm font-medium">
                SEE MORE
              </button>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-amber-400 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Balance and Expenses */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">BALANCE</div>
                  <div className="text-lg font-semibold">
                    {totalBalance.toLocaleString("en-US", {
                      style: "currency",
                      currency: "KES",
                      minimumFractionDigits: 0,
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <Minus className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">EXPENSES</div>
                  <div className="text-lg font-semibold">
                    {totalExpenses.toLocaleString("en-US", {
                      style: "currency",
                      currency: "KES",
                      minimumFractionDigits: 0,
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expenses List - Separate Card */}
        <div className="">
          {expenses.map((expense) => (
            <div
              key={expense._id}
              className="border-b border-gray-200 bg-white rounded-xl shadow-sm font-sans mb-4"
            >
              <div className="px-2 sm:px-6 py-3 text-sm  text-gray-500 flex justify-between items-center">
                <span>
                  <span>
                    {new Date(expense.date)
                      .toLocaleString("en-US", {
                        weekday: "long",
                        day: "numeric",
                        month: "short",
                      })
                      .toUpperCase()}
                  </span>
                </span>

                {expense.amount && (
                  <span>
                    {expense.amount.toLocaleString("en-US", {
                      style: "currency",
                      currency: "KES",
                      minimumFractionDigits: 0,
                    })}
                  </span>
                )}
              </div>
              <hr className="border-gray-200" />
              <div
                className="flex items-center px-4 sm:px-6 py-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleExpand(expense._id)}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-ful flex items-center justify-center flex-shrink-0">
                  <span className="text-lg sm:text-xl">
                    {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="size-6 min-w-6 min-h-6 text-violet-500"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
                      />
                    </svg>
                  </span>
                </div>
                <div className="ml-4 sm:ml-6 flex-grow">
                  <span className="text-gray-900 text-base block">
                    {expense.type}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {expense.property.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-gray-700 text-base sm:text-base">
                    {(-expense.amount).toLocaleString("en-US", {
                      style: "currency",
                      currency: "KES",
                      minimumFractionDigits: 0,
                      signDisplay: "always",
                    })}
                  </span>
                  {expandedExpense === expense._id ? (
                    <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  )}
                </div>
              </div>
              {expandedExpense === expense._id && (
                <div className="px-4 sm:px-6 py-4 bg-gray-50">
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <dt className="font-medium text-gray-500">Property</dt>
                      <dd className="mt-1 text-gray-900">
                        {expense.property.name}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-500">Renter</dt>
                      <dd className="mt-1 text-gray-900">
                        {expense.renter.name}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-500">Type</dt>
                      <dd className="mt-1 text-gray-900">{expense.type}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-500">Amount</dt>
                      <dd className="mt-1 text-gray-900">
                        {expense.amount.toLocaleString("en-US", {
                          style: "currency",
                          currency: "KES",
                          minimumFractionDigits: 0,
                        })}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-500">Date</dt>
                      <dd className="mt-1 text-gray-900">
                        {new Date(expense.date).toLocaleDateString()}
                      </dd>
                    </div>
                    {expense.description && (
                      <div className="col-span-2">
                        <dt className="font-medium text-gray-500">
                          Description
                        </dt>
                        <dd className="mt-1 text-gray-900">
                          {expense.description}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>

);
}

import { useContext, useEffect, useRef, useState } from "react";
import axios from "../axiosConfig";
import { showToast } from "../utils/toastUtils";
import { Store } from "../context/UserContext";
import { format } from "date-fns";

interface Rental {
\_id: string;
property: { name: string };
renter: { firstName: string; lastName: string };
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

interface PaymentSummary {
\_id: {
month: number;
year: number;
};
totalAmount: number;
}

const Dashboard = () => {
type Active = "Month" | "Year";
const [activePart, setActivePart] = useState<Active>("Month");
const [summary, setSummary] = useState({
totalRenters: 0,
totalProperties: 0,
totalEarnings: 0,
overdueCount: 0,
});
const [payments, setPayments] = useState({
earnings: 0,
pastDue: 0,
});
const [rentals, setRentals] = useState<Rental[]>([]);
const [selectedMonth, setSelectedMonth] = useState<number>(
new Date().getMonth()
); // Default: Current Month (0-based)
const [selectedYear, setSelectedYear] = useState<number>(
new Date().getFullYear()
);

const { state, dispatch } = useContext(Store);
const { userInfo } = state;

useEffect(() => {
const fetchDashboardSummary = async () => {
try {
const response = await axios.get("/api/admin/dashboard/summary");
setSummary(response.data);
} catch (error) {
console.error("Error fetching dashboard summary", error);
}
};
fetchDashboardSummary();
}, []);

useEffect(() => {
const fetchPaymentsSummary = async () => {
try {
const response = await axios.get(
`/api/admin/payments/summary?period=${activePart.toLowerCase()}&month=${
            selectedMonth + 1
          }&year=${selectedYear}`
);
setPayments(response.data);
} catch (error) {
console.log("Error fetching payment summary", error);
}
};
fetchPaymentsSummary();
}, [activePart, selectedMonth, selectedYear]);

useEffect(() => {
const fetchRentals = async () => {
try {
const response = await axios.get("/api/admin/rentals");
setRentals(response.data);
} catch (error) {
showToast("Error fetching rentals", "error");
console.error("Error fetching rentals:", error);
}
};

    fetchRentals();

}, []);

const getTitle = () => {
if (activePart === "Month") {
return `${new Date(selectedYear, selectedMonth).toLocaleString(
        "default",
        { month: "long" }
      )} Payments`;
} else {
return `${selectedYear} Payments`;
}
};

const scrollContainerRef = useRef<HTMLDivElement | null>(null); // Explicitly set the ref type

// Scroll left
const scrollLeft = () => {
if (scrollContainerRef.current) {
const scrollWidth = scrollContainerRef.current.offsetWidth; // Width of the visible scroll area
scrollContainerRef.current.scrollBy({
left: -scrollWidth - 7, // Scroll by the width of one card
behavior: "smooth",
});
}
};

// Scroll right
const scrollRight = () => {
if (scrollContainerRef.current) {
const scrollWidth = scrollContainerRef.current.offsetWidth; // Width of the visible scroll area
scrollContainerRef.current.scrollBy({
left: scrollWidth + 7, // Scroll by the width of one card
behavior: "smooth",
});
}
};

return (

<div className="px-12 py-4 bg-slate-500 min-h-screen">
<h1 className="text-2xl font-bold">
Jambo, <span className="text-violet-500">{userInfo?.name}</span>
</h1>
<div className="">
<div className="">
<div className="mt-4 bg-red-700 lg:w-2/3">
<h2 className="text-base uppercase text-gray-500 font-semibold">
Summary
</h2>

            <div className="grid grid-cols-2 w-full md:grid-cols-4 gap-0 shadow-sm h-44 bg-gray-50">
              <div className="flex flex-col items-center justify-center border border-gray-300 p-2">
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
                    d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                  />
                </svg>

                <span className="text-sm uppercase font-semibold text-violet-500">
                  Tenants
                </span>
                <span className="text-2xl font-bold mt-1">
                  {summary.totalRenters}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center border border-gray-300 p-2">
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
                    d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                  />
                </svg>
                <span className="text-sm uppercase font-semibold text-violet-500">
                  Properties
                </span>
                <span className="text-2xl font-bold mt-1">
                  {summary.totalProperties}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center border border-gray-300 p-2">
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
                    d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
                  />
                </svg>

                <span className="text-sm uppercase font-semibold text-violet-500">
                  Earnings
                </span>
                <span className="text-base md:text-xl font-bold mt-1 text-green-500">
                  KES{" "}
                  {summary.totalEarnings
                    ? summary.totalEarnings.toLocaleString()
                    : "0"}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center border border-gray-300 p-2">
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
                    d="m4.5 4.5 15 15m0 0V8.25m0 11.25H8.25"
                  />
                </svg>
                <span className="text-sm uppercase font-semibold text-violet-500 whitespace-nowrap">
                  Rent Overdue
                </span>
                <span className="text-2xl font-bold mt-1">
                  {summary.overdueCount}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-24 md:mt-4 bg-blue-700 md:w-2/3">
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

              <div className="flex gap-3 mt-0">
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
                    KES {payments.earnings.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col border border-gray-300 rounded-sm w-1/2 p-4">
                  <span className="text-sm uppercase text-gray-400 font-bold">
                    PAST DUE
                  </span>
                  <span className="text-red-600 font-extrabold">
                    KES {payments.pastDue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-green-700 lg:w-2/3 ">
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
                  rentals.map((rental) => (
                    <div className="text-xxs md:text-sm uppercase bg-white border border-white-300 rounded-sm p-2 min-w-full ">
                      <div className="flex justify-between pb-1">
                        <span className=" font-bold  text-violet-500">
                          {rental.property.name}
                        </span>
                        <span className=" font-bold">
                          VALUE: KES {rental.amount}
                        </span>
                      </div>
                      <div className="flex justify-between pb-1">
                        <div className="flex">
                          <span className=" font-bold">
                            {rental.renter.firstName} {rental.renter.lastName}
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="size-5 ml-2"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
                            />
                          </svg>
                        </div>
                        <span className=" font-bold">
                          Paid:{" "}
                          <span className="text-green-600 font-extrabold">
                            KES{" "}
                            {rental.paidAmount ??
                              0 + rental.utilityPaidAmount ??
                              0}
                          </span>
                        </span>
                      </div>
                      <div className="flex justify-between pb-1 ">
                        <span className=" font-bold">
                          Monthly:{" "}
                          <span className="text-green-600 font-extrabold">
                            KES {rental.utilitiesTotal}
                          </span>
                        </span>
                        <span className=" font-bold">
                          Past Due:{" "}
                          <span className="text-red-600 font-extrabold">
                            KES {rental.dues}
                          </span>
                        </span>
                      </div>
                      <div className="flex justify-between pb-1">
                        <span className=" font-bold">
                          DATES:{" "}
                          {format(
                            new Date(rental.rentalStartDate),
                            "dd-MM-yyyy"
                          )}{" "}
                          -{" "}
                          {format(new Date(rental.rentalEndDate), "dd-MM-yyyy")}
                        </span>
                        <span className=" font-bold ">
                          Deadline:{" "}
                          <span className="text-red-600 font-extrabold">
                            {format(new Date(rental.deadline), "dd-MM-yyyy")}
                          </span>
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="flex justify-center items-center h-32 w-full">
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
        <div>hi</div>
      </div>
    </div>

);
};

export default Dashboard;

export const updateDuesForNewCycle = async () => {
try {
console.log("🔄 Running updateDuesForNewCycle...");

    // Get all rented properties that still have unpaid dues
    const rentals = await Rental.find({ status: "Rented" });

    /*  const today = new Date(); */
    const today = CURRENT_DATE;

    for (const rental of rentals) {
      let updatedDeadline = new Date(rental.deadline);
      let missedCycles = 0;

      // Check how many cycles have been missed
      while (updatedDeadline <= today) {
        missedCycles++;
        updatedDeadline = calculateDeadline(
          updatedDeadline,
          rental.rentalFrequency
        );
      }

      if (missedCycles > 0) {
        // Get the associated renter
        const renter = await Renter.findById(rental.renter);
        if (!renter) continue; // Skip if renter not found

        if (rental.dues === 0) {
          // ✅ Renter paid last cycle in full → Reset dues & mark as "Pending"
          rental.dues = rental.amount + rental.utilitiesTotal;
          renter.paymentStatus = "Pending";
        } else {
          // ❌ Renter did NOT pay in full → Increase dues
          const expectedDues =
            (rental.amount + rental.utilitiesTotal) * missedCycles;
          if (rental.dues < expectedDues) {
            rental.dues = expectedDues; // Ensure dues reflect missed cycles correctly
          }
          renter.paymentStatus = "Overdue";
        }

        // Update deadline to the next valid cycle
        rental.deadline = updatedDeadline;

        // Save updates
        await rental.save();
        await renter.save();

        console.log(
          `✅ Rental ${rental._id} updated: Dues = ${rental.dues}, Status = ${renter.paymentStatus}, New Deadline = ${rental.deadline}`
        );
      }
    }

    console.log("✅ Dues updated for new cycle.");
    setCurrentDate("2025-04-26");

} catch (error) {
console.error("❌ Error updating dues:", error);
}
};

export const addPayment = async (req: Request, res: Response) => {
try {
const { rentalId } = req.params;
const { amount, date, isLateFee, description } = req.body;

    // Step 1: Find rental and renter
    const rental = await Rental.findById(rentalId).populate<{
      renter: IRenter;
    }>("renter");

    if (!rental) {
      res.status(404).json({ message: "Rental not found" });
      return;
    }

    const renter = rental.renter;
    if (!renter) {
      res.status(404).json({ message: "Renter not found" });
      return;
    }

    const paymentDate = new Date(date);

    // Step 2: Save Payment
    const newPayment = new Payment({
      rental: rentalId,
      amount,
      date: paymentDate,
      isLateFee,
      description,
    });

    await newPayment.save();

    // 🔍 Step 3: Calculate missed cycles (same logic as updateDuesForNewCycle)
    let updatedDeadline = new Date(rental.deadline);
    let missedCycles = 0;
    const today = new Date();

    while (updatedDeadline <= today) {
      missedCycles++;
      updatedDeadline = calculateDeadline(
        updatedDeadline,
        rental.rentalFrequency
      );
    }

    // Ensure dues reflect missed cycles correctly
    const expectedDues = (rental.amount + rental.utilitiesTotal) * missedCycles;
    if (rental.dues < expectedDues) {
      rental.dues = expectedDues;
    }

    // Step 4: Deduct payment from existing dues
    rental.paidAmount += amount;
    rental.dues = Math.max(rental.dues - amount, 0);
    // Ensure dues don't go negative

    // Step 5: Update renter's payment status
    if (rental.dues === 0) {
      renter.paymentStatus = "Paid"; // Fully paid
    } else if (rental.paidAmount > 0) {
      renter.paymentStatus = "Partially Paid"; // Partial payment
    } else {
      renter.paymentStatus = "Overdue"; // Still overdue if dues remain
    }

    // Step 6: Save updates
    rental.payments.push({ amount, date: paymentDate, isLateFee, description });
    await rental.save();
    await renter.save();

    res.status(200).json({ message: "Payment added successfully", rental });

} catch (error) {
console.error("Error adding payment:", error);
res.status(500).json({ message: "Error adding payment", error });
}
};
