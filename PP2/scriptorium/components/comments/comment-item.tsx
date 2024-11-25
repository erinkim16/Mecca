import React, { useState } from "react";
import ReportModal from "../general/reports";

interface Comment {
  id: number;
  text: string;
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

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply, onRate }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isReportModalOpen, setReportModalOpen] = useState(false);

  const handleUpvote = () => onRate(comment.id, 1); // +1 for upvote
  const handleDownvote = () => onRate(comment.id, -1); // -1 for downvote

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReply(replyText, comment.id);
    setReplyText("");
    setIsReplying(false);
  };

  const handleReportSubmit = async (reason: string, explanation: string) => {
    try {
      const response = await fetch(`/api/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
    }

    setReportModalOpen(false);
  };

  return (
    <div className="comment-item">
      <p>
        <strong>{comment.author.username}</strong>: {comment.text}
      </p>
      <div className="comment-actions">
        <button onClick={handleUpvote}>👍 Upvote</button>
        <span>{comment.rating}</span>
        <button onClick={handleDownvote}>👎 Downvote</button>
        <button onClick={() => setIsReplying(!isReplying)}>Reply</button>
        <button onClick={() => setReportModalOpen(true)}>Report</button>
      </div>
      {isReplying && (
        <form onSubmit={handleReplySubmit} className="reply-form">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            required
          />
          <button type="submit">Submit Reply</button>
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
