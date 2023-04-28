import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useCookies } from "react-cookie";
import {
  MDBTextArea,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBContainer,
} from "mdb-react-ui-kit";
import { auth } from "../firebase/firebaseConfig";
import { doc, collection, addDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
export default function Posts() {
  const [cookies, setCookie] = useCookies(["uid-current"]);
  const [currentUser, setCurrentUser] = useState(null);

  const [data, setData] = useState({});
  const handleInput = (event) => {
    let record = { [event.target.name]: event.target.value };
    setData({ ...data, ...record });
  };

  const navigate = useNavigate();

  const CheckStateUser = async () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          await setCurrentUser(docSnap.data());
        } else {
          toast.error("user don't exist");
        }
      } else {
        setCurrentUser(null);
      }
    });
  };
  const createPost = () => {
    if (data.title === "" || data.content === "")
      toast.error("title and content can't empty");
    else {
      toast.info("create success");
      addDoc(
        collection(
          db,
          "posts",
          auth.currentUser !== null && auth.currentUser.uid !== null
            ? auth.currentUser.uid
            : cookies.uid,
          "userPosts"
        ),
        {
          title: data.title,
          content: data.content,
          createdDate: new Date(),
          updatedDate: new Date(),
          subPost: data.content.substring(0, 400),
          userId: auth.currentUser.uid,
          nameAuthor: currentUser.name,
        }
      ).then(async (a) => {
        const docRef = doc(
          db,
          "posts",
          auth.currentUser !== null && auth.currentUser.uid !== null
            ? auth.currentUser.uid
            : cookies.uid,
          "userPosts",
          a.id
        );
        await updateDoc(docRef, {
          postId: a.id,
        });

        console.log(a.id);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      });
    }
  };
  useEffect(() => {
    CheckStateUser();
  }, []);
  return (
    <MDBContainer>
      <ToastContainer />
      <div className="mt-5">
        <MDBInput
          wrapperClass="mb-4"
          textarea
          id="title"
          rows={4}
          label="Title of your post"
          name="title"
          onChange={(event) => handleInput(event)}
        />
        <MDBTextArea
          label="Post content"
          id="content"
          rows={8}
          name="content"
          onChange={(event) => handleInput(event)}
        />
        <MDBCheckbox
          wrapperClass="d-flex justify-content-center mb-4"
          id="form6Example8"
          label="Create a posts?"
          defaultChecked
        />

        <MDBBtn className="mb-4" block onClick={createPost}>
          Create Your Post
        </MDBBtn>
      </div>
    </MDBContainer>
  );
}
