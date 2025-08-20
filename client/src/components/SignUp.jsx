import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  useEffect(() => {
    document.title = "Sign Up";
  }, []);
  const [form, setForm] = useState({ username: "", password: "" });
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
      const response = await fetch("http://localhost:5000/api/sign-up", {
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
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Create Account</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
export default SignUp;
