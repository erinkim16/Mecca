import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Handle form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent form from submitting the default way
    setError(""); // clear any previous error

    try {
      // Send login data to the backend
      const response = await axios.post("/api/login", {
        username,
        password,
      });

      // If successful, save tokens to local storage
      const { accessToken, refreshToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Redirect the user to a protected page, such as the dashboard
      router.push("/dashboard");
    } catch (err: any) {
      // Display error if login fails
      setError(
        err.response?.data?.message || "Failed to log in. Please try again."
      );
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
