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

  useEffect(() => {
    const token = validateToken();
    if (token) {
      const decodedToken: any = JSON.parse(atob(token.split('.')[1]));
      setUserId(decodedToken.id);
    }
  }, []);

  const isAuthor = userId === blog.author.id;

  const renderContent = (content: any) => {
    if (!content || typeof content === "string") {
      try {
        content = JSON.parse(content);
      } catch (err) {
        console.error("Failed to parse content:", err);
        return <p>Error rendering content.</p>;
      }
    }
  
    if (!content || !content.content) {
      console.error("Invalid content structure:", content);
      return <p>No content to display.</p>;
    }
  
    const applyMarks = (text: string, marks: any[]) => {
      if (!marks) return text;
  
      return marks.reduce((acc, mark) => {
        if (mark.type === "bold") {
          return <strong>{acc}</strong>;
        }
        if (mark.type === "italic") {
          return <em>{acc}</em>;
        }
        // Add more mark types as needed
        return acc;
      }, text);
    };
  
    return content.content.map((node: any, index: number) => {
      if (node.type === "paragraph") {
        return (
          <p key={index}>
            {node.content?.map((child: any, childIndex: number) => {
              if (child.type === "text") {
                const markedText = applyMarks(child.text, child.marks);
                return <React.Fragment key={childIndex}>{markedText}</React.Fragment>;
              }
              return null;
            })}
          </p>
        );
      }
  
      console.warn("Unhandled node type:", node.type);
      return null;
    });
  };
  
  console.log("Rendered content:", blog.content);
  return (
    <div className="bg-ui-light p-6 rounded-lg shadow-lg text-foreground">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-sm mb-4">
        By <strong>{author.username}</strong> | Published on: {formattedDate}
      </p>
      <div className="tags flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-primary-light text-primary-dark px-2 py-1 rounded-full text-xs font-medium"
          >
            #{tag}
          </span>
        ))}
      </div>
      <div className="rating mb-4">
        <span className="font-semibold">Rating:</span> {blog.rating}
      </div>
      <div >{renderContent(blog.content)}</div>
      <div className="vote-actions flex items-center gap-2 mb-4">
        <button
          onClick={() => handleVote(1)}
          disabled={isActionLoading}
          className={`px-4 py-2 rounded text-sm font-medium ${
            userVote === 1 ? "bg-secondary text-white" : "bg-primary text-black"
          }`}
        >
          👍 Upvote
        </button>
        <button
          onClick={() => handleVote(-1)}
          disabled={isActionLoading}
          className={`px-4 py-2 rounded text-sm font-medium ${
            userVote === -1
              ? "bg-secondary text-white"
              : "bg-primary text-black"
          }`}
        >
          👎 Downvote
        </button>
      </div>
      <div className="author-actions flex gap-4">
  {isAuthor && onEdit && (
    <button
      onClick={onEdit}
      className="bg-accent text-white px-4 py-2 rounded"
    >
      Edit
    </button>
  )}
  {isAuthor && onDelete && (
    <button
      onClick={onDelete}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Delete
    </button>
  )}
  <button
    onClick={() => setIsReporting(!isReporting)}
    className="bg-secondary-light text-secondary-dark px-4 py-2 rounded"
  >
    Report
  </button>
</div>
      {isReporting && (
        <form onSubmit={handleReport} className="mt-4">
          <textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="Write the reason for your report..."
            required
            disabled={isActionLoading}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-secondary-dark text-white px-4 py-2 rounded mt-2"
          >
            Submit Report
          </button>
        </form>
      )}
    </div>
  );
};

export default BlogPostView;
