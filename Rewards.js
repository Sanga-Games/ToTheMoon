const PurchaseRewardsBTN = document.getElementById('PurchaseRewardsBTN');
const RewardsHistoryBTN = document.getElementById('RewardsHistoryBTN');

const RewardsContainer = document.getElementById('RewardsContainer');
const RewardsHolder = document.getElementById('RewardsHolder');
const RewardsContainerCancelBTN = document.getElementById('RewardsContainerCancelBTN');

const RewardsEmailContainer = document.getElementById('RewardsEmailContainer');
const EmailContainerpayButton = document.getElementById('EmailContainerpayButton');
const EmailContainercancelButton = document.getElementById('EmailContainercancelButton');
const emailInput = document.getElementById('emailInput');

var RewardID;

const RewardsHistoryContainer = document.getElementById('RewardsHistoryContainer');
const RewardsHistoryHolder = document.getElementById('RewardsHistoryHolder');
const RewardsHistoryContainerCancelBTN = document.getElementById('RewardsHistoryContainerCancelBTN');
var RewardHistoryStartKey = '';
const RewardsHistoryloadMoreBTN = document.getElementById('RewardsHistoryloadMoreBTN');

var GreenColor = "rgb(117, 240, 2)";
var RedColor = "rgb(255, 53, 3);";

////////////// FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////


// Get User Owned Rewards
RewardsHistoryBTN.addEventListener('click', function () {
    ToggleOptionsMenus();
    GetRewardsHistory();

});

// Load More Rewards Owned by User
RewardsHistoryloadMoreBTN.addEventListener('click', function () {

    GetRewardsHistory();

});

// Close User Rewards Panel
RewardsHistoryContainerCancelBTN.addEventListener('click', function () {

    RewardsHistoryContainer.style.display = 'none';
    RewardHistoryStartKey = '';

});

// Get Rewards
PurchaseRewardsBTN.addEventListener('click', function () {
    ToggleOptionsMenus();
    ToggleLoadingScreen(true);
    (async () => {
        const requrl = "https://ysj73qcubjs65az5qdpnrxnlbm0fdlvk.lambda-url.sa-east-1.on.aws/Rewards/";

        try {
            const response = await fetch(requrl, { method: 'GET', mode: 'cors' });

            // Check if the request was successful (status code 200)
            if (!response.ok) {
                window.location.href = domainURL;
                ToggleLoadingScreen(false);
            }

            ToggleLoadingScreen(false);
            AllRewardsContainerClass = document.querySelectorAll('.RewardsContainerClass')
            if (AllRewardsContainerClass.length > 0) {

                AllRewardsContainerClass.forEach((RewardsClass) => {
                    RewardsClass.remove();
                });
            }

            // Parse the JSON response
            const RewardsData = await response.json();

            RewardsData.forEach(reward => {
                const divElement = document.createElement('div');
                divElement.id = reward.id;
                divElement.className = 'RewardsContainerClass'

                const imgElement = document.createElement('img');
                imgElement.src = reward.Image;
                imgElement.alt = "Rewards";

                const pElement = document.createElement('p');
                pElement.textContent = reward.Name;

                const buttonElement = document.createElement('button');
                buttonElement.textContent = `${reward.Price} VCoin`;

                buttonElement.onclick = function () {
                    console.log(divElement.id);
                    RewardID = divElement.id;
                    RewardsEmailContainer.style.display = 'flex';
                };

                // Append the elements to the RewardsContainer
                divElement.appendChild(imgElement);
                divElement.appendChild(pElement);
                divElement.appendChild(buttonElement);

                RewardsHolder.appendChild(divElement);
            });


            console.log(RewardsData);
        } catch (error) {
            console.error(error);
            ToggleLoadingScreen(false);
        }
    })();


    //RewardsContainer.style.display = 'grid';
    RewardsContainer.style.display = 'flex';

});

// Close Rewards Panel
RewardsContainerCancelBTN.addEventListener('click', function () {

    RewardsContainer.style.display = 'none';

});

// Email Pay Button
EmailContainerpayButton.addEventListener('click', function () {

    PurchaseReward();

});

// close Email Panel
EmailContainercancelButton.addEventListener('click', function () {

    RewardsEmailContainer.style.display = 'none';
    RewardID = '';

});

function OnChangeRewardsReceivedState(selectElement)
{
    console.log("Called");
    RewardHistoryStartKey = '';
    GetRewardsHistory();
}


