import "./App.css";
import { BrowserRouter, Routes, Route,Navigate} from "react-router-dom";
import Game from "./Components/Game";
import AuthRedirect from "./Components/AuthRedirect";
import Signup from "./Components/Signup";
import Signin from "./Components/Signin";
import Home from "./Components/Home";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";
import Profile from "./Components/Profile";
import Fallback from "./Components/Fallback";
import UpdateProfile from "./Components/UpdateProfile";
import Leaderboard from "./Components/LeaderBoard";
import History from "./Components/History";
import Analyse from "./Components/Analyse";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home></Home>} />
        <Route path="/game" element={<Game></Game>} />
        <Route path="/profile/:id" element={<Profile></Profile>}></Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/auth-redirect" element={<AuthRedirect />} />
        <Route path="/updateProfile" element={<UpdateProfile />} />
        <Route path="/leaderboard" element={<Navigate to="/leaderboard/1" replace />} />
        <Route path="/leaderboard/:page" element={<Leaderboard></Leaderboard>} />
        <Route path="/history" element={<History></History>}/>
        <Route path="/analyse/:matchid" element={<Analyse></Analyse>}/>
        <Route path="*" element={<Fallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
