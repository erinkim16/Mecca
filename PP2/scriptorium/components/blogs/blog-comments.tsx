import React, { useState, useEffect } from "react";
import CommentList from "../comments/comment-list";
import CommentForm from "../comments/add-comment";

interface Comment {
  id: number;
  text: string;
  author: string;
  upvotes: number;
  hidden: boolean;
  rating: number;
  parentId?: number;
  replies?: Comment[];
}

const BlogComments: React.FC<{ blogId: number }> = ({ blogId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const getAccessToken = () => localStorage.getItem("accessToken");


  const fetchComments = async () => {
    const response = await fetch(`/api/comments?blogId=${blogId}`);
    const data = await response.json();
    setComments(data);
  };

  const addComment = async (text: string, parentId?: number) => {
    await fetch(`/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, blogPostId: blogId, parentId }),
    });
    fetchComments();
  };

  const rateComment = async (id: number, rating: number) => {
    try {
      const response = await fetch(`/api/comments/${id}/rate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getAccessToken}` },
        body: JSON.stringify({ rating }), // +1 for upvote, -1 for downvote
      });
  
      if (response.ok) {
        fetchComments(); // Refresh comments after rating
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error rating comment:", error);
    }
  };

  const editComment = async (id: number, text: string) => {
    await fetch(`/api/comments/${id}/edit`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    fetchComments();
  };

  const hideComment = async (id: number) => {
    await fetch(`/api/comments/${id}/hide`, { method: "PUT" });
    fetchComments();
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="blog-comments">
      <h2>Comments</h2>
      <CommentForm onSubmit={(text) => addComment(text)} placeholder="Write a comment..." />
      <CommentList
        comments={comments}
        onReply={addComment}
        onRate={rateComment}
        onEdit={editComment}
        onHide={hideComment}
      />
    </div>
  );
};

export default BlogComments;
