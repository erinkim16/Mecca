// allow users to view the comment

import React, { useState } from "react";
import CommentForm from "./add-comment";

interface Comment {
    id: number;
    text: string;
    author: string;
    rating: number;
    parentId?: number;
    hidden: boolean;
    replies?: Comment[];
}

interface CommentItemProps {
    comment: Comment;
    onReply: (text: string, parentId: number) => void;
    onRate: (id: number, rating: number) => void;
    onEdit: (id: number, text: string) => void;
    onHide: (id: number) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({  comment,
    onReply,
    onRate,
    onEdit,
    onHide, }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text);

    const handleReply = (text: string) => {
        onReply(text, comment.id);
        setShowReplyForm(false);
    };

    const handleEdit = () => {
        onEdit(comment.id, editText);
        setIsEditing(false);
      };

    if (comment.hidden) {

        return <p>This comment is hidden.</p>
    }

    return (
        <div className="comment-item">
        <p>
          <strong>{comment.author}</strong> ({comment.rating} upvotes):{" "}
          {isEditing ? (
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
          ) : (
            comment.text
          )}
        </p>
        {isEditing ? (
          <button onClick={handleEdit}>Save</button>
        ) : (
          <>
            <button onClick={() => onRate(comment.id, 1)}>Upvote</button>
            <button onClick={() => onRate(comment.id, -1)}>Downvote</button>
            <button onClick={() => setShowReplyForm(!showReplyForm)}>
              Reply
            </button>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={() => onHide(comment.id)}>Hide</button>
          </>
        )}
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
      </div>
      );
};

export default CommentItem;