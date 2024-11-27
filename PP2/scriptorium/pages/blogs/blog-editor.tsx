// pages/create-blog.tsx

import React from "react";
import BlogEditor from "@/components/blogs/blog-editor"; // Adjust the path as needed
import NavBar from "@/components/general/nav-bar"; // Assuming a NavBar component exists

const CreateBlogPage = () => {
  return (
    <div className="create-blog-page">
      <NavBar />
      <BlogEditor />
    </div>
  );
};

export default CreateBlogPage;
