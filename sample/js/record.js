const streamCanvasAndWebAudio = () => {
  // Video
  var canvas = document.querySelectorAll("canvas")[1];
  // Optional frames per second argument.
  var videoOutputStream = canvas.captureStream(25);

  // Audio
  let streamDestination = window.streamDestination[2];
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
  let recordedChunks = [];
  let outputStream = streamCanvasAndWebAudio();
  let options = { mimeType: "video/webm; codecs=vp9" };
  let recordOthers = new MediaRecorder(outputStream, options);

  recordOthers.ondataavailable = handleDataAvailable;
  recordOthers.start();
  let recordMyself;
  navigator.mediaDevices
    .getUserMedia(window.constraints)
    .then(function (stream) {
      recordMyself = new MediaRecorder(stream, options);
      recordMyself.ondataavailable = handleDataAvailable;
      recordMyself.start();
    });
  // demo: to download after 3sec
  function handleDataAvailable(event) {
    console.log("data-available", event);
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
      console.log(recordedChunks);
      download();
    } else {
      console.log("data-nil");
    }
  }
  function download() {
    var blob = new Blob(recordedChunks, {
      type: "video/webm",
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = "test.webm";
    a.click();
    window.URL.revokeObjectURL(url);
  }
  setTimeout((event) => {
    console.log("stopping");
    recordOthers.stop();
    recordMyself.stop();
  }, 5000);
};
