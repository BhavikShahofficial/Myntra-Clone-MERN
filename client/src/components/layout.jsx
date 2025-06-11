import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function ShopLayout() {
  return (
    <div className="d-flex flex-column bg-white ">
      {/* common header */}
      <Header />
      <main className="d-flex flex-column w-100">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default ShopLayout;
