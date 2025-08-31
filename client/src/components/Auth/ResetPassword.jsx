import "./Login.css";
import { useState, useEffect } from "react";

function ResetPassword() {
  useEffect(() => {
    document.title = "Reset Password";
  }, []);

  const email = location.state?.email;
  const [form, setForm] = useState({
    email,
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Reset Password</h2>
      <form className="login-form">
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
