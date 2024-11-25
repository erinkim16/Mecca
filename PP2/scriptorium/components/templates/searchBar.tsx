import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (filters: {
    title?: string;
    explanation?: string;
    tags?: string;
  }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [title, setTitle] = useState("");
  const [explanation, setExplanation] = useState("");
  const [tags, setTags] = useState("");

  const handleSearch = () => {
    onSearch({ title, explanation, tags });
  };

  return (
    <div className="search-bar">
      <div className="search-field">
        <label>Title:</label>
        <input
          type="text"
          placeholder="Search by title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="search-field">
        <label>Explanation:</label>
        <input
          type="text"
          placeholder="Search by explanation"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
        />
      </div>
      <div className="search-field">
        <label>Tags:</label>
        <input
          type="text"
          placeholder="Search by tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <button onClick={handleSearch} className="search-button">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
