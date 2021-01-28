import JSZip from "jszip";
const streamCanvasAndWebAudio = () => {
  // Video
  var canvas = document.getElementById("main-video");
  // Optional frames per second argument.
  var videoOutputStream = canvas.captureStream(25);

  // Audio
  let streamDestination =
    window.streamDestinations[window.streamDestinations.length - 1];
  let audioOutputStream = streamDestination.stream;

  // Combine Audio & Video
  let outputStream = new MediaStream();
  [audioOutputStream, videoOutputStream].forEach(function (s) {
    s.getTracks().forEach(function (t) {
      outputStream.addTrack(t);
    });
  });
  return outputStream;
};

export const startRecordingCanvas = () => {
  let outputStream = streamCanvasAndWebAudio();
  let options = { mimeType: "video/webm; codecs=vp9" };
  let recordThem = new MediaRecorder(outputStream, options);
  let recordedChunksDict = {};

  recordThem.ondataavailable = handleDataAvailableFactory("them");
  recordThem.start();
  let recordMe;
  let constraints = {
    audio: window.audioConstraints || true,
    video: window.videoConstraints || true,
  };
  console.log("record constraints", constraints);
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    recordMe = new MediaRecorder(stream, options);
    recordMe.ondataavailable = handleDataAvailableFactory("me");
    recordMe.start();
  });
  // demo: to download after 3sec
  function handleDataAvailableFactory(id) {
    recordedChunksDict[id] = [];
    return function handleDataAvailable(event) {
      console.log("data-available", event);
      if (event.data.size > 0) {
        recordedChunksDict[id].push(event.data);
        download();
      } else {
        console.log("data-nil");
      }
    };
  }
  function download() {
    let chunkSize = 0;
    Object.values(recordedChunksDict).forEach(
      (chunk) => (chunkSize += chunk.length)
    );
    console.log(chunkSize);
    if (chunkSize <= 1) {
      return;
    }
    const zip = new JSZip();
    const folder = zip.folder("RecordedVideos");
    let blobDict = Object.fromEntries(
      Object.entries(recordedChunksDict).map(([key, recordedChunks], i) => [
        key,
        new Blob(recordedChunksDict[key], {
          type: "video/webm",
        }),
      ])
    );

    for (const [key, blob] of Object.entries(blobDict)) {
      folder.file(`${key}.webm`, blob);
    }

    zip.generateAsync({ type: "blob" }).then((blob) => {
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "test.zip";
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
  setTimeout((event) => {
    console.log("stopping");
    recordThem.stop();
    recordMe.stop();
  }, 5000);
};
