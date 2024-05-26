import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./Components/Game";
import AuthRedirect from "./Components/AuthRedirect";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import DemoSign from "./Components/DemoSign";
import Home from "./Components/Home";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home></Home>} />
        <Route path="/game" element={<Game />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth-redirect" element={<AuthRedirect />} />
        <Route path="login" element={<Login></Login>} />
        <Route path="/s" element={<DemoSign></DemoSign>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
