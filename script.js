var FuncIntervalID;
var PrevState = "Idle";
var startTime;
var GameID = 0;

function GameStateChanged(data)
{

    Trigger_GameStateChanged(data);

    clearInterval(FuncIntervalID);
    GameID = data.GameID;
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
            document.querySelector("#Game_TotalBetAmount").innerHTML = 0;
        }
        startTime = new Date(data.BetStartUTC+"Z").getTime();
        FuncIntervalID = setInterval(UpdateWaitTime, 50);
        document.querySelector("#Game_Multiplier").innerHTML = "-";
        document.querySelector("#MakeBet_btn").style.display = "block";
        document.querySelector("#CashOut_btn").style.display = "none";
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

async function MakeBet()
{
    document.querySelector("#MakeBet_btn").disabled = true;
    var temp_com = 0;
    if(document.querySelector("#Game_CashOutMultiplierCheck").checked)
        temp_com = document.querySelector("#Game_CashOutMultiplierInput").value
    var result = await addPlayerBet(GameID,localSessionToken,document.querySelector("#Game_BetAmountInput").value,temp_com);
    AddBalance(0);
    console.log(result);
}

async function CashOut()
{
    document.querySelector("#CashOut_btn").disabled = true;
    var result =  await cashOutPlayerBet(GameID,localSessionToken);
    AddBalance(0);
    console.log(result);
}

function BetStateChanged(data)
{

    Trigger_PlayerBetChanged(data);

    var ele = document.getElementById('user-' + data.UserID);
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
    newDiv.id = 'user-' + data.UserID;
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
        const response = await fetch(`https://434m33avoi.execute-api.ap-south-1.amazonaws.com/Production/userinfo?uid=${userId}`, {
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
initializeGame();


function Trigger_GameStateChanged(data)
{
    AddBalance(0);
    if(data.State == "OnGoing")
    {
        InitialLaunchRocket();
    }
    else if(data.State == "Betting")
    {
        ResetRocketGame2();
    }
    else if(data.State == "Concluded")
    {
        BlastRocket();
    }
}


function Trigger_PlayerBetChanged(data)
{

}

async function AddBalance(amount)
{
    var new_balance = await AddWalletBalance(amount);
    var ele = document.querySelector("#Profile_WalletBalance");
    ele.innerHTML = parseFloat(new_balance.AddWalletBalance.toFixed(2)) ;
}

