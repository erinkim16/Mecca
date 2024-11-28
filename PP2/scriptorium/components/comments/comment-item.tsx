import React, { useEffect, useState } from "react";

interface Comment {
  id: number;
  content: string;
  ratingScore: number;
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
  const { id, author, userVote, replies, ratingScore } = comment;
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportText, setReportText] = useState("");
  const [showReplies, setShowReplies] = useState(false); // Toggle state for replies



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
    <div className="comment-item bg-lightGray dark:bg-darkGray p-4 mb-4">
      <div className="comment-header">
        <p>
          <strong>{author.username}</strong>: {comment.content}
        </p>
        <div className="comment-rating">
          <span className="rating-label font-semibold">Rating:</span>
          <span className="rating-value ml-2">{ratingScore}</span>
        </div>
      </div>
      <div className="comment-actions mt-2">
        <button
          onClick={() => handleVote(1)}
          disabled={isActionLoading}
          className={`btn ${comment.userVote === 1 ? "active" : ""}`}
        >
          👍 Upvote
        </button>
        <button
          onClick={() => handleVote(-1)}
          disabled={isActionLoading}
          className={`btn ${comment.userVote === -1 ? "active" : ""}`}
        >
          👎 Downvote
        </button>
        <button
          onClick={() => setIsReplying(!isReplying)}
          disabled={isActionLoading}
          className="btn"
        >
          Reply
        </button>
        <button
          onClick={() => setIsReporting(!isReporting)}
          disabled={isActionLoading}
          className="btn"
        >
          Report
        </button>
        {replies && replies.length > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="btn"
            disabled={isActionLoading}
          >
            {showReplies ? "Hide Replies" : `Show Replies (${replies.length})`}
          </button>
        )}
      </div>
      {isReporting && (
        <form onSubmit={handleReport} className="report-form mt-2">
          <textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="Write the reason for your report..."
            required
            disabled={isActionLoading}
            className="textarea"
          />
          <button type="submit" disabled={isActionLoading || !reportText.trim()} className="btn">
            Submit Report
          </button>
        </form>
      )}
      {isReplying && (
        <form onSubmit={handleReplySubmit} className="reply-form mt-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            required
            disabled={isActionLoading}
            className="textarea"
          />
          <button type="submit" disabled={isActionLoading || !replyText.trim()} className="btn">
            Submit Reply
          </button>
        </form>
      )}
      {showReplies && replies && (
        <div className="replies ml-6 mt-4">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onRate={onRate}
              onRemoveVote={onRemoveVote}
              onReport={onReport}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;