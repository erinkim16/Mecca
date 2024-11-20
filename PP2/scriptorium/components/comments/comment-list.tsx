import React from "react";
import CommentItem from "./comment-item";

interface Comment {
    id: number;
    text: string;
    author: string;
    rating: number;
    parentId?: number;
    hidden: boolean;
    replies?: Comment[];
}

interface CommentListProps {
    comments: Comment[];
    onReply: (text: string, parentId: number) => void;
    onRate: (id: number, rating: number) => void;
    onEdit: (id: number, text: string) => void;
    onHide: (id: number) => void;
  }

const CommentList: React.FC<CommentListProps> = ({ comments,
    onReply,
    onRate,
    onEdit,
    onHide, }) => {
    return (
        <div className="comment-list">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={onReply}
            onRate={onRate}
            onEdit={onEdit}
            onHide={onHide}
          />
        ))}
      </div>
    );
};

export default CommentList;