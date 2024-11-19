import React from "react"
import { JSONContent } from "@tiptap/core"; // If using TipTap
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface BlogPostProps {
    title: string;
    author: string;
    tags: string[];
    content: string;
    createdAt: string;
}

const BlogPostView: React.FC<BlogPostProps> = ({ title, author, tags, content, createdAt }) => {
    const parsedContent: JSONContent = JSON.parse(content);

  const editor = useEditor({
    extensions: [StarterKit],
    content: parsedContent,
    editable: false, // Set to read-only
  });

    return (
        <div className='blog-post'>
            <h1 className='title'>{title}</h1>
            <p className="author">
                By <strong>{author}</strong> on {new Date(createdAt).toLocaleDateString()}
            </p>
            {editor && <EditorContent editor={editor} />}
        </div>
    );
};

export default BlogPostView;