import React, { useEffect, useState } from "react";
import {
  MDBBadge,
  MDBIcon,
  MDBBtn,
  MDBListGroup,
  MDBListGroupItem,
  MDBContainer,
  MDBInput,
} from "mdb-react-ui-kit";
import { auth, db } from "../firebase/firebaseConfig";
import {
  addDoc,
  collection,
  collectionGroup,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";
import Moment from "react-moment";

export default function ChatForum() {
  const [content, setContent] = useState("");
  const [load, setLoad] = useState(false);
  const [listMessage, setListMessage] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [sender, setSender] = useState({
    email: "",
    name: "",
    username: "",
    avatar: "",
    id: "",
  });

  const sender12 = {
    email: "huhu@gmail.com",
    name: "huhu",
    username: "huhu",
    avatar: "https://mdbootstrap.com/img/new/avatars/15.jpg",
    id: 1,
  };
  const receiver = {
    email: "haha@gmail.com",
    name: "haha",
    username: "haha",
    avatar: "https://mdbootstrap.com/img/new/avatars/8.jpg",
    id: 2,
  };

  const sender1 = {
    email: "kaka@gmail.com",
    name: "kaka",
    username: "kaka",
    avatar: "https://mdbootstrap.com/img/new/avatars/15.jpg",
    id: 3,
  };
  const receiver1 = {
    email: "hichic@gmail.com",
    name: "hichic",
    username: "hichic",
    avatar: "https://mdbootstrap.com/img/new/avatars/8.jpg",
    id: 4,
  };

  const CheckStateUser = async () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        await getDoc(docRef)
          .then((doc) => doc.data())
          .then((data) =>
            setSender({
              ...sender,
              email: data.email,
              name: data.name,
              username: data.username,
              avatar: data.photoUrl,
              id: data.uid,
            })
          );
      } else {
        setCurrentUser(null);
      }
    });
  };

  const handleSendMess = async () => {
    if (content.trim() !== "") {
      addDoc(collection(db, "messages"), {
        sender: sender1,
        content: content,
        createdDate: new Date(),
        receiver: receiver,
      }).then(async (result) => {
        const docRef = doc(db, "messages", result.id);
        await updateDoc(docRef, {
          messageId: result.id,
        });
      });
    } else {
      toast.error("Vui lòng nhập nội dung!!!");
    }
  };

  const getAllMessage = async () => {
    setLoad(true);
    const ref = collectionGroup(db, "messages");
    onSnapshot(query(ref, orderBy("createdDate", "desc")), (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      const messages = [];
      for (const dat of data) {
        if (
          dat.sender.email === sender1.email ||
          dat.receiver.email === sender1.email
        ) {
          if (
            dat.sender.email === receiver.email ||
            dat.receiver.email === receiver.email
          ) {
            messages.push(dat);
          }
        }
      }
      setListMessage(messages);
      setLoad(false);
    });
  };

  useEffect(() => {
    (async () => {
      await CheckStateUser();
      await getAllMessage();
    })();
  }, []);
  return (
    <>
      <MDBContainer className="p-5" style={{ maxWidth: "50%" }}>
        <ToastContainer />
        <MDBListGroup style={{ minWidth: "22rem" }} light>
          {load ? (
            <div>Đang tải</div>
          ) : (
            <>
              {listMessage.map((message) => (
                <MDBListGroupItem className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <img
                      src={message.sender.avatar}
                      alt=""
                      style={{ width: "45px", height: "45px" }}
                      className="rounded-circle"
                    />
                    <div className="ms-3">
                      <p className="fw-bold mb-1">{message.content}</p>
                      <p className="text-muted mb-0">
                        Bởi {message.sender.name}
                      </p>
                    </div>
                  </div>
                  <MDBBadge pill light color="success">
                    <Moment fromNow>{message.createdDate.toDate()}</Moment>
                  </MDBBadge>
                </MDBListGroupItem>
              ))}
            </>
          )}

          <MDBListGroupItem className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <img
                src="https://mdbootstrap.com/img/new/avatars/8.jpg"
                alt=""
                style={{ width: "45px", height: "45px" }}
                className="rounded-circle"
              />
              <div className="ms-3">
                <p className="fw-bold mb-1">Ok ổn</p>
                <p className="text-muted mb-0">Bởi duong</p>
              </div>
            </div>
            <MDBBadge pill light color="success">
              1 phút trước
            </MDBBadge>
          </MDBListGroupItem>
          <MDBInput
            label="Say hi to your friend..."
            id="content"
            type="text"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
          <MDBBtn
            className="mb-2 w-100 mt-3"
            size="sm"
            style={{ backgroundColor: "gray" }}
            onClick={handleSendMess}
          >
            <MDBIcon fab icon="google" className="mx-2" />
            Sender
          </MDBBtn>
        </MDBListGroup>
      </MDBContainer>
    </>
  );
}
