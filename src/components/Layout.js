import React from "react";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "100px" }}>{children}</div>
    </>
  );
}

export default Layout;
