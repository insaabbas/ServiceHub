import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-[#F9E3CA] to-[#D3E3F1] text-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center h-20">
        
        {/* Logo (zoomed + shifted slightly downward) */}
        <Link to="/" className="flex items-center">
          <img
            src="/image-removebg-preview (2).png"
            alt="Logo"
            className="h-16 w-auto object-contain scale-[2.3] translate-y-1" 
          />
        </Link>

        {/* Menu Items */}
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="hover:text-blue-700 transition font-medium text-lg"
          >
            Home
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                className="hover:text-blue-700 transition font-medium text-lg"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-blue-300 hover:bg-blue-400 text-blue-900 font-semibold px-5 py-2 rounded-lg border-2 border-blue-900 shadow-md transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="px-5 py-2 rounded-lg font-semibold border-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white shadow-md transition"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="px-5 py-2 rounded-lg font-semibold border-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white shadow-md transition"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
