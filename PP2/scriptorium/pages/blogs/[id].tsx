import React, { useEffect, useState } from "react";
import BlogPostView from "@/components/blogs/blog-view";
import BlogComments from "@/components/blogs/blog-comments";

interface BlogPost {
    id: number;
    title: string;
    tags: string[];
    content: string;
    author: string;
    createdAt: string;
}

interface BlogPostProps {
    blog: BlogPost | null;
}

const BlogViewPage: React.FC<BlogPostProps> = ({ blog }) => {
    if (!blog) {
        return <p>Blog not found</p>
    }
    return (
        <div className="blog-view-page">
          <BlogPostView
            title={blog.title}
            tags={blog.tags}
            content={blog.content}
            author={blog.author}
            createdAt={blog.createdAt}
          />
          <BlogComments blogId={blog.id} />
        </div>
      );
}

export async function getServerSideProps(context: any) {
    const { id } = context.params;
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${id}`);
      if (!response.ok) {
        return { notFound: true };
      }
  
      const blog = await response.json();
  
      return {
        props: { blog },
      };
    } catch (error) {
      console.error("Error fetching blog:", error);
      return { notFound: true };
    }
  }
  
  export default BlogViewPage;