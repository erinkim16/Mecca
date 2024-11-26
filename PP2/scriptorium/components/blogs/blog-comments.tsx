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
      console.error("Error fetching comments:", err);
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

      if (!response.ok) throw new Error("Failed to post comment.");
      const newComment = await response.json();
      setComments((prev) =>
        parentId
          ? prev.map((comment) =>
              comment.id === parentId
                ? { ...comment, replies: [newComment, ...(comment.replies || [])] }
                : comment
            )
          : [newComment, ...prev]
      );
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

    const handleReport = async (id: number, report: string) => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch('/api/comments/${id}/rate', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ report }),
        });

        if (!response.ok) {
          const errorData = await response.json(); // Parse the error message
          throw new Error(errorData.message || "Failed to report comment.");
        }
    
        alert("Comment reported successfully. Thank you!");
      } catch (error) {
        alert("Failed to report the comment. Please try again later");
      }
    };

    const onRate = async (id: number, rating: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("You must be logged in to rate comments.");
      return;
    }

    try {
      const response = await fetch(`/api/comments/${id}/rate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating }),
      });

      if (!response.ok) throw new Error("Failed to rate comment.");
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === id
            ? { ...comment, rating: comment.rating + rating }
            : comment
        )
      );
    } catch (err) {
      console.error("Error rating comment:", err);
      alert("Failed to rate comment. Please try again later.");
      return;
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
        onReport={handleReport}
      />
    </div>
  );
};

export default BlogComments;
