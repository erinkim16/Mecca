import React from "react";
import CommentItem from "./comment-item";

interface CommentListProps {
  comments?: Comment[]; // Allow undefined
  onReply: (text: string, parentId: number) => void;
  onRate: (id: number, rating: number) => void;
  onReport: (id: number, reason: string) => void;
  onRemoveVote: (id: number) => void;
}

interface Comment {
  id: number;
  content: string;
  rating: number;
  author: {
    id: number;
    username: string;
  };
  replies?: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({
  comments = [], // Default to an empty array if undefined
  onReply,
  onRate,
  onReport,
  onRemoveVote,
}) => {
  if (!Array.isArray(comments) || comments.length === 0) {
    return <p>No comments available. Be the first to comment!</p>;
  }

  // Debugging: Log comments being rendered
  console.log("Rendering CommentList with comments:", comments);

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <div key={comment.id} className="comment-thread">
          {/* Render the main comment */}
          <CommentItem
            comment={comment}
            onReply={onReply}
            onRate={onRate}
            onReport={onReport}
            onRemoveVote={onRemoveVote}
          />

          {/* Render replies recursively if they exist */}
          {Array.isArray(comment.replies) && comment.replies.length > 0 && (
            <div className="comment-replies">
              <CommentList
                comments={comment.replies} // Pass nested replies
                onReply={onReply}
                onRate={onRate}
                onReport={onReport}
                onRemoveVote={onRemoveVote}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;
