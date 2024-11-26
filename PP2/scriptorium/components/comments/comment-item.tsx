import React, { useState } from "react";

interface Comment {
  id: number;
  content: string;
  rating: number;
  author: {
    username: string;
  };
  replies?: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  onReply: (text: string, parentId: number) => void;
  onRate: (id: number, rating: number) => void;
  onReport: (id: number, reason: string) => void;
 // onHide: (id: number) => void;
}

const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

const validateToken = (): string | null => {
  const token = getAccessToken();
  if (!token) {
    alert("Please log in to perform this action.");
    return null;
  }
  return token;
};

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply, onRate, onReport }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportText, setReportText] = useState("");

  const handleUpvote = async () => {
    const token = validateToken();
    if (!token) return;

    setIsActionLoading(true);
    try {
      await onRate(comment.id, 1); // +1 for upvote
    } catch (error) {
      console.error("Error upvoting comment ID:", comment.id, error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDownvote = async () => {
    const token = validateToken();
    if (!token) return;

    setIsActionLoading(true);
    try {
      await onRate(comment.id, -1); // -1 for downvote
    } catch (error) {
      console.error("Error downvoting comment ID:", comment.id, error);
    } finally {
      setIsActionLoading(false);
    }
  };

  
  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = validateToken();
    if (!token) return;
    
    try{
      await onReport(comment.id, reportText);
      setReportText("");
      setIsReporting(false);
    } catch (error) {
      console.error("Error submitting report for:", comment.id)
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = validateToken();
    if (!token) return;

    if (!replyText.trim()) {
      alert("Reply cannot be empty.");
      return;
    }

    setIsActionLoading(true);
    try {
      await onReply(replyText.trim(), comment.id);
      setReplyText("");
      setIsReplying(false);
    } catch (error) {
      console.error("Error replying to comment ID:", comment.id, error);
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="comment-item">
      <div className="comment-header">
        <p>
          <strong>{comment.author.username}</strong>: {comment.content}
        </p>
        <div className="comment-rating">
          <span className="rating-label">Rating:</span>
          <span className="rating-value">{comment.rating}</span>
        </div>
      </div>
      <div className="comment-actions">
        <button onClick={handleUpvote} disabled={isActionLoading}>
          👍 Upvote
        </button>
        <button onClick={handleDownvote} disabled={isActionLoading}>
          👎 Downvote
        </button>
        <button onClick={() => setIsReplying(!isReplying)} disabled={isActionLoading}>
          Reply
        </button>
        <button onClick={() => setIsReporting(!isReporting)} disabled={isActionLoading}>
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
          <button type="submit" disabled={isActionLoading || !replyText.trim()}>
            Submit Report
          </button>
        </form>
      )

      }
      {isReplying && (
        <form onSubmit={handleReplySubmit} className="reply-form">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            required
            disabled={isActionLoading}
          />
          <button type="submit" disabled={isActionLoading || !replyText.trim()}>
            Submit Reply
          </button>
        </form>
      )}
    </div>
  );
};

export default CommentItem;
