import React from "react";
import BlogEditor from "../../components/blogs/blog-editor";
import NavBar from "@/components/general/nav-bar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from "@/utils/account/api";

const BlogEditorPage = () => {
  console.log("Rendering Blog editor page");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Verifying session through authenticatedFetch");
        await authenticatedFetch("/api/protected");
        console.log("Session valid, access granted");
        setIsLoading(false);
      } catch (error) {
        console.error("Authentication failed:", error);
        setIsLoading(false); // Ensure loading stops on error
        router.push("/login-page"); // Redirect to login page
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
    <NavBar></NavBar>
    <div className="m-8">
      
      <BlogEditor />
    </div>
    </>
    
  );
};

export default BlogEditorPage;
