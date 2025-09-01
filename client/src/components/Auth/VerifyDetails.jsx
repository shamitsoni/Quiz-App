import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function VerifyDetails() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState("email");
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${SERVER_URL}/api/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email }),
    });
    const data = await res.json();
    if (data.success) {
      setStep("code");
    }
    setMessage(data.message);
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${SERVER_URL}/api/verify-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, code: code }),
    });
    const data = await res.json();
    setMessage(data.message);
    if (data.success) {
      console.log("Code valid");
      navigate("/reset-password", { state: { email, verified: true } });
    } else {
      console.log("Wrong code");
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

      {step === "code" && (
        <form onSubmit={handleCodeSubmit}>
          <input
            name="code"
            type="text"
            placeholder="Enter Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button>Verify</button>
        </form>
      )}
    </>
  );
}

export default VerifyDetails;
