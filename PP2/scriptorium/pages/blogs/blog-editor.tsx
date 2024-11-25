import React from "react";
import BlogEditor from "../../components/blogs/blog-editor";
import NavBar from "@/components/general/nav-bar";

const BlogEditorPage = () => {
  return (
    <div>
      <NavBar></NavBar>
      <BlogEditor />
    </div>
  );
};

export default BlogEditorPage;
