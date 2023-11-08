var FuncIntervalID;
var PrevState = "Idle";
var startTime;
var GameID = 0;
var GameState = "";


function GameInit_Handler(data)
{

}

function WalletBalanceChanged(data)
{
    let currentBalance = parseFloat(document.querySelector("#Profile_WalletBalance").innerHTML);
    let updatedBalance = 0;
    if(data.IsAdditive)
        updatedBalance = currentBalance + data.Balance;
    else
        updatedBalance = data.Balance;

    document.querySelector("#Profile_WalletBalance").innerHTML = (Math.floor(parseFloat(updatedBalance) * 100) / 100).toFixed(2)
    return;
}

function GameStateChanged(data)
{
    for (var item of data["BatchData"])
    {
        var obj;
        if (typeof item === 'string')
            obj = JSON.parse(item);
        else
            obj = item

        if(obj["Type"] == "GameState")
        {
            GameState_Handler(obj["Body"]);
        }
        else if(obj["Type"] == "GameHistory")
        {
            console.log(obj)
        }
        else if(obj["Type"] == "PlayerBet")
        {
            PlayerBet_Handler(obj["Body"]);
        }

    
    }
}

function GameState_Handler(data)
{
    Trigger_GameStateChanged(data);

    clearInterval(FuncIntervalID);
    GameID = data.GameID;
    GameState = data.State;
    if(data.State == "ONGOING")
    {
        if(PrevState!="ONGOING")
        {
            document.querySelector("#CashOut_btn").disabled = false;
        }
        startTime = data.GameStartUTC * 1000;
        FuncIntervalID = setInterval(UpdateMultiplier, 50);
        document.querySelector("#Game_WaitTime").innerHTML = "";
        document.querySelector("#MakeBet_btn").style.display = "none";
        document.querySelector("#CashOut_btn").style.display = "block";
    }
    else if(data.State == "BETTING")
    {
        if(PrevState!="BETTING")
        {
            ClearParticipants();
            document.querySelector("#MakeBet_btn").disabled = false;
            document.querySelector("#Game_TotalBetAmount").innerHTML = 0;
        }
        startTime = data.BetStartUTC * 1000;
        FuncIntervalID = setInterval(UpdateWaitTime, 50);
        document.querySelector("#Game_Multiplier").innerHTML = "-";
        document.querySelector("#MakeBet_btn").style.display = "block";
        document.querySelector("#CashOut_btn").style.display = "none";
    }
    else if(data.State == "CONCLUDED")
    {
        console.log(data.BlastMultiplier);
        document.querySelector("#Game_Multiplier").innerHTML = "x" + (Math.floor(parseFloat(data.BlastMultiplier) * 100) / 100).toFixed(2);
        document.querySelector("#Game_WaitTime").innerHTML = "BLAST!!!";
        document.querySelector("#MakeBet_btn").style.display = "none";
        document.querySelector("#CashOut_btn").style.display = "none";
        BlastAllParticipants();
    }
    PrevState = data.State;
}

