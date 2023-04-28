import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import Moment from "react-moment";
import {
  collection,
  query,
  collectionGroup,
  onSnapshot,
  orderBy,
  getDoc,
  doc,
} from "firebase/firestore";
import {
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardTitle,
  MDBCardFooter,
  MDBCardText,
  MDBSpinner,
  MDBContainer,
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";

export default function Home() {
  const [post, setPost] = useState([]);
  const [load, setLoad] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  let spinner = (
    <MDBContainer>
      <MDBBtn color="secondary" disabled>
        <MDBSpinner size="sm" role="status" tag="span" className="me-2" />
        Loading...
      </MDBBtn>
    </MDBContainer>
  );

  const getAllPostBycollectionGroup = async () => {
    setLoad(true);
    const newpost = collectionGroup(db, "userPosts");

    onSnapshot(
      query(newpost, orderBy("createdDate", "desc")),
      (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });

        setPost(data);
        setTimeout(() => {
          console.log(post);
          setLoad(false);
        }, 1000);
      }
    );
  };
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

  useEffect(() => {
    getAllPostBycollectionGroup();
    CheckStateUser();
  }, []);

  return (
    <>
      <MDBRow className="me-3 ms-3">
        <ToastContainer />
        {load
          ? spinner
          : post.map((item) => (
              <MDBCol md="12" lg="4" className="">
                <MDBCard
                  className="m-2 border border-secondary "
                  alignment="center"
                >
                  <MDBCardHeader></MDBCardHeader>
                  <MDBCardBody>
                    <MDBCardTitle>{JSON.stringify(item.title)}</MDBCardTitle>
                    <MDBCardText>
                      {JSON.parse(JSON.stringify(item.subPost))}...
                    </MDBCardText>
                  </MDBCardBody>

                  <MDBCardFooter className="text-muted">
                    Đăng <Moment fromNow>{item.updatedDate.toDate()}</Moment>{" "}
                    bởi {item.nameAuthor}
                  </MDBCardFooter>

                  <MDBCardFooter className="text-muted">
                    <Link to={`/post-detail/${item.postId}`}>
                      {" "}
                      Xem chi tiết
                    </Link>
                  </MDBCardFooter>
                </MDBCard>
              </MDBCol>
            ))}
        <h1></h1>{" "}
      </MDBRow>
    </>
  );
}
