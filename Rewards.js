function GetRewards()
{
    // Your JSON message
    const jsonMessage = {
        action: 'Rewards',
        subAction: 'RewardHistory',
        
    };

    // Send the JSON message as a string
    GameWebSocket.send(JSON.stringify(jsonMessage));

}

function PurchaseReward()
{
    // Your JSON message
    const jsonMessage = {
        action: 'Rewards',
        subAction: 'PurchaseReward'
    };

    // Send the JSON message as a string
    GameWebSocket.send(JSON.stringify(jsonMessage));

}


function RewardsResponse(data)
{
    switch (data.subType){

        case "GetRewards":
            // All Rewards Logic
            break;
        case "RewardHistory":
            //bet success logic
            break;

        case "Rewards":
            RewardsResponse(data);
            break;    
    }
}