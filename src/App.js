import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./layout/Header";
import Posts from "./components/Posts";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import AuthProvider, { AuthContext } from "./context/AuthProvider";
import Home from "./components/Home";
import UserInfor from "./components/UserInfor";
import Footer from "./layout/Footer";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/post" element={<Posts />} />
          <Route path="/user" element={<UserInfor />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
