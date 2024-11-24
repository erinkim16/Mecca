import { useState } from "react";
import axios from "axios";

interface AvatarSelectorProps {
  userId: string;
  setAvatar: (avatar: number) => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  userId,
  setAvatar,
}) => {
  const avatars = [1, 2, 3, 4]; // Avatar IDs as integers
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);

  const handleAvatarSelect = async (avatarId: number) => {
    setSelectedAvatar(avatarId);
    setAvatar(avatarId);

    try {
      const token = localStorage.getItem("accessToken");

      await axios.put(
        `/api/users/${userId}`,
        { avatar: avatarId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Avatar updated successfully!");
    } catch (err) {
      console.error("Failed to update avatar:", err);
    }
  };

  return (
    <div className="avatar-selector">
      <h2>Select an Avatar</h2>
      <div className="avatars">
        {avatars.map((avatarId) => (
          <img
            key={avatarId}
            src={`/avatars/${avatarId}.png`}
            alt={`Avatar ${avatarId}`}
            className={selectedAvatar === avatarId ? "selected" : ""}
            onClick={() => handleAvatarSelect(avatarId)}
          />
        ))}
      </div>

      <style jsx>{`
        .avatars {
          display: flex;
          gap: 10px;
          justify-content: center;
        }
        img {
          width: 50px;
          height: 50px;
          cursor: pointer;
          border: 2px solid transparent;
        }
        img.selected {
          border: 2px solid #0070f3;
        }
      `}</style>
    </div>
  );
};

export default AvatarSelector;
