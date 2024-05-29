import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./Components/Game";
import AuthRedirect from "./Components/AuthRedirect";
import Signup from "./Components/Signup";
import Signin from "./Components/Signin";
import Home from "./Components/Home";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home></Home>} />
        <Route path="/game" element={<Game />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/auth-redirect" element={<AuthRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
