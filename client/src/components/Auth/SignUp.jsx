import "./Login.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function SignUp() {
  useEffect(() => {
    document.title = "Sign Up";
  }, []);
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    let value = e.target.value;
    // Prevent users from having spaces in their username
    if (e.target.name === "username") {
      value = value.replace(/\s+/g, "");
    }
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || form.username.trim() === "") {
      setError("Username cannot be empty or have trailing spaces");
      return;
    }
    try {
      const response = await fetch(`${SERVER_URL}/api/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok) {
        navigate("/");
      } else {
        setError("Username already taken!");
      }
    } catch (err) {
      console.error("Sign up failed:", err);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Create Account</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          name="username"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <button type="submit" className="login-btn">
          Create Account
        </button>
        {error && <p className="login-error">{error}</p>}
      </form>
    </div>
  );
}
export default SignUp;
