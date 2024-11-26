import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from "@/utils/account/api";

const DashboardPage = () => {
  console.log("Rendering DashboardPage");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Verifying session through authenticatedFetch");
        await authenticatedFetch("/api/protected");
        console.log("Session valid, access granted");
        setIsLoading(false);
      } catch (error) {
        console.error("Authentication failed:", error);
        setIsLoading(false); // Ensure loading stops on error
        router.push("/login-page"); // Redirect to login page
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome!</h2>
        {/* Dashboard content */}
      </div>
    </div>
  );
};

export default DashboardPage;
