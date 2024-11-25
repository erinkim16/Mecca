import React, { useState } from "react";
import { login } from "@/utils/account/api";
// import { useNavigate } from "react-router-dom";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // const navigate = useNavigate();
  const router = useRouter();

  // const handleSubmitClick = () => {
  //   console.log("Button clicked");
  // };

  const handleLogin = async (e: React.FormEvent) => {
    console.log("Form submission triggered");

    e.preventDefault();
    console.log("Form submitted with:", { username, password }); // Add this
    console.log("Default prevented");

    try {
      console.log("Starting login process...");
      const response = await login({ username, password });
      console.log("Login response:", response); // Add this to see the full response

      // Check if response.data exists
      // if (!response?.data) {
      //   console.error("No data in response:", response);
      //   throw new Error("Invalid response format");
      // }

      const { payload, accessToken, refreshToken } = response;

      // Verify tokens exist
      if (!accessToken || !refreshToken) {
        console.error("Missing tokens in response:", response);
        throw new Error("Missing authentication tokens");
      }

      const userId: number = payload.id;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", userId.toString());
      // Save tokens in cookies
      // Cookies.set("accessToken", accessToken, { secure: true });
      // Cookies.set("refreshToken", refreshToken, { secure: true });
      Cookies.set("accessToken", accessToken, {
        secure: true, // Only transmit over HTTPS
        sameSite: "strict", // Prevent CSRF
        path: "/", // Ensure the cookie is accessible site-wide
      });
      Cookies.set("refreshToken", refreshToken, {
        secure: true,
        sameSite: "strict",
        path: "/",
      });

      console.log("Tokens stored, redirecting...");

      // navigate("/dashboard"); // Replace with your target page
      router.push("/execution");
    } catch (err: any) {
      console.error("Login error details:", err); // Add detailed error logging
      setError(err.response?.data?.message || "Login failedddd");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
