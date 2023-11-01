// Make sure to include the pako library
// You can add it to your project using: npm install pako
// Or include it from a CDN in your HTML file: <script src="https://cdnjs.cloudflare.com/ajax/libs/pako/2.0.3/pako.min.js"></script>



// Initialize the audio context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const bufferSize = 2048;
const scriptNode = audioContext.createScriptProcessor(bufferSize, 1, 1);
var lzma = LZMA_WORKER;
scriptNode.connect(audioContext.destination);
var timeStamp = new Date();
var VoiceData = new Uint8Array();

// Access the microphone and start streaming
function startCapturing()
{
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(scriptNode);
  
      scriptNode.onaudioprocess = (e) => {
          AddToVoiceQueue(e.inputBuffer.getChannelData(0));
      };
    })
    .catch((error) => console.error('Error accessing microphone:', error));
  
}

function stopCapturing()
{
    navigator.mediaDevices.getUserMedia({ audio: false })
  .then(function(stream) {
    /* Handle the stream or do nothing */
  })
  .catch(function(err) {
    console.error("Error: " + err);
  });
}



function AddToVoiceQueue(rawAudio)
{
    var currentVoiceData = float32ArrayToUint8Array(rawAudio);
    VoiceData = combineUint8Arrays(VoiceData,currentVoiceData);

    var tempTimeStamp = new Date();
    timeElapsed = tempTimeStamp - timeStamp;
    if(timeElapsed >100)
    {
        timeStamp = tempTimeStamp;
        SendVoicePacket(VoiceData);
        VoiceData = new Uint8Array();
    }
}

function SendVoicePacket(int8VoiceData)
{
    const base64Encoded = uint8ArrayToBase64(int8VoiceData);
    SendVoiceDataToServer(base64Encoded);
    //PlayVoice(base64Encoded);
    return;
}

function PlayVoice(compressedAudio)
{
    var uint8Data = base64ToUint8Array(compressedAudio);
    const float32Data = new Float32Array(uint8Data.buffer);
    const audioBuffer = audioContext.createBuffer(1, float32Data.length, audioContext.sampleRate);
    audioBuffer.getChannelData(0).set(float32Data);

    // Create a buffer source node and connect it to the audio context
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);

    // Start playing the audio
    source.start();
    return;
}
  
  
// Convert Uint8Array to Base64-encoded string
function uint8ArrayToBase64(uint8Array) {
    const binaryString = String.fromCharCode.apply(null, uint8Array);
    return btoa(binaryString);
}  




// Convert Base64-encoded string to Uint8Array
function base64ToUint8Array(base64String) {
    const binaryString = atob(base64String);
    const uint8Array = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }
    return uint8Array;
}

function combineUint8Arrays(arr1, arr2) {
    const combinedArray = new Uint8Array(arr1.length + arr2.length);
    combinedArray.set(arr1);
    combinedArray.set(arr2, arr1.length);
    return combinedArray;
}

// Convert Float32Array to Uint8Array
function float32ArrayToUint8Array(float32Array) {
    const uint8Array = new Uint8Array(float32Array.buffer);
    return uint8Array;
  }