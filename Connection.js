let GameWebSocket;
let VoiceWebSocket;

function InitGameWebsocketConnection()
{
    // Replace 'ws://localhost:8080' with your WebSocket server URL
    const socketUrl = 'wss://zmrxhgzk6h.execute-api.sa-east-1.amazonaws.com/production/';

    // Your custom headers
    const sessionToken = localSessionToken;
    const deviceID = encodedDeviceidParams;



    // Replace these with your actual headers
    const headers = {
        'SessionToken': sessionToken,
        'DeviceID': deviceID
    };

    // Construct the WebSocket URL with query parameters for headers
    const urlWithHeaders = `${socketUrl}?${Object.entries(headers).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&')}`;

    // Create WebSocket instance
    GameWebSocket = new WebSocket(urlWithHeaders);

    // Connection opened
    GameWebSocket.addEventListener('open', (event) => {
        console.log('WebSocket connection opened:', event);
    });

    // Listen for messages from the server
    GameWebSocket.addEventListener('message', (event) => {
        console.log(event.data);
    });

    // Listen for any errors that occur
    GameWebSocket.addEventListener('error', (error) => {
        console.error('WebSocket encountered an error:', error);
    });

    // Connection closed
    GameWebSocket.addEventListener('close', (event) => {
        console.log('WebSocket connection closed:', event);
    });
}

function CloseGameWebSocketConnection()
{
    // Close the connection when needed
    GameWebSocket.close();
}

function InitVoiceWebsocketConnection()
{
    // Replace 'ws://localhost:8080' with your WebSocket server URL
    const socketUrl = 'wss://v5irfwsic0.execute-api.ap-south-1.amazonaws.com/production';

    // Your custom headers
    const sessionToken = localSessionToken;
    const deviceID = encodedDeviceidParams;



    // Replace these with your actual headers
    const headers = {
        'SessionToken': sessionToken,
        'DeviceID': deviceID
    };

    // Construct the WebSocket URL with query parameters for headers
    const urlWithHeaders = `${socketUrl}?${Object.entries(headers).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&')}`;

    // Create WebSocket instance
    GameWebSocket = new WebSocket(urlWithHeaders);

    // Connection opened
    GameWebSocket.addEventListener('open', (event) => {
        console.log('WebSocket connection opened:', event);
    });

    // Listen for messages from the server
    GameWebSocket.addEventListener('message', (event) => {
        console.log(event.data);
        GameMessageFromServer(event.data);
    });

    // Listen for any errors that occur
    GameWebSocket.addEventListener('error', (error) => {
        console.error('WebSocket encountered an error:', error);
    });

    // Connection closed
    GameWebSocket.addEventListener('close', (event) => {
        console.log('WebSocket connection closed:', event);
        InitWebsocketConnection();
    });
}

function CloseVoiceWebSocketConnection()
{
    // Close the connection when needed
    VoiceWebSocket.close();
}

function SendVoiceDataToServer(compressedString)
{
    document.querySelector("#CashOut_btn").disabled = true;
    // Your JSON message
    const jsonMessage = {
        action: 'Voice',
        voiceData: compressedString
    };

    // Send the JSON message as a string
    VoiceWebSocket.send(JSON.stringify(jsonMessage));

}


function GameMessageFromServer(data)
{
    switch (data.type){
        case "BetSuccess":
            //bet success logic
            break;
        case "RewardHistory":
            //bet success logic
            break;
    }
}








  