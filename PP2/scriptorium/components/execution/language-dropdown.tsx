import React, { useState, useEffect, useRef } from "react";

interface LanguageDropdownProps {
    language?: string;
    setLanguage: React.Dispatch<React.SetStateAction<string>>
}

export default function LanguageDropdown(props: LanguageDropdownProps) {

    // Handler for when the selected language changes
    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLanguage = event.target.value;
        props.setLanguage(selectedLanguage); // Update the parent component's language state
    };
    
    return (
        // TODO: add more languages
        <div>
            <label>Language:</label>
            <select id="language" name="language" >
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="c">C</option>
                <option value="c++">C++</option>
                <option value="javascript">JavaScript</option>
            </select>
        </div>
    )
}