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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await onSubmit(text, parentId);
      setText("");
    } catch (err) {
      console.error("Error submitting comment:", err);
      setError("Failed to submit your comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      {error && <p className="error-message">{error}</p>}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="textarea"
        disabled={loading}
      />
      <button type="submit" className="submit-button" disabled={!text.trim() || loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};


export default CommentForm;
