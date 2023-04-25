import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./layout/Header";
import Posts from "./components/Posts";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

import Home from "./components/Home";
import UserInfor from "./components/UserInfor";
import Footer from "./layout/Footer";
import { useCookies } from "react-cookie";
import "moment/locale/vi";

function App() {
  const [cookies, setCookie] = useCookies(["name"]);

  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/post" element={<Posts />} />
        <Route path="/user" element={<UserInfor />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
