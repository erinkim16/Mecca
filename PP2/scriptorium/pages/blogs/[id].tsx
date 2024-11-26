import React from "react";
import { GetServerSideProps } from "next";
import BlogComments from "@/components/blogs/blog-comments";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface BlogPost {
  id: number;
  title: string;
  description: string;
  content: string;
  tags: { name: string }[];
  author: { username: string };
  createdAt: string;
}

const BlogPostPage: React.FC<{ blog: BlogPost }> = ({ blog }) => {
  if (!blog) {
    return <p>Blog post not found.</p>;
  }

  return (
    <div className="blog-post">
      <h1>{blog.title}</h1>
      <p>{blog.description}</p>
      <p>
        By <strong>{blog.author.username}</strong> on{" "}
        {new Date(blog.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "2-digit",
        })}
      </p>
      <div className="content">{blog.content}</div>
      <div className="tags">
        {blog.tags.map((tag) => (
          <span key={tag.name} className="tag">
            #{tag.name}
          </span>
        ))}
      </div>

      <div className="comments-section">
        <BlogComments blogId={blog.id} />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;

  const blog = await prisma.blogPost.findUnique({
    where: { id: parseInt(id as string, 10) },
    include: {
      tags: true,
      author: { select: { username: true } },
    },
  });

  if (!blog) {
    return { notFound: true };
  }

  return {
    props: {
      blog: {
        ...blog,
        createdAt: blog.createdAt.toISOString(),
      },
    },
  };
};

export default BlogPostPage;
