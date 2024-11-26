// import { useState, useEffect } from "react";
// import axios from "axios";
// import ProfileCard from "@/components/profile/profilecard";
// import NavBar from "@/components/general/nav-bar";

// const ProfilePage = () => {
//   const [userData, setUserData] = useState<{
//     username: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//     avatar: number;
//   } | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const token = localStorage.getItem("accessToken");
//       if (!token) {
//         setError("User is not authenticated.");
//         setLoading(false);
//         return;
//       }
//       const userId = localStorage.getItem("userId");

//       try {
//         const response = await axios.get(`/api/user/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUserData(response.data);
//       } catch (err) {
//         console.error("Error fetching user data:", err);
//         setError("Failed to fetch user data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>{error}</p>;
//   }

//   return (
//     <div>
//       <NavBar />
//       <h1>Profile</h1>
//       {userData ? (
//         <ProfileCard user={userData} />
//       ) : (
//         <p>No user data available.</p>
//       )}
//       <style jsx>{`
//         h1 {
//           margin-bottom: 20px;
//           font-size: 2rem;
//           text-align: center;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ProfilePage;

import { useState, useEffect } from "react";
import ProfileCard from "@/components/profile/profilecard";
import NavBar from "@/components/general/nav-bar";
import { authenticatedFetch } from "@/utils/account/api"; // Import your authenticatedFetch function
import { useRouter } from "next/router";

const ProfilePage = () => {
  const [userData, setUserData] = useState<{
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setError("User ID not found.");
        setLoading(false);
        router.push("/login-page");
        return;
      }

      try {
        const response = await authenticatedFetch(`/api/user/${userId}`);
        setUserData(response.data); // Assuming response.data contains user data
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
        router.push("/login-page");
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <NavBar />
      <h1>Profile</h1>
      {userData ? (
        <ProfileCard user={userData} />
      ) : (
        <p>No user data available.</p>
      )}
      <style jsx>{`
        h1 {
          margin-bottom: 20px;
          font-size: 2rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
