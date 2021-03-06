import Layout from "../components/Layout";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Jumbotron,
  Nav,
  Navbar,
} from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useLocalStorage } from "@hooks/useLocalStorage";
import { ZoomCredentials } from "interfaces";
import { useRouter } from "next/router";
import { basePath } from "next.config";
const IndexPage = () => {
  const [showRequestRoomCredentials, setShowRequestRoomCredentials] = useState(
    false
  );
  const [
    zoomCredentials,
    setZoomCredentials,
  ] = useLocalStorage<ZoomCredentials>("zoomCredentials", {
    apiKey: "",
    secret: "",
  });
  const [showRequestZoomCredentials, setShowRequestZoomCredentials] = useState(
    false
  );
  const router = useRouter();
  useEffect(() => {
    console.log("zoomCredentials", zoomCredentials);
    if (!zoomCredentials.apiKey) {
      setShowRequestZoomCredentials(true);
    }
  }, []);
  return (
    <Layout title="世界シミュレーター">
      <Navbar className="navbar navbar-light bg-light">
        <Navbar.Brand>世界シミュレーター</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>APIキー:</Navbar.Text>
          <Nav.Link onClick={() => setShowRequestZoomCredentials(true)}>
            {`${zoomCredentials.apiKey}...`}
          </Nav.Link>
        </Navbar.Collapse>
      </Navbar>
      <Container>
        <Row style={{ height: "80vh" }}>
          <Col className="text-center align-self-center">
            <img src={`${basePath}/people.gif`} width="400px" />
          </Col>
          <Col lg className="text-center align-self-center">
            <Row className="justify-content-center">
              <h1>世界シミュレーター</h1>
            </Row>
            <Row className="justify-content-center">
              <h5 className="text-secondary">
                <small>世界をシミュレーション</small>
              </h5>
            </Row>
            <Row className="justify-content-center mt-5 flex-nowrap">
              <Col lg="4">
                <Button
                  variant="link"
                  onClick={() => setShowRequestRoomCredentials(true)}
                >
                  <img src={`${basePath}/Join.png`} width="70px" />
                </Button>
              </Col>
              <Col lg="4">
                <img src={`${basePath}/NewMeeting.png`} width="70px" />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default IndexPage;
