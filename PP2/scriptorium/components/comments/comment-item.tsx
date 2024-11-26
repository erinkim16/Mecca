import React, { useState } from "react";
import ReportModal from "../general/reports";

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
  onEdit: (id: number, text: string) => void;
  onHide: (id: number) => void;
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

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply, onRate }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleUpvote = async () => {
    const token = validateToken();
    if (!token) return;

    console.log("upvote");

    setIsActionLoading(true);
    try {
      await onRate(comment.id, 1); // +1 for upvote
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
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReportSubmit = async (reason: string, explanation: string) => {
    const token = validateToken();
    if (!token) return;

    setIsActionLoading(true);
    try {
      const response = await fetch(`/api/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetId: comment.id,
          targetType: "Comment",
          reason,
          explanation,
        }),
      });

      if (response.ok) {
        alert("Your report has been submitted. Thank you!");
      } else {
        const error = await response.json();
        alert(`Failed to submit report: ${error.error}`);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("An error occurred while submitting your report.");
    } finally {
      setIsActionLoading(false);
      setReportModalOpen(false);
    }
  };

  return (
    <div className="comment-item">
      <p>
        <strong>{comment.author.username}</strong>: {comment.content}
      </p>
      <div className="comment-actions">
        <button onClick={handleUpvote} disabled={isActionLoading}>
          👍 Upvote
        </button>
        <span>{comment.rating}</span>
        <button onClick={handleDownvote} disabled={isActionLoading}>
          👎 Downvote
        </button>
        <button onClick={() => setIsReplying(!isReplying)} disabled={isActionLoading}>
          Reply
        </button>
        <button onClick={() => setReportModalOpen(true)} disabled={isActionLoading}>
          Report
        </button>
      </div>
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
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onSubmit={handleReportSubmit}
        targetType="Comment"
      />
    </div>
  );
};

export default CommentItem;
