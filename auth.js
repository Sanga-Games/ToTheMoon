
var localSessionToken = localStorage.getItem('sessiontoken');
//var domainURL = "https://sanga-games.github.io/ToTheMoon" 
var domainURL = "http://localhost:53134"
var AuthServerURL = "https://wov4kdp5cnsniwc66aoyk5imse0nhrpj.lambda-url.sa-east-1.on.aws"
var UserID = ""
var IsVoiceCommsEnabled = false;

//Post-Signout CLeanup
if (window.location.href == domainURL + "/?action=signout") {
    //localStorage.removeItem('sessiontoken');
    //window.location.href = domainURL;
}

if (!localSessionToken) {
    // 'sessiontoken' is not in localStorage, check URL parameters
    var currentUrl = window.location.href;
    var urlParams = new URLSearchParams(currentUrl.split('?')[1]);
    var urlSessionToken = urlParams.get('sessiontoken');
    if (urlSessionToken && urlSessionToken.trim() !== '') {
        // URL has a valid 'sessiontoken', save it to localStorage
        localStorage.setItem('sessiontoken', urlSessionToken);
        window.location.href = domainURL;
        //localSessionToken = urlSessionToken;
    } else {
        SubscribeToGameEvents();
        // 'sessiontoken' is not in localStorage and not in URL, redirect to the login page
        //window.location.href = 'http://localhost:53134/'; // Replace with the actual login page URL
    }
}

//Device param logic
var eachnavigator_info = window.navigator;
var eachscreen_info = window.screen;

var mimeTypesLength = eachnavigator_info.mimeTypes.length;
var userAgentDigits = eachnavigator_info.userAgent.replace(/\D+/g, '');
var pluginsLength = eachnavigator_info.plugins.length;
var screenHeight = eachscreen_info.height || '';
var screenWidth = eachscreen_info.width || '';
var pixelDepth = eachscreen_info.pixelDepth || '';

var deviceidObject = {
    mimeTypesLength,
    userAgentDigits,
    pluginsLength,
    screenHeight,
    screenWidth,
    pixelDepth,
};

// Serialize the object as a JSON string
var deviceidParams = JSON.stringify(deviceidObject);
var encodedDeviceidParams = encodeURIComponent(deviceidParams);

if (localSessionToken) {

    (async () => {
        const requrl = `${AuthServerURL}/?sessiontoken=${localSessionToken}&sessiondeviceid=${encodedDeviceidParams}`;

        try {
            const response = await fetch(requrl, { method: 'GET', mode: 'cors' });
            console.log(response)
            // Check if the request was successful (status code 200)
            if (!response.ok) {
                localStorage.removeItem('sessiontoken');
                window.location.href = domainURL;
                throw new Error(`Failed to fetch user details. Status: ${response.status}, StatusText: ${response.statusText}`);
            }

            // Parse the JSON response
            const userData = await response.json();

            if (userData.msg == "Session token not valid") {
                localStorage.removeItem('sessiontoken');
                window.location.href = domainURL;
                throw new Error(`Failed to fetch user details. Status: ${response.status}, StatusText: ${response.statusText}`);
            }

            console.log(userData);
            const { dusername, davatarid, did, userid } = userData;
            UserID = userid;
            document.getElementById('Profile_UserName').textContent = dusername;
            document.getElementById('Profile_Avatar').src = `https://cdn.discordapp.com/avatars/${did}/${davatarid}`;
            document.getElementById('PreLogin').style.display = "none";
            document.getElementById('PostLogin').style.display = "block";
            SubscribeToGameEvents();
            // InitGameWebsocketConnection();
            // startCapturing();
            //initializeGame();
        } catch (error) {
            console.error(error);
        }
    })();




    // var refreshButton = document.getElementById('Profile_RefreshButton');

    // refreshButton.addEventListener('click', function() {
    //     requrl = AuthServerURL + `/refresh?sessiontoken=${localSessionToken}`
    //     console.log('Button clicked');
    // });
}


function UserSignout() {
    localStorage.removeItem('sessiontoken');
    requrl = AuthServerURL + `/signout?sessiontoken=${localSessionToken}&sessiondeviceid=${encodedDeviceidParams}`
    window.location.href = requrl;
}


const AddVCointBTN = document.getElementById('AddVCointBTN');
const balanceAdder = document.querySelector('.BalanceAdder');
const addBalanceCancelButton = document.getElementById('AddBalanceCancelButton');

const TenVCoinbutton = document.getElementById('TenVCoinButton');
const FiftyVCoinButton = document.getElementById('FiftyVCoinButton');
const HundredVCoinButton = document.getElementById('HundredVCoinButton');

AddVCointBTN.addEventListener('click', function () {
    balanceAdder.style.display = 'flex';
    console.log("Add VCoin button clicked")
});

addBalanceCancelButton.addEventListener('click', function () {
    balanceAdder.style.display = 'none';
});


TenVCoinbutton.addEventListener('click', function () {

    window.location.href = `https://kq7r6ttsuhnvxhgxzzreh4okya0tmmrr.lambda-url.sa-east-1.on.aws/?sessiontoken=${localSessionToken}&Quantity=10`

});

FiftyVCoinButton.addEventListener('click', function () {

    window.location.href = `https://kq7r6ttsuhnvxhgxzzreh4okya0tmmrr.lambda-url.sa-east-1.on.aws/?sessiontoken=${localSessionToken}&Quantity=50`

});

HundredVCoinButton.addEventListener('click', function () {

    window.location.href = `https://kq7r6ttsuhnvxhgxzzreh4okya0tmmrr.lambda-url.sa-east-1.on.aws/?sessiontoken=${localSessionToken}&Quantity=100`

});



