import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import {
  getDocs,
  collection,
  query,
  collectionGroup,
} from "firebase/firestore";
import {
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardTitle,
  MDBBtn,
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
  const getNewPost = async () => {
    setLoad(true);
    const data = [];
    const newpost = query(collectionGroup(db, "userPosts"));
    getDocs(newpost)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
      })
      .then(() => {
        setPost(data);
        setLoad(false);
      });
  };
  useEffect(() => {
    getNewPost();
  }, []);
  return (
    <>
      <>
        {load
          ? spinner
          : post.map((item) => (
              <MDBCard className="m-2 border border-info " alignment="center">
                <MDBCardHeader></MDBCardHeader>
                <MDBCardBody>
                  <MDBCardTitle>{JSON.stringify(item.title)}</MDBCardTitle>
                  <MDBCardText>
                    {JSON.parse(JSON.stringify(item.content))}
                  </MDBCardText>
                  <MDBBtn>Detail ...</MDBBtn>
                </MDBCardBody>
                <MDBCardFooter className="text-muted">
                  {JSON.stringify(item.updatedDate)}
                </MDBCardFooter>
              </MDBCard>
            ))}
        <h1></h1>{" "}
      </>
      {/* ))} */}
    </>
  );
}
