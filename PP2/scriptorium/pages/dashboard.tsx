import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from "@/utils/account/api";

const DashboardPage = () => {
  console.log("in dashboard");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verify the current session
        console.log("authenticating through middleware");
        await authenticatedFetch("/api/protected");
        setIsLoading(false);
      } catch (error) {
        router.push("/login");
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
