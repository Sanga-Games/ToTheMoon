// Make sure to include the pako library
// You can add it to your project using: npm install pako
// Or include it from a CDN in your HTML file: <script src="https://cdnjs.cloudflare.com/ajax/libs/pako/2.0.3/pako.min.js"></script>

let audioContext;
let microphone;
let audioWorkletNode;
let voiceData = new Uint8Array();
let timeStamp = new Date();
let stream;
let audioContext2 = new AudioContext();

async function startCapturing() {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    audioContext = new AudioContext();
    microphone = audioContext.createMediaStreamSource(stream);

    audioContext.audioWorklet.addModule('AudioProcessor.js')
        .then(() => {
            audioWorkletNode = new AudioWorkletNode(audioContext, 'mic-processor');
            microphone.connect(audioWorkletNode);
            audioWorkletNode.connect(audioContext.destination);
            audioWorkletNode.port.onmessage = (event) => {
                addToVoiceQueue(event.data.audioData);
            };
        })
        .catch((error) => console.error('Error loading audioworklet:', error));

}

function stopCapturing() {
    // Stop the stream.
    stream.getTracks().forEach(track => track.stop());

    if (microphone) {
        microphone.disconnect();
    }

    if (audioWorkletNode) {
        audioWorkletNode.disconnect();
    }

    // Optionally, close the AudioContext to release additional resources
    if (audioContext) {
        audioContext.close().then(() => {
            console.log('AudioContext closed');
        });
    }
    audioContext = null; // Reset the audioContext to null
    audioWorkletNode = null; // Reset the audioWorkletNode to null
    microphone = null; // Reset the microphone to null
}


function addToVoiceQueue(rawAudio) {

    const currentVoiceData = float32ArrayToUint8Array(rawAudio);
    voiceData = combineUint8Arrays(voiceData, currentVoiceData);

    const tempTimeStamp = new Date();
    const timeElapsed = tempTimeStamp - timeStamp;
    if (timeElapsed > 100) {
        timeStamp = tempTimeStamp;
        sendVoicePacket(voiceData);
        voiceData = new Uint8Array();
    }
}

function sendVoicePacket(int8VoiceData) {
    const base64Encoded = uint8ArrayToBase64(int8VoiceData);
    SendVoiceDataToServer(base64Encoded);
    //PlayVoice(base64Encoded);
    return;
}



function PlayVoice(data)
{
    compressedAudio = data.Data;
    var uint8Data = base64ToUint8Array(compressedAudio);
    const float32Data = new Float32Array(uint8Data.buffer);
    const audioBuffer = audioContext2.createBuffer(1, float32Data.length, audioContext2.sampleRate);
    audioBuffer.getChannelData(0).set(float32Data);

    // Create a buffer source node and connect it to the audio context
    const source = audioContext2.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext2.destination);

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


//Key handler
document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);



let isKeyPressed = false;
// Function to be called on key down
function onKeyDown(event) {
    if(isKeyPressed)
        return;
    if (VoiceWebSocket && VoiceWebSocket.readyState === WebSocket.OPEN) {
        if (event.key == "t") {
            console.log("AudioCaptureStarted");
            isKeyPressed = true;
            startCapturing();
        }
    }
}

// Function to be called on key up
function onKeyUp(event) {
    if (event.key == "t") {
        console.log("AudioCaptureStopped");
        isKeyPressed = false;
        stopCapturing();
    }
}