// GraphQL subscription
//https://medium.com/@julianminde/realtime-updates-with-appsync-over-websockets-88fbe4ae62cc
//https://docs.aws.amazon.com/appsync/latest/devguide/real-time-websocket-client.html
const APPSYNC_HOST = "hwjxx5xkv5ayvjqn6kmmevizwq.appsync-api.sa-east-1.amazonaws.com";
const APPSYNC_REALTIME_HOST = "hwjxx5xkv5ayvjqn6kmmevizwq.appsync-realtime-api.sa-east-1.amazonaws.com";
const APPSYNC_API_KEY = 'da2-sya3gtlx2nesdmmm7mwz6z7emq';
const aws_region = 'sa-east-1';

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

const gameStateSubscription = `
  subscription OnGameStateChange {
    onGameStateChange {
      Data
    }
  }
`;

const voiceDataSubscription = `
  subscription OnVoiceDataChange {
    onVoiceDataChange {
      Identity
      SequenceCode
      Data
    }
  }
`;

const walletBalanceSubscription = `
  subscription OnWalletBalanceChange($userId: String!) {
    onWalletBalanceChange(UserID: $userId) {
      UserID
      Balance
      IsAdditive
    }
  }
`;

const subscriptions = [
  {
    type:'GameState',
    query: gameStateSubscription
  },
  {
    type:'VoiceData',
    query: voiceDataSubscription
  },
  {
    type:'WalletBalance',
    query: walletBalanceSubscription
  },
];

function startSubscriptions(websocket, subscriptions) {
  subscriptions.forEach((subscription) => {

    if(subscription.type == 'GameState' || (subscription.type == 'VoiceData' && IsVoiceCommsEnabled) || (subscription.type == 'WalletBalance' && UserID!= ""))
    {
      const subscribeMessage = {
        id: window.crypto.randomUUID(),
        type: "start",
        payload: {
          data: JSON.stringify({
            query: subscription.query,
            variables: {
              userId: UserID,
            },
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
  });
}

const MAX_RECONNECT_ATTEMPTS = 5;
let reconnectAttempts = 0;

function subscribeToWebSocket(subscriptions,callback) {
  const url = getWebsocketUrl();

  const websocket = new WebSocket(url, ["graphql-ws"]);

  websocket.addEventListener("open", () => {
    reconnectAttempts = 0;
    websocket.send(
      JSON.stringify({
        type: "connection_init",
      })
    );
  });

  websocket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);

    switch (message.type) {
      case "connection_ack":
        console.log("connection_ack");
        startSubscriptions(websocket, subscriptions);
        break;
      case "ka":
        console.log("keep alive");
        break;
      case "start_ack":
        console.log("start_ack");
        break;
      case "error":
        console.error("WebSocket Error:", message.payload.errors);
        break;
      case "data":
        callback(message.payload.data);
        break;
    }
  });

  // Listen for any errors that occur
  websocket.addEventListener('error', (error) => {
    console.error('WebSocket encountered an error:', error);
  });

  // Connection closed
  websocket.addEventListener('close', (event) => {
      console.log('WebSocket connection closed:', event);
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) 
      {
        console.log('Reconnecting...');
        reconnectAttempts++;
        setTimeout(() => SubscribeToGameEvents(), 2000); // 2 seconds delay before reconnecting
      } 
      else {
        console.error('Max reconnection attempts reached. Unable to reconnect.');
      }
  });

  return websocket;
}

// Usage
var SubscriptionWebSocket;

function SubscribeToGameEvents() {
  if (SubscriptionWebSocket && SubscriptionWebSocket.readyState === WebSocket.OPEN) {
    SubscriptionWebSocket.close();
  }
  SubscriptionWebSocket = subscribeToWebSocket(subscriptions, (data) => {
    let key = Object.keys(data)[0];
    switch (key){
      case "onGameStateChange":
        let value = JSON.parse(data[key].Data);
        GameStateChanged(value);
        break;
      case "onVoiceDataChange":
        //PlayVoice(value);
        break;
      case "onWalletBalanceChange":
        WalletBalanceChanged(data[key]);
        break;
    } 

  });
}
