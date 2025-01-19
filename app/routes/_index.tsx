export default function Index() {
  return (
    <div className="flex h-screen flex-col">
      {/* Navbar */}
      <nav className="dark:bg-gray-900 shadow-md p-4 border-b-2 border-rose-600">
        <div className="container flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-red-600 dark:text-gray-100">
            Admin Panel
          </h1>

          {/* Navigation Links */}
          <div className="space-x-4">
            <a href="/login" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-red-600">
              Login
            </a>
            <a href="/signup" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              Sign Up
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-grow items-center justify-center">
        <div className="flex flex-col items-center gap-16">
          <header className="flex flex-col items-center gap-9">
            <h1 className="text-2xl font-bold text-red-600 dark:text-gray-100">
              Welcome to Admin Panel
            </h1>
          </header>
        </div>
      </div>
    </div>
  );
}
