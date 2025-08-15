import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import LoginPage from "./pages/login";
import FormPendaftaran from "./pages/pendaftaran";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/pendaftaran" element={<FormPendaftaran />} />
      </Routes>
    </Router>
  );
}

export default App;
