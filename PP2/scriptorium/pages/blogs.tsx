import React, { useState, useEffect } from "react";
import Link from "next/link";
import NavBar from "@/components/general/nav-bar";
import BlogSearch from "./blogs/blog-search";

interface BlogPost {
  id: number;
  title: string;
  description: string;
  tags: { name: string }[];
  codeTemplate: { title: string }[];
}

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async (params: URLSearchParams = new URLSearchParams()) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/blogs?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }

      const data = await response.json();
      setBlogs(data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to fetch blogs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async ({
    query,
    tags,
    codeTemplate,
  }: {
    query?: string;
    tags?: string[];
    codeTemplate?: string;
  }) => {
    const params = new URLSearchParams();
    if (query) params.append("query", query);
    if (tags && tags.length > 0) params.append("tags", tags.join(","));
    if (codeTemplate) params.append("codeTemplate", codeTemplate);

    await fetchBlogs(params);
  };

  // Fetch all blogs when the component mounts
  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="blog-list">
      <NavBar />
      <h1>Search Blog Posts</h1>
      <BlogSearch onSearch={handleSearch} />

      <main>
        {loading && <p className="loading">Loading blogs...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && blogs.length === 0 && !error && (
          <p className="no-blogs">No blogs found. Try adjusting your search criteria.</p>
        )}
        <ul className="blogs">
          {blogs.map((blog) => (
            <li key={blog.id} className="blog-item">
              <h2>
                <Link href={`/blogs/${blog.id}`}>{blog.title}</Link>
              </h2>
              <p>{blog.description}</p>
              <p>Tags: {blog.tags.map((tag) => `#${tag.name}`).join(", ")}</p>
              <p>
                Code Templates:{" "}
                {blog.codeTemplate.map((template) => template.title).join(", ")}
              </p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default BlogList;
