import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Store, UserInfo } from "../context/UserContext";
import { showToast } from "../utils/toastUtils";

const Navbar = () => {
  const location = useLocation();
  const isCurrentPage = (path: string): boolean => {
    return location.pathname === path;
  };
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const signoutHandler = () => {
    dispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    showToast("Log out Successful!", "success");
    navigate("/login");
  };

  return (
    <>
      <nav className="md:text-right h-screen relative bg-slate-50 pl-9">
        <div>
          <h1 className="hidden md:block text-xl font-semibold hover:text-gray-700 text-violet-500  p-1">
            RentaHub
          </h1>
        </div>
        <ul className="mt-6 text-xs hidden md:block ">
          <li className="py-2">
            <Link
              to="/"
              className={`flex justify-end px-4 items-center ${
                isCurrentPage("/")
                  ? "border-r-4 border-violet-500"
                  : "border-r-4 border-transparent"
              }`}
            >
              <span>Home</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-6 ml-2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
            </Link>
          </li>
          <li className="py-2">
            <Link
              to="/tenants"
              className={`flex justify-end px-4 items-center ${
                isCurrentPage("/tenants")
                  ? "border-r-4 border-violet-500"
                  : "border-r-4 border-transparent"
              }`}
            >
              <span>Tenant</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-6 ml-2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </Link>
          </li>
          <li className="py-2">
            <Link
              to="/properties"
              className={`flex justify-end px-4 items-center ${
                isCurrentPage("/properties")
                  ? "border-r-4 border-violet-500"
                  : "border-r-4 border-transparent"
              }`}
            >
              <span>Property</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill: rgba(0, 0, 0, 1);transform: ;msFilter:; ml-2 min-w-6 min-h-6"
              >
                <path d="M19 2H9c-1.103 0-2 .897-2 2v6H5c-1.103 0-2 .897-2 2v9a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4c0-1.103-.897-2-2-2zM5 12h6v8H5v-8zm14 8h-6v-8c0-1.103-.897-2-2-2H9V4h10v16z"></path>
                <path d="M11 6h2v2h-2zm4 0h2v2h-2zm0 4.031h2V12h-2zM15 14h2v2h-2zm-8 .001h2v2H7z"></path>
              </svg>
            </Link>
          </li>
          <li className="py-2">
            <Link
              to="/rentals"
              className={`flex justify-end px-4 items-center ${
                isCurrentPage("/rentals")
                  ? "border-r-4 border-violet-500"
                  : "border-r-4 border-transparent"
              }`}
            >
              <span>Rentals</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-6 ml-2 "
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </Link>
          </li>
          <li className="py-2">
            <Link
              to="/expenses"
              className={`flex justify-end px-4 items-center ${
                isCurrentPage("/expenses")
                  ? "border-r-4 border-violet-500"
                  : "border-r-4 border-transparent"
              }`}
            >
              <span>Expenses</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-6 ml-2 min-w-6 min-h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
                />
              </svg>
            </Link>
          </li>

          <li className="text-base absolute bottom-0 right-0 w-full mb-2">
            <Link
              to={"/login"}
              className="md:flex justify-end px-4 items-center border-r-4 border-transparent "
              onClick={signoutHandler}
            >
              <div>
                <p className="text-violet-500 font-semibold whitespace-nowrap">
                  {userInfo?.name}
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-6 ml-2 cursor-pointer"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                />
              </svg>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
