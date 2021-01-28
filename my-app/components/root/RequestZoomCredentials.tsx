import { useLocalStorage } from "@hooks/useLocalStorage";
import { ZoomCredentials } from "interfaces";
import React, { useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

export const RequestZoomCredentials = ({
  onSubmitZoomCredentials,
  zoomCredentials,
  show,
}: {
  zoomCredentials: ZoomCredentials;
  onSubmitZoomCredentials: (zoomCredentialString: ZoomCredentials) => void;
  show: boolean;
}) => {
  const zoomCredentialsEl = useRef<HTMLInputElement>(null);
  return (
    <Modal
      show={show}
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
              defaultValue={`${zoomCredentials.apiKey}${
                zoomCredentials.apiKey ? "." : ""
              }${zoomCredentials.secret}`}
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
            onSubmitZoomCredentials({ apiKey, secret });
          }}
        >
          利用開始
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
