// import React, { useState } from "react";
// import { login } from "@/utils/account/api";
// // import { useNavigate } from "react-router-dom";
// import { useRouter } from "next/router";
// import Cookies from "js-cookie";

// const LoginForm: React.FC = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   // const navigate = useNavigate();
//   const router = useRouter();

//   // const handleSubmitClick = () => {
//   //   console.log("Button clicked");
//   // };

//   const handleLogin = async (e: React.FormEvent) => {
//     console.log("Form submission triggered");

//     e.preventDefault();
//     console.log("Form submitted with:", { username, password }); // Add this
//     console.log("Default prevented");

//     try {
//       console.log("Starting login process...");
//       const response = await login({ username, password });
//       console.log("Login response:", response); // Add this to see the full response

//       // Check if response.data exists
//       // if (!response?.data) {
//       //   console.error("No data in response:", response);
//       //   throw new Error("Invalid response format");
//       // }

//       const { payload, accessToken, refreshToken } = response;

//       // Verify tokens exist
//       if (!accessToken || !refreshToken) {
//         console.error("Missing tokens in response:", response);
//         throw new Error("Missing authentication tokens");
//       }

//       const userId: number = payload.id;
//       localStorage.setItem("accessToken", accessToken);
//       localStorage.setItem("refreshToken", refreshToken);
//       localStorage.setItem("userId", userId.toString());
//       // Save tokens in cookies
//       // Cookies.set("accessToken", accessToken, { secure: true });
//       // Cookies.set("refreshToken", refreshToken, { secure: true });
//       Cookies.set("accessToken", accessToken, {
//         secure: true, // Only transmit over HTTPS
//         sameSite: "strict", // Prevent CSRF
//         path: "/", // Ensure the cookie is accessible site-wide
//       });
//       Cookies.set("refreshToken", refreshToken, {
//         secure: true,
//         sameSite: "strict",
//         path: "/",
//       });

//       console.log("Tokens stored, redirecting...");

//       // navigate("/dashboard"); // Replace with your target page
//       router.push("/execution");
//     } catch (err: any) {
//       console.error("Login error details:", err); // Add detailed error logging
//       setError(err.response?.data?.message || "Login failedddd");
//     }
//   };

//   return (
//     <form onSubmit={handleLogin}>
//       <h2>Login</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <div>
//         <label>Username:</label>
//         <input
//           type="text"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//       </div>
//       <div>
//         <label>Password:</label>
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//       </div>
//       <button type="submit">Login</button>
//     </form>
//   );
// };

// export default LoginForm;

import React, { useState } from "react";
import { login } from "@/utils/account/api";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
);

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
    />
  </svg>
);

const AlertIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 mr-2 text-red-600"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
    />
  </svg>
);

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const handleContinueAsGuest = () => {
      router.push("/execution"); // Replace with your guest entry point
    };
    try {
      const response = await login({ username, password });
      const { payload, accessToken, refreshToken } = response;

      if (!accessToken || !refreshToken) {
        throw new Error("Missing authentication tokens");
      }

      const userId: number = payload.id;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", userId.toString());

      Cookies.set("accessToken", accessToken, {
        secure: true,
        sameSite: "strict",
        path: "/",
      });
      Cookies.set("refreshToken", refreshToken, {
        secure: true,
        sameSite: "strict",
        path: "/",
      });

      router.push("/execution");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to continue</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4 flex items-center">
            <AlertIcon />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-gray-700 font-medium mb-2"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:accentDark"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:accentDark"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-lg bg-accent hover:bg-accentDark text-white font-semibold transition duration-300 ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:accentDark"
              }`}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Continue as guest?{" "}
                <a
                  href="/execution"
                  className="text-accent hover:accentDark font-semibold transition duration-300"
                >
                  home page
                </a>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
