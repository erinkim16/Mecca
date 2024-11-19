// allow users to view the comment

import React, { useState } from "react";
import CommentForm from "./add-comment";

interface Comment {
    id: number;
    text: string;
    author: string;
    parentId?: number;
    replies?: Comment[];
}

interface CommentItemProps {
    comment: Comment;
    onReply: (text: string, parentId: number) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);

    const handleReply = (text: string) => {
        onReply(text, comment.id);
        setShowReplyForm(false);
    };

    return (
        <div className="comment-item">
        <p>
          <strong>{comment.author}</strong>: {comment.text}
        </p>
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="reply-button"
        >
          Reply
        </button>
        {showReplyForm && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.elements.namedItem(
                "replyInput"
              ) as HTMLInputElement;
              handleReply(input.value);
            }}
          >
            <textarea name="replyInput" placeholder="Write your reply..." />
            <button type="submit">Submit</button>
          </form>
        )}
        {comment.replies && comment.replies.length > 0 && (
          <div className="replies">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} onReply={onReply} />
            ))}
          </div>
        )}
      </div>
      );
};

export default CommentItem;