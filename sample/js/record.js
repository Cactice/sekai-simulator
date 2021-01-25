export const startRecordingCanvas = () => {
  var canvas = document.querySelectorAll("canvas")[1];

  // Optional frames per second argument.
  var videoOutputStream = canvas.captureStream(25);
  var recordedChunks = [];

  console.log(window.audioCtx1);
  console.log(window.audioCtx2);
  console.log("stream!");
  // console.log(stream);
  // var options = { mimeType: "video/webm; codecs=vp9" };
  // let videoOutputStream = new MediaRecorder(stream, options);

  // Audio
  let ctx = window.audioCtx2;
  var streamDestination;
  streamDestination = ctx.createMediaStreamDestination();
  console.log("streamDest", streamDestination);
  let audioOutputStream = streamDestination.stream;
  console.log(audioOutputStream.getTracks());
  var outputStream = new MediaStream();
  [audioOutputStream, videoOutputStream].forEach(function (s) {
    s.getTracks().forEach(function (t) {
      outputStream.addTrack(t);
    });
  });
  console.log(outputStream.getTracks());
  // Both
  var finalRecorder;
  var options = { mimeType: "video/webm; codecs=vp9" };
  finalRecorder = new MediaRecorder(videoOutputStream, options);

  finalRecorder.ondataavailable = handleDataAvailable;
  finalRecorder.start();
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
    finalRecorder.stop();
  }, 3000);
};
