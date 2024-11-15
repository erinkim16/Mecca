// Credit: ChatGPT used to help generate this

import React, { useState, KeyboardEvent, ChangeEvent } from 'react';

const TagInput: React.FC = () => {
  // Define the state for tags and input value
  const [tags, setTags] = useState<string[]>([]); // Tags are stored as an array of strings
  const [input, setInput] = useState<string>(''); // Input is a string

  // Function to handle the input change
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setInput(event.target.value);
  };

  // Function to handle when the user presses "Enter"
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter' && input.trim() !== '') {
      // Add the tag only if it's not empty
      setTags((prevTags) => [...prevTags, input.trim()]);
      setInput(''); // Clear input field after adding the tag
    }
  };

  // Function to remove a tag
  const handleTagRemove = (tagToRemove: string): void => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
       <style jsx>{`
        /* Add this in your App.css or styles.css */


        .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        }

        .tag {
        padding: 5px;
        background-color: #ddd;
        border-radius: 5px;
        cursor: pointer;
        user-select: none;
        }
    `} </style>

      <div className="tag-input-container">
        {/* Display tags */}
        <div className="tags">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="tag"
              onClick={() => handleTagRemove(tag)}
            >
              {tag} &times;
            </span>
          ))}
        </div>

        {/* Input field to add tags */}
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type and press Enter to add tags"
        />
      </div>

    </div>
  );
};

export default TagInput;
