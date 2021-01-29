import { MeetingConfig } from "interfaces";
import { basePath } from "next.config";
if (typeof window !== "undefined") {
  // TODO: rewrite for react

  window.streamDestinations = [];
  (function () {
    var original = window.AudioContext.prototype.createMediaStreamSource;
    console.log("createMediaStreamSource", original);
    window.AudioContext.prototype.createMediaStreamSource = function () {
      return original.call(this, arguments[0]);
    };
  })();
  (function () {
    var original = window.AudioContext.prototype.createMediaStreamDestination;
    window.AudioContext.prototype.createMediaStreamDestination = function () {
      let mediaStreamDestination = original.call(this);
      console.log("media destination", mediaStreamDestination);
      window.streamDestinations.push(mediaStreamDestination);
      return mediaStreamDestination;
    };
  })();
  (function () {
    var original = navigator.mediaDevices.getUserMedia;
    navigator.mediaDevices.getUserMedia = function () {
      const constraints: MediaStreamConstraints = arguments[0];
      console.log("preffered device", constraints);
      if (constraints.audio) {
        window.audioConstraints = constraints.audio;
      } else if (constraints.video) {
        window.videoConstraints = constraints.video;
      }
      return original.call(this, ...arguments);
    };
  })();
}
export const initZoom = async (meetingConfig: MeetingConfig) => {
  // console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));
  let { ZoomMtg } = await import("@zoomus/websdk");
  ZoomMtg.setZoomJSLib(
    `${window.location.protocol}//${window.location.host}${basePath}/zoomLib`
  );
  ZoomMtg.preLoadWasm();
  ZoomMtg.prepareJssdk();
  ZoomMtg.init({
    leaveUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLScKy_TQx9x7qAZD9yvHeiFDPgevtWu2Ymh1-FaxT03W_IOuoA/viewform",
    success: function () {
      console.log(meetingConfig);
      console.log("signature", meetingConfig.signature);
      ZoomMtg.i18n.load("jp-JP");
      ZoomMtg.join({
        ...meetingConfig,
        success: () => {
          console.log("join meeting success");
          console.log("get attendeelist");
        },
        error: (res: any) => {
          console.log(res);
        },
      });
    },
    error: (res: any) => {
      console.log(res);
    },
  });
};
