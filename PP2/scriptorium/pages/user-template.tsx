// // for user specific template searching
// import React, { useState, useEffect } from "react";
// import SearchBar from "@/components/templates/searchBar";
// import Pagination from "@/components/general/pagination";
// import TemplateList from "@/components/templates/templateList";
// import axios from "axios";
// import NavBar from "@/components/general/nav-bar";
// import { useRouter } from "next/router";
// import { authenticatedFetch } from "@/utils/account/api";

// // type Template = {
// //   id: number;
// //   title: string;
// //   explanation: string;
// //   tags: { name: string }[];
// //   language: string;
// // };

// const TemplatesPage: React.FC = () => {
//   const [templates, setTemplates] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchField, setSearchField] = useState("title");
//   const [query, setQuery] = useState("");

//   const fetchTemplates = async (page: number) => {
//     try {
//       // Build query string for the backend
//       const params = new URLSearchParams({
//         [searchField]: query,
//         page: page.toString(),
//         limit: "10",
//       });
//       console.log("search params: ", params);

//       // const response = await fetch(`/api/templates?${params.toString()}`);
//       // if (!response.ok) {
//       //   throw new Error("Failed to fetch templates");
//       // }

//       // const data = await response.json();
//       const token = localStorage.getItem("accessToken"); // Or use cookies
//       const response = await axios.get(
//         `/api/templates/my_templates?${params.toString()}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setTemplates(response.data.templates);
//       setTotalPages(response.data.pagination.totalPages);
//       setCurrentPage(response.data.pagination.currentPage);
//     } catch (error) {
//       console.error("Error fetching templates:", error);
//     }
//   };

//   useEffect(() => {
//     fetchTemplates(currentPage);
//   }, [currentPage, searchField, query]);

//   const handleSearch = (field: string, query: string) => {
//     setSearchField(field);
//     setQuery(query);
//     setCurrentPage(1); // Reset to first page on new search
//     fetchTemplates(1);
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   // return (
//   //   <div className="templates-page">
//   //     <h1>Search Code Templates</h1>
//   //     <SearchBar onSearch={handleSearch} />
//   //     <div className="templates-list">
//   //       {templates.length > 0 ? (
//   //         templates.map((template) => (
//   //           <TemplateCard key={template.id} template={template} />
//   //         ))
//   //       ) : (
//   //         <p>No templates found</p>
//   //       )}
//   //     </div>
//   //     <Pagination
//   //       currentPage={currentPage}
//   //       totalPages={totalPages}
//   //       onPageChange={handlePageChange}
//   //     />
//   //   </div>
//   return (
//     <div className="code-search-page">
//       <NavBar />
//       <h1>Code Search</h1>
//       <SearchBar onSearch={handleSearch} />
//       <TemplateList templates={templates} />
//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={handlePageChange}
//       />
//     </div>
//   );
// };

// export default TemplatesPage;
import React, { useState, useEffect } from "react";
import SearchBar from "@/components/templates/searchBar";
import Pagination from "@/components/general/pagination";
import TemplateList from "@/components/templates/templateList";
import axios from "axios";
import NavBar from "@/components/general/nav-bar";
import { useRouter } from "next/router";
import { authenticatedFetch } from "@/utils/account/api";

const TemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchField, setSearchField] = useState("title");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchTemplates = async (page: number) => {
    try {
      // Build query string for the backend
      const params = new URLSearchParams({
        [searchField]: query,
        page: page.toString(),
        limit: "10",
      });

      const token = localStorage.getItem("accessToken"); // Or use cookies
      const response = await axios.get(
        `/api/templates/my_templates?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTemplates(response.data.templates);
      setTotalPages(response.data.pagination.totalPages);
      setCurrentPage(response.data.pagination.currentPage);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

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

  useEffect(() => {
    if (!isLoading) {
      fetchTemplates(currentPage);
    }
  }, [currentPage, searchField, query, isLoading]);

  const handleSearch = (field: string, query: string) => {
    setSearchField(field);
    setQuery(query);
    setCurrentPage(1); // Reset to first page on new search
    fetchTemplates(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="code-search-page">
      <NavBar />
      <h1>Code Search</h1>
      <SearchBar onSearch={handleSearch} />
      <TemplateList templates={templates} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default TemplatesPage;
