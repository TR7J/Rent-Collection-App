import { useState } from "react";

interface SignUpFormProps {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  role: string;
  setRole: (value: string) => void;
  handleSignUp: (e: React.SyntheticEvent) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  role,
  setRole,
  handleSignUp,
}) => {
  const [showPassword, setShowPassword] = useState(true);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="bg-white px-10 py-16 rounded-3xl border-2 border-gray-200">
      <h1 className="text-5xl font-semibold mr-28">Hi There</h1>
      <p className="text-lg font-medium text-gray-500 mt-4">
        Create a New Account
      </p>

      <form onSubmit={handleSignUp}>
        <div>
          <label htmlFor="name" className="text-lg font-medium">
            Name
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 mt-1 border-gray-100 border-2 rounded-xl bg-transparent"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="text-lg font-medium">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 mt-1 border-gray-100 border-2 rounded-xl bg-transparent"
            required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 mt-1 border-2 border-gray-100 rounded-xl bg-transparent"
              required
            />
            <button
              type="button"
              className="absolute right-4 top-1/3"
              onClick={togglePasswordVisibility}
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

        <div>
          <label htmlFor="role" className="text-lg font-medium">
            Role
          </label>
          <select
            id="role"
            className="w-full p-4 mt-1 border-gray-100 border-2 rounded-xl bg-transparent"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="Admin">Admin</option>
            <option value="Supervisor">Supervisor</option>
          </select>
        </div>

        <div className="mt-8 flex flex-col gap-y-4">
          <button
            type="submit"
            className="bg-violet-500 text-white text-lg font-bold py-3 rounded-xl active:scale-[0.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
