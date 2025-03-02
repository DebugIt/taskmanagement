import Login from "./components/Login";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast";
import UserContext from "./context/UserContext";
import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";

function App() {

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.style.backgroundColor = theme === "dark" ? "#0f0f0f" : "";
  }, [theme])
  

  return (
    <UserContext value={{ theme, setTheme }}>
      <div id="container" className={``}>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
        <Toaster position="top-center"/>
      </div>
    </UserContext>
  );
}

export default App;
