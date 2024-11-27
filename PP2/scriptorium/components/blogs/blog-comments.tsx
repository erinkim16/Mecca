import React, { useState, useEffect } from "react";
import CommentList from "../comments/comment-list";
import CommentForm from "../comments/add-comment";
import { PrismaClient } from "@prisma/client";
import { GetServerSideProps } from "next";

const prisma = new PrismaClient();

interface Comment {
  id: number;
  content: string;
  rating: number;
  author: {
    id: number;
    username: string;
  };
  replies?: Comment[];
}

const BlogComments: React.FC<{ blogId: number }> = ({ blogId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("default");

  const fetchComments = async (sortBy = "default") => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/comments?blogPostId=${blogId}&sortBy=${sortBy}`
      );
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

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    fetchComments(newSortBy);
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

      if (!response.ok) {
        throw new Error("Failed to post comment.");
      }

      const newComment = await response.json();

      console.log("New comment,", newComment);

      if (parentId) {
        // Fetch the updated parent comment with its replies
        const updatedParentResponse = await fetch(`/api/comments/${parentId}`);
        const updatedParent = await updatedParentResponse.json();

        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === parentId ? updatedParent : comment
          )
        );
        fetchComments;
      } else {
        setComments((prevComments) => [newComment, ...prevComments]);
      }

      await fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleReport = async (id: number, report: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`/api/comments/${id}/report`, {
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
    console.log("onRate function called with ID:", id, "Rating:", rating);

    try {
      const response = await fetch(`/api/comments/${id}/rate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to rate comment:", errorData);
        alert(`Failed to rate comment: ${errorData.error || "Unknown error"}`);
        return;
      }

      const updatedComment = await response.json();

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === updatedComment.id // Check if this is the comment to update
            ? { ...comment, rating: updatedComment.ratingScore, userVote: rating }
            : comment // Leave other comments unchanged
        )
      );
      
    } catch (err) {
      console.error("Error rating comment:", err);
      alert("Failed to rate comment. Please try again later.");
    }
  };

  const onRemoveVote = async (id: number) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("You must be logged in to remove your vote.");
      return;
    }

    try {
      const response = await fetch(`/api/comments/${id}/rate`, {
        method: "DELETE", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to remove vote:", errorData);
        alert(`Failed to remove vote: ${errorData.error || "Unknown error"}`);
        return;
      }

      // Parse the updated comment from the server response
      const updatedComment = await response.json();

      // Update the state to reflect the removed vote
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === updatedComment.id 
            ? { ...comment, rating: updatedComment.ratingScore, userVote: 0 }
            : comment 
        )
      );
      
      fetchComments();
    } catch (err) {
      console.error("Error removing vote:", err);
      alert("Failed to remove vote. Please try again later.");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  return (
    <div className="blog-comments">
      <h2>Comments</h2>
      <CommentForm
        onSubmit={(text) => handleSubmit(text)} // Handle new top-level comment
        placeholder="Write a comment..."
      />
      <div className="sort-options">
        <button
          onClick={() => handleSortChange("default")}
          disabled={sortBy === "default"}
        >
          Default
        </button>
        <button
          onClick={() => handleSortChange("ratinghigh")}
          disabled={sortBy === "ratingHigh"}
        >
          Highest to Lowest Rating
        </button>
        <button
          onClick={() => handleSortChange("ratingLow")}
          disabled={sortBy === "ratingLow"}
        >
          Lowest to Highest Rating
        </button>
      </div>

      <CommentList
        comments={comments}
        onReply={handleSubmit} // Handle replies
        onRate={onRate}
        onReport={handleReport}
        onRemoveVote={onRemoveVote}
      />
    </div>
  );
};

export default BlogComments;


export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};

  if (!id || isNaN(Number(id))) {
    return { notFound: true };
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id as string, 10) },
      include: {
        author: { select: { id: true, username: true } },
      },
    });

    if (!comment) {
      return { notFound: true };
    }
    console.log("Fetched comment from Prisma:", comment);

    return {
      props: {
        comment: {
          ...comment,
          author: comment.author,
          rating: comment.ratingScore
        },
      },
    };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return { props: { blog: null } };
  }
};
