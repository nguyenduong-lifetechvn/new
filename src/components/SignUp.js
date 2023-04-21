import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../firebase/firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
function SignUp() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    confirmpassword: "",
  });
  const [data, setData] = useState({});

  const SignUpWithCreateNormal = async () => {
    if (data.username === "" || data.password === "")
      toast.warning("Username and Password can't empty");
    else if (data.password !== data.confirmpassword)
      toast.error("Password and Confirm incorrect");
    else {
      console.log(data);
      addDoc(collection(db, "users"), {
        name: data.fullname,
        email: data.email,
        username: data.username,
        password: data.password,
        dob: data.dob,
        createdDate: serverTimestamp(),
        updatedDate: serverTimestamp(),
      })
        .then(async (res) => {
          console.log(res);
          const t = await toast.success("Create Success");
        })

        .catch((error) => {
          toast.error(error.message);
        })
        .finally(() => navigate("/login"));
    }
  };

  const handleInput = (event) => {
    let record = { [event.target.name]: event.target.value };
    setData({ ...data, ...record });
  };

  const SignUpWithAuthEmail = () => {
    if (data.username === "" || data.password === "")
      toast.warning("Username and Password can't empty");
    else if (data.password !== data.confirmpassword)
      toast.error("Password and Confirm incorrect");
    else {
      createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
          const user = userCredential.user;
          toast.success("Create Successfull");
          navigate("/login");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
        });
    }
  };

  return (
    <MDBContainer fluid className="p-3 my-5 h-custom">
      <ToastContainer />
      <MDBRow>
        <MDBCol col="10" md="6">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
            class="img-fluid"
            alt="Phone image"
          />
        </MDBCol>

        <MDBCol col="2" md="4">
          <div className="divider d-flex align-items-center my-4">
            <p className="text-center fw-bold mx-3 mb-0">
              Register Account With:
            </p>
          </div>

          <MDBInput
            wrapperClass="mb-4 "
            label="Your Fullname"
            id="fullname"
            type="text"
            size="lg"
            name="fullname"
            onChange={(event) => handleInput(event)}
          />
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
            label="Your username"
            id="username"
            type="text"
            size="lg"
            name="username"
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
          <MDBInput
            wrapperClass="mb-4"
            label="Confirm Password"
            id="confirmpassword"
            type="password"
            size="lg"
            name="confirmpassword"
            onChange={(event) => handleInput(event)}
          />
          <MDBInput
            wrapperClass="mb-4 "
            label="Day of birth"
            id="dob"
            type="date"
            size="lg"
            name="dob"
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
            <MDBBtn
              className="mb-0 px-5"
              size="lg"
              onClick={SignUpWithCreateNormal}
            >
              Create Account
            </MDBBtn>
            <MDBBtn
              className="ms-1 px-5"
              size="lg"
              onClick={SignUpWithAuthEmail}
            >
              Create Authen Email
            </MDBBtn>
            <p className="small fw-bold mt-2 pt-1 mb-2">
              Already have an account?{" "}
              <Link to={"/login"} className="link-danger">
                Login
              </Link>
            </p>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default SignUp;
