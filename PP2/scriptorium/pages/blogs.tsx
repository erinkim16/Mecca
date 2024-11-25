import React, { useState } from "react";
import Link from "next/link"; 
import BlogSearch from "@/components/general/search-page";
import NavBar from "@/components/general/nav-bar";

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

  const handleSearch = async ({
    query,
    tags,
    codeTemplate,
  }: {
    query?: string;
    tags?: string[];
    codeTemplate?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (query) params.append("query", query);
      if (tags && tags.length > 0) params.append("tags", tags.join(","));
      if (codeTemplate) params.append("codeTemplate", codeTemplate);

      const response = await fetch(`/api/blogs?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }

      const data = await response.json();
      setBlogs(data);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to fetch blogs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blog-list">
      <NavBar />
      <h1>Search Blog Posts</h1>
      <BlogSearch onSearch={handleSearch} />
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {blogs.length === 0 && !loading && !error && <p>No blogs found.</p>}
      <ul>
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
    </div>
  );
};

export default BlogList;
