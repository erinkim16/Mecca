// // /components/SearchBar.tsx
// import React, { useState } from "react";

// type SearchBarProps = {
//   onSearch: (searchField: string, query: string) => void;
// };

// const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
//   const [searchField, setSearchField] = useState("title"); // Default: search by title
//   const [query, setQuery] = useState("");

//   const handleSearch = () => {
//     if (!query.trim()) return; // Avoid empty searches
//     onSearch(searchField, query.trim());
//   };

//   return (
//     <div className="search-bar">
//       <select
//         value={searchField}
//         onChange={(e) => setSearchField(e.target.value)}
//         className="dropdown"
//       >
//         <option value="title">Title</option>
//         <option value="explanation">Explanation</option>
//         <option value="tag">Tag</option>
//       </select>
//       <input
//         type="text"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         placeholder={`Search by ${searchField}`}
//         className="input"
//       />
//       <button onClick={handleSearch} className="search-button">
//         Search
//       </button>
//     </div>
//   );
// };

// export default SearchBar;

import React, { useState } from "react";

type SearchBarProps = {
  onSearch: (searchField: string, query: string | string[]) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchField, setSearchField] = useState("title"); // Default: search by title
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return; // Avoid empty searches

    let parsedQuery: string | string[] = query.trim();

    console.log("parsedquery : ", parsedQuery);

    onSearch(searchField, parsedQuery);
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
        className="dropdown"
      >
        <option value="title">Title</option>
        <option value="explanation">Explanation</option>
        <option value="tag">Tag</option>
      </select>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={
          searchField === "tag"
            ? "Enter tags, space-separated"
            : `Search by ${searchField}`
        }
        className="input"
      />
      <button onClick={handleSearch} className="search-button">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
