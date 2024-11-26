import React, { useState, useEffect } from "react";
import CommentList from "../comments/comment-list";
import CommentForm from "../comments/add-comment";

interface Comment {
  id: number;
  content: string;
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

  const handleSubmit = async (text: string, parentId?: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ content: text, blogId, parentId }),
      });
      fetchComments();
      if (!response.ok) {
        throw new Error("Failed to post comment.");
      }
    } catch (error) {
      throw error; // Let the error propagate back to the CommentForm
    }
  };
  
  const onRate = async (id: number, rating: number) => {
    console.log(rating)
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("You must be logged in to rate comments.");
      return;
    }
     JSON.stringify({ rating })
    try {
      console.log( JSON.stringify({ rating }))
      const response = await fetch(`/api/comments/${id}/rate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating }),
      });

  
      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to rate comment:", error.message);
        throw new Error(error.message || "Failed to rate comment.");
      }
  
      console.log(`Comment with ID ${id} rated with value ${rating}`);
      fetchComments(); // Refresh comments to reflect the rating changes
    } catch (err) {
      console.error("Error rating comment:", err);
      alert("Failed to rate comment. Please try again later.");
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
        onSubmit={(text) => handleSubmit(text)} // Handle new top-level comment
        placeholder="Write a comment..."
      />
      {!loading && !comments.length && !error && (
        <p>No comments yet. Be the first to comment!</p>
      )}
      <CommentList
        comments={comments}
        onReply={handleSubmit} // Handle replies
        onRate={onRate}
        onEdit={() => {}} // Add edit logic if needed
        onHide={() => {}} // Add hide logic if needed
      />
    </div>
  );
};

export default BlogComments;
