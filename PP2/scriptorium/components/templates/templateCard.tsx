// // export default TemplateCard;
// import React from "react";

// // Define the types for the props
// interface Tag {
//   id: number;
//   name: string;
// }

// interface Code {
//   id: number;
//   filePath: string;
//   language: string;
// }

// interface Author {
//   id: number;
//   username: string; // Assuming `User` has a `name` field
// }

// export interface TemplateCardProps {
//   id: number;
//   title: string;
//   explanation: string;
//   code: Code;
//   tags: Tag[];
//   author: Author;
// }

// const TemplateCard: React.FC<TemplateCardProps> = ({
//   id,
//   title,
//   explanation,
//   code,
//   tags,
//   author,
// }) => {
//   // Function to truncate code preview
//   const truncateCode = (codeContent: string, maxLength: number) => {
//     if (codeContent.length > maxLength) {
//       return codeContent.substring(0, maxLength) + "...";
//     }
//     return codeContent;
//   };

//   return (
//     <div className="template-card border shadow-md p-4 rounded-md">
//       <h2 className="text-lg font-semibold">{title}</h2>
//       <p className="text-sm text-gray-600">{explanation}</p>
//       <div className="code-preview mt-2 bg-gray-100 p-2 rounded">
//         <pre className="text-sm overflow-hidden whitespace-pre-wrap">
//           {/* For simplicity, a mock preview - replace with real code content */}
//           {truncateCode("Code preview not implemented. Load from file.", 100)}
//         </pre>
//         <p className="text-xs text-gray-500 mt-1">Language: {code.language}</p>
//       </div>
//       <div className="tags mt-2 flex gap-2">
//         {tags.map((tag) => (
//           <span
//             key={tag.id}
//             className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full"
//           >
//             {tag.name}
//           </span>
//         ))}
//       </div>
//       <div className="author mt-2 text-sm text-gray-500">
//         Created by: {author.username}
//       </div>
//     </div>
//   );
// };
// export default TemplateCard;

import React from "react";
import Link from "next/link";

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
  username: string;
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
  return (
    <div className="template-card border shadow-md p-4 rounded-md flex flex-col">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="explanation flex-grow bg-gray-100 p-2 rounded text-sm text-gray-700 mb-2">
        {explanation}
      </div>
      <div className="tags mt-2 flex gap-2 mb-2">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full"
          >
            {tag.name}
          </span>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <div className="author text-sm text-gray-500">
          Created by: {author.username}
        </div>
        <Link href={`/templates/${id}`}>
          <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TemplateCard;
