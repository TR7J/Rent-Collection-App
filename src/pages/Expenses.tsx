import { useState, useEffect } from "react";
import { ChevronDown, Plus, Minus, ChevronUp } from "lucide-react";
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
import { showToast } from "../utils/toastUtils";
import { useDashboard } from "../context/DashboardContext";
import { calculateBalance } from "../utils/calculateBalance";

interface IExpense {
  _id: string;
  property: {
    _id: string;
    name: string;
  };
  renter: {
    _id: string;
    firstName: string;
  };
  type: string;
  amount: number;
  date: string;
  description?: string;
}

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<IExpense[]>([]);

  const [totalExpenses, setTotalExpenses] = useState(0);
  const [earnings, setEarnings] = useState<number>(0); // New state for earnings
  const [expandedExpense, setExpandedExpense] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Use the Dashboard Context
  const { utilities, deposits } = useDashboard();

  const balance: number = calculateBalance(
    earnings,
    deposits,
    totalExpenses,
    utilities
  );

  useEffect(() => {
    // Fetch expenses and earnings
    const fetchData = async () => {
      try {
        // Fetch expenses
        const expensesResponse = await axios.get("/api/admin/expenses");
        const expensesData = expensesResponse.data;
        setExpenses(expensesData);

        // Calculate total expenses
        const totalExpenses = expensesData.reduce(
          (sum: number, expense: IExpense) => sum + expense.amount,
          0
        );
        setTotalExpenses(totalExpenses);

        // Fetch earnings
        const response = await axios.get("/api/admin/dashboard/summary");
        const { totalEarnings } = response.data;
        console.log(response.data);
        setEarnings(totalEarnings);

        // Calculate total balance
        console.log(earnings);
      } catch (error) {
        setError("Error fetching data.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedExpense(expandedExpense === id ? null : id);
  };

  const progressPercentage = (balance / (balance + totalExpenses)) * 100;

  // Group expenses by date
  const parseDate = (date: string) => {
    if (!date) {
      console.error("Empty date value");
      return null;
    }

    const parsedDate = Date.parse(date) ? new Date(date) : null;

    if (!parsedDate) {
      console.error("Invalid date:", date); // Log invalid date
      return null;
    }

    return parsedDate;
  };

  const groupedExpenses = expenses.reduce((acc, expense) => {
    const date = parseDate(expense.date);
    if (!date) return acc; // Skip if date is invalid

    const dateKey = date.toISOString().split("T")[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(expense);
    return acc;
  }, {} as { [key: string]: IExpense[] });

  const deleteExpense = async (expenseId: any) => {
    try {
      const response = await axios.delete(`/api/admin/expenses/${expenseId}`);
      if (response.status === 200) {
        showToast("Expense deleted successfully.", "success");

        //Removing deleted expense from the list
        const updatedExpenses = expenses.filter(
          (expense) => expense._id !== expenseId
        );
        setExpenses(updatedExpenses);

        // Recalculate total expenses
        const newTotalExpenses = updatedExpenses.reduce(
          (sum: number, expense: IExpense) => sum + expense.amount,
          0
        );
        setTotalExpenses(newTotalExpenses);

        // Recalculate total balance
        calculateBalance(earnings, deposits, totalExpenses, utilities);
      } else {
        showToast("Failed to delete expense", "error");
      }
    } catch (error: any) {
      showToast("Error deleting expense. Please try again", "error");
      console.error("Error deleting expense:", error);
    }
  };

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
              <button
                className="text-purple-600 text-sm font-medium"
                onClick={() => navigate("/")}
              >
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
                    {balance.toLocaleString("en-US", {
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

        {loading && <Loading />}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && expenses.length === 0 && (
          <p className="text-center">No expenses found.</p>
        )}
        {/* Expenses List - Separate Card */}
        <div className="">
          {Object.entries(groupedExpenses).map(([date, expensesOnDate]) => (
            <div
              key={date}
              className="border-b border-gray-200 bg-white rounded-xl shadow-sm font-sans mb-4"
            >
              <div className="px-4 sm:px-6 py-3 text-sm text-gray-500 flex justify-between items-center">
                <span>
                  {parseDate(date)?.toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                  }) || "Invalid Date"}
                </span>
                <span>
                  {expensesOnDate
                    .reduce((sum, expense) => sum + expense.amount, 0)
                    .toLocaleString("en-US", {
                      style: "currency",
                      currency: "KES",
                      minimumFractionDigits: 0,
                    })}
                </span>
              </div>
              <hr className="border-gray-200" />
              {expensesOnDate.map((expense) => (
                <div
                  key={expense._id}
                  onClick={() => toggleExpand(expense._id)}
                >
                  <div className="flex items-center px-4 sm:px-6 py-4 hover:bg-gray-50 cursor-pointer">
                    <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center flex-shrink-0 ">
                      <span className="text-lg sm:text-xl">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
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
                                d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              />
                            </svg>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/editexpense/${expense._id}`)
                              }
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => deleteExpense(expense._id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                        <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-violet-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-violet-500" />
                      )}
                    </div>
                  </div>
                  <hr className="border-gray-200" />

                  {expandedExpense === expense._id && (
                    <div className="flex justify-center px-4 sm:px-6 py-4 bg-gray-50 ">
                      <dl className="grid grid-cols-2 gap-x-20 md:gap-x-40 lg:gap-x-60 gap-y-2 text-sm">
                        <div>
                          <dt className="font-medium text-gray-500 ">
                            Property
                          </dt>
                          <dd className="mt-1 text-gray-900">
                            {expense.property.name || "Unknown"}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium text-gray-500">Renter</dt>
                          <dd className="mt-1 text-gray-900">
                            {expense.renter
                              ? expense.renter.firstName
                              : "No Renter"}
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
                          <div>
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
          ))}
        </div>
      </div>
    </div>
  );
}
