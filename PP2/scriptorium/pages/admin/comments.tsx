import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "@/components/general/pagination";
import NavBar from "@/components/general/nav-bar";
import { authadminFetch } from "@/utils/account/api";

type Comment = {
  id: number;
  content: string;
  createdAt: string;
  reportsCount: number;
  hidden: boolean;
};

const InappropriateComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const ITEMS_PER_PAGE = 10; // Adjust as needed

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Verifying session through authenticatedFetch");
        await authadminFetch("/api/protected");
        console.log("Session valid, access granted");
        setLoading(false);
      } catch (error) {
        console.error("Authentication failed:", error);
        setLoading(false); // Ensure loading stops on error
        window.location.href = "/login-page"; // Redirect to login page
      }
    };
    checkAuth();

    fetchComments();
  }, [currentPage]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.get(`/api/admin/inappropriate-comments`, {
        params: { page: currentPage, perPage: ITEMS_PER_PAGE },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { comments, totalPages } = response.data;

      setComments(comments);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleHideComment = async (commentId: number) => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.put(
        "/api/admin/inappropriate-comments",
        { commentId }, // Request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? { ...comment, hidden: true } : comment
        )
      );
      alert("Comment hidden successfully.");
    } catch (error) {
      console.error("Failed to hide comment:", error);
      alert("Failed to hide the comment.");
    }
  };

  return (
    <>

    <NavBar></NavBar>
    
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Inappropriate Comments</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-4 border rounded shadow ${
                comment.hidden ? "bg-gray-200" : "bg-white"
              }`}
            >
              <p className="text-gray-800">{comment.content}</p>
              <p className="text-sm text-gray-600">
                Created: {new Date(comment.createdAt).toLocaleDateString()}
              </p>
              <p className="text-red-500">Reports: {comment.reportsCount}</p>
              <button
                onClick={() => handleHideComment(comment.id)}
                disabled={comment.hidden}
                className={`mt-2 px-4 py-2 rounded ${
                  comment.hidden
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                {comment.hidden ? "Hidden" : "Hide Content"}
              </button>
            </div>
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
    
    </>
    
  );
};

export default InappropriateComments;
