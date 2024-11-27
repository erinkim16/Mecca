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
  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <div key={comment.id} className="comment-thread">
          <CommentItem
            comment={comment}
            onReply={onReply}
            onRate={onRate}
            onReport={onReport}
            onRemoveVote={onRemoveVote}
          />
        </div>
      ))}
    </div>
  );
};

export default CommentList;
