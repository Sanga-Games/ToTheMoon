// Define your Agora App ID and token
var APP_ID = '68338d127d60455198f140831c762df0';
var TOKEN = null;
var CHANNEL_NAME = 'Default';

// Initialize the client
var client = AgoraRTC.createClient({mode: 'rtc', codec: 'vp9'});
var localAudioTrack;
var agora_userid;

function JoinVoiceChannel()
{
    client.join(APP_ID, CHANNEL_NAME, null).then(uid => {
        console.log('join success');
        agora_userid = uid;
        BroadcastLocalAudio();
    });
}

function BroadcastLocalAudio()
{

    // Create and initialize a local audio track
    AgoraRTC.createMicrophoneAudioTrack().then(track => {
        console.log('create audio track success');
        localAudioTrack = track
        // Publish the local audio track to the channel
        client.publish([localAudioTrack]).then(() => {
            console.log('publish success');
        });
    });
}

// Function to stop broadcasting local audio
function StopLocalAudioBroadcast() {
    if (localAudioTrack) {
        // Unpublish the local audio track
        client.unpublish([localAudioTrack]).then(() => {
            console.log('unpublish success');
            localAudioTrack.close(); // Close the local audio track
        });
    }
}

// Subscribe to the remote audio track when it is published
client.on("user-published", (user, mediaType) => {
    if (mediaType === 'audio') {
        // Subscribe to a remote audio track
        client.subscribe(user, mediaType).then(() => {
            console.log('subscribe success');
            user.audioTrack.play();
        });
    }
});

JoinVoiceChannel();