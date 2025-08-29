import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function Register({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!name || !email || !password) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      const res = await API.post("/auth/register", { name, email, password });

      if (!res.data || !res.data.token) {
        setMessage("Registration failed: no token received");
        return;
      }

      const { token, _id, name: userName, email: userEmail, role } = res.data;

      // Save token and user info
      localStorage.setItem("token", token);
      setUser({ _id, name: userName, email: userEmail, role });

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Register error:", err);
      setMessage(
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Check console."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div
        className="max-w-md w-full p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300"
        style={{ background: "linear-gradient(135deg, #F9E3CA, #D3E3F1)" }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-200 text-blue-900 font-medium rounded-lg hover:bg-blue-300 transition"
          >
            Register
          </button>
        </form>
        {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
      </div>
    </div>
  );
}

export default Register;