function OnRewardHistoryReceived(RewardsHistoryData)
{
    AllRewardsHistoryRow = document.querySelectorAll('.RewardsHistoryDataRow');
            if (AllRewardsHistoryRow.length > 0) {

                AllRewardsHistoryRow.forEach((RewardsRow) => {
                    RewardsRow.remove();
                });
            }

            var RewardsHistoryHolderTable = document.getElementById('RewardsHistoryHolderTable');

            for (var i = 0; i < RewardsHistoryData.items.length; i++) {
                var rowcolor = RedColor;

                if (RewardsHistoryData.items[i].Received == "True") {
                    rowcolor = GreenColor;
                }

                var row = `<tbody class="RewardsHistoryDataRow">
                            <tr>
                                <td>${Convert_UTC_To_LocalTime(RewardsHistoryData.items[i].Timestamp)}</td>
                                <td>${RewardsHistoryData.items[i].RewardName}</td>
                                <td>${RewardsHistoryData.items[i].EmailId}</td>
                                <td>${RewardsHistoryData.items[i].PaymentStatus}</td>
                                <td style="color: ${rowcolor}; font-weight: bolder;">${RewardsHistoryData.items[i].Received}</td>
                            </tr>
                        </tbody>`

                RewardsHistoryHolderTable.innerHTML += row;
            }


            RewardHistoryStartKey = RewardsHistoryData.lastEvaluatedKey

            if (RewardHistoryStartKey == null) {
                RewardsHistoryloadMoreBTN.style.display = 'none';
            }
            else {
                RewardsHistoryloadMoreBTN.style.display = 'flex';
            }
    
    RewardsHistoryContainer.style.display = 'flex'; 
    ToggleLoadingScreen(false);       

}

function OnLoadMoreRewardsHistoryReceived(RewardsHistoryData)
{
    var RewardsHistoryHolderTable = document.getElementById('RewardsHistoryHolderTable');

            for (var i = 0; i < RewardsHistoryData.items.length; i++) {
                var rowcolor = RedColor;

                if (RewardsHistoryData.items[i].Received == "True") {
                    rowcolor = GreenColor;
                }

                var row = `<tbody class="RewardsHistoryDataRow">
                            <tr>
                                <td>${Convert_UTC_To_LocalTime(RewardsHistoryData.items[i].Timestamp)}</td>
                                <td>${RewardsHistoryData.items[i].RewardName}</td>
                                <td>${RewardsHistoryData.items[i].EmailId}</td>
                                <td>${RewardsHistoryData.items[i].PaymentStatus}</td>
                                <td style="color: ${rowcolor}; font-weight: bolder;">${RewardsHistoryData.items[i].Received}</td>
                            </tr>
                        </tbody>`

                RewardsHistoryHolderTable.innerHTML += row;
            }


            RewardHistoryStartKey = RewardsHistoryData.lastEvaluatedKey

            if (RewardHistoryStartKey == null) {
                RewardsHistoryloadMoreBTN.style.display = 'none';
            }

            ToggleLoadingScreen(false);

}

function OnPurchaseRewardReceived(data)
{
    // Show a Popup message about the state of purchase
    console.log(data);
    emailInput.value = '';
    RewardID = '';
    RewardsEmailContainer.style.display = 'none';
    RewardsContainer.style.display = 'none';
    ToggleLoadingScreen(false);
}

////////////// WEB SOCKET FUNCTIONS ///////////////////////////////////////////////////////////////////////////////////////////////////

function GetRewardsHistory()
{

    var RewardHistoryParams = JSON.stringify(RewardHistoryStartKey);
    var encodedRewardHistoryParams = encodeURIComponent(RewardHistoryParams);

    // Your JSON message
    const jsonMessage = {
        action: 'Rewards',
        subAction: 'RewardHistory',
        RewardsStartKey: encodedRewardHistoryParams,
        RewardsReceivedState: document.getElementById('RewardsSelect').value
    };

    // Send the JSON message as a string
    GameWebSocket.send(JSON.stringify(jsonMessage));
    ToggleLoadingScreen(true);

}

function PurchaseReward()
{
    // Your JSON message
    const jsonMessage = {
        action: 'Rewards',
        subAction: 'PurchaseReward',
        RewardID: RewardID,
        EmailId: emailInput.value
    };

    // Send the JSON message as a string
    GameWebSocket.send(JSON.stringify(jsonMessage));
    ToggleLoadingScreen(true);

}


function RewardsResponse(data)
{

    switch (data.subType){

        case "RewardHistory":
            // Got all the rewards history for the specific user
                OnLoadMoreRewardsHistoryReceived(data.value);
                document.getElementById('RewardsSelect').value = data.RewardsReceivedState;
            break;

        case "FirstRewardHistory":

            OnRewardHistoryReceived(data.value);
            document.getElementById('RewardsSelect').value = data.RewardsReceivedState;
            break;

        case "PurchaseReward":

            OnPurchaseRewardReceived(data.value);
            break;
        

    }
}