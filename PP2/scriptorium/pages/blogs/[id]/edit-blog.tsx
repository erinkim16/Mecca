import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import BlogEditor from "@/components/blogs/blog-editor"; // Adjust the path if necessary

const EditBlogPage = () => {
  const router = useRouter();
  const { id } = router.query;

  interface Blog {
    id: number;
    title: string;
    description: string;
    tags: string[];
    content: JSON;
    codeTemplates: string[];
  }
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const response = await axios.get(`/api/blogs/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setBlog(response.data);
        } catch (err) {
          console.error("Error fetching blog:", err);
          setError("Failed to fetch the blog post.");
        } finally {
          setLoading(false);
        }
      };

      fetchBlog();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="edit-blog-page">
      <h1>Edit Blog Post</h1>
      {blog && (
       <BlogEditor
   initialBlog={{
     id: blog.id,
     title: blog.title,
     description: blog.description,
     tags: blog.tags ? blog.tags.map(tag => ({ name: tag })) : [], // Ensure `tags` is an array of objects with a name property
     content: JSON.stringify(blog.content), // Add the content property
     codeTemplates: blog.codeTemplates || [],
   }}
       isEditMode={true}
     />
     
      )}
    </div>
  );
};

export default EditBlogPage;
