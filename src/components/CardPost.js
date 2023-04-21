import React from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardHeader,
  MDBCardFooter,
  MDBBtn,
} from "mdb-react-ui-kit";

export default function CardPost(props) {
  return (
    <>
      <MDBCard className="m-2 border border-info" alignment="center">
        <MDBCardHeader>{props.title}</MDBCardHeader>
        <MDBCardBody>
          <MDBCardTitle>{props.title}</MDBCardTitle>
          <MDBCardText>{props.content}</MDBCardText>
          <MDBBtn href="#">Detail ...</MDBBtn>
        </MDBCardBody>
        <MDBCardFooter className="text-muted">2 days ago</MDBCardFooter>
      </MDBCard>
    </>
  );
}
