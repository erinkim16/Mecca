# 📜 Scriptorium

Scriptorium is a collaborative web-based platform for writing, executing, and sharing code templates. It allows users to create, store, and share reusable code snippets while also providing an interactive environment for learning, coding, and sharing knowledge through blog posts. With built-in syntax highlighting, secure code execution, and an intuitive user interface, Scriptorium empowers developers to collaborate and grow together.

## 🚀 Features

### 🔐 **Authentication & Authorization**
- **User Roles**: Visitors, Authenticated Users, and System Administrators with distinct access privileges.
- **Account Management**: Sign up, log in, log out, and update profile information (name, email, profile picture, etc.).
- **Secure Access**: JWT-based authentication for secure user sessions.

### ✍️ **Code Writing & Execution**
- **Multi-Language Support**: Write and execute code in C, C++, Java, Python, and JavaScript.
- **Syntax Highlighting**: Dynamic code highlighting for improved readability.
- **Real-time Code Execution**: Instantly run code and see the output.
- **Input Support**: Provide standard input (stdin) to interact with code that requires user input.
- **Error Handling**: Clear error messages for compile errors, runtime errors, and timeouts.
- **Secure Execution**: User code runs in an isolated Docker container with time and memory limits to prevent system abuse.

### 💾 **Code Templates**
- **Save & Reuse**: Save reusable code templates with titles, tags, and descriptions.
- **Fork Templates**: Use, modify, and save versions of other users' templates.
- **Template Management**: View, edit, and delete templates as needed.
- **Template Search**: Easily search for templates by title, tags, and content.

### 📝 **Blog Posts**
- **Create Blog Posts**: Write, edit, and delete blog posts linked to code templates.
- **Interactive Learning**: Browse and read blog posts to learn from other users’ experiences.
- **Content Discovery**: Search for blog posts by title, tags, content, and related templates.
- **Comment & Reply**: Engage in discussions through comments and replies on blog posts.
- **Rating System**: Upvote or downvote blog posts and comments to identify valuable discussions.

### 🛡️ **Content Moderation**
- **Report Inappropriate Content**: Report inappropriate blog posts or comments.
- **Admin Controls**: System administrators can flag or hide reported content, ensuring a safe environment for all users.

### 🎨 **User Experience**
- **Clean User Interface**: A modern, minimalistic UI to enhance focus and productivity.
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices.
- **Dark & Light Themes**: Toggle between light and dark modes for a personalized coding experience.

---

## 🛠️ **Tech Stack**
- **Frontend**: React, TailwindCSS, TypeScript
- **Backend**: Next.js, Prisma, REST API
- **Database**: SQLite (development)
- **Containerization**: Docker for isolated code execution
- **Authentication**: JWT for secure access control
- **Other Tools**: ESLint, Prettier, Git, VS Code

