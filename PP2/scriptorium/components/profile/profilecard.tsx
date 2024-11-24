interface ProfileCardProps {
  user: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: number;
  };
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  const avatarUrl = `/avatars/${user.avatar}.png`;
  return (
    <div className="profile-card">
      <img
        src={avatarUrl}
        alt={`${user.username}'s avatar`}
        className="avatar"
      />
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <p>
        <strong>First Name:</strong> {user.firstName || "N/A"}
      </p>
      <p>
        <strong>Last Name:</strong> {user.lastName || "N/A"}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <style jsx>{`
        .profile-card {
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          background-color: #fff;
          text-align: center; // 중앙 정렬
        }
        .avatar {
          width: 100px; // 아바타 크기 조정
          height: 100px;
          border-radius: 50%; // 둥근 이미지
          margin-bottom: 15px; // 이미지 아래 여백
        }
        p {
          margin: 10px 0;
        }
        strong {
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default ProfileCard;