function UpdateMultiplier()
{
    const currentTime = new Date().getTime();
    const elapsedTime = (currentTime - startTime)/1000;
    var ele = document.querySelector("#Game_Multiplier");
    ele.innerHTML = "x" + (Math.floor(calculateMultiplier(elapsedTime) * 100) / 100).toFixed(2);
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

async function MakeBet()
{
    if(localSessionToken)
    {
        document.querySelector("#MakeBet_btn").disabled = true;
        SendPlaceBet(GameID,document.querySelector("#Game_BetAmountInput").value,document.querySelector("#Game_CashOutMultiplierInput").value,document.querySelector("#Game_CashOutMultiplierCheck").checked);
    }

}
async function CashOut()
{
    if(localSessionToken)
    {
        document.querySelector("#CashOut_btn").disabled = true;
        SendCashOut(GameID);
    }
}

function PlayerBet_Handler(data)
{

    Trigger_PlayerBetChanged(data);

    var ele = document.getElementById('user-' + data.UserID);
    if(ele !== null)
    {
        //exists
        if(data.BetState == "SUCCESS")
        {
            ele.classList.add('participant_cashedout');
            cashOutDisplay = "x"+ (Math.floor(data.CashOutMultiplier * 100) / 100).toFixed(2);
        }
        else
        {
            cashOutDisplay = data.IsAutoCashOut ? ("x"+ (Math.floor(data.CashOutMultiplier * 100) / 100).toFixed(2)) : "LIVE";
        }
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
    newDiv.id = 'user-' + data.UserID;
    if(data.BetState == "SUCCESS")
    {
        newDiv.classList.add('participant_cashedout');
        cashOutDisplay = "x"+ (Math.floor(data.CashOutMultiplier * 100) / 100).toFixed(2);
    }
    else
    {
        cashOutDisplay = data.IsAutoCashOut ? ("x"+ (Math.floor(data.CashOutMultiplier * 100) / 100).toFixed(2)) : "LIVE";
    }

    var content = '<img class="participant_avatar" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyD3SI8Qdekp6twYtnVVcpKfHw7WVQGy9Yfd32EiXPZI30cEgXJ-XhquB0ObTnutlwQrM&usqp=CAU"/> <span class="participant_name">username</span> <img style="width:18px; height:18px;" src="https://cdn-icons-png.flaticon.com/512/272/272525.png" alt="Coins"> <span class="participant_betAmount">'+data.BetAmount+'</span> <div class="participant_cashOutMultiplier">'+cashOutDisplay+'</div>';
    newDiv.innerHTML = content;
    var parentElement = document.querySelector("#Game_ParticipantsContainer");

    parentElement.appendChild(newDiv);
    document.querySelector("#Game_PlayerCount").innerHTML = parentElement.children.length +" PLAYING";
    GetUserInfo(data.UserID);

    document.querySelector("#Game_TotalBetAmount").innerHTML = (parseFloat(document.querySelector("#Game_TotalBetAmount").innerHTML) + parseFloat(data.BetAmount)).toFixed(2);
}

function RemoveParticipant(data) {
  var elementToRemove = document.getElementById("user-" + data.UserID);
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
  
var cache = {};
async function GetUserInfo(userId) {
    var userData;
    if (cache[userId]) {
        userData = cache[userId];
    }
    else
    {
        const response = await fetch(`https://diky7svtssilljdjfe6fzkq4eq0ekkje.lambda-url.sa-east-1.on.aws/?uid=${userId}`, {
            method: 'GET',
            mode: 'cors',
        });
        
        // Check if the request was successful (status code 200)
        if (!response.ok) {
        throw new Error(`Failed to fetch user details. Status: ${response.status}`);
        }
    
        // Parse the JSON response
        userData = await response.json();
        const { username, avatar_url } = userData;
        checkCacheSize();
        cache[userId] = { username, avatar_url };

    }
    

    // Get username and avatarURL from the response
    const { username, avatar_url } = userData;

    console.log(username);
    // Update the specified div with the user details
    const userDiv = document.getElementById("user-" + userId);
    //userDiv.querySelector(".c_username").textContent = username;
    userDiv.querySelector("img").src = avatar_url;

}


function checkCacheSize() {
    const currentCacheSize = Object.keys(cache).length;
    if (currentCacheSize > 200) {
        cache = {}
        console.log('Cache cleared');
    }
}



async function initializeGame() {

    const initGameState = await getCurrentGameState();
    GameStateChanged(initGameState.getCurrentGameState);
    
    const initPlayerBets = await getAllPlayerBets(initGameState.getCurrentGameState["GameID"]);
    for (let bet of initPlayerBets.getAllPlayerBets) {
        BetStateChanged(bet);
    }

    SubscribeToGameEvents();
}

// Call the async function
// initializeGame();


function Trigger_GameStateChanged(data)
{
    if(data.State == "ONGOING")
    {
        InitialLaunchRocket();
    }
    else if(data.State == "BETTING")
    {
        ResetRocketGame2();
    }
    else if(data.State == "CONCLUDED")
    {
        BlastRocket();
        RemoveAllVipPlayers();
    }
}


function Trigger_PlayerBetChanged(data)
{
    // console.log("DinoBetStateChanged");
    // console.log(data);

    AddDataToAllPlayerList(data);
}


