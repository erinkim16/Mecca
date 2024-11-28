import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "@/components/general/pagination";
import { authadminFetch } from "@/utils/account/api";
import NavBar from "@/components/general/nav-bar";

type BlogPost = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  reportsCount: number;
  hidden: boolean;
};

const InappropriateBlogs = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
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

    fetchBlogPosts();
  }, [currentPage]);

  const fetchBlogPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.get(`/api/admin/inappropriate-blogs`, {
        params: { page: currentPage, perPage: ITEMS_PER_PAGE },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { posts, totalPages } = response.data;

      setBlogPosts(posts);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleHideBlog = async (blogId: number) => {

    try {
      const token = localStorage.getItem("accessToken");
      console.log("accesstoken", token);

      await axios.put(
        "/api/admin/inappropriate-blogs",
        { blogId }, // Request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBlogPosts((prev) =>
        prev.map((post) =>
          post.id === blogId ? { ...post, hidden: true } : post
        )
      );
      alert("Blog hidden successfully.");
    } catch (error) {
      console.error("Failed to hide blog post:", error);
      alert("Failed to hide the blog post.");
    }
  };

  return (

    <>
    <NavBar></NavBar>
    <div className="container mx-auto p-4 m-8">
      <h1 className="text-2xl font-bold mb-4">Inappropriate Blog Posts</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className={`p-4 border rounded shadow ${
                post.hidden ? "bg-gray-200" : "bg-white"
              }`}
            >
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-sm text-gray-600">
                Created: {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-800">{post.description}</p>
              <p className="text-red-500">Reports: {post.reportsCount}</p>
              <button
                onClick={() => handleHideBlog(post.id)}
                disabled={post.hidden}
                className={`mt-2 px-4 py-2 rounded ${
                  post.hidden
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                {post.hidden ? "Hidden" : "Hide Content"}
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

export default InappropriateBlogs;
