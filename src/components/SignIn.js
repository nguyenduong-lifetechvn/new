import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import {
  doc,
  setDoc,
  getDocs,
  serverTimestamp,
  collection,
} from "firebase/firestore";
import {
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import { query, where } from "firebase/firestore";

function SignIn() {
  const navigate = useNavigate();
  const providerGG = new GoogleAuthProvider();
  const providerFB = new FacebookAuthProvider();
  const providerGH = new GithubAuthProvider();
  const [data, setData] = useState({});

  const SignInWithGoogle = async () => {
    await signInWithPopup(auth, providerGG)
      .then((result) => {
        const user = result.user;
        return user;
      })
      .then((user) => {
        console.log(user);
        setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          dob: "null",
          photoUrl: user.photoURL,
          createdDate: serverTimestamp(),
          updatedDate: serverTimestamp(),
        });
        const state = true;
        return state;
      })
      .then((state) => {
        if (state === true) navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("errorMessage: ", errorMessage);
      });
  };

  const SignInWithAuthEmail = async () => {
    console.log(data);
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(userCredential);
        toast.success("Sign In Success");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.warning(errorCode);
        toast.error(errorMessage);
      });
  };

  const handleInput = (event) => {
    let record = { [event.target.name]: event.target.value };
    setData({ ...data, ...record });
  };

  const SignInWithNormal = async (username, password) => {
    const q = query(
      collection(db, "users"),
      where("username", "==", username),
      where("password", "==", password)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 0) {
    }
  };

  const SignInWithFacebook = async () => {
    await signInWithPopup(auth, providerFB)
      .then((result) => {
        const user = result.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  const SignInWithGitHub = async () => {
    await signInWithPopup(auth, providerGH)
      .then((result) => {
        const user = result.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };
  return (
    <MDBContainer fluid className="p-3 my-5 h-custom">
      <ToastContainer />
      <MDBRow>
        <MDBCol col="10" md="6">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            class="img-fluid"
            alt="Sample image"
          />
        </MDBCol>

        <MDBCol col="2" md="4">
          <div className="d-flex flex-row align-items-center justify-content-center">
            <p className="lead fw-normal mb-0 me-3">Sign in with</p>

            <MDBBtn
              className="m-1"
              style={{ backgroundColor: "#3b5998" }}
              href="#"
              onClick={SignInWithFacebook}
            >
              <MDBIcon fab icon="facebook-f" />
            </MDBBtn>
            <MDBBtn
              onClick={SignInWithGoogle}
              className="m-1"
              style={{ backgroundColor: "#dd4b39" }}
              href="#"
            >
              <MDBIcon fab icon="google" />
            </MDBBtn>
            <MDBBtn
              onClick={SignInWithGitHub}
              className="m-1"
              style={{ backgroundColor: "#333333" }}
              href="#"
            >
              <MDBIcon fab icon="github" />
            </MDBBtn>
            <MDBBtn
              className="m-1"
              style={{ backgroundColor: "#481449" }}
              href="#"
            >
              <MDBIcon fab icon="slack-hash" />
            </MDBBtn>
          </div>

          <div className="divider d-flex align-items-center my-4">
            <p className="text-center fw-bold mx-3 mb-0">Or</p>
          </div>

          <MDBInput
            wrapperClass="mb-4"
            label="Email address"
            id="email"
            type="email"
            size="lg"
            name="email"
            onChange={(event) => handleInput(event)}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Password"
            id="password"
            type="password"
            size="lg"
            name="password"
            onChange={(event) => handleInput(event)}
          />

          <div className="d-flex justify-content-between mb-4">
            <MDBCheckbox
              name="flexCheck"
              value=""
              id="flexCheckDefault"
              label="Remember me"
            />
            <a href="!#">Forgot password?</a>
          </div>

          <div className="text-center text-md-start mt-4 pt-2">
            <MDBBtn className="mb-0 px-5" size="lg" onClick={SignInWithNormal}>
              Login
            </MDBBtn>
            <MDBBtn
              className="mb-0 px-5 ms-1"
              size="lg"
              onClick={SignInWithAuthEmail}
            >
              Login Auth Email
            </MDBBtn>
            <p className="small fw-bold mt-2 pt-1 mb-2">
              Don't have an account?{" "}
              <Link to={"/register"} className="link-danger">
                Register
              </Link>
            </p>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default SignIn;