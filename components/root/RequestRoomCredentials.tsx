import { useLocalStorage } from "@hooks/useLocalStorage";
import { RoomCredentials, ZoomCredentials } from "interfaces";
import React, { useRef } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useRouter } from "next/router";
import { generateMeetingConfig } from "./generateMeetingConfig";

export const RequestRoomCredentials = ({
  onSubmitRoomCredentials,
  show,
  onHide,
}: {
  onHide: () => void;
  onSubmitRoomCredentials: (
    roomCredentials: RoomCredentials,
    managerName: string
  ) => void;
  show: boolean;
}) => {
  const router = useRouter();
  const roomIdEl = useRef<HTMLInputElement>(null);
  const roomPasscodeEl = useRef<HTMLInputElement>(null);
  const managerNameEl = useRef<HTMLInputElement>(null);
  const [
    roomCredentials,
    setRoomCredentials,
  ] = useLocalStorage<RoomCredentials>("roomCredentials", {
    ID: NaN,
    passcode: "",
  });
  const [managerName, setManagerName] = useLocalStorage<string>(
    "managerName",
    ""
  );
  return (
    <Modal
      onHide={onHide}
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">会議に参加</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Row>
              <Col>
                <Form.Label>会議ID</Form.Label>
                <Form.Control
                  defaultValue={roomCredentials.ID || ""}
                  onChange={(e) => {
                    let newRoomPasscode = e.target.value.match(
                      /pwd=([\d,\w]+)/
                    )?.[1];
                    if (
                      newRoomPasscode &&
                      typeof roomPasscodeEl?.current?.value !== "undefined"
                    ) {
                      roomPasscodeEl.current.value = newRoomPasscode;
                    }
                    let newRoomID = e.target.value
                      .replace(/([^0-9])+/i, "")
                      .match(/([0-9]{9,11})/)?.[1];
                    if (
                      newRoomID &&
                      typeof roomIdEl?.current?.value !== "undefined"
                    ) {
                      roomIdEl.current.value = newRoomID;
                    }
                  }}
                  ref={roomIdEl}
                  placeholder=""
                />
              </Col>
              <Col>
                <Form.Label>パスコード(任意)</Form.Label>
                <Form.Control
                  defaultValue={roomCredentials.passcode}
                  ref={roomPasscodeEl}
                  placeholder=""
                />
              </Col>
            </Row>
            <Form.Label>名前</Form.Label>
            <Form.Control
              defaultValue={managerName}
              ref={managerNameEl}
              placeholder="あなたの名前"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => {
            let roomCredentials = {
              ID: parseInt(roomIdEl?.current?.value || ""),
              passcode: roomPasscodeEl?.current?.value || "",
            };
            let managerName = managerNameEl?.current?.value || "";
            setRoomCredentials(roomCredentials);
            setManagerName(managerName);
            onSubmitRoomCredentials(roomCredentials, managerName);
          }}
        >
          参加
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
