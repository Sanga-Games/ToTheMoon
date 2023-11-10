let GameWebSocket;
let VoiceWebSocket;
let gamereconnectAttempts = 0;

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
        gamereconnectAttempts = 0;
    });

    // Listen for messages from the server
    GameWebSocket.addEventListener('message', (event) => {
        console.log(event.data);
        GameMessageFromServer(JSON.parse(event.data));
    });

    // Listen for any errors that occur
    GameWebSocket.addEventListener('error', (error) => {
        console.error('WebSocket encountered an error:', error);
    });

    // Connection closed
    GameWebSocket.addEventListener('close', (event) => {
        console.log('WebSocket connection closed:', event);
        if (gamereconnectAttempts < MAX_RECONNECT_ATTEMPTS) 
        {
            console.log('Game Reconnecting...');
            gamereconnectAttempts++;
            setTimeout(() => InitGameWebsocketConnection(), 2000); // 2 seconds delay before reconnecting
        } 
        else {
            console.error('Max reconnection attempts reached. Unable to reconnect.');
        }
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
    const socketUrl = 'wss://6sogmqi7uh.execute-api.sa-east-1.amazonaws.com/production';

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
    VoiceWebSocket = new WebSocket(urlWithHeaders);

    // Connection opened
    VoiceWebSocket.addEventListener('open', (event) => {
        console.log('voice WebSocket connection opened:', event);
    });

    // Listen for messages from the server
    VoiceWebSocket.addEventListener('message', (event) => {
        console.log(event.data);
    });

    // Listen for any errors that occur
    VoiceWebSocket.addEventListener('error', (error) => {
        console.error('WebSocket encountered an error:', error);
    });

    // Connection closed
    VoiceWebSocket.addEventListener('close', (event) => {
        console.log('VoiceWebsocket connection closed:', event);
        
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
        sequenceCode:0,
        voiceData: compressedString
    };

    // Send the JSON message as a string
    VoiceWebSocket.send(JSON.stringify(jsonMessage));

}


function GameMessageFromServer(data)
{

    console.log("GameMessageFromServer");

    switch (data.type){
        case "Rewards":
            RewardsResponse(data);
            break;   

        case "Payments":
            PaymentsResponse(data);
            break;   
    }
}

function SendPlaceBet(gameID,betAmount,cashOutMultiplier,isAutoCashOut)
{
    const jsonMessage = {
        action: 'Bet',
        SubAction: 'PlaceBet',
        BetGameID:gameID,
        BetAmount:betAmount,
        CashOutMultiplier:cashOutMultiplier,
        IsAutoCashOut:isAutoCashOut
    };
    GameWebSocket.send(JSON.stringify(jsonMessage));
}

function SendCashOut(gameID)
{
    const jsonMessage = {
        action: 'Bet',
        SubAction: 'LiveCashOut',
        BetGameID:gameID
    };
    GameWebSocket.send(JSON.stringify(jsonMessage));
}
