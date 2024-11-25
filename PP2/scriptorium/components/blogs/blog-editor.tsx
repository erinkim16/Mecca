import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./menu-bar"; // Ensure proper path to MenuBar
import TagInput from "../general/tag-input"; // Import the TagInput component

const BlogEditor = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>(""); // Input for TagInput
  const [codeTemplates, setCodeTemplates] = useState<string[]>([]);

  const editor = useEditor({
    extensions: [StarterKit],
    content: `<p>Start your blog here...</p>`,
  });

  const saveBlogPost = async () => {
    if (!editor) return;

    const content = editor.getJSON();

    if (!title || !description || !content) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          content,
          tags,
          codeTemplates,
        }),
      });

      if (response.ok) {
        alert("Blog post saved successfully!");
      } 
    } catch (error) {
      console.log("Error saving blog post:", error);
      alert("An error occurred while saving the blog post.");
    }
  };

  return (
    <div className="blog-editor">
      <h1>Create a New Blog Post</h1>

      {/* Title Input */}
      <input
        type="text"
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input-class"
      />

      {/* Description Input */}
      <input
        placeholder="Short Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="input-class"
      />

      {/* Tag Input Component */}
      <TagInput
        tags={tags}
        setTags={setTags}
        input={tagInput}
        setInput={setTagInput}
      />

      {/* Code Templates Input */}
      <input
        type="text"
        placeholder="Code Templates (comma-separated URLs)"
        value={codeTemplates.join(", ")}
        onChange={(e) =>
          setCodeTemplates(e.target.value.split(",").map((url) => url.trim()))
        }
        className="input-class"
      />

      {/* Rich Text Editor */}
      {editor && <MenuBar editor={editor} />}
      <EditorContent editor={editor} className="editor-content" />

      {/* Save Button */}
      <button onClick={saveBlogPost} className="save-button">
        Save Blog Post
      </button>
    </div>
  );
};

export default BlogEditor;
