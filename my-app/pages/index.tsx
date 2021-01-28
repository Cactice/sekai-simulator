import Layout from "../components/Layout";
// import { RequestZoomCredentials } from "@components/root/RequestZoomCredentials";
import { Container, Row, Col, Form, Button, Jumbotron } from "react-bootstrap";
import React, { useState } from "react";
import { RequestRoomCredentials } from "@components/root/RequestRoomCredentials";
import { RequestZoomCredentials } from "@components/root/RequestZoomCredentials";
const IndexPage = () => {
  const [showRequestRoomCredentials, setShowRequestRoomCredentials] = useState(
    false
  );
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <RequestZoomCredentials
        onSubmitZoomCredentials={(zoomCredentials) => {
          console.log(zoomCredentials);
        }}
      />
      <RequestRoomCredentials
        onHide={() => setShowRequestRoomCredentials(false)}
        show={showRequestRoomCredentials}
        onSubmitRoomCredentials={() => {}}
      />
      <Container>
        <Row style={{ height: "80vh" }}>
          <Col className="text-center align-self-center">
            <img src="/meeting.gif" width="400px" />
          </Col>
          <Col lg className="text-center align-self-center">
            <Row className="justify-content-center">
              <h1>1 on 1 録画ツール</h1>
            </Row>
            <Row className="justify-content-center">
              <h5 className="text-secondary">
                <small>Zoom上で行われる1 on 1面談を録画</small>
              </h5>
            </Row>
            <Row className="justify-content-center mt-5 flex-nowrap">
              <Col lg="4">
                <Button
                  variant="link"
                  onClick={() => setShowRequestRoomCredentials(true)}
                >
                  <img src="/Join.png" width="70px" />
                </Button>
              </Col>
              <Col lg="4">
                <img src="/NewMeeting.png" width="70px" />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default IndexPage;
