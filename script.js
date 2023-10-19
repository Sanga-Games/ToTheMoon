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
        GetGameState();
    });

    // Listen for messages from the server
    socket.addEventListener('message', (event) => {
        ParseMessage(JSON.parse(event.data));
        console.log(event.data);
    });

    // Listen for any errors that occur
    socket.addEventListener('error', (error) => {
        console.error('WebSocket encountered an error:', error);
    });

    // Connection closed
    socket.addEventListener('close', (event) => {
        console.log('WebSocket connection closed:', event);
        //InitWebsocketConnection();
    });
}

function CloseWebSocketConnection()
{
    // Close the connection when needed
    socket.close();
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

function GetGameState()
{
     // Your JSON message
     const jsonMessage = {
        action: 'GetGameState'
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
        
        case "game_bet":
            BetStateChanged(data);
            break;
        
        case "Update_BetSuccess":
            AddBalance(0);
            document.querySelector("#MakeBet_btn").disabled = true;
            break;

        case "Update_BetFailed":
            document.querySelector("#MakeBet_btn").disabled = false;
            break;

        case "Update_CashOutSuccess":
            AddBalance(0);
            document.querySelector("#CashOut_btn").disabled = true;
            break;
        
        case "Update_CashOutFailed":
            document.querySelector("#CashOut_btn").disabled = false;
            break;
    
        default:
            break;
    }
}

function UpdateWalletBalance(data)
{
    var ele = document.querySelector("#Profile_WalletBalance");
    ele.innerHTML = parseFloat(data.value.toFixed(2)) ;
}

var FuncIntervalID;
var PrevState = "Idle";


function GameStateChanged(data)
{
    clearInterval(FuncIntervalID);
    if(data.State == "OnGoing")
    {
        Multiplier = 1;
        startTime = new Date(data.StartUTC+"Z").getTime();
        FuncIntervalID = setInterval(UpdateMultiplier, 50);
        document.querySelector("#Game_WaitTime").innerHTML = "";
        document.querySelector("#MakeBet_btn").style.display = "none";
        document.querySelector("#CashOut_btn").style.display = "block";
    }
    else if(data.State == "Betting")
    {
        if(PrevState!="Betting")
            ClearParticipants();
        startTime = new Date(data.BetStartUTC+"Z").getTime();
        FuncIntervalID = setInterval(UpdateWaitTime, 50);
        document.querySelector("#Game_Multiplier").innerHTML = "-";
        document.querySelector("#MakeBet_btn").style.display = "block";
        document.querySelector("#CashOut_btn").style.display = "none";
        document.querySelector("#Game_TotalBetAmount").innerHTML = data.TotalBetAmount;
    }
    else if(data.State == "Concluded")
    {
        document.querySelector("#Game_Multiplier").innerHTML = "x" + parseFloat(data.BlastMultiplier).toFixed(2);
        document.querySelector("#Game_WaitTime").innerHTML = "BLAST!!!";
        document.querySelector("#MakeBet_btn").style.display = "none";
        document.querySelector("#CashOut_btn").style.display = "none";
    }
    PrevState = data.State;
}

var Multiplier = 1;
var startTime;
function UpdateMultiplier()
{
    const currentTime = new Date().getTime();
    const elapsedTime = (currentTime - startTime)/1000;
    var ele = document.querySelector("#Game_Multiplier");
    ele.innerHTML = "x" + calculateMultiplier(elapsedTime).toFixed(2);
}

function calculateMultiplier(waitTime) 
{
    const growthRate = 1.08;  
    if (growthRate <= 1) {
      throw new Error("Growth rate must be greater than 1");
    }
    // Solve for multiplier: multiplier = growthRate^waitTime
    const multiplier = Math.pow(growthRate, waitTime);
    return multiplier;
}

function UpdateWaitTime()
{
    const currentTime = new Date().getTime();
    var elapsedTime = (currentTime - startTime)/1000;
    var ele = document.querySelector("#Game_WaitTime");
    elapsedTime = 10 - elapsedTime;
    if(elapsedTime < 0)
    {
        elapsedTime = 0;
    }
    ele.innerHTML = "Place your Bets, Next Game starts in \"" + elapsedTime.toFixed(2) + "\" sec";

}

function MakeBet()
{
    document.querySelector("#MakeBet_btn").disabled = true;
    // Your JSON message
    const jsonMessage = {
        action: 'MakeBet',
        betAmount: document.querySelector("#Game_BetAmountInput").value,
        AutoCashOut: document.querySelector("#Game_CashOutMultiplierCheck").checked,
        CashOutMultiplier: document.querySelector("#Game_CashOutMultiplierInput").value
        // Add other key-value pairs as needed
    };

    // Send the JSON message as a string
    socket.send(JSON.stringify(jsonMessage));

}

function CashOut()
{
    document.querySelector("#CashOut_btn").disabled = true;
    // Your JSON message
    const jsonMessage = {
        action: 'CashOut'
    };

    // Send the JSON message as a string
    socket.send(JSON.stringify(jsonMessage));

}

function BetStateChanged(data)
{
    AddParticipant(data);
}

function AddParticipant(data) {
    
    var newDiv = document.createElement('div');
    newDiv.classList.add('participant');
    newDiv.id = 'user-' + data.userid;

    cashOutDisplay = data.CashOutMultiplier == "0" ? "LIVE" : ("x"+ data.CashOutMultiplier)
    
    var content = '<img class="participant_avatar" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyD3SI8Qdekp6twYtnVVcpKfHw7WVQGy9Yfd32EiXPZI30cEgXJ-XhquB0ObTnutlwQrM&usqp=CAU"/> <span class="participant_name">username</span> <img style="width:18px; height:18px;" src="https://cdn-icons-png.flaticon.com/512/272/272525.png" alt="Coins"> <span class="participant_betAmount">'+data.BetAmount+'</span> <div class="participant_cashOutMultiplier">'+cashOutDisplay+'</div>';
    newDiv.innerHTML = content;
    var parentElement = document.querySelector("#Game_ParticipantsContainer");

    parentElement.appendChild(newDiv);
    document.querySelector("#Game_PlayerCount").innerHTML = parentElement.children.length +" PLAYING";
    GetUserInfo(data.userid);
}

function RemoveParticipant(data) {
  var elementToRemove = document.getElementById("user-" + data.userid);
  if (elementToRemove) {
    var parentElement = elementToRemove.parentNode;
    parentElement.removeChild(elementToRemove);
  } else {
    console.error('Element with ID ' + elementId + ' not found.');
  }
}

function ClearParticipants() {
  var parentElement = document.querySelector("#Game_ParticipantsContainer");
  parentElement.innerHTML = '';
  document.querySelector("#Game_PlayerCount").innerHTML = parentElement.children.length +" PLAYING";
}

async function GetUserInfo(userId) {
    const response = await fetch(`https://434m33avoi.execute-api.ap-south-1.amazonaws.com/Production/userinfo?uid=${userId}`, {
    method: 'GET',
    mode: 'cors',
    });
    
    // Check if the request was successful (status code 200)
    if (!response.ok) {
    throw new Error(`Failed to fetch user details. Status: ${response.status}`);
    }

    // Parse the JSON response
    const userData = await response.json();

    // Get username and avatarURL from the response
    const { username, avatar_url } = userData;

    console.log(username);
    // Update the specified div with the user details
    const userDiv = document.getElementById("user-" + userId);
    //userDiv.querySelector(".c_username").textContent = username;
    userDiv.querySelector("img").src = avatar_url;

}



  