window.streamDestination = [];
(function () {
  var original = window.AudioContext.prototype.createMediaStreamDestination;
  window.AudioContext.prototype.createMediaStreamDestination = function () {
    let mediastreamDestination = original.call(this, ...arguments);
    window.streamDestination.push(value);
    return mediastreamDestination;
  };
})();
(function () {
  var original = navigator.mediaDevices.getUserMedia;
  navigator.mediaDevices.getUserMedia = function () {
    const constraints = arguments[0];
    console.log("preffered device", constraints);
    if (constraints.audio) {
      window.audioConstraints = constraints.audio;
    } else if (constraints.video) {
      window.videoConstraints = constraints.video;
    }
    return original.call(this, ...arguments);
  };
})();
console.log(window.AudioContext.createMediaStreamDestination);
import { ZoomMtg } from "@zoomus/websdk";
import { startRecordingCanvas } from "./record";
import { testTool } from "./tool";

// get meeting args from url
const tmpArgs = testTool.parseQuery();
const meetingConfig = {
  apiKey: tmpArgs.apiKey,
  meetingNumber: tmpArgs.mn,
  userName: (function () {
    if (tmpArgs.name) {
      try {
        return testTool.b64DecodeUnicode(tmpArgs.name);
      } catch (e) {
        return tmpArgs.name;
      }
    }
    return (
      "CDN#" +
      tmpArgs.version +
      "#" +
      testTool.detectOS() +
      "#" +
      testTool.getBrowserInfo()
    );
  })(),
  passWord: tmpArgs.pwd,
  leaveUrl: "/index.html",
  role: parseInt(tmpArgs.role, 10),
  userEmail: (function () {
    try {
      return testTool.b64DecodeUnicode(tmpArgs.email);
    } catch (e) {
      return tmpArgs.email;
    }
  })(),
  lang: tmpArgs.lang,
  signature: tmpArgs.signature || "",
  china: tmpArgs.china === "1",
};

console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));
function createElementFromHTML(htmlString) {
  var div = document.createElement("div");
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
}
let loop = () => {
  setInterval(() => {
    let footer = document.querySelector("#wc-footer > div > div:nth-child(2)");
    if (document.querySelector("[aria-label='record current meeting']")) {
      console.log("element exists");
    } else {
      let startRecording = () => {
        console.log("record!!");
        startRecordingCanvas();
      };
      let recordButton = createElementFromHTML(
        `<button class="footer-button__button ax-outline" type="button" aria-label="record current meeting"><div class="footer-button__img-layer"><div class="footer-button__no-record-icon"></div></div><span class="footer-button__button-label">Record</span></button>`
      );
      recordButton.onclick = () => startRecording();
      footer.appendChild(recordButton);
      loop();
    }
  }, 1000);
};
loop();

// it's option if you want to change the WebSDK dependency link resources. setZoomJSLib must be run at first
ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();
function beginJoin(signature) {
  ZoomMtg.init({
    leaveUrl: meetingConfig.leaveUrl,
    webEndpoint: meetingConfig.webEndpoint,
    success: function () {
      console.log(meetingConfig);
      console.log("signature", signature);
      ZoomMtg.i18n.load(meetingConfig.lang);
      ZoomMtg.i18n.reload(meetingConfig.lang);
      ZoomMtg.join({
        meetingNumber: meetingConfig.meetingNumber,
        userName: meetingConfig.userName,
        signature: signature,
        apiKey: meetingConfig.apiKey,
        userEmail: meetingConfig.userEmail,
        passWord: meetingConfig.passWord,
        success: function (res) {
          console.log("join meeting success");
          console.log("get attendeelist");
          ZoomMtg.getAttendeeslist({});
          ZoomMtg.getCurrentUser({
            success: function (res) {
              console.log("success getCurrentUser", res.result.currentUser);
            },
          });
        },
        error: function (res) {
          console.log(res);
        },
      });
    },
    error: function (res) {
      console.log(res);
    },
  });

  ZoomMtg.inMeetingServiceListener("onUserJoin", function (data) {
    console.log("inMeetingServiceListener onUserJoin", data);
  });

  ZoomMtg.inMeetingServiceListener("onUserLeave", function (data) {
    console.log("inMeetingServiceListener onUserLeave", data);
  });

  ZoomMtg.inMeetingServiceListener("onUserIsInWaitingRoom", function (data) {
    console.log("inMeetingServiceListener onUserIsInWaitingRoom", data);
  });

  ZoomMtg.inMeetingServiceListener("onMeetingStatus", function (data) {
    console.log("inMeetingServiceListener onMeetingStatus", data);
  });
}

beginJoin(meetingConfig.signature);
