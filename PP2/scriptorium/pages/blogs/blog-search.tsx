// import React, { useState } from "react";

// interface SearchProps {
//   onSearch: (query: { query?: string; tags?: string[]; codeTemplate?: string }) => void;
// }

// const BlogSearch: React.FC<SearchProps> = ({ onSearch }) => {
//   const [query, setQuery] = useState<string>("");
//   const [tags, setTags] = useState<string[]>([]);
//   const [codeTemplate, setCodeTemplate] = useState<string>("");

//   const handleSearch = () => {
//     onSearch({
//       query,
//       tags,
//       codeTemplate,
//     });
//   };

//   return (
//     <div className="search-bar">
//       <style jsx>{`
//         .search-bar {
//           display: flex;
//           flex-direction: column;
//           gap: 10px;
//         }
//         input,
//         textarea {
//           padding: 10px;
//           border: 1px solid #ccc;
//           border-radius: 4px;
//           font-size: 16px;
//         }
//         button {
//           padding: 10px 15px;
//           background-color: #007bff;
//           color: white;
//           border: none;
//           border-radius: 4px;
//           cursor: pointer;
//           font-size: 16px;
//         }
//         button:hover {
//           background-color: #0056b3;
//         }
//       `}</style>
//       <input
//         type="text"
//         value={query}
//         placeholder="Search by title or content..."
//         onChange={(e) => setQuery(e.target.value)}
//       />
//       <input
//         type="text"
//         value={tags.join(", ")}
//         placeholder="Search by tags (comma-separated)..."
//         onChange={(e) => setTags(e.target.value.split(",").map((tag) => tag.trim()))}
//       />
//       <input
//         type="text"
//         value={codeTemplate}
//         placeholder="Search by code template title..."
//         onChange={(e) => setCodeTemplate(e.target.value)}
//       />
//       <button onClick={handleSearch}>Search</button>
//     </div>
//   );
// };

// export default BlogSearch;

import React, { useState } from "react";

interface SearchProps {
  onSearch: (query: { searchField: string; query: string | string[] }) => void;
}

const BlogSearch: React.FC<SearchProps> = ({ onSearch }) => {
  const [searchField, setSearchField] = useState<string>("query"); // Default: search by title/content
  const [query, setQuery] = useState<string>("");

  const handleSearch = () => {
    if (!query.trim()) return; // Prevent empty searches

    let searchQuery: string | string[] = query.trim();
    if (searchField === "tags") {
      // Convert comma-separated input into an array of trimmed tags
      searchQuery = query
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag); // Remove empty tags
    }

    onSearch({ searchField, query: searchQuery });
  };

  return (
    <div className="search-bar">
      <style jsx>{`
        .search-bar {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        select {
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: #f8f8f8;
        }
        input {
          flex: 1;
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
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
      <select
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
      >
        <option value="query">Title/Content</option>
        <option value="tags">Tags</option>
        <option value="codeTemplate">Code Template</option>
      </select>
      <input
        type="text"
        value={query}
        placeholder={
          searchField === "tags"
            ? "Enter tags, comma-separated..."
            : `Search by ${searchField}`
        }
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default BlogSearch;
