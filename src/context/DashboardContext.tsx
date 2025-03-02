import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "../axiosConfig";
import { showToast } from "../utils/toastUtils";

interface DashboardContextType {
  // Dashboard Summary
  totalRenters: number;
  totalProperties: number;
  totalEarnings: number;
  overdueCount: number;

  // Chart Summary
  earnings: number;
  expenses: number;
  utilities: number;
  overdues: number;
  deposits: number;

  // Payments Summary
  paymentsEarnings: number;
  paymentsPastDue: number;

  // Rentals Data
  rentals: Rental[];

  // Functions
  fetchDashboardSummary: () => Promise<void>;
  fetchChartSummary: () => Promise<void>;
  fetchPaymentsSummary: (
    period: string,
    month: number,
    year: number
  ) => Promise<void>;
  fetchRentals: () => Promise<void>;
  deletePayment: (paymentId: string) => Promise<void>;
  deleteUtility: (utilityId: string) => Promise<void>;
}

interface Rental {
  _id: string;
  property: { name: string };
  renter: { firstName: string; lastName: string };
  amount: number;
  deposit: number;
  status: "Rented" | "Past";
  rentalStartDate: string;
  rentalEndDate: string;
  paidAmount: number;
  dues: number;
  deadline: string;
  utilitiesTotal: number;
  utilityPaidAmount: number;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  // Dashboard Summary State
  const [totalRenters, setTotalRenters] = useState<number>(0);
  const [totalProperties, setTotalProperties] = useState<number>(0);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [overdueCount, setOverdueCount] = useState<number>(0);

  // Chart Summary State
  const [earnings, setEarnings] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [utilities, setUtilities] = useState<number>(0);
  const [overdues, setOverdues] = useState<number>(0);
  const [deposits, setDeposits] = useState<number>(0);

  // Payments Summary State
  const [paymentsEarnings, setPaymentsEarnings] = useState<number>(0);
  const [paymentsPastDue, setPaymentsPastDue] = useState<number>(0);

  // Rentals State
  const [rentals, setRentals] = useState<Rental[]>([]);

  // Fetch Dashboard Summary
  const fetchDashboardSummary = async () => {
    try {
      const response = await axios.get("/api/admin/dashboard/summary");
      setTotalRenters(response.data.totalRenters);
      setTotalProperties(response.data.totalProperties);
      setTotalEarnings(response.data.totalEarnings);
      setOverdueCount(response.data.overdueCount);
    } catch (error) {
      console.error("Error fetching dashboard summary", error);
    }
  };

  // Fetch Chart Summary
  const fetchChartSummary = async () => {
    try {
      const response = await axios.get("/api/admin/dashboard/chartsummary");
      setEarnings(response.data.earnings);
      setExpenses(response.data.expenses);
      setUtilities(response.data.utilities);
      setOverdues(response.data.overdues);
      setDeposits(response.data.deposits);
    } catch (error) {
      console.error("Error fetching chart summary", error);
    }
  };

  // Fetch Payments Summary
  const fetchPaymentsSummary = async (
    period: string,
    month: number,
    year: number
  ) => {
    try {
      const response = await axios.get(
        `/api/admin/payments/summary?period=${period}&month=${month}&year=${year}`
      );
      setPaymentsEarnings(response.data.earnings);
      setPaymentsPastDue(response.data.pastDue);
    } catch (error) {
      console.error("Error fetching payments summary", error);
    }
  };

  // Fetch Rentals
  const fetchRentals = async () => {
    try {
      const response = await axios.get("/api/admin/rentals");
      setRentals(response.data);
    } catch (error) {
      showToast("Error fetching rentals", "error");
      console.error("Error fetching rentals:", error);
    }
  };

  // Delete Payment
  const deletePayment = async (paymentId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this payment?"
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`/api/admin/payment/${paymentId}`);
      if (response.status === 200) {
        showToast("Payment deleted successfully", "success");
        // Update the local state to remove the deleted payment

        // Refetch all relevant data after deletion
        await fetchDashboardSummary();
        await fetchChartSummary();
        await fetchPaymentsSummary(
          "month",
          new Date().getMonth() + 1,
          new Date().getFullYear()
        );
        await fetchRentals();
      }
    } catch (error) {
      console.error("Error deleting payment", error);
      showToast("Error deleting payment. Please try again", "error");
    }
  };

  // Delete Utility
  const deleteUtility = async (utilityId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this utility?"
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`/api/admin/utility/${utilityId}`);

      if (response.status === 200) {
        showToast("Utility deleted successfully", "success");

        await fetchChartSummary();
        await fetchRentals();
      }
    } catch (error) {
      console.error("Error deleting utility", error);
      showToast("Error deleting utility. Please try again", "error");
    }
  };

  // Initial Fetch
  useEffect(() => {
    fetchDashboardSummary();
    fetchChartSummary();
    fetchPaymentsSummary(
      "month",
      new Date().getMonth() + 1,
      new Date().getFullYear()
    );
    fetchRentals();
  }, []);

  return (
    <DashboardContext.Provider
      value={{
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
        fetchDashboardSummary,
        fetchChartSummary,
        fetchPaymentsSummary,
        fetchRentals,
        deletePayment,
        deleteUtility,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
