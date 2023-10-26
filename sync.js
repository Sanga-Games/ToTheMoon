const API_URL = 'https://qipblkyeffhtnmrojaiti3ji7u.appsync-api.ap-south-1.amazonaws.com/graphql'; // Replace with your AWS AppSync API endpoint
const subscriptionEndpoint = 'wss://qipblkyeffhtnmrojaiti3ji7u.appsync-realtime-api.ap-south-1.amazonaws.com/graphql'; // WebSocket endpoint
const API_KEY = 'da2-xlsu3viohzhc3gs5zunjmkl5ia'; // Replace with your actual API key
const aws_region = 'ap-south-1'; 

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
    console.log(message);

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
var playerBetWebsocket 
var gameStateWebsocket 

function SubscribeToGameEvents()
{
  playerBetWebsocket = subscribeToWebSocket(playerBetSubscription, (data) => {
    // Handle player bet changes
    console.log("Player Bet Change:", data);
    BetStateChanged(data)
  });
  
  gameStateWebsocket = subscribeToWebSocket(gameStateSubscription, (data) => {
    // Handle game state changes
    console.log("Game State Change:", data);
    GameStateChanged(data);
  });
}



