import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBSpinner,
} from "mdb-react-ui-kit";
import {
  collection,
  query,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  setDoc,
  getDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function Follow() {
  const [users, setUsers] = useState([]);
  const [load, setLoad] = useState(false);
  const [q] = useSearchParams();
  const [isFollow, setIsFollow] = useState(false);
  const [userSearch, setUserSearch] = useState(null);
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(false);

  let spinner = (
    <MDBSpinner role="status">
      <span className="visually-hidden">Loading...</span>
    </MDBSpinner>
  );
  let k = q.get("q");

  const getAnotherUser = async () => {
    setLoad(true);
    const q = collection(db, "users");
    await getDocs(q)
      .then((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        return data;
      })
      .then((data) => {
        for (const i of data) {
          setUsers(...users, i);
        }
        console.log(data);
        setUsers(data);
        console.log(users);
        setLoad(false);
      });
  };

  const searchUser = async () => {
    setLoading(true);

    console.log(k);
    const userRef = collection(db, "users");
    const ref = query(userRef, where("name", "==", k));

    if (k !== null || k !== "") {
      await getDocs(ref).then((docSnap) => {
        docSnap.forEach((doc) => {
          setUserSearch(doc.data());
        });
      });
      setLoading(false);
    } else {
      setUserSearch(null);
      setLoading(false);
    }
  };

  const CheckStateUser = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
  };

  const handleClickFollow = async () => {
    if (currentUser != null && currentUser.uid != userSearch.uid) {
      const ref = doc(
        db,
        "following",
        currentUser.uid,
        "userFollowing",
        userSearch.uid
      );
      const userFollow = await getDoc(ref);
      if (userFollow.exists()) {
        await deleteDoc(ref);
        setIsFollow(false);
      } else {
        setDoc(ref, {}).then(() => {
          setIsFollow(true);
        });
      }
    } else {
      toast.error("Can't follow myselft !!!");
    }
  };

  const checkStatusFollow = async () => {
    if (currentUser != null && currentUser.uid != userSearch.uid) {
      const follow = await getDoc(
        doc(db, "following", currentUser.uid, "userFollowing", userSearch.uid),
        {}
      );
      if (follow !== null) {
        setIsFollow(true);
      }
    }
  };
  const handleClickUnFollow = () => {
    if (currentUser != null) {
      deleteDoc(
        doc(db, "following", currentUser.uid, "userFollowing", userSearch.uid),
        {}
      );
      setIsFollow(false);
    }
  };

  useEffect(() => {
    checkStatusFollow();
    getAnotherUser();
    CheckStateUser();
    searchUser();
  }, [q]);

  return (
    <MDBTable align="middle">
      <MDBTableHead>
        <ToastContainer />
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Title</th>
          <th scope="col">Status</th>
          <th scope="col">Position</th>
          <th scope="col">Actions</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        <tr>
          <td>
            <div className="d-flex align-items-center">
              <img
                src="https://mdbootstrap.com/img/new/avatars/8.jpg"
                alt=""
                style={{ width: "45px", height: "45px" }}
                className="rounded-circle"
              />
              <div className="ms-3">
                <p className="fw-bold mb-1">John Doe</p>
                <p className="text-muted mb-0">john.doe@gmail.com</p>
              </div>
            </div>
          </td>
          <td>
            <p className="fw-normal mb-1">Software engineer</p>
            <p className="text-muted mb-0">IT department</p>
          </td>
          <td>
            <MDBBadge color="success" pill>
              Active
            </MDBBadge>
          </td>
          <td>Senior</td>
          <td>
            <MDBBtn color="link" rounded size="sm">
              Follow
            </MDBBtn>
          </td>
        </tr>
        <tr>
          <td>
            <div className="d-flex align-items-center">
              <img
                src="https://mdbootstrap.com/img/new/avatars/6.jpg"
                alt=""
                style={{ width: "45px", height: "45px" }}
                className="rounded-circle"
              />
              <div className="ms-3">
                <p className="fw-bold mb-1">Alex Ray</p>
                <p className="text-muted mb-0">alex.ray@gmail.com</p>
              </div>
            </div>
          </td>
          <td>
            <p className="fw-normal mb-1">Consultant</p>
            <p className="text-muted mb-0">Finance</p>
          </td>
          <td>
            <MDBBadge color="primary" pill>
              Onboarding
            </MDBBadge>
          </td>
          <td>Junior</td>
          <td>
            <MDBBtn color="link" rounded size="sm">
              Follow
            </MDBBtn>
          </td>
        </tr>
        {!loading && userSearch !== null ? (
          <tr>
            <td>
              <div className="d-flex align-items-center">
                <img
                  src={userSearch.photoUrl}
                  alt=""
                  style={{ width: "45px", height: "45px" }}
                  className="rounded-circle"
                />
                <div className="ms-3">
                  <p className="fw-bold mb-1">{userSearch.name}</p>
                  <p className="text-muted mb-0">{userSearch.email}</p>
                </div>
              </div>
            </td>
            <td>
              <p className="fw-normal mb-1">Designer</p>
              <p className="text-muted mb-0">UI/UX</p>
            </td>
            <td>
              <MDBBadge color="warning" pill>
                Awaiting
              </MDBBadge>
            </td>
            <td>Senior</td>
            <td>
              {isFollow ? (
                <MDBBtn
                  onClick={handleClickUnFollow}
                  color="link"
                  rounded
                  size="sm"
                >
                  UnFollow
                </MDBBtn>
              ) : (
                <MDBBtn
                  onClick={handleClickFollow}
                  color="link"
                  rounded
                  size="sm"
                >
                  Follow
                </MDBBtn>
              )}
            </td>
          </tr>
        ) : null}
      </MDBTableBody>
    </MDBTable>
  );
}
