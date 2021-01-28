import { useLocalStorage } from "@hooks/useLocalStorage";
import { ZoomCredentials } from "interfaces";
import React, { useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

export const RequestZoomCredentials = ({
  onSubmitZoomCredentials,
}: {
  onSubmitZoomCredentials: (zoomCredentialString: ZoomCredentials) => void;
}) => {
  const zoomCredentialsEl = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(true);
  const [
    zoomCredentials,
    setZoomCredentials,
  ] = useLocalStorage<ZoomCredentials>("zoomCredentials", {
    apiKey: "",
    secret: "",
  });
  return (
    <Modal
      show={showModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">始める前に</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="ApiKey">
            <Form.Label>APIキーを入力してください</Form.Label>
            <Form.Control
              defaultValue={`${zoomCredentials.apiKey}.${zoomCredentials.secret}`}
              ref={zoomCredentialsEl}
              placeholder=""
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => {
            let credentialsValue = zoomCredentialsEl?.current?.value || "";
            if (!credentialsValue) {
              return;
            }
            const [apiKey, secret] = credentialsValue.split(".");
            setZoomCredentials({ apiKey, secret });
            onSubmitZoomCredentials({ apiKey, secret });
            setShowModal(false);
          }}
        >
          利用開始
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
