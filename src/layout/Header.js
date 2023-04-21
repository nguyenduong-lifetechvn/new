import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBBtn,
  MDBCollapse,
} from "mdb-react-ui-kit";
import { auth, db } from "../firebase/firebaseConfig";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
export default function Header() {
  const [showBasic, setShowBasic] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [status, setStatus] = useState(true);
  const navigate = useNavigate();
  let userInfor = (
    <>
      <MDBNavbarItem>
        <MDBNavbarLink>
          <Link className="nav-link" to={"/login"}>
            Sign In
          </Link>
        </MDBNavbarLink>
      </MDBNavbarItem>

      <MDBNavbarItem>
        <MDBNavbarLink>
          <Link className="nav-link" to={"/register"}>
            Sign Up
          </Link>
        </MDBNavbarLink>
      </MDBNavbarItem>
    </>
  );
  const CheckStateUser = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        setCurrentUser(user);
      } else {
      }
    });
  };
  const SignOut = async () => {
    await signOut(auth)
      .then(() => {
        setStatus(false);
        // Sign-out successful.
        navigate("/login");
      })
      .catch((error) => {
        alert(error);
      });
  };
  useEffect(() => {
    CheckStateUser();
  }, [currentUser]);

  if (currentUser !== null)
    userInfor = (
      <>
        <MDBNavbarItem>
          <MDBNavbarLink active aria-current="page">
            {" "}
            <Link className="nav-link text-danger" to="/user">
              {/* <img
                src={currentUser.photoUrl}
                width="20"
                className="rounded-circle"
              /> */}
              Chào {currentUser.displayName}
            </Link>
          </MDBNavbarLink>
        </MDBNavbarItem>
        <MDBBtn className="me-0" color="secondary" onClick={SignOut}>
          Sign Out
        </MDBBtn>
      </>
    );
  return (
    <MDBNavbar
      className="m-3 rounded border border-info"
      expand="lg"
      light
      style={{ backgroundColor: "#e3f2fd" }}
    >
      <MDBContainer fluid>
        <MDBNavbarBrand>
          <Link className="" to={"/"}>
            MY APP
          </Link>
        </MDBNavbarBrand>

        <MDBNavbarToggler
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setShowBasic(!showBasic)}
        >
          <MDBIcon icon="bars" fas />
        </MDBNavbarToggler>

        <MDBCollapse navbar show={showBasic}>
          <MDBNavbarNav className="mr-auto mb-2 mb-lg-0">
            <MDBNavbarItem>
              <MDBNavbarLink active aria-current="page">
                <Link className="nav-link" to={"/"}>
                  Home
                </Link>
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink>
                <Link className="nav-link" to={"/post"}>
                  Create Your Post
                </Link>
              </MDBNavbarLink>
            </MDBNavbarItem>
            {userInfor}
          </MDBNavbarNav>
          <form className="d-flex input-group w-50">
            <input
              type="search"
              className="form-control"
              placeholder="Type content that you find ..."
              aria-label="Search"
            />
            <MDBBtn color="danger">Search</MDBBtn>
          </form>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}
