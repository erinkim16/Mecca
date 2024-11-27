import React from "react";
import { GetServerSideProps } from "next";
import BlogComments from "@/components/blogs/blog-comments";
import BlogPostView from "@/components/blogs/blog-view"; // Add this line to import BlogPostView
import { PrismaClient } from "@prisma/client";
import { useRouter } from "next/router";

const prisma = new PrismaClient();

interface BlogPost {
  id: number;
  title: string;
  description: string;
  content: string;
  tags: { name: string }[]; // Ensure `id` for unique key
  author: { id: number, username: string };
  createdAt: string;
}

const BlogPostPage: React.FC<{ blog: BlogPost | null }> = ({ blog }) => {
  if (!blog) {
    return <p>Blog post not found.</p>;
  }

  const router = useRouter();

  const handleEdit = () => {
    console.log("Edit blog post", blog.id);
    router.push(`/blogs/${blog.id}/edit-blog`);
  };

  const handleDelete = () => {
    console.log("Delete blog post", blog.id);
    // Implement your delete logic here
  };

  return (
    <div className="blog-page">
      <BlogPostView
        blog={{ ...blog, tags: blog.tags.map(tag => tag.name), author: { ...blog.author, id: blog.author.id } }}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <div className="comments-section">
        <BlogComments blogId={blog.id} />
      </div>
    </div>
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
      },
    });

    if (!blog) {
      return { notFound: true };
    }

    return {
      props: {
        blog: {
          ...blog,
          createdAt: blog.createdAt.toISOString(), // Ensure date is serialized
          tags: blog.tags || [], // Fallback for tags
          author: blog.author, 
        },
      },
    };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return {
      props: { blog: null }, // Ensure no crash if an error occurs
    };
  }
};

export default BlogPostPage;
