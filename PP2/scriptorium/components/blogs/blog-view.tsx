import React, { useState, useEffect } from "react";
import axios from "axios";

interface BlogPost {
  id: number;
  title: string;
  tags: string[];
  content: string; // Stored as JSON
  author: { id: number; username: string };
  createdAt: string;
}

interface BlogPostViewProps {
  blog: BlogPost;
  onEdit: () => void; // Callback for edit functionality
  onDelete: () => void; // Callback for delete functionality
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

const BlogPostView: React.FC<BlogPostViewProps> = ({
  blog,
  onEdit,
  onDelete,
}) => {
  const { title, tags, content, author, createdAt } = blog;
  const [userId, setUserId] = useState<number | null>(null);

  const fetchAndSetUserId = async () => {
    const id = await fetchUserData();
    setUserId(id);
    console.log("Current User ID:", id);
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

  // Parse JSON content and render
  const renderContent = () => {
    try {
      const parsedContent = JSON.parse(content); // Parse content JSON
      return parsedContent?.content?.map((node: any, index: number) => {
        if (node.type === "paragraph") {
          return (
            <p key={index}>
              {node.content?.map((child: any, childIndex: number) => {
                if (child.type === "text") {
                  let textElement = <span key={childIndex}>{child.text}</span>;

                  // Apply marks like bold or italic
                  child.marks?.forEach((mark: any) => {
                    if (mark.type === "bold") {
                      textElement = (
                        <strong key={childIndex}>{textElement}</strong>
                      );
                    }
                    if (mark.type === "italic") {
                      textElement = <em key={childIndex}>{textElement}</em>;
                    }
                  });

                  return textElement;
                }
                return null; // Handle other types of child nodes if necessary
              })}
            </p>
          );
        }

        // Handle other node types (e.g., headings, lists)
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

        return null; // Fallback for unsupported node types
      });
    } catch (err) {
      console.error("Error parsing content:", err);
      return <p>{content}</p>; // Fallback to raw content if JSON parsing fails
    }
  };
  const isAuthor = userId === blog.author.id;
  console.log("Is Author:", isAuthor);

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
