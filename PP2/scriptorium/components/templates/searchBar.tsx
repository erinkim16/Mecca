// /components/SearchBar.tsx
import React, { useState } from "react";

type SearchBarProps = {
  onSearch: (searchField: string, query: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchField, setSearchField] = useState("title"); // Default: search by title
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return; // Avoid empty searches
    onSearch(searchField, query.trim());
  };

  return (
    <div className="search-bar">
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
        placeholder={`Search by ${searchField}`}
        className="input"
      />
      <button onClick={handleSearch} className="search-button">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
