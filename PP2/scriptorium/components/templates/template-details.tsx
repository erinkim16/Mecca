import React from "react";
import Link from "next/link";
import NavBar from "@/components/general/nav-bar";
import { useRouter } from "next/router";

interface Tag {
  id: number;
  name: string;
}

interface Code {
  id: number;
  filePath: string;
  language: string;
  content?: string;
}

interface Author {
  id: number;
  username: string;
}

interface TemplateDetail {
  id: number;
  title: string;
  explanation: string;
  code: Code;
  tags: Tag[];
  author: Author;
}

interface TemplateDetailPageProps {
  template: TemplateDetail;
}

const TemplateDetailPage: React.FC<TemplateDetailPageProps> = ({
  template,
}) => {
  const router = useRouter();
  const currUser = parseInt(localStorage.getItem("userId") || "0", 10);
  const navigateToCode = (id: number) => {
    router.push(`/execution?id=${id}`); // Passing as a query parameter
  };

  const deleteTemplate = async () => {
    try {
      const response = await fetch(`/api/templates/${template.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.ok) {
        alert("Template deleted successfully.");
        router.push("/user-template");
      } else {
        const errorData = await response.json();
        alert(`Failed to delete template: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      alert("An unexpected error occurred while deleting the template.");
    }
  };

  return (
    <div className="template-detail-page">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">{template.title}</h1>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Explanation</h2>
              <p className="text-gray-700 mb-4">{template.explanation}</p>

              <div className="mb-4">
                <h3 className="font-semibold">Language</h3>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {template.code.language}
                </span>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold">Author</h3>
                <p>{template.author.username}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Code</h2>
              {/* <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{template.code.content || "Code not available"}</code>
              </pre> */}

              <div className="mt-4 flex justify-between">
                {/* Button to navigate to the code execution page */}
                <button
                  onClick={() => navigateToCode(template.id)} // Pass template.id to navigateToCode
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  Go to Code
                </button>

                {/* Delete Button (Visible only to the author) */}
                {template.author.id === currUser && (
                  <button
                    onClick={deleteTemplate}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Delete Template
                  </button>
                )}

                <Link href="/template-search">
                  <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
                    Back to Templates
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDetailPage;
