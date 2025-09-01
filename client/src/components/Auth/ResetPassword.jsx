import "./Login.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function ResetPassword() {
  useEffect(() => {
    document.title = "Reset Password";
  }, []);

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const verified = location.state?.verified;
  const [form, setForm] = useState({
    email,
    password: "",
    passwordConfirm: "",
  });

  if (!verified) {
    navigate("/verify-details");
    return null;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(`${SERVER_URL}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Reset Password</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          name="password"
          type="password"
          placeholder="New Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          name="passwordConfirm"
          type="password"
          placeholder="Confirm New Password"
          value={form.passwordConfirm}
          onChange={handleChange}
          required
        />
        <button type="submit" className="login-btn">
          Submit
        </button>
      </form>
      {error && <p className="login-error">{error}</p>}
    </div>
  );
}

export default ResetPassword;
