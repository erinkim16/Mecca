import React from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    // Remove tokens from cookies
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      style={{ marginTop: "20px", background: "red", color: "white" }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
