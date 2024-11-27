import React, { useState, useEffect } from "react";
import axios from "axios";

interface BlogPost {
  id: number;
  title: string;
  tags: string[];
  content: string; // Stored as JSON
  author: { id: number; username: string };
  createdAt: string;
  rating: number;
  userVote?: number; // Added votes property
}

interface BlogPostViewProps {
  blog: BlogPost;
  onEdit: () => void;
  onDelete: () => void;
  onRate: (id: number, rating: number) => void;
  onRemoveVote: (id: number) => void;
  onReport: (id: number, reason: string) => void;
}
  
const validateToken = (): string | null => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("Please log in to perform this action.");
    return null;
  }
  return token;
};

const BlogPostView: React.FC<BlogPostViewProps> = ({ blog, onEdit, onDelete, onRate, onRemoveVote, onReport }) => {
  const { id, title, tags, content, author, createdAt, userVote } = blog;
  const [userId, setUserId] = useState<number | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportText, setReportText] = useState("");

  const formattedDate = new Date(createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

 const handleVote = async (vote: number) => {
    const token = validateToken();
    if (!token) return;

    if (isActionLoading) return; // Prevent concurrent actions

    setIsActionLoading(true);
    
    try {
      if (userVote === vote) {
        await onRemoveVote(id); // Remove the vote if it's the same as the current vote
      } else {
        await onRate(id, vote); // Otherwise, cast the vote
      }
    } catch (error) {
      console.error(`Error handling vote for blog ID: ${id}`, error);
      alert("Failed to process your vote. Please try again.");
    } finally {
      setIsActionLoading(false);
    }
  };


  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = validateToken();
    if (!token) return;

    if (!reportText.trim()) {
      alert("Please provide a reason for your report.");
      return;
    }

    setIsActionLoading(true);
    try {
      await onReport(id, reportText);
      alert("Thank you for your report. We will review it shortly.");
      setReportText("");
      setIsReporting(false);
    } catch (error) {
      console.error(`Error reporting blog ID: ${id}`, error);
      alert("Failed to submit the report. Please try again.");
    } finally {
      setIsActionLoading(false);
    }
  };

  
  const isAuthor = userId === blog.author.id;
  const renderContent = () => {
    try {
      const parsedContent = JSON.parse(content);
      return parsedContent?.content?.map((node: { type: string; content?: any[]; attrs?: { level?: number } }, index: number) => {
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
      <div className="rating">
      <span className="rating-label">Rating:</span>
      <span className="rating-value">{blog.rating}</span>
      </div>
      <div className="content">{renderContent()}</div>
      <div className="vote-actions">
        <button
          onClick={() => handleVote(1)}
          disabled={isActionLoading}
          className={userVote === 1 ? "active" : ""}
        >
          👍 Upvote
        </button>
        <button
          onClick={() => handleVote(-1)}
          disabled={isActionLoading}
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
  <div className="actions">
    <button
      onClick={() => setIsReporting(!isReporting)}
      disabled={isActionLoading}
    >
      Report
    </button>
  </div>
  {isReporting && (
    <form onSubmit={handleReport} className="report-form">
      <textarea
        value={reportText}
        onChange={(e) => setReportText(e.target.value)}
        placeholder="Write the reason for your report..."
        required
        disabled={isActionLoading}
      />
      <button
        type="submit"
        disabled={isActionLoading || !reportText.trim()}
      >
        Submit Report
      </button>
    </form>
  )}
</div>
  );
};

export default BlogPostView;
