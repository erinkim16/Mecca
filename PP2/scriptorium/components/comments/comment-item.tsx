import React, { useState } from "react";

interface Comment {
  id: number;
  content: string;
  rating: number;
  author: {
    id: number;
    username: string;
  };
  userVote?: number; // Represents the user's vote on this comment: 1 for upvote, -1 for downvote
  replies?: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  onReply: (text: string, parentId: number) => void;
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

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReply,
  onRate,
  onRemoveVote,
  onReport,
}) => {
  const { id, author, userVote } = comment;
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportText, setReportText] = useState("");

  const handleVote = async (vote: number) => {
    const token = validateToken();
    if (!token) return;

    if (isActionLoading) return; // Prevent concurrent actions

    setIsActionLoading(true);
    try {
      if (userVote === vote) {
        await onRemoveVote(id); // Remove the vote if it's the same as the current vote
      } else {
        console.log("here")
        await onRate(id, vote); // Otherwise, cast the vote
      }
    } catch (error) {
      console.error(`Error handling vote for comment ID: ${comment.id}`, error);
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
      await onReport(comment.id, reportText);
      alert("Thank you for your report. We will review it shortly.");
      setReportText("");
      setIsReporting(false);
    } catch (error) {
      console.error(`Error reporting comment ID: ${comment.id}`, error);
      alert("Failed to submit the report. Please try again.");
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
      console.error(`Error replying to comment ID: ${comment.id}`, error);
      alert("Failed to post reply. Please try again.");
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
        <button
          onClick={() => handleVote(1)}
          disabled={isActionLoading}
          className={comment.userVote === 1 ? "active" : ""}
        >
          👍 Upvote
        </button>
        <button
          onClick={() => handleVote(-1)}
          disabled={isActionLoading}
          className={comment.userVote === -1 ? "active" : ""}
        >
          👎 Downvote
        </button>
        <button
          onClick={() => setIsReplying(!isReplying)}
          disabled={isActionLoading}
        >
          Reply
        </button>
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
