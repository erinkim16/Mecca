import React, { useState } from "react";

interface SearchProps {
  onSearch: (query: { query?: string; tags?: string[]; codeTemplate?: string }) => void;
}

const BlogSearch: React.FC<SearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [codeTemplate, setCodeTemplate] = useState<string>("");

  const handleSearch = () => {
    onSearch({
      query,
      tags,
      codeTemplate,
    });
  };

  return (
    <div className="search-bar">
      <style jsx>{`
        .search-bar {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        input,
        textarea {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 16px;
        }
        button {
          padding: 10px 15px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        button:hover {
          background-color: #0056b3;
        }
      `}</style>
      <input
        type="text"
        value={query}
        placeholder="Search by title or content..."
        onChange={(e) => setQuery(e.target.value)}
      />
      <input
        type="text"
        value={tags.join(", ")}
        placeholder="Search by tags (comma-separated)..."
        onChange={(e) => setTags(e.target.value.split(",").map((tag) => tag.trim()))}
      />
      <input
        type="text"
        value={codeTemplate}
        placeholder="Search by code template title..."
        onChange={(e) => setCodeTemplate(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default BlogSearch;
