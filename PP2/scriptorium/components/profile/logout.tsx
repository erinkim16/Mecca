import React from "react";
import { useRouter } from "next/router";

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
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
