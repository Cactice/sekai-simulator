import { useRouter } from "next/router";
import { startRecordingCanvas } from "@components/meeting/record";
import { inject } from "@components/meeting/inject";
import { initZoom } from "@components/meeting/zoom";
import { MeetingConfig } from "interfaces";
import { useEffect } from "react";
import Head from "next/head";

function createElementFromHTML(htmlString: string) {
  var div = document.createElement("div");
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
}
let loop = () => {
  setInterval(() => {
    let footer = document.querySelector("#wc-footer > div > div:nth-child(2)");
    if (
      !document.querySelector("[aria-label='record current meeting']") &&
      footer
    ) {
      let startRecording = () => {
        console.log("record!!");
        startRecordingCanvas();
      };
      let recordButton = createElementFromHTML(
        `<button class="footer-button__button ax-outline" type="button" aria-label="record current meeting"><div class="footer-button__img-layer"><div class="footer-button__no-record-icon"></div></div><span class="footer-button__button-label">Record</span></button>`
      );
      if (recordButton) {
        (recordButton as HTMLButtonElement).onclick = () => startRecording();
        footer.appendChild(recordButton);
      }
      loop();
    }
  }, 1000);
};
let first = true;
const Post = () => {
  const router = useRouter();
  const meetingConfig = (router.query as unknown) as MeetingConfig;
  useEffect(() => {
    if (first) {
      inject();
      initZoom(meetingConfig);
      loop();
      first = false;
    }
  }, []);

  return (
    <head>
      <link
        type="text/css"
        rel="stylesheet"
        href="https://source.zoom.us/1.8.6/css/bootstrap.css"
      />
      <link
        type="text/css"
        rel="stylesheet"
        href="https://source.zoom.us/1.8.6/css/react-select.css"
      />
      <script src="https://source.zoom.us/1.8.6/lib/vendor/react.min.js" />
      <script src="https://source.zoom.us/1.8.6/lib/vendor/react-dom.min.js" />
      <script src="https://source.zoom.us/1.8.6/lib/vendor/redux.min.js" />
      <script src="https://source.zoom.us/1.8.6/lib/vendor/redux-thunk.min.js" />
      <script src="https://source.zoom.us/1.8.6/lib/vendor/jquery.min.js" />
      <script src="https://source.zoom.us/1.8.6/lib/vendor/lodash.min.js" />
    </head>
  );
};

export default Post;
