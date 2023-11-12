var FuncIntervalID;
var PrevState = "Idle";
var startTime;
var GameID = 0;
var GameState = "";
var BettingWaitTime = 10;
var UpdateReceivedAfterGameInit = 0;
var isBetPlaced = false;


async function GetGameInit()
{
    if(UpdateReceivedAfterGameInit >= 2)
        return;
    const response = await fetch(`https://j2zyz42upr64kqijsjpnu5it240layxj.lambda-url.sa-east-1.on.aws/?uid=${UserID}`, {
        method: 'GET',
        mode: 'cors',
    });
    if (!response.ok) {
    throw new Error(`Failed to fetch GameInit Data. Status: ${response.status}`);
    }

    // Parse the JSON response
    gameInitData = await response.json();
    //console.log(gameInitData);
    GameState_Handler(gameInitData.game_state);
    console.log(gameInitData.player_bets);
    for (var item of gameInitData.player_bets)
    {
        PlayerBet_Handler(item);
    }
    WalletBalanceChanged({
        "Balance":gameInitData.wallet_data.WalletBalance
    });

    setTimeout(function(){
        GetGameInit();
    }, 3000);
}

function WalletBalanceChanged(data)
{
    console.log(data);
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

function CheckForVoiceCommsAccess()
{
    const top10Entries = AllPlayersList.slice(0, 10);

    // Check if any entry in the top 10 has the specified UserID
    const hasBet = top10Entries.some(entry => entry.UserID === UserID);
  
    if(hasBet & IsVoiceCommsEnabled)
        InitVoiceWebsocketConnection();
}

function GameState_Handler(data)
{
    if(data.GameID < GameID)
        return;

    if(UpdateReceivedAfterGameInit < 2)
        UpdateReceivedAfterGameInit++;

    if(PrevState!=data.State)
        Trigger_GameStateChanged(data);

    clearInterval(FuncIntervalID);
    GameID = data.GameID;
    GameState = data.State;
    if(data.State == "ONGOING")
    {
        if(PrevState!="ONGOING")
        {
            if(isBetPlaced)
                document.querySelector("#CashOut_btn").disabled = false;
            else
                document.querySelector("#CashOut_btn").disabled = true;

            document.querySelector("#BettingGroup").style.display = "none";
            document.querySelector("#CashoutGroup").style.display = "block";
            if(UserID)
                CheckForVoiceCommsAccess();
        }
        startTime = data.GameStartUTC * 1000;
        FuncIntervalID = setInterval(UpdateMultiplier, 50);
        document.querySelector("#Game_WaitTime").innerHTML = "";
    }
    else if(data.State == "BETTING")
    {
        if(PrevState!="BETTING")
        {
            isBetPlaced = false;
            ClearParticipants();
            document.querySelector("#MakeBet_btn").disabled = false;
            document.querySelector("#BettingGroup").style.display = "block";
            document.querySelector("#CashoutGroup").style.display = "none";
            document.querySelector("#Game_TotalBetAmount").innerHTML = 0;
            BettingWaitTime = data.BetDuration;
        }
        startTime = data.BetStartUTC * 1000;
        FuncIntervalID = setInterval(UpdateWaitTime, 50);
        document.querySelector("#Game_Multiplier").innerHTML = "-";
        document.querySelector("#CashOut_btn").disabled = false;
    }
    else if(data.State == "CONCLUDED")
    {

        document.querySelector("#BettingGroup").style.display = "none";
        document.querySelector("#CashoutGroup").style.display = "block";
        console.log(data.BlastMultiplier);
        document.querySelector("#Game_Multiplier").innerHTML = "x" + (Math.floor(parseFloat(data.BlastMultiplier) * 100) / 100).toFixed(2);
        document.querySelector("#Game_WaitTime").innerHTML = "BLAST!!!";
        document.querySelector("#CashOut_btn").disabled = true;
        BlastAllParticipants();
        isBetPlaced = false;
    }
    PrevState = data.State;
}

function UpdateMultiplier()
{
    const currentTime = getCurrentUTCSeconds();
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
    const currentTime = getCurrentUTCSeconds();
    var elapsedTime = (currentTime - startTime)/1000;
    var ele = document.querySelector("#Game_WaitTime");
    elapsedTime = BettingWaitTime - elapsedTime;
    if(elapsedTime < 0)
    {
        elapsedTime = 0;
    }
    ele.innerHTML = "Place your Bets, Next Game starts in \"" + elapsedTime.toFixed(1) + "\" sec";

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
    if(data.BetGameID < GameID)
        return;

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
    SortPlayerBets();
}

function SortPlayerBets() {
    var parentElement = document.querySelector("#Game_ParticipantsContainer");
    var participantList = parentElement.querySelectorAll('.participant');

    var sortedParticipants = Array.from(participantList).sort(function (a, b) {
        var betAmountA = parseFloat(a.querySelector('.participant_betAmount').innerHTML);
        var betAmountB = parseFloat(b.querySelector('.participant_betAmount').innerHTML);

        if (a.classList.contains('participant_cashedout')) {
            betAmountA += 1000000;
        }

        if (b.classList.contains('participant_cashedout')) {
            betAmountB += 1000000;
        }
        return betAmountA - betAmountB;
    });

    // Remove all participants from the parent div
    participantList.forEach(function (participant) {
        participant.remove();
    });

    // Append the sorted participants back to the parent div
    sortedParticipants.forEach(function (participant) {
        parentElement.appendChild(participant);
    });
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
    console.log("blastParticipants1")
    setTimeout(function() {
        if(CurrentGameStateObj.State == "CONCLUDED")
        {
            
            console.log("blastParticipants2")
            var parentElement = document.querySelector("#Game_ParticipantsContainer");
            for (var i = 0; i < parentElement.children.length; i++) {
            var child = parentElement.children[i];
        
            // Check if the element does not have the class "participant_cashedout"
            if (!child.classList.contains('participant_cashedout')) {
                child.classList.add('participant_blasted');
            }
            }
        }
        
    }, 1000);
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
    CurrentGameStateObj = data;
    if(data.State == "ONGOING")
    {
        InitialLaunchRocket();
        $('.explosion').remove();
    }
    else if(data.State == "BETTING")
    {
        ResetRocketGame2();
        $('.explosion').remove();
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


function Notify(type, message) {
    // Clear all elements of class ".notif" in #BettingControlsArea
    $('#BettingControlsArea').find('.notif').remove();
  
    // Add a new div of class notif to BettingControlsArea with message as content
    const newNotification = $('<div>').addClass('notif').addClass(type).text(message);
    $('#BettingControlsArea').append(newNotification);
}

