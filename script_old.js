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
        InitWebsocketConnection();
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
            AddBalance(0);
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
        if(PrevState!="OnGoing")
        {
            document.querySelector("#CashOut_btn").disabled = false;
        }
        startTime = new Date(data.StartUTC+"Z").getTime();
        FuncIntervalID = setInterval(UpdateMultiplier, 50);
        document.querySelector("#Game_WaitTime").innerHTML = "";
        document.querySelector("#MakeBet_btn").style.display = "none";
        document.querySelector("#CashOut_btn").style.display = "block";
    }
    else if(data.State == "Betting")
    {
        if(PrevState!="Betting")
        {
            ClearParticipants();
            document.querySelector("#MakeBet_btn").disabled = false;
        }
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
        BlastAllParticipants();
    }
    PrevState = data.State;
}

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
    var ele = document.getElementById('user-' + data.userid);
    if(ele !== null)
    {
        //exists
        if(data.BetState == "CashedOut")
        {
            ele.classList.add('participant_cashedout');
            AddBalance(0);
        }
        cashOutDisplay = data.CashOutMultiplier == 0 ? "LIVE" : ("x"+ parseFloat(data.CashOutMultiplier).toFixed(2))
        ele.querySelector(".participant_cashOutMultiplier").innerHTML = cashOutDisplay;
    }
    else
    {
        AddParticipant(data);
    }
}

function AddParticipant(data) {
    
    var newDiv = document.createElement('div');
    newDiv.classList.add('participant');
    newDiv.id = 'user-' + data.userid;
    if(data.BetState == "CashedOut")
    {
        newDiv.classList.add('participant_cashedout');
    
    }

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

function BlastAllParticipants() {
    var parentElement = document.querySelector("#Game_ParticipantsContainer");
    
    for (var i = 0; i < parentElement.children.length; i++) {
      var child = parentElement.children[i];
  
      // Check if the element does not have the class "participant_cashedout"
      if (!child.classList.contains('participant_cashedout')) {
        child.classList.add('participant_blasted');
      }
    }
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





const API_URL = 'https://hwjxx5xkv5ayvjqn6kmmevizwq.appsync-api.sa-east-1.amazonaws.com/graphql'; // Replace with your AWS AppSync API endpoint
const subscriptionEndpoint = 'wss://hwjxx5xkv5ayvjqn6kmmevizwq.appsync-realtime-api.sa-east-1.amazonaws.com/graphql'; // WebSocket endpoint
const API_KEY = 'da2-sya3gtlx2nesdmmm7mwz6z7emq'; // Replace with your actual API key
const aws_region = 'sa-east-1'; 

// Function to make GraphQL requests
async function graphqlRequest(query, variables = {}, operationName) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify({
      query,
      variables,
      operationName,
    }),
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }
  return result.data;
}

// GraphQL Queries
async function getCurrentGameState() {
  const query = `
    query {
      getCurrentGameState {
        GameID
        ActiveBetAmount
        BetStartUTC
        BlastMultiplier
        EndUTC
        GameHash
        StartUTC
        State
        TotalBetAmount
      }
    }
  `;

  return graphqlRequest(query);
}

async function getAllPlayerBets(gameID) {
  const query = `
    query($gameID: Int!) {
      getAllPlayerBets(GameID: $gameID) {
        GameID
        UserID
        BetAmount
        BetState
        CashOutMultiplier
      }
    }
  `;

  const variables = { gameID };

  return graphqlRequest(query, variables);
}

async function AddWalletBalance(AddedBalance) {
  SessionToken = localSessionToken;
  const query = `
    query($SessionToken: String!, $AddedBalance: Float!) {
      AddWalletBalance(SessionToken: $SessionToken, AddedBalance: $AddedBalance) 
    }
  `;

  const variables = { SessionToken, AddedBalance };

  return graphqlRequest(query, variables);
}

// GraphQL Mutations
async function addPlayerBet(gameID, sessionToken, betAmount, cashOutMultiplier) {
  const mutation = `
    mutation($gameID: Int!, $sessionToken: String!, $betAmount: Float!, $cashOutMultiplier: Float!) {
      addPlayerBet(GameID: $gameID, SessionToken: $sessionToken, BetAmount: $betAmount, CashOutMultiplier: $cashOutMultiplier) {
        Message
      }
    }
  `;

  const variables = { gameID, sessionToken, betAmount, cashOutMultiplier };

  return graphqlRequest(mutation, variables);
}

