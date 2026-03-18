// src/layouts/NoNavbarLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../ScrollToTop.jsx";

export default function NoNavbarLayout() {
  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Outlet />
    </div>
  );
}
