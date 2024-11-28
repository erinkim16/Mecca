import NavBar from "@/components/general/nav-bar";

export default function Admin() {
  return (
    <>
      <NavBar />
      
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            <a
              href="/admin/comments"
              className="block bg-primary text-white py-4 px-8 rounded-lg shadow-md hover:bg-primaryDark transition duration-300 ease-in-out"
            >
              Manage Comments
            </a>
            
            <a
              href="/admin/blogs"
              className="block bg-secondary text-white py-4 px-8 rounded-lg shadow-md hover:bg-secondaryDark transition duration-300 ease-in-out"
            >
              Manage Blogs
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
