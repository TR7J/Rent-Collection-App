import Authentication from "./pages/Authentication";
import { Routes, Route, Navigate } from "react-router-dom";
import Tenants from "./pages/Tenants";
import Properties from "./pages/Properties";
import Expenses from "./pages/Expenses";
import MainLayout from "./pages/MainLayout";
import Rentals from "./pages/Rentals";
import Dashboard from "./pages/Dashboard";
import AuthenticationDev from "./pages/AuthenticationDev";
import { ToastContainer } from "react-toastify";
import AddTenant from "./pages/AddTenant";
import EditTenant from "./pages/EditTenant";
import AddProperty from "./pages/AddProperty";
import PropertyDetails from "./pages/PropertyDetails";
import EditProperty from "./pages/EditProperty";
import AddRental from "./pages/AddRental";
import AddPayment from "./pages/AddPayment";
import AddUtility from "./pages/AddUtility";
import AddExpense from "./pages/AddExpense";
import EditRental from "./pages/EditRental";
import EditExpense from "./pages/EditExpense";
import RentalDetails from "./pages/RentalDetails";
import EditPayment from "./pages/EditPayment";
import EditUtility from "./pages/EditUtility";
import Payments from "./pages/Payments";
import Utilities from "./pages/Utilities";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <ToastContainer position="bottom-center" limit={5} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Authentication />} />
        <Route path="/authenticationdev" element={<AuthenticationDev />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tenants" element={<Tenants />} />
            <Route path="/addtenant" element={<AddTenant />} />
            <Route path="/edittenant/:renterId" element={<EditTenant />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/addproperty" element={<AddProperty />} />
            <Route path="/property/:propertyId" element={<PropertyDetails />} />
            <Route
              path="/editproperty/:propertyId"
              element={<EditProperty />}
            />
            <Route path="/rentals" element={<Rentals />} />
            <Route path="/addrental" element={<AddRental />} />
            <Route path="/editrental/:rentalId" element={<EditRental />} />
            <Route path="/rental/:rentalId" element={<RentalDetails />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/addpayment" element={<AddPayment />} />
            <Route path="/addpayment/:rentalId" element={<AddPayment />} />
            <Route path="/editpayment/:paymentId" element={<EditPayment />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/addexpense" element={<AddExpense />} />
            <Route path="/editexpense/:expenseId" element={<EditExpense />} />
            <Route path="/utilities" element={<Utilities />} />
            <Route path="/addutility" element={<AddUtility />} />
            <Route path="/addutility/:rentalId" element={<AddUtility />} />
            <Route path="/editutility/:utilityId" element={<EditUtility />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
