import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./Components/Game";
import Signup from "./Components/Signup";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
