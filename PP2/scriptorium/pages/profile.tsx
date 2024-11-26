import { useState, useEffect } from "react";
import ProfileEditForm from "@/components/profile/profile-form";
import AvatarSelector from "@/components/profile/avatar-selection";
import LogoutButton from "@/components/profile/logout";
import NavBar from "@/components/general/nav-bar";
import { useRouter } from "next/router";
import { authenticatedFetch } from "@/utils/account/api";

const EditProfilePage = () => {
  const [userId, setUserId] = useState<string>("");
  const [avatar, setAvatar] = useState<number | null>(null);
  console.log("Rendering edit profile page");
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
    const storedUserId = localStorage.getItem("userId");

    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavBar />
      <div className="edit-profile-page">
        <h1>Edit Profile</h1>
        <ProfileEditForm userId={userId} currentAvatar={avatar} />
        <AvatarSelector userId={userId} setAvatar={setAvatar} />
        <LogoutButton />

        <style jsx>{`
          .edit-profile-page {
            max-width: 600px;
            margin: 2vw auto;
            text-align: center;
          }
          h1 {
            margin-bottom: 20px;
          }
        `}</style>
      </div>
    </>
  );
};

export default EditProfilePage;
