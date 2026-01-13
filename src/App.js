import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";


import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Vouchers from "./pages/Vouchers";   
import Savings from "./pages/Savings"; 
import About from "./pages/About";
 
import Layout from "./components/Layout";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#020617",
          color: "white",
          fontSize: "18px",
        }}
      >
        Loading Budget Buddy...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
       
        <Route
          path="/login"
          element={user ? <Navigate to="/home" /> : <Login />}
        />

        
        <Route
          path="/home"
          element={
            user ? (
              <Layout>
                <Home />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

  
        <Route
          path="/dashboard"
          element={
            user ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {}
        <Route
          path="/vouchers"
          element={
            user ? (
              <Layout>
                <Vouchers />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {}
        <Route
          path="/savings"
          element={
            user ? (
              <Layout>
                <Savings />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/about"
          element={
            user ? (
              <Layout>
                <About />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />


        {}
        <Route
          path="/"
          element={<Navigate to={user ? "/home" : "/login"} />}
        />

        {}
        <Route
          path="*"
          element={<Navigate to={user ? "/home" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
