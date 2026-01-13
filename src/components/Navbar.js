import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { NavLink } from "react-router-dom";


export default function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {}
      <div className="nav-left">
        <span className="logo" onClick={() => navigate("/home")}>
          Budget Buddy
        </span>
      </div>

      {}
      <div className="nav-center">
  <NavLink to="/dashboard" className="nav-icon">
    📊 Dashboard
  </NavLink>

  <NavLink to="/vouchers" className="nav-icon">
    🎟 Vouchers
  </NavLink>

  <NavLink to="/savings" className="nav-icon">
    💰 Savings Plan
  </NavLink>
  <NavLink to="/about" className="nav-icon">
  ℹ️ About
</NavLink>

</div>


      {}
      {user && (
        <div className="profile" ref={dropdownRef}>
          <div className="avatar" onClick={() => setOpen(!open)}>
            {user.email?.[0]?.toUpperCase()}
          </div>

          {open && (
            <div className="dropdown">
              <p className="email">{user.email}</p>
              <Link to="/dashboard">Dashboard</Link>
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
