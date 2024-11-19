import React from "react";
import CommentItem from "./comment-item";

// do I really need to show the blog id?
interface Comment {
    id: number;
    text: string;
    author: string;
    replies?: Comment[];
}

interface CommentListProps {
    comments: Comment[];
    onReply: (text: string, parentId: number) => void; 
}

const CommentList: React.FC<CommentListProps> = ({ comments, onReply }) => {
    return (
        <div className="comment-list">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} onReply={onReply} />
      ))}
    </div>
    );
};

export default CommentList;