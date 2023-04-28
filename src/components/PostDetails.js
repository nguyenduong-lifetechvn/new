import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBRow,
  MDBSpinner,
  MDBTextArea,
  MDBTypography,
} from "mdb-react-ui-kit";
import {
  addDoc,
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { auth, db } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import Moment from "react-moment";
import { toast, ToastContainer } from "react-toastify";

export default function PostDetails() {
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [load, setLoad] = useState(false);
  const [showBoxComment, setShowBoxComment] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [allComment, setAllComment] = useState([]);
  const [comment, setComment] = useState();
  const [loadComment, setLoadComment] = useState(false);

  let spinner = (
    <MDBContainer>
      <MDBBtn color="secondary" disabled>
        <MDBSpinner size="sm" role="status" tag="span" className="me-2" />
        Loading...
      </MDBBtn>
    </MDBContainer>
  );
  const CheckStateUser = async () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          await setCurrentUser(docSnap.data());
        } else {
        }
      } else {
        setCurrentUser(null);
      }
    });
  };
  const formatDate = (string) => {
    var options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(string).toLocaleDateString([], options);
  };

  const createComment = async () => {
    setComment("");
    setLoadComment(true);
    if (comment === "") toast.error("Comment can't empty");
    else {
      toast.info("create success");
      await addDoc(collection(db, "comments", postId, "postComments"), {
        userRef: `users/${currentUser.uid}`,
        content: comment,
        createdDate: new Date(),
      }).then(() => {
        setShowBoxComment(false);

        setLoadComment(false);
      });
    }
  };

  const loadAllComment = async () => {
    setLoadComment(true);
    const ref = collection(db, "comments", postId, "postComments");
    onSnapshot(
      query(ref, orderBy("createdDate", "desc")),

      (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((comment) => {
          data.push(comment.data());
        });

        setAllComment(data);
        setTimeout(() => {
          setLoadComment(false);
        }, 500);
      }
    );
  };

  const loadPostDetails = async () => {
    setLoad(true);
    const ref = collectionGroup(db, "userPosts");
    onSnapshot(query(ref, where("postId", "==", postId)), (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      setPost(data);
      setTimeout(() => {
        console.log(post);
        setLoad(false);
      }, 1000);
    });
  };

  useEffect(() => {
    loadPostDetails();

    CheckStateUser();
    loadAllComment();
  }, [postId]);
  return (
    <section className="" style={{ backgroundColor: "#eee" }}>
      <ToastContainer />
      <MDBContainer className="py-5" style={{ maxWidth: "100%" }}>
        {load ? (
          spinner
        ) : (
          <MDBRow className="justify-content-center">
            <MDBCol md="12" lg="10" xl="8">
              <MDBCard>
                <MDBCardBody>
                  <div className="d-flex flex-start align-items-center">
                    <MDBCardImage
                      className="rounded-circle shadow-1-strong me-3"
                      src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(19).webp"
                      alt="avatar"
                      width="60"
                      height="60"
                    />
                    <div>
                      <h6 className="fw-bold text-primary mb-1">
                        {post.nameAuthor}
                      </h6>
                      <p className="text-muted small mb-0">
                        Shared publicly -{" "}
                        <Moment format="D MMM YYYY">{post.updatedDate}</Moment>
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 mb-4 pb-2">{post.content}</p>

                  <div className="small d-flex justify-content-start">
                    <a href="#!" className="d-flex align-items-center me-3">
                      <MDBIcon far icon="thumbs-up me-2" />
                      <p className="mb-0">Like</p>
                    </a>
                    <a
                      href="#!"
                      onClick={() => {
                        setShowBoxComment(!showBoxComment);
                      }}
                      className="d-flex align-items-center me-3"
                    >
                      <MDBIcon far icon="comment-dots me-2" />
                      <p className="mb-0">Comment</p>
                    </a>
                    <a href="#!" className="d-flex align-items-center me-3">
                      <MDBIcon fas icon="share me-2" />
                      <p className="mb-0">Share</p>
                    </a>
                  </div>
                </MDBCardBody>
                {showBoxComment ? (
                  <MDBCardFooter
                    className="py-3 border-0"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >
                    <div className="d-flex flex-start w-100">
                      <MDBCardImage
                        className="rounded-circle shadow-1-strong me-3"
                        src={currentUser.photoUrl}
                        alt="avatar"
                        width="40"
                        height="40"
                      />
                      <MDBTextArea
                        value={comment}
                        onChange={(e) => {
                          setComment(e.target.value);
                        }}
                        label="Message"
                        id="textAreaExample"
                        rows={4}
                        style={{ backgroundColor: "#fff" }}
                        wrapperClass="w-100"
                      />
                    </div>
                    <div className="float-end mt-2 pt-1">
                      <MDBBtn
                        size="sm"
                        className="me-1"
                        onClick={createComment}
                      >
                        Post comment
                      </MDBBtn>
                      <MDBBtn
                        outline
                        size="sm"
                        onClick={() => setShowBoxComment(false)}
                      >
                        Cancel
                      </MDBBtn>
                    </div>
                  </MDBCardFooter>
                ) : null}
              </MDBCard>
              {allComment.map((comment) => (
                <MDBCard className="m-3">
                  <MDBCardBody>
                    <div className="d-flex flex-start">
                      <MDBCardImage
                        className="rounded-circle shadow-1-strong me-3"
                        src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(21).webp"
                        alt="avatar"
                        width="40"
                        height="40"
                      />

                      <div className="w-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <MDBTypography
                            tag="h6"
                            className="text-primary fw-bold mb-0"
                          >
                            t_anya
                            <span className="text-dark ms-2">
                              <span className="text-primary">
                                @rashida_jones
                              </span>{" "}
                              {comment.content}
                            </span>
                          </MDBTypography>
                          <p className="mb-0">
                            {" "}
                            <Moment fromNow>
                              {comment.createdDate.toDate()}
                            </Moment>
                          </p>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <p className="small mb-0" style={{ color: "#aaa" }}>
                            <a href="#!" className="link-grey">
                              Remove
                            </a>{" "}
                            •
                            <a href="#!" className="link-grey">
                              Reply
                            </a>{" "}
                            •
                            <a href="#!" className="link-grey">
                              Translate
                            </a>
                          </p>
                          <div className="d-flex flex-row">
                            <MDBIcon
                              far
                              icon="check-circle text-primary"
                              style={{ color: "#aaa" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              ))}
            </MDBCol>
          </MDBRow>
        )}
      </MDBContainer>
    </section>
  );
}
