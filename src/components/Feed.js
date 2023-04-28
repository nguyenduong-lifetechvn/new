import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBContainer,
  MDBIcon,
  MDBRipple,
  MDBSpinner,
  MDBTextArea,
} from "mdb-react-ui-kit";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collectionGroup, getDocs, query, where } from "firebase/firestore";

export default function Feed() {
  let spinner = (
    <MDBContainer>
      <MDBBtn color="secondary" disabled>
        <MDBSpinner size="sm" role="status" tag="span" className="me-2" />
        Loading...
      </MDBBtn>
    </MDBContainer>
  );
  const [showBoxComment, setShowBoxComment] = useState(false);
  const { postId } = useParams();
  const [showAreaComment, setShowAreaComment] = useState(false);
  const [postDetail, setPostDetail] = useState();
  const [loading, setLoading] = useState(false);

  const test = async () => {
    setLoading(true);
    console.log(postId);
    const subcollectionName = "userPosts";
    const subcollectionQuery = query(
      collectionGroup(db, subcollectionName),
      where("postId", "==", postId)
    );
    await getDocs(subcollectionQuery)
      .then((docs) => {
        docs.forEach((doc) => {
          console.log(doc.data());
          setPostDetail(doc.data());
        });
      })
      .then(() => {
        setTimeout(() => {
          setLoading(false);
          console.log(postDetail);
        }, 2000);
      });
  };

  useEffect(async () => {
    setLoading(true);
    await test();
  }, []);

  return (
    <>
      <MDBContainer className="py-5  bg-secondary rounded-6">
        {loading ? (
          spinner
        ) : (
          <MDBCard style={{ maxWidth: "100%" }}>
            <MDBCardBody>
              <div className="d-flex mb-3">
                <a href="#!">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/new/avatars/18.webp"
                    className="border rounded-circle me-2"
                    alt="Avatar"
                    style={{ height: "40px" }}
                  />
                </a>
                <div>
                  <a href="#!" className="text-dark mb-0">
                    <strong>Anna Doe</strong>
                  </a>
                  <a
                    href="#!"
                    className="text-muted d-block"
                    style={{ marginTop: "-6px" }}
                  >
                    <small>10h</small>
                  </a>
                </div>
              </div>
              <div>
                <p>dfgdfgdg</p>
              </div>
            </MDBCardBody>
            <MDBRipple
              className="bg-image hover-overlay ripple rounded-0"
              rippleTag="div"
              rippleColor="light"
            >
              <img
                src="https://mdbcdn.b-cdn.net/img/new/standard/people/077.webp"
                className="w-100"
              />
              <a href="#!">
                <div
                  className="mask"
                  style={{ backgroundColor: "rgba(251, 251, 251, 0.2)" }}
                ></div>
              </a>
            </MDBRipple>
            <MDBCardBody>
              <MDBBtn floating size="lg" gradient="purple">
                <MDBIcon icon="bolt" />
              </MDBBtn>
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <MDBBtn floating size="md" gradient="purple">
                    <MDBIcon fas icon="thumbs-up" />
                  </MDBBtn>
                  <MDBBtn floating size="md" gradient="purple">
                    <MDBIcon far icon="grin-hearts" />
                  </MDBBtn>
                  <MDBBtn floating size="md" gradient="purple">
                    <MDBIcon fas icon="thumbs-up" />
                  </MDBBtn>
                  <MDBBtn floating size="md" gradient="purple">
                    <MDBIcon fas icon="thumbs-up" />
                  </MDBBtn>
                  <a href="#!">
                    <MDBIcon
                      fas
                      icon="thumbs-up"
                      color="primary"
                      className="me-1"
                      size="lg"
                    />

                    <MDBIcon
                      fas
                      icon="heart"
                      color="danger"
                      className="me-1"
                      size="lg"
                    />
                    <span>124</span>
                  </a>
                </div>
                <div>
                  <a href="#!" className="text-muted">
                    8 comments
                  </a>
                </div>
              </div>
              <div className="d-flex justify-content-between text-center border-top border-bottom mb-4">
                <MDBBtn size="lg" rippleColor="dark" color="link">
                  <MDBIcon fas icon="thumbs-up" className="me-2" /> Like
                </MDBBtn>

                <MDBBtn size="lg" rippleColor="dark" color="link">
                  <MDBIcon far icon="thumbs-up" /> Like
                </MDBBtn>
                <MDBBtn
                  size="lg"
                  rippleColor="dark"
                  color="link"
                  onClick={(event) => setShowAreaComment(!showAreaComment)}
                >
                  <MDBIcon fas icon="comment-alt" className="me-2" /> Comments
                </MDBBtn>
                <MDBBtn size="lg" rippleColor="dark" color="link">
                  <MDBIcon fas icon="share" className="me-2" /> Share
                </MDBBtn>
              </div>
              {showAreaComment ? (
                <span>
                  <div className="d-flex mb-3">
                    <a href="#!">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/new/avatars/18.webp"
                        className="border rounded-circle me-2"
                        alt="Avatar"
                        style={{ height: "40px" }}
                      />
                    </a>
                    <MDBTextArea
                      label="Message"
                      id="textAreaExample"
                      rows={2}
                      wrapperClass="w-100"
                    />
                  </div>
                  <div className="d-flex mb-3  ">
                    <MDBBtn
                      className="mx-2 float-end"
                      color="secondary"
                      style={{}}
                    >
                      Send <MDBIcon fas icon="paper-plane" />
                    </MDBBtn>
                  </div>
                  <div className="d-flex mb-3">
                    <a href="#!">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/new/avatars/8.webp"
                        className="border rounded-circle me-2"
                        alt="Avatar"
                        style={{ height: "40px" }}
                      />
                    </a>
                    <div>
                      <div className="bg-light rounded-3 px-3 py-1">
                        <a href="#!" className="text-dark mb-0">
                          <strong>Malcolm Dosh</strong>
                        </a>
                        <a href="#!" className="text-muted d-block">
                          <small>
                            Lorem ipsum dolor sit amet consectetur, adipisicing
                            elit. Natus, aspernatur!
                          </small>
                        </a>
                      </div>
                      <a href="#!" className="text-muted small ms-3 me-2">
                        <strong>Like</strong>
                      </a>
                      <a href="#!" className="text-muted small me-2">
                        <strong>Reply</strong>
                      </a>
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <a href="#!">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/new/avatars/5.webp"
                        className="border rounded-circle me-2"
                        alt="Avatar"
                        style={{ height: "40px" }}
                      />
                    </a>
                    <div>
                      <div className="bg-light rounded-3 px-3 py-1">
                        <a href="#!" className="text-dark mb-0">
                          <strong>Rhia Wallis</strong>
                        </a>
                        <a href="#!" className="text-muted d-block">
                          <small>
                            Et tempora ad natus autem enim a distinctio quaerat
                            asperiores necessitatibus commodi dolorum nam
                            perferendis labore delectus, aliquid placeat quia
                            nisi magnam.
                          </small>
                        </a>
                      </div>
                      <a href="#!" className="text-muted small ms-3 me-2">
                        <strong>Like</strong>
                      </a>

                      <a href="#!" className="text-muted small me-2">
                        <strong>Reply</strong>
                      </a>
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <a href="#!">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/new/avatars/6.webp"
                        className="border rounded-circle me-2"
                        alt="Avatar"
                        style={{ height: "40px" }}
                      />
                    </a>
                    <div>
                      <div className="bg-light rounded-3 px-3 py-1">
                        <a href="#!" className="text-dark mb-0">
                          <strong>Marcie Mcgee</strong>
                        </a>
                        <a href="#!" className="text-muted d-block">
                          <small>
                            Officia asperiores autem sit rerum architecto a
                            deserunt doloribus obcaecati, velit ab at, ad
                            delectus sapiente! Voluptatibus quaerat suscipit in
                            nostrum necessitatibus illum nemo quo beatae
                            obcaecati quidem optio fugit ipsam distinctio, illo
                            repellendus porro sequi alias perferendis ea soluta
                            maiores nisi eligendi? Mollitia debitis quam ex,
                            voluptates cupiditate magnam fugiat.
                          </small>
                        </a>
                      </div>
                      <a href="#!" className="text-muted small ms-3 me-2">
                        <strong>Like</strong>
                      </a>
                      <a href="#!" className="text-muted small me-2">
                        <strong>Reply</strong>
                      </a>
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <a href="#!">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/new/avatars/10.webp"
                        className="border rounded-circle me-2"
                        alt="Avatar"
                        style={{ height: "40px" }}
                      />
                    </a>
                    <div>
                      <div className="bg-light rounded-3 px-3 py-1">
                        <a href="#!" className="text-dark mb-0">
                          <strong>Hollie James</strong>
                        </a>
                        <a href="#!" className="text-muted d-block">
                          <small>
                            Voluptatibus quaerat suscipit in nostrum
                            necessitatibus
                          </small>
                        </a>
                      </div>
                      <a href="#!" className="text-muted small ms-3 me-2">
                        <strong>Like</strong>
                      </a>
                      <a href="#!" className="text-muted small me-2">
                        <strong>Reply</strong>
                      </a>
                    </div>
                  </div>
                </span>
              ) : null}
            </MDBCardBody>
          </MDBCard>
        )}
      </MDBContainer>
    </>
  );
}
