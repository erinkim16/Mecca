import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./menu-bar";
import TagInput from "../general/tag-input";
import axios from "axios";
import { useRouter } from "next/router";

interface BlogEditorProps {
  initialBlog?: {
    id: number;
    title: string;
    description: string;
    tags: { name: string }[];
    content: any; // JSON content
    codeTemplates: string[];
  };
  isEditMode?: boolean;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ initialBlog, isEditMode }) => {
  const [title, setTitle] = useState(initialBlog?.title || "");
  const [description, setDescription] = useState(initialBlog?.description || "");
  const [tags, setTags] = useState<string[]>(
    initialBlog?.tags.map((tag) => tag.name) || []
  );
  const [tagInput, setTagInput] = useState<string>("");
  const [codeTemplates, setCodeTemplates] = useState<string[]>(
    initialBlog?.codeTemplates || []
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialBlog?.content || { type: "doc", content: [] }, // Use parsed JSON
  });

  const saveBlogPost = async () => {
    if (!editor) return;
  
    const content = editor.getJSON();
  
    console.log("Saving content:", {
      title,
      description,
      content,
      tags,
      codeTemplates,
    });
  
    if (!title || !description || !content) {
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
  
      const url = isEditMode ? `/api/blogs/${initialBlog?.id}` : "/api/blogs";
      const method = isEditMode ? "PUT" : "POST";
  
      const response = await axios({
        url,
        method,
        data: {
          title,
          description,
          content,
          tags,
          codeTemplates,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      

      console.log("Save blog post", response)
      if (response.status === 200) {
        setMessage(
          isEditMode
            ? "Blog post updated successfully!"
            : "Blog post created successfully!"
        );
        router.push(`/blogs/${response.data.updatedBlog.id}`);
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
