// Create a WebSocket instance, replace 'ws://localhost:8080' with your WebSocket server URL
let socket;

function InitWebsocketConnection()
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
    socket = new WebSocket(urlWithHeaders);

    // Connection opened
    socket.addEventListener('open', (event) => {
        console.log('WebSocket connection opened:', event);
        AddMessage("Connected");
    });

    // Listen for messages from the server
    socket.addEventListener('message', (event) => {
        console.log('Message from server:', event.data);
        AddMessage(event.data);
    });

    // Listen for any errors that occur
    socket.addEventListener('error', (error) => {
        console.error('WebSocket encountered an error:', error);
    });

    // Connection closed
    socket.addEventListener('close', (event) => {
        console.log('WebSocket connection closed:', event);
        AddMessage("Connection Closed");
    });
}

function CloseWebSocketConnection()
{
    // Close the connection when needed
    socket.close();
}

function AddMessage(msg)
{
    var ele = document.querySelector("#MessageLog");
    ele.innerHTML += "<br/>" + msg;
}



