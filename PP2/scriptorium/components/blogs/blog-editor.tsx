import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./menu-bar";
import TagInput from "../general/tag-input";
import axios from "axios";

interface BlogEditorProps {
  initialBlog?: {
    id: number;
    title: string;
    description: string;
    tags: { name: string }[];
    content: object; // Properly typed as object for JSON
    codeTemplates: string[];
  };
  isEditMode?: boolean;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ initialBlog, isEditMode }) => {
  const [title, setTitle] = useState(initialBlog?.title || "");
  const [description, setDescription] = useState(initialBlog?.description || "");
  const [tags, setTags] = useState<string[]>(
    initialBlog?.tags?.map((tag) => tag.name) || []
  );
  const [tagInput, setTagInput] = useState<string>("");
  const [codeTemplates, setCodeTemplates] = useState<string[]>(
    initialBlog?.codeTemplates || []
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Parse content if it's a string
  const parsedContent = (() => {
    try {
      return typeof initialBlog?.content === "string"
        ? JSON.parse(initialBlog.content)
        : initialBlog?.content || { type: "doc", content: [{ type: "paragraph" }] };
    } catch (error) {
      console.error("Invalid JSON content. Falling back to default:", error);
      return { type: "doc", content: [{ type: "paragraph" }] };
    }
  })();

  // Initialize the editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: parsedContent, // Pass parsed JSON object
  });

  const saveBlogPost = async () => {
    if (!editor) return;

    const content = editor.getJSON();
    console.log("Editor content before saving:", content);

    if (!title.trim() || !description.trim() || !content) {
      alert("Please fill out all required fields.");
      return;
    }

    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("You must be logged in to save a blog post.");
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const url = isEditMode
        ? `/api/blogs/${initialBlog?.id}` // Update blog
        : "/api/blogs"; // Create new blog

      const method = isEditMode ? "PUT" : "POST";

      const response = await axios({
        url,
        method,
        data: {
          title,
          description,
          content: JSON.stringify(content), // Save JSON content
          tags,
          codeTemplates,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setMessage(isEditMode ? "Blog post updated successfully!" : "Blog post created successfully!");
      }
    } catch (error) {
      console.error("Error saving blog post:", error);
      setMessage("An error occurred while saving the blog post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blog-editor">
      <h1>{isEditMode ? "Edit Blog Post" : "Create a New Blog Post"}</h1>

      <input
        type="text"
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input-class"
      />

      <input
        placeholder="Short Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="input-class"
      />

      <TagInput tags={tags} setTags={setTags} input={tagInput} setInput={setTagInput} />

      <input
        type="text"
        placeholder="Code Templates (comma-separated URLs)"
        value={codeTemplates.join(", ")}
        onChange={(e) =>
          setCodeTemplates(e.target.value.split(",").map((url) => url.trim()))
        }
        className="input-class"
      />

      {editor && <MenuBar editor={editor} />}
      <EditorContent editor={editor} className="editor-content" />

      <button onClick={saveBlogPost} className="save-button" disabled={loading}>
        {loading ? "Saving..." : isEditMode ? "Update Blog Post" : "Save Blog Post"}
      </button>

      {message && <p className="feedback-message">{message}</p>}
    </div>
  );
};


export default BlogEditor;
