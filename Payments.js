const AddVCointBTN = document.getElementById('AddVCointBTN');
const balanceAdder = document.querySelector('.BalanceAdder');
const addBalanceCancelButton = document.getElementById('AddBalanceCancelButton');

const TenVCoinbutton = document.getElementById('TenVCoinButton');
const FiftyVCoinButton = document.getElementById('FiftyVCoinButton');
const HundredVCoinButton = document.getElementById('HundredVCoinButton');

const PaymentHistoryBTN = document.getElementById('PaymentHistoryBTN');

const PaymentContainer = document.getElementById('PaymentContainer');
const PaymentHolder = document.getElementById('PaymentHolder');
const PaymentContainerCancelBTN = document.getElementById('PaymentContainerCancelBTN');
var PaymentStartKey = '';
const PaymentloadMoreBTN = document.getElementById('PaymentloadMoreBTN');

var GreenColor = "rgb(117, 240, 2)";
var RedColor = "rgb(255, 53, 3);";

/////////////////// FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function checkAndCallUpdateVCoinBalance() 
{
    ToggleLoadingScreen(true);
    if (window.location.href === domainURL + "/?action=UpdateBalance") {
        if (GameWebSocket && GameWebSocket.readyState === WebSocket.OPEN) {
            UpdateVCoinBalance();
        } else {
            // If not connected, wait for 1 second and then check again
            setTimeout(checkAndCallUpdateVCoinBalance, 1000); // 1000 milliseconds = 1 second
        }
    }
    else
    {
        console.log("Don't update VCoin Balance");
        ToggleLoadingScreen(false);
    }
}

// Call the function initially
checkAndCallUpdateVCoinBalance();


AddVCointBTN.addEventListener('click', function () {
    balanceAdder.style.display = 'flex';
});

addBalanceCancelButton.addEventListener('click', function () {
    balanceAdder.style.display = 'none';
});


TenVCoinbutton.addEventListener('click', function () {

    PurchaseVCoin("10");

});

FiftyVCoinButton.addEventListener('click', function () {

    PurchaseVCoin("50");

});

HundredVCoinButton.addEventListener('click', function () {

    PurchaseVCoin("100");

});




PaymentHistoryBTN.addEventListener('click', function () {

    GetPaymentsHistory();

});

PaymentContainerCancelBTN.addEventListener('click', function () {

    PaymentContainer.style.display = 'none';
    PaymentStartKey = ''

});


PaymentloadMoreBTN.addEventListener('click', function () {

    GetPaymentsHistory();

});



function OnPurchaseVCoinReceived(data)
{
    ToggleLoadingScreen(false);
    window.location.href = data;
}

function OnUpdateVCoinBalanceReceived(data)
{
    ToggleLoadingScreen(false);
    console.log(data);
    window.location.href = domainURL;
}

function OnPaymentHistoryReceived(PaymentsData)
{
    AllPaymentsRow = document.querySelectorAll('.PaymentDataRow');
    if (AllPaymentsRow.length > 0) {

        AllPaymentsRow.forEach((PaymentRow) => {
            PaymentRow.remove();
        });
    }
    var PaymentTableBody = document.getElementById('PaymnetHolderTable');

    for (var i = 0; i < PaymentsData.items.length; i++) {
        var rowcolor = RedColor;

        if (PaymentsData.items[i].isTransferred == "True") {
            rowcolor = GreenColor;
        }

        var row = `<tbody class="PaymentDataRow">
                        <tr>
                            <td>${PaymentsData.items[i].PaymentIntent}</td>
                            <td>${PaymentsData.items[i].Quantity}</td>
                            <td>${PaymentsData.items[i].PaymentStatus}</td>
                            <td style="color: ${rowcolor}; font-weight: bolder;">${PaymentsData.items[i].isTransferred}</td>
                        </tr>
                    </tbody>`

        PaymentTableBody.innerHTML += row;
    }


    PaymentStartKey = PaymentsData.lastEvaluatedKey

    if (PaymentStartKey == null) {
        PaymentloadMoreBTN.style.display = 'none';
    }
    else {
        PaymentloadMoreBTN.style.display = 'flex';
    }

    PaymentContainer.style.display = 'flex';
    ToggleLoadingScreen(false);

}

function OnLoadMorePaymentsHistoryReceived(PaymentsData)
{
    var PaymentTableBody = document.getElementById('PaymnetHolderTable')

            for (var i = 0; i < PaymentsData.items.length; i++) {
                var rowcolor = RedColor;

                if (PaymentsData.items[i].isTransferred == "True") {
                    rowcolor = GreenColor;
                }

                var row = `<tbody class="PaymentDataRow">
                                <tr>
                                    <td>${PaymentsData.items[i].PaymentIntent}</td>
                                    <td>${PaymentsData.items[i].Quantity}</td>
                                    <td>${PaymentsData.items[i].PaymentStatus}</td>
                                    <td style="color: ${rowcolor}; font-weight: bolder;">${PaymentsData.items[i].isTransferred}</td>
                                </tr>
                            </tbody>`

                PaymentTableBody.innerHTML += row;
            }


            PaymentStartKey = PaymentsData.lastEvaluatedKey

            if (PaymentStartKey == null) {
                PaymentloadMoreBTN.style.display = 'none';
            }

            ToggleLoadingScreen(false);

}

///////////////// WEB SOCKET FUNCTIONS ///////////////////////////////////////////////////////////////////////////////////////////////////////////////


function GetPaymentsHistory()
{

    var PaymentParams = JSON.stringify(PaymentStartKey);
    var encodedPaymentParams = encodeURIComponent(PaymentParams);

    // Your JSON message
    const jsonMessage = {
        action: 'Payments',
        subAction: 'PaymentHistory',
        PaymentStartKey: encodedPaymentParams
    };

    // Send the JSON message as a string
    GameWebSocket.send(JSON.stringify(jsonMessage));
    ToggleLoadingScreen(true);


}

function PurchaseVCoin(Quantity)
{
    // Your JSON message
    const jsonMessage = {
        action: 'Payments',
        subAction: 'PurchaseVCoin',
        Quantity: Quantity
    };

    // Send the JSON message as a string
    GameWebSocket.send(JSON.stringify(jsonMessage));
    ToggleLoadingScreen(true);
}

function UpdateVCoinBalance()
{
    // Your JSON message
    const jsonMessage = {
        action: 'Payments',
        subAction: 'UpdateVCoinBalance'
    };

    // Send the JSON message as a string
    GameWebSocket.send(JSON.stringify(jsonMessage));
    ToggleLoadingScreen(true);
}

function PaymentsResponse(data)
{
    switch (data.subType){

        case "PaymentHistory":
            // Got all the rewards history for the specific user
            OnLoadMorePaymentsHistoryReceived(data.value);
            break;

        case "FirstPaymentHistory":

            OnPaymentHistoryReceived(data.value);
            break; 
            
        case "PurchaseVCoin":

            OnPurchaseVCoinReceived(data.value);
            break;    

        case "UpdateVCoinBalance":

            OnUpdateVCoinBalanceReceived(data.value);
            break;   

    }
}