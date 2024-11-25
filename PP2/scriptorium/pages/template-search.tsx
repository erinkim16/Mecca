import React, { useState, useEffect } from "react";
import SearchBar from "@/components/templates/searchBar";
import Pagination from "@/components/general/pagination";
import TemplateList from "@/components/templates/templateList";
import axios from "axios";

const CodeSearchPage: React.FC = () => {
  console.log(SearchBar); // Should show a function, not an object
  console.log(Pagination); // Should show a function, not an object
  console.log(TemplateList); // Should show a function, not an object

  const [templates, setTemplates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<{
    title?: string;
    explanation?: string;
    tags?: string;
  }>({});

  const fetchTemplates = async (
    filters: { title?: string; explanation?: string; tags?: string },
    page: number
  ) => {
    try {
      const token = localStorage.getItem("accessToken"); // Or use cookies
      const response = await axios.get("/api/templates", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ...filters,
          page,
          limit: 10, // Fixed pagination limit
        },
      });
      console.log("templates fetched:", response.data.templates);
      setTemplates(response.data.templates);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  useEffect(() => {
    fetchTemplates(filters, currentPage);
  }, [currentPage]);

  const handleSearch = (newFilters: {
    title?: string;
    explanation?: string;
    tags?: string;
  }) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to the first page on a new search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="code-search-page">
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

export default CodeSearchPage;
