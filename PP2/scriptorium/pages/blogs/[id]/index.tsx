import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import BlogComments from "@/components/blogs/blog-comments";
import BlogPostView from "@/components/blogs/blog-view";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import NavBar from "@/components/general/nav-bar";

const prisma = new PrismaClient();

interface BlogPost {
  id: number;
  title: string;
  description: string;
  content: string;
  tags: { name: string }[];
  author: { id: number; username: string };
  createdAt: string;
  rating: number;
  userVote?: number;
}

const BlogPostPage: React.FC<{ blog: BlogPost | null }> = ({ blog }) => {
  const [blogState, setBlogState] = useState<BlogPost | null>(() => blog);
  const router = useRouter();

  if (!blogState) {
    return <p>Blog post not found.</p>;
  }
  useEffect(() => {
  }, [blogState]);

  console.log("Blog state initialized:", blogState);

  const handleEdit = () => {
    router.push(`/blogs/${blogState.id}/edit-blog`);
  };

  const onRate = async (id: number, rating: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("You must be logged in to rate blogs.");
      return;
    }

    try {
      const response = await fetch(`/api/blogs/${id}/rate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to rate blog:", errorData);
        alert(`Failed to rate blog: ${errorData.error || "Unknown error"}`);
        return;
      }

      const updatedBlog = await response.json();
      console.log(updatedBlog);

      setBlogState((prev) =>
        prev
          ? {
              ...prev,
              rating: updatedBlog.ratingScore,
              userVote: rating,
            }
          : prev
      );
    } catch (err) {
      console.error("Error rating blog:", err);
      alert("Failed to rate blog. Please try again later.");
    }
  };

  const onRemoveVote = async (id: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("You must be logged in to remove your vote.");
      return;
    }

    try {
      const response = await fetch(`/api/blogs/${id}/rate`, {
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

      const updatedBlog = await response.json();
      console.log("Updated blog from API after vote removal:", updatedBlog);

      setBlogState((prev) =>
        prev
          ? {
              ...prev,
              rating: updatedBlog.ratingScore, 
              userVote: 0, 
            }
          : prev );
    } catch (err) {
      console.error("Error removing vote:", err);
      alert("Failed to remove vote. Please try again later.");
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this blog post? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("You must be logged in to delete a blog post.");
        return;
      }

      const response = await axios.delete(`/api/blogs/${blogState.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        alert("Blog post deleted successfully.");
        router.push("/blogs");
      } else {
        alert("Failed to delete the blog post. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting blog post:", error);
      alert("An error occurred while deleting the blog post.");
    }
  };

  return (
    <>  
    <NavBar></NavBar>
    <div className="blog-page m-8">
      <BlogPostView
        blog={{ ...blogState, tags: blogState.tags.map(tag => tag.name) }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRate={onRate}
        onRemoveVote={onRemoveVote}
        onReport={() => console.log("Report blog post")}
      />
      <div className="comments-section">
        <BlogComments blogId={blogState.id} />
      </div>
    </div>
    
    </>
    
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};

  if (!id || isNaN(Number(id))) {
    return { notFound: true };
  }

  try {
    const blog = await prisma.blogPost.findUnique({
      where: { id: parseInt(id as string, 10) },
      include: {
        tags: { select: { name: true } },
        author: { select: { id: true, username: true } },
        rating: true
      },
    });

    if (!blog) {
      return { notFound: true };
    }
    console.log("Fetched blog from Prisma:", blog);

    return {
      props: {
        blog: {
          ...blog,
          createdAt: blog.createdAt.toISOString(),
          tags: blog.tags || [],
          author: blog.author,
          rating: blog.ratingScore
        },
      },
    };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return { props: { blog: null } };
  }
};

export default BlogPostPage;