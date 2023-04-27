import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownItem,
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
  MDBDropdownToggle,
} from "mdb-react-ui-kit";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useCookies } from "react-cookie";
import DropList from "../components/DropList";

export default function Header() {
  const [showBasic, setShowBasic] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [status, setStatus] = useState(true);
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["uid-current"]);

  const [q, setQ] = useState("");
  let userInfor = (
    <>
      <MDBNavbarItem>
        <MDBNavbarLink>
          <Link style={{ color: "white" }} className="nav-link" to={"/login"}>
            Sign In
          </Link>
        </MDBNavbarLink>
      </MDBNavbarItem>

      <MDBNavbarItem>
        <MDBNavbarLink>
          <Link
            style={{ color: "white" }}
            className="nav-link"
            to={"/register"}
          >
            Sign Up
          </Link>
        </MDBNavbarLink>
      </MDBNavbarItem>
    </>
  );
  const getUserByUidFromCookie = async () => {
    const userRef = doc(db, "users", cookies.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setCurrentUser(docSnap.data());
      console.log(currentUser);
    } else {
      console.log("No such document!");
    }
  };
  const CheckStateUser = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
  };
  const SignOut = async () => {
    if (cookies !== null) {
      removeCookie("uid");
      setStatus(false);
      navigate("/login");
    }
    await signOut(auth)
      .then(() => {
        setStatus(false);

        navigate("/login");
      })
      .catch((error) => {
        alert(error);
      });
  };

  const SearchUser = async (e) => {
    e.preventDefault();
    navigate(`/follow?q=${q}`);
  };

  useEffect(() => {
    CheckStateUser();
    getUserByUidFromCookie();
  }, [cookies, status]);

  if (currentUser !== null)
    userInfor = (
      <>
        <MDBNavbarItem>
          <MDBNavbarLink>
            <Link style={{ color: "white" }} className="nav-link" to={"/post"}>
              Create Your Post
            </Link>
          </MDBNavbarLink>
        </MDBNavbarItem>

        <MDBNavbarItem>
          <MDBDropdown>
            <MDBNavbarLink className="d-flex align-items-center">
              <MDBDropdownToggle
                style={{ color: "white", marginTop: "1px" }}
                className="hidden-arrow "
                rounded
                color="#778899"
              >
                Chào {currentUser.name}
              </MDBDropdownToggle>
            </MDBNavbarLink>
            <MDBDropdownMenu>
              <MDBDropdownItem link>
                <Link
                  style={{ color: "black" }}
                  className="text-decoration-none"
                  to={"/user"}
                >
                  MyProfile
                </Link>
              </MDBDropdownItem>
              <MDBDropdownItem link>Settings</MDBDropdownItem>
              <MDBDropdownItem link onClick={SignOut}>
                Logout
              </MDBDropdownItem>
            </MDBDropdownMenu>
          </MDBDropdown>
        </MDBNavbarItem>
      </>
    );

  return (
    <MDBNavbar
      className="m-3 rounded border border-secondary"
      expand="lg"
      light
      style={{ backgroundColor: "#778899", color: "white" }}
    >
      <MDBContainer fluid>
        <MDBNavbarBrand>
          <Link style={{ color: "white" }} className="" to={"/"}>
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
                <Link style={{ color: "white" }} className="nav-link" to={"/"}>
                  Home
                </Link>
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink active aria-current="page">
                <Link
                  style={{ color: "white" }}
                  className="nav-link"
                  to={"/follow"}
                >
                  Follower
                </Link>
              </MDBNavbarLink>
            </MDBNavbarItem>

            {userInfor}
            <DropList />
          </MDBNavbarNav>

          <form
            onSubmit={SearchUser}
            style={{ width: "500px" }}
            className="d-flex input-group "
          >
            <input
              style={{ color: "black", borderRadius: "5px" }}
              type="search"
              className="form-control"
              placeholder="Type content that you find ..."
              aria-label="Search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <br />
            <MDBBtn
              style={{ color: "white", borderRadius: "10px" }}
              className="mx-2"
              color="tertiary"
              rippleColor="light"
              type="submit"
            >
              Search
            </MDBBtn>
          </form>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}
