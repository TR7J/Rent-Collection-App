import { useContext, useState } from "react";
import Form from "../components/Form";
import axios from "../axiosConfig";
import { showToast } from "../utils/toastUtils";
import { useNavigate } from "react-router-dom";
import { Store, UserInfo } from "../context/UserContext";

const Authentication = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const handleSignIn = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/signIn", {
        email,
        password,
      });

      const userData: UserInfo = response.data;

      // Dispatch the USER_SIGNIN action to update the userInfo in the context
      dispatch({ type: "USER_SIGNIN", payload: userData });

      // Optionally, store userInfo in localStorage for persistence
      localStorage.setItem("userInfo", JSON.stringify(userData));

      showToast("Login Successful!", "success");
      navigate("/");
    } catch (error: any) {
      showToast("Invalid Email or Password!", "error");
      console.error("Error during signin", error.response?.data || error);
    }
  };
  return (
    <div className="flex w-full h-screen">
      <div className="w-full flex items-center justify-center lg:w-1/2">
        <Form
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleSignIn={handleSignIn}
        />
      </div>
      <div className="bg-gray-200 hidden lg:flex flex-col gap-y-4 h-full items-center justify-center w-1/2">
        <div className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-20 h-20"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
        <p className="text-violet-500 text-3xl font-semibold">
          Streamlined Rental Operations
        </p>
      </div>
    </div>
  );
};

export default Authentication;
