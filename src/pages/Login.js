import React, { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async () => {
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <style>{`
        body { margin: 0; font-family: 'Poppins', sans-serif; }

        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f172a, #020617);
        }

        .login-card {
          width: 380px;
          padding: 35px;
          border-radius: 20px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          color: white;
        }

        h2 {
          text-align: center;
          margin-bottom: 25px;
        }

        input {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border-radius: 10px;
          border: none;
          outline: none;
        }

        button {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #c77dff, #7c3aed);
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        .toggle {
          margin-top: 15px;
          text-align: center;
          cursor: pointer;
          color: #c77dff;
        }

        .error {
          color: #ef4444;
          margin-bottom: 10px;
          text-align: center;
        }
      `}</style>

      <div className="login-card">
        <h2>💸 Budget Buddy</h2>
        {error && <div className="error">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleAuth}>
          {isSignup ? "Create Account" : "Login"}
        </button>
        <div className="toggle" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "Already have an account? Login" : "New user? Sign up"}
        </div>
      </div>
    </div>
  );
}

export default Login;
