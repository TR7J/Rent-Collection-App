import { useState } from "react";

interface SignInFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  handleSignIn: (e: React.SyntheticEvent) => void;
}

const Form: React.FC<SignInFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  handleSignIn,
}) => {
  const [showPassword, setShowPassword] = useState(true);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleContact = () => {
    const message =
      "Hi. I would like to purchase an account to access the app. Kindly inform me of the price details.";

    // Open WhatsApp
    window.open(`https://wa.me/+254720477826?text=${message}`, "_blank");
  };

  return (
    <div className="bg-white px-10 py-16 rounded-3xl border-2 border-gray-200">
      <h1 className="text-5xl font-semibold">Welcome Back</h1>
      <p className="text-lg font-medium text-gray-500 mt-4">
        Sign In to the Rent App
      </p>

      <form onSubmit={handleSignIn}>
        <div>
          <label htmlFor="email" className="text-lg font-medium">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            id="email"
            className="w-full p-4 mt-1 border-gray-100 border-2 rounded-xl bg-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="text-lg font-medium">
            Password
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? "password" : "text"}
              placeholder="Enter your password"
              id="password"
              className="w-full p-4 mt-1 border-2 border-gray-100 rounded-xl bg-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="absolute right-4 top-1/3"
              onClick={togglePasswordVisibility}
              type="button"
            >
              {showPassword ? (
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
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              ) : (
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
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-y-4">
          <button
            type="submit"
            className="bg-violet-500 text-white text-lg font-bold py-3 rounded-xl active:scale-[0.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out"
          >
            Sign In
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 border-gray-100 border-2 bg-transparent py-3 rounded-xl font-bold text-lg active:scale-[0.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out"
            onClick={() => handleContact()}
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
                d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
              />
            </svg>
            Purchase Account
          </button>
        </div>
      </form>

      <div className="mt-8 flex items-center justify-center">
        <p className="font-medium text-base">Don't have an account?</p>
        <button
          type="button"
          className="text-violet-500 text-base font-medium ml-1"
          onClick={() => handleContact()}
        >
          Contact here
        </button>
      </div>
    </div>
  );
};

export default Form;
