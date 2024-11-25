import React from "react";

interface BlogPost {
  title: string;
  tags: string[];
  content: string;
  author: { username: string }; // Ensure this matches the backend's response
  createdAt: string;
}

interface BlogPostViewProps {
  blog: BlogPost;
}

const BlogPostView: React.FC<BlogPostViewProps> = ({ blog }) => {
  const { title, tags, content, author, createdAt } = blog;

  const formattedDate = new Date(createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  let parsedContent: string;
  try {
    parsedContent = JSON.parse(content)?.body || content;
  } catch {
    parsedContent = content;
  }

  return (
    <div className="blog-post">
      <h1>{title}</h1>
      <p className="meta-info">
        By <strong>{author.username || "Unknown Author"}</strong> | Published on: {formattedDate}
      </p>
      <div className="tags">
        {tags.map((tag, index) => (
          <span key={index} className="tag">
            #{tag}
          </span>
        ))}
      </div>
      <div className="content">
        <p>{parsedContent}</p>
      </div>
    </div>
  );
};

export default BlogPostView;
