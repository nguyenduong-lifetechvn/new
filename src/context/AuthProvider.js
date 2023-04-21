import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { MDBSpinner } from "mdb-react-ui-kit";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const auth = getAuth();
  const [isloading, setIsLoading] = useState(true);
  let spinner = (
    <MDBSpinner role="status">
      <span className="visually-hidden">Loading...</span>
    </MDBSpinner>
  );

  useEffect(() => {
    const unsubscibed = onAuthStateChanged(auth, (user) => {
      console.log(auth, user);
      if (user) {
        // const { displayName, email, photoURL } = user;
        setUser(user);
        const uid = user.uid;
        // ...
        setIsLoading(false);
        // navigate("/");
      } else {
        // User is signed out
        // ...
        // navigate("/login");
      }
    });
    return () => unsubscibed();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
