import React, { useState } from "react";

interface CommentFormProps {
  onSubmit: (text: string, parentId?: number) => void;
  placeholder?: string;
  parentId?: number;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  placeholder = "Write a comment...",
  parentId,
}) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
      onSubmit(text, parentId);
      setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="textarea"
      />
      <button type="submit" className="submit-button" disabled={!text.trim()}>
        Submit
      </button>
    </form>
  );
};

export default CommentForm;
