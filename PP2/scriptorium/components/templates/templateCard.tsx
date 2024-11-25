// // /components/TemplateCard.tsx
// import React from "react";

// type Template = {
//   id: number;
//   title: string;
//   explanation: string;
//   tags: { name: string }[];
//   language: string;
// };

// type TemplateCardProps = {
//   template: Template;
// };

// const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
//   return (
//     <div className="template-card">
//       <h3>{template.title}</h3>
//       <p>{template.explanation}</p>
//       <div>
//         <strong>Tags:</strong>
//         {template.tags.map((tag) => (
//           <span key={tag.name} className="tag">
//             {tag.name}
//           </span>
//         ))}
//       </div>
//       <p>
//         <strong>Language:</strong> {template.language}
//       </p>
//     </div>
//   );
// };

// export default TemplateCard;
import React from "react";

// Define the types for the props
interface Tag {
  id: number;
  name: string;
}

interface Code {
  id: number;
  filePath: string;
  language: string;
}

interface Author {
  id: number;
  username: string; // Assuming `User` has a `name` field
}

export interface TemplateCardProps {
  id: number;
  title: string;
  explanation: string;
  code: Code;
  tags: Tag[];
  author: Author;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  id,
  title,
  explanation,
  code,
  tags,
  author,
}) => {
  // Function to truncate code preview
  const truncateCode = (codeContent: string, maxLength: number) => {
    if (codeContent.length > maxLength) {
      return codeContent.substring(0, maxLength) + "...";
    }
    return codeContent;
  };

  return (
    <div className="template-card border shadow-md p-4 rounded-md">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-gray-600">{explanation}</p>
      <div className="code-preview mt-2 bg-gray-100 p-2 rounded">
        <pre className="text-sm overflow-hidden whitespace-pre-wrap">
          {/* For simplicity, a mock preview - replace with real code content */}
          {truncateCode("Code preview not implemented. Load from file.", 100)}
        </pre>
        <p className="text-xs text-gray-500 mt-1">Language: {code.language}</p>
      </div>
      <div className="tags mt-2 flex gap-2">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full"
          >
            {tag.name}
          </span>
        ))}
      </div>
      <div className="author mt-2 text-sm text-gray-500">
        Created by: {author.username}
      </div>
    </div>
  );
};

export default TemplateCard;
