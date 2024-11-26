import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { verifyAccessToken } from "@/utils/account/auth";

interface ReportedContent {
  id: number;
  type: "Blog" | "Comment";
  title?: string; // For blogs
  text?: string; // For comments
  author: string;
  reportCount: number;
  isHidden: boolean;
}

const AdminDashboard: React.FC = () => {
  const [reportedContent, setReportedContent] = useState<ReportedContent[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchReportedContent = async () => {
    setError(null);
    try {
      const response = await fetch("/api/admin/reported-content", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reported content");
      }

      const data = await response.json();
      setReportedContent(data);
    } catch (err) {
      console.error("Error fetching reported content:", err);
      setError("Failed to load reported content. Please try again.");
    }
  };

  const hideContent = async (id: number, type: "Blog" | "Comment") => {
    try {
      const response = await fetch("/api/admin/hide-content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, type }),
      });

      if (!response.ok) {
        throw new Error("Failed to hide content");
      }

      alert("Content has been successfully hidden.");
      fetchReportedContent();
    } catch (err) {
      console.error("Error hiding content:", err);
      alert("Failed to hide content. Please try again.");
    }
  };

  useEffect(() => {
    fetchReportedContent();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {error && <p className="error">{error}</p>}
      {reportedContent.length === 0 && !error && (
        <p>No reported content at the moment.</p>
      )}
      {reportedContent.map((content) => (
        <div key={content.id} className="content-item">
          <h3>
            {content.type} - {content.type === "Blog" ? content.title : content.text}
          </h3>
          <p>Author: {content.author}</p>
          <p>Reports: {content.reportCount}</p>
          <p>Status: {content.isHidden ? "Hidden" : "Visible"}</p>
          {!content.isHidden && (
            <button onClick={() => hideContent(content.id, content.type)}>
              Hide Content
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const authHeader = context.req.headers.authorization || "";
  const user = verifyAccessToken(authHeader);

  if (!user || !user.isAdmin) { 
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default AdminDashboard;
