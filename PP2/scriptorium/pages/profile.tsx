import { useState, useEffect } from "react";
import ProfileEditForm from "@/components/profile/profile-form";
import AvatarSelector from "@/components/profile/avatar-selection";
import LogoutButton from "@/components/profile/logout";
import NavBar from "@/components/general/nav-bar";

const EditProfilePage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<number | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    console.log("userid editing: ", storedUserId);
    if (storedUserId) {
      setUserId(storedUserId); // Parse userId as an integer
    }
  }, []);

  if (!userId) {
    return <p>Loading...</p>;
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
