import React, { useState, useEffect, useRef } from "react";

const SUPPORTED_LANGUAGES = [
  "python",
  "java",
  "javascript",
  "golang",
  "elixir",
  "perl",
  "php",
  "ruby",
  "rust",
  "swift",
];

interface LanguageDropdownProps {
  language?: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
}

export default function LanguageDropdown(props: LanguageDropdownProps) {
  // Handler for when the selected language changes
  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedLanguage = event.target.value;
    props.setLanguage(selectedLanguage); // Update the parent component's language state
  };

  return (
    // TODO: add more languages
    <div>
      <label>Language:</label>
      <select
        id="language"
        name="language"
        onChange={handleLanguageChange}
        value={props.language}
      >
        {SUPPORTED_LANGUAGES.map((language) => (
          <option key={language} value={language}>
            {language.charAt(0).toUpperCase() + language.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