async function cashOutPlayerBet(gameID, sessionToken) {
  const mutation = `
    mutation($gameID: Int!, $sessionToken: String!) {
      cashOutPlayerBet(GameID: $gameID, SessionToken: $sessionToken) {
        Message
      }
    }
  `;

  const variables = { gameID, sessionToken };

  return graphqlRequest(mutation, variables);
}


// GraphQL subscription
//https://medium.com/@julianminde/realtime-updates-with-appsync-over-websockets-88fbe4ae62cc
//https://docs.aws.amazon.com/appsync/latest/devguide/real-time-websocket-client.html
const APPSYNC_HOST = "qipblkyeffhtnmrojaiti3ji7u.appsync-api.ap-south-1.amazonaws.com";
const APPSYNC_REALTIME_HOST = "qipblkyeffhtnmrojaiti3ji7u.appsync-realtime-api.ap-south-1.amazonaws.com";
const APPSYNC_API_KEY = API_KEY;

function encodeAppSyncCredentials() {
  const creds = {
    host: APPSYNC_HOST,
    "x-api-key": APPSYNC_API_KEY,
  };
  const b64Creds = window.btoa(JSON.stringify(creds));

  return b64Creds;
}

function getWebsocketUrl() {
  const header = encodeAppSyncCredentials();
  const payload = window.btoa(JSON.stringify({}));

  const url = `wss://${APPSYNC_REALTIME_HOST}/graphql?header=${header}&payload=${payload}`;

  return url;
}

const playerBetSubscription = `
  subscription OnPlayerBetChange {
    onPlayerBetChange {
      GameID
      UserID
      BetAmount
      BetState
      CashOutMultiplier
    }
  }
`;

const gameStateSubscription = `
  subscription OnGameStateChange {
    onGameStateChange {
      GameID
      ActiveBetAmount
      BetStartUTC
      BlastMultiplier
      EndUTC
      GameHash
      StartUTC
      State
      TotalBetAmount
    }
  }
`;

const voiceDataSubscription = `
  subscription OnVoiceDataChange {
    onVoiceDataChange {
      Identity
      Data
    }
  }
`;

function startSubscription(websocket, subscriptionQuery) {
  const subscribeMessage = {
    id: window.crypto.randomUUID(),
    type: "start",
    payload: {
      data: JSON.stringify({
        query: subscriptionQuery,
      }),
      extensions: {
        authorization: {
          "x-api-key": APPSYNC_API_KEY,
          host: APPSYNC_HOST,
        },
      },
    },
  };
  websocket.send(JSON.stringify(subscribeMessage));
}

function subscribeToWebSocket(subscriptionQuery, callback) {
  const url = getWebsocketUrl();

  const websocket = new WebSocket(url, ["graphql-ws"]);

  websocket.addEventListener("open", () => {
    websocket.send(
      JSON.stringify({
        type: "connection_init",
      })
    );
  });

  websocket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    //console.log(message);

    switch (message.type) {
      case "connection_ack":
        startSubscription(websocket, subscriptionQuery);
        break;
      case "start_ack":
        console.log("start_ack");
        break;
      case "error":
        console.error(message);
        break;
      case "data":
        const responseData = message.payload.data[Object.keys(message.payload.data)[0]];
        callback(responseData);
        break;
    }
  });

  return websocket;
}

// Usage
var playerBetWebsocket; 
var gameStateWebsocket;
var voiceWebsocket; 

function SubscribeToGameEvents()
{
  playerBetWebsocket = subscribeToWebSocket(playerBetSubscription, (data) => {
    // Handle player bet changes
    //console.log("Player Bet Change:", data);
    BetStateChanged(data)
  });
  
  gameStateWebsocket = subscribeToWebSocket(gameStateSubscription, (data) => {
    // Handle game state changes
    //console.log("Game State Change:", data);
    GameStateChanged(data);
  });

  voiceWebsocket = subscribeToWebSocket(voiceDataSubscription, (data) => {
    // Handle game state changes
    //console.log("Voice Data Change:", data);
    PlayVoice(data.Data);
  });
}



