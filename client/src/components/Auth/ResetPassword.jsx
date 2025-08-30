import { useState } from "react";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${SERVER_URL}/api/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("One-time reset code sent to your email.");
    } else {
      setMessage("Invalid email");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Confirm Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button>Verify</button>
      </form>
      {message && <p>{message}</p>}
    </>
  );
}

export default ResetPassword;