const FeedbackBTN = document.getElementById('FeedbackBTN');
const PaymentHistoryBTN = document.getElementById('PaymentHistoryBTN');

const FeedbackContainer = document.getElementById('FeedbackContainer');
const FeedbackSendButton = document.getElementById('FeedbackSendButton');
const FeedbackcancelButton = document.getElementById('FeedbackcancelButton');
const TopicInput = document.getElementById('TopicInput');
const DescriptionInput = document.getElementById('DescriptionInput');

const PaymentContainer = document.getElementById('PaymentContainer');
const PaymentHolder = document.getElementById('PaymentHolder');
const PaymentContainerCancelBTN = document.getElementById('PaymentContainerCancelBTN');
var PaymentStartKey = '';
const PaymentloadMoreBTN = document.getElementById('PaymentloadMoreBTN');

PaymentHistoryBTN.addEventListener('click', function () {

    var PaymentParams = JSON.stringify(PaymentStartKey);
    var encodedPaymentParams = encodeURIComponent(PaymentParams);

    (async () => {

        const requrl = `https://kq7r6ttsuhnvxhgxzzreh4okya0tmmrr.lambda-url.sa-east-1.on.aws/RetrivePayments/?sessiontoken=${localSessionToken}&PaymentStartKey=${encodedPaymentParams}`

        try {
            const response = await fetch(requrl, { method: 'GET', mode: 'cors' });

            // Check if the request was successful (status code 200)
            if (!response.ok) {
                window.location.href = domainURL;
            }

            // Parse the JSON response
            const PaymentsData = await response.json();
            console.log(PaymentsData);
            AllPaymentsRow = document.querySelectorAll('.PaymentDataRow');
            if (AllPaymentsRow.length > 0) {

                AllPaymentsRow.forEach((PaymentRow) => {
                    PaymentRow.remove();
                });
            }
            var PaymentTableBody = document.getElementById('PaymnetHolderTable');

            for (var i = 0; i < PaymentsData.items.length; i++) {
                var rowcolor = "red";

                if (PaymentsData.items[i].isTransferred == "True") {
                    rowcolor = "green";
                }

                var row = `<tbody class="PaymentDataRow" style="background-color: ${rowcolor};">
                                <tr>
                                    <td>${PaymentsData.items[i].PaymentIntent}</td>
                                    <td>${PaymentsData.items[i].Quantity}</td>
                                    <td>${PaymentsData.items[i].PaymentStatus}</td>
                                    <td>${PaymentsData.items[i].isTransferred}</td>
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

        } catch (error) {
            console.error(error);
        }

    })();

    PaymentContainer.style.display = 'flex';

});

PaymentContainerCancelBTN.addEventListener('click', function () {

    PaymentContainer.style.display = 'none';
    PaymentStartKey = ''

});


PaymentloadMoreBTN.addEventListener('click', function () {

    var PaymentParams = JSON.stringify(PaymentStartKey);
    var encodedPaymentParams = encodeURIComponent(PaymentParams);

    (async () => {

        const requrl = `https://kq7r6ttsuhnvxhgxzzreh4okya0tmmrr.lambda-url.sa-east-1.on.aws/RetrivePayments/?sessiontoken=${localSessionToken}&PaymentStartKey=${encodedPaymentParams}`

        try {
            const response = await fetch(requrl, { method: 'GET', mode: 'cors' });

            // Check if the request was successful (status code 200)
            if (!response.ok) {
                window.location.href = domainURL;
            }

            // Parse the JSON response
            const PaymentsData = await response.json();
            console.log(PaymentsData);

            var PaymentTableBody = document.getElementById('PaymnetHolderTable')

            for (var i = 0; i < PaymentsData.items.length; i++) {
                var rowcolor = "red";

                if (PaymentsData.items[i].isTransferred == "True") {
                    rowcolor = "green";
                }

                var row = `<tbody class="PaymentDataRow" style="background-color: ${rowcolor};">
                                <tr>
                                    <td>${PaymentsData.items[i].PaymentIntent}</td>
                                    <td>${PaymentsData.items[i].Quantity}</td>
                                    <td>${PaymentsData.items[i].PaymentStatus}</td>
                                    <td>${PaymentsData.items[i].isTransferred}</td>
                                </tr>
                            </tbody>`

                PaymentTableBody.innerHTML += row;
            }


            PaymentStartKey = PaymentsData.lastEvaluatedKey

            if (PaymentStartKey == null) {
                PaymentloadMoreBTN.style.display = 'none';
            }

        } catch (error) {
            console.error(error);
        }

    })();

});


FeedbackBTN.addEventListener('click', function () {

    FeedbackContainer.style.display = 'flex';

});

FeedbackcancelButton.addEventListener('click', function () {

    FeedbackContainer.style.display = 'none';

});

FeedbackSendButton.addEventListener('click', function () {



    (async () => {

        const requrl = `https://ysj73qcubjs65az5qdpnrxnlbm0fdlvk.lambda-url.sa-east-1.on.aws/AddFeedback/?sessiontoken=${localSessionToken}&FeedbackTopic=${TopicInput.value}&FeedbackDescription=${DescriptionInput.value}`

        if (TopicInput.value != null & DescriptionInput.value != null) {

            console.log("Both are valid value");

            try {
                const response = await fetch(requrl, { method: 'GET', mode: 'cors' });

                // Check if the request was successful (status code 200)
                if (!response.ok) {
                    window.location.href = domainURL;
                }

                // Parse the JSON response
                const FeedbackData = await response.json();
                console.log(FeedbackData);

                FeedbackContainer.style.display = 'none';

                TopicInput.value = '';
                DescriptionInput.value = '';

            } catch (error) {
                console.error(error);
            }
        }
        else {
            console.log("Topic or description is empty");
        }

    })();

});