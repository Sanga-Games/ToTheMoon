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
        AddBalance(0);
        AddMessage("Connected");
    });

    // Listen for messages from the server
    socket.addEventListener('message', (event) => {
        console.log('Message from server:', event.data);
        ParseMessage(JSON.parse(event.data));
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
    ele.innerHTML += "<br/>\> " + msg;
}

function AddBalance(amount)
{
     // Your JSON message
     const jsonMessage = {
        action: 'AddBalance',
        addedBalance: amount
        // Add other key-value pairs as needed
    };

    // Send the JSON message as a string
    socket.send(JSON.stringify(jsonMessage));
}

function ParseMessage(data)
{
    switch (data.type) {
        case "Update_WalletBalance":
            UpdateWalletBalance(data);
            break;

        case "game_state":
            GameStateChanged(data);
            break;
    
        default:
            break;
    }
}

function UpdateWalletBalance(data)
{
    var ele = document.querySelector("#Profile_WalletBalance");
    ele.innerHTML = data.value;
}

var FuncIntervalID;
function GameStateChanged(data)
{
    clearInterval(FuncIntervalID);
    if(data.State == "OnGoing")
    {
        Multiplier = 1;
        startTime = new Date();
        FuncIntervalID = setInterval(UpdateMultiplier, 50);
    }
    else
    {
        startTime = new Date();
        FuncIntervalID = setInterval(UpdateWaitTime, 50);
        var ele = document.querySelector("#Game_Multiplier");
        ele.innerHTML = "x" + parseFloat(data.BlastMultiplier).toFixed(2);
    }
}

var Multiplier = 1;
var startTime;
function UpdateMultiplier()
{
    const currentTime = new Date();
    const elapsedTime = (currentTime - startTime)/1000;
    var ele = document.querySelector("#Game_Multiplier");
    ele.innerHTML = "x" + calculateMultiplier(elapsedTime).toFixed(2);
}

function calculateMultiplier(waitTime) 
{
    const growthRate = 1.1;  
    if (growthRate <= 1) {
      throw new Error("Growth rate must be greater than 1");
    }
    // Solve for multiplier: multiplier = growthRate^waitTime
    const multiplier = Math.pow(growthRate, waitTime);
    return multiplier;
}

function UpdateWaitTime()
{
    const currentTime = new Date();
    var elapsedTime = (currentTime - startTime)/1000;
    var ele = document.querySelector("#Game_WaitTime");
    elapsedTime = 10 - elapsedTime;
    if(elapsedTime < 0)
    {
        elapsedTime = 0;
    }
    ele.innerHTML = "Wait Time: " + elapsedTime.toFixed(2) + "sec";

}

function MakeBet()
{
    // Your JSON message
    const jsonMessage = {
        action: 'MakeBet',
        betAmount: document.querySelector("#Game_BetAmountInput").value,
        AutoCashOut: document.querySelector("#Game_CashOutMultiplierCheck").value,
        CashOutMultiplier: document.querySelector("#Game_CashOutMultiplierInput").value
        // Add other key-value pairs as needed
    };

    // Send the JSON message as a string
    socket.send(JSON.stringify(jsonMessage));

}

function CashOut()
{
    // Your JSON message
    const jsonMessage = {
        action: 'CashOut'
    };

    // Send the JSON message as a string
    socket.send(JSON.stringify(jsonMessage));

}


