import { useState } from "react";
import axios from "axios";

interface ProfileEditFormProps {
  userId: string;
  currentAvatar: number | null;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ userId }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");

      await axios.put(
        `/api/user/${userId}`,
        { ...formData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Profile"}
      </button>
      {message && <p>{message}</p>}

      <style jsx>{`
        .form-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
        }
        input {
          width: 100%;
          padding: 8px;
        }
        button {
          margin-top: 15px;
          padding: 10px 20px;
          background-color: #0070f3;
          color: white;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </form>
  );
};

export default ProfileEditForm;
