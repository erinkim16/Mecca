import React, { useState, useEffect } from "react";
import CommentList from "../comments/comment-list";
import CommentForm from "../comments/add-comment";

interface Comment {
  id: number;
  text: string;
  rating: number;
  author: { username: string };
  replies?: Comment[];
}
const BlogComments: React.FC<{ blogId: number }> = ({ blogId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/comments?blogPostId=${blogId}`);
      if (!response.ok) throw new Error("Failed to fetch comments.");
      const data = await response.json();
      setComments(data.comments || []);
    } catch (err) {
      console.error("Error fetching comments:", err); // Log error
      setError("Failed to load comments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle replies
  const onReply = async (text: string, parentId: number) => {
    try {
      const response = await fetch(`/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, blogPostId: blogId, parentId }),
      });
      if (!response.ok) throw new Error("Failed to post reply.");
      fetchComments(); // Refresh comments after a reply
    } catch (err) {
      console.error("Error posting reply:", err); // Log error
      alert("Failed to post reply.");
    }
  };

  // Function to handle upvotes and downvotes
  const onRate = async (id: number, rating: number) => {
    try {
      const response = await fetch(`/api/comments/${id}/rate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });
      if (!response.ok) throw new Error("Failed to rate comment.");
      fetchComments(); // Refresh comments after rating
    } catch (err) {
      console.error("Error rating comment:", err); // Log error
      alert("Failed to rate comment.");
    }
  };

  // Function to edit a comment
  const onEdit = async (id: number, text: string) => {
    try {
      const response = await fetch(`/api/comments/${id}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error("Failed to edit comment.");
      fetchComments(); // Refresh comments after editing
    } catch (err) {
      console.error("Error editing comment:", err); // Log error
      alert("Failed to edit comment.");
    }
  };

  // Function to hide a comment
  const onHide = async (id: number) => {
    try {
      const response = await fetch(`/api/comments/${id}/hide`, { method: "PUT" });
      if (!response.ok) throw new Error("Failed to hide comment.");
      fetchComments(); // Refresh comments after hiding
    } catch (err) {
      console.error("Error hiding comment:", err); // Log error
      alert("Failed to hide comment.");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  return (
    <div className="blog-comments">
      <h2>Comments</h2>
      {loading && <p>Loading comments...</p>}
      {error && <p className="error">{error}</p>}
      <CommentForm
        onSubmit={(text) => onReply(text, 0)}
        placeholder="Write a comment..."
      />
      {!loading && !comments.length && !error && (
        <p>No comments yet. Be the first to comment!</p>
      )}
      <CommentList
        comments={comments}
        onReply={onReply}
        onRate={onRate}
        onEdit={onEdit}
        onHide={onHide}
      />
    </div>
  );
};

export default BlogComments;
