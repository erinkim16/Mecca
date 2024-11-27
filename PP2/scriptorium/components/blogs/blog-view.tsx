import React, { useState, useEffect } from "react";
import axios from "axios";

interface BlogPost {
  id: number;
  title: string;
  tags: string[];
  content: string; // Stored as JSON
  author: { id: number; username: string };
  createdAt: string;
  userVote?: number; // Added votes property
}

interface BlogPostViewProps {
  blog: BlogPost;
  onEdit: () => void;
  onDelete: () => void;
}

const fetchUserData = async (): Promise<number | null> => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return null;
  }

  const userId = localStorage.getItem("userId");

  try {
    const response = await axios.get(`/api/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return userId ? parseInt(userId, 10) : null;
  } catch (err) {
    console.error("Error fetching user data:", err);
    return null;
  }
};

const BlogPostView: React.FC<BlogPostViewProps> = ({ blog, onEdit, onDelete }) => {
  const { id, title, tags, content, author, createdAt, userVote } = blog;
  const [userId, setUserId] = useState<number | null>(null);

  const fetchAndSetUserId = async () => {
    const id = await fetchUserData();
    setUserId(id);
  };

  useEffect(() => {
    fetchAndSetUserId();
  }, []);

  const formattedDate = new Date(createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const handleVote = async (value: 1 | -1) => {
    try {
      const response = await axios.post(
        `/api/blog/${id}/rate`,
        { value },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
      );
      setCurrentVotes(response.data.updatedVotes);
    } catch (err) {
      console.error("Error updating votes:", err);
    }
  };

  const isAuthor = userId === blog.author.id;

  const renderContent = () => {
    try {
      const parsedContent = JSON.parse(content);
      return parsedContent?.content?.map((node: any, index: number) => {
        if (node.type === "paragraph") {
          return (
            <p key={index}>
              {node.content?.map((child: any, childIndex: number) => {
                if (child.type === "text") {
                  let textElement = <span key={childIndex}>{child.text}</span>;

                  child.marks?.forEach((mark: any) => {
                    if (mark.type === "bold") {
                      textElement = <strong key={childIndex}>{textElement}</strong>;
                    }
                    if (mark.type === "italic") {
                      textElement = <em key={childIndex}>{textElement}</em>;
                    }
                  });

                  return textElement;
                }
                return null;
              })}
            </p>
          );
        }

        if (node.type === "heading") {
          const HeadingTag = `h${node.attrs?.level || 1}`;
          return React.createElement(
            HeadingTag,
            { key: index },
            node.content?.map((child: any, childIndex: number) => {
              if (child.type === "text") {
                return child.text;
              }
              return null;
            })
          );
        }

        return null;
      });
    } catch (err) {
      console.error("Error parsing content:", err);
      return <p>{content}</p>;
    }
  };

  return (
    <div className="blog-post">
      <h1>{title}</h1>
      <p className="meta-info">
        By <strong>{author.username}</strong> | Published on: {formattedDate}
      </p>
      <div className="tags">
        {tags.map((tag, index) => (
          <span key={index} className="tag">
            #{tag}
          </span>
        ))}
      </div>
      <div className="content">{renderContent()}</div>
      <div className="vote-actions">
      <button
          onClick={() => handleVote(1)}
          className={blog.userVote === 1 ? "active" : ""}
        >
          👍 Upvote
        </button>
        <button
          onClick={() => handleVote(-1)}
          className={blog.userVote === -1 ? "active" : ""}
        >
          👎 Downvote
        </button>
      </div>
      {isAuthor && (
        <div className="author-actions">
          <button onClick={onEdit} className="edit-button">
            Edit
          </button>
          <button onClick={onDelete} className="delete-button">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogPostView;
function setCurrentVotes(updatedVotes: any) {
  throw new Error("Function not implemented.");
}

