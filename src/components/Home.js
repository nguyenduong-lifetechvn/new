import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import Moment from "react-moment";
import {
  collection,
  query,
  collectionGroup,
  onSnapshot,
  orderBy,
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
} from "mdb-react-ui-kit";

export default function Home() {
  const [post, setPost] = useState([]);
  const [load, setLoad] = useState(false);

  let spinner = (
    <MDBSpinner role="status">
      <span className="visually-hidden">Loading...</span>
    </MDBSpinner>
  );

  const postsRefAll = collection(db, "posts");

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
        setLoad(false);
      }
    );
  };

  useEffect(() => {
    getAllPostBycollectionGroup();
  }, []);

  return (
    <>
      <MDBRow className="me-3 ms-3">
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
                      {JSON.parse(JSON.stringify(item.content))}
                    </MDBCardText>
                    <MDBBtn>Detail ...</MDBBtn>
                  </MDBCardBody>
                  <Moment fromNow>{item.updatedDate.toDate()}</Moment>
                  <MDBCardFooter className="text-muted"></MDBCardFooter>
                  <MDBCardFooter className="text-muted"></MDBCardFooter>
                </MDBCard>
              </MDBCol>
            ))}
        <h1></h1>{" "}
      </MDBRow>
    </>
  );
}
