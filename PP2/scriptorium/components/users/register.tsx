import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Register() {
  // Define state for form fields and error messages
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState(1); // default avatar ID
  const [error, setError] = useState("");
  const router = useRouter();

  // Handle registration form submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError(""); // Clear any previous error messages

    try {
      // Send registration data to the backend
      const response = await axios.post("/api/register", {
        username,
        email,
        password,
        firstName,
        lastName,
        avatar,
      });

      // On successful registration, redirect to login page
      if (response.status === 200) {
        router.push("/login");
      }
    } catch (err: any) {
      // Display error message if registration fails
      setError(
        err.response?.data?.error || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleRegister}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

        <label htmlFor="firstName">First Name (Optional)</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <label htmlFor="lastName">Last Name (Optional)</label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <label htmlFor="avatar">Avatar (1-4)</label>
        <input
          type="number"
          id="avatar"
          value={avatar}
          onChange={(e) => setAvatar(Number(e.target.value))}
          min="1"
          max="4"
        />

        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <a href="/login">Log in</a>
      </p>
    </div>
  );
}
