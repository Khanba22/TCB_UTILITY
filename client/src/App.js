import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CertificateDesignPage from "./pages/CertificateDesignPage";

function App() {
  return (
    <Routes>
      <Route path="/" index element={<HomePage />} />
      <Route path="/design" element = {<CertificateDesignPage/>} />
    </Routes>
  );
}

export default App;
