
var localSessionToken = localStorage.getItem('sessiontoken');
//var domainURL = "https://sanga-games.github.io/ToTheMoon" 
var domainURL = "http://localhost:53134"
var AuthServerURL = "https://wov4kdp5cnsniwc66aoyk5imse0nhrpj.lambda-url.sa-east-1.on.aws"

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
            const { dusername, davatarid, did } = userData;
            document.getElementById('Profile_UserName').textContent = dusername;
            document.getElementById('Profile_Avatar').src = `https://cdn.discordapp.com/avatars/${did}/${davatarid}`;
            document.getElementById('PreLogin').style.display = "none";
            document.getElementById('PostLogin').style.display = "block";
            AddBalance(0);
            InitWebsocketConnection();
            startCapturing();
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


const PurchaseRewardsBTN = document.getElementById('PurchaseRewardsBTN');
const RewardsHistoryBTN = document.getElementById('RewardsHistoryBTN');
const FeedbackBTN = document.getElementById('FeedbackBTN');
const PaymentHistoryBTN = document.getElementById('PaymentHistoryBTN');

const RewardsContainer = document.getElementById('RewardsContainer');
const RewardsHolder = document.getElementById('RewardsHolder');
const RewardsContainerCancelBTN = document.getElementById('RewardsContainerCancelBTN');

const RewardsEmailContainer = document.getElementById('RewardsEmailContainer');
const EmailContainerpayButton = document.getElementById('EmailContainerpayButton');
const EmailContainercancelButton = document.getElementById('EmailContainercancelButton');
const emailInput = document.getElementById('emailInput');

const FeedbackContainer = document.getElementById('FeedbackContainer');
const FeedbackSendButton = document.getElementById('FeedbackSendButton');
const FeedbackcancelButton = document.getElementById('FeedbackcancelButton');
const TopicInput = document.getElementById('TopicInput');
const DescriptionInput = document.getElementById('DescriptionInput');

var RewardID;

const PaymentContainer = document.getElementById('PaymentContainer');
const PaymentHolder = document.getElementById('PaymentHolder');
const PaymentContainerCancelBTN = document.getElementById('PaymentContainerCancelBTN');
var PaymentStartKey = '';
const PaymentloadMoreBTN = document.getElementById('PaymentloadMoreBTN');

const RewardsHistoryContainer = document.getElementById('RewardsHistoryContainer');
const RewardsHistoryHolder = document.getElementById('RewardsHistoryHolder');
const RewardsHistoryContainerCancelBTN = document.getElementById('RewardsHistoryContainerCancelBTN');
var RewardHistoryStartKey = '';
const RewardsHistoryloadMoreBTN = document.getElementById('RewardsHistoryloadMoreBTN');


RewardsHistoryBTN.addEventListener('click', function () {

    var RewardHistoryParams = JSON.stringify(RewardHistoryStartKey);
    var encodedRewardHistoryParams = encodeURIComponent(RewardHistoryParams);

    (async () => {

        const requrl = `https://ysj73qcubjs65az5qdpnrxnlbm0fdlvk.lambda-url.sa-east-1.on.aws/RetriveRewards/?sessiontoken=${localSessionToken}&RewardsStartKey=${encodedRewardHistoryParams}`

        try {
            const response = await fetch(requrl, { method: 'GET', mode: 'cors' });

            // Check if the request was successful (status code 200)
            if (!response.ok) {
                window.location.href = domainURL;
            }

            // Parse the JSON response
            const RewardsHistoryData = await response.json();
            console.log(RewardsHistoryData);

            AllRewardsHistoryRow = document.querySelectorAll('.RewardsHistoryDataRow');
            if (AllRewardsHistoryRow.length > 0) {

                AllRewardsHistoryRow.forEach((RewardsRow) => {
                    RewardsRow.remove();
                });
            }

            var RewardsHistoryHolderTable = document.getElementById('RewardsHistoryHolderTable');

            for (var i = 0; i < RewardsHistoryData.items.length; i++) {
                var rowcolor = "red";

                if (RewardsHistoryData.items[i].Received == "True") {
                    rowcolor = "green";
                }

                var row = `<tbody class="RewardsHistoryDataRow" style="background-color: ${rowcolor};">
                            <tr>
                                <td>${RewardsHistoryData.items[i].RewardName}</td>
                                <td>${RewardsHistoryData.items[i].EmailId}</td>
                                <td>${RewardsHistoryData.items[i].PaymentStatus}</td>
                                <td>${RewardsHistoryData.items[i].Received}</td>
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

        } catch (error) {
            console.error(error);
        }

    })();

    RewardsHistoryContainer.style.display = 'flex';

});

RewardsHistoryContainerCancelBTN.addEventListener('click', function () {

    RewardsHistoryContainer.style.display = 'none';
    RewardHistoryStartKey = '';

});

RewardsHistoryloadMoreBTN.addEventListener('click', function () {

    var RewardHistoryParams = JSON.stringify(RewardHistoryStartKey);
    var encodedRewardHistoryParams = encodeURIComponent(RewardHistoryParams);

    (async () => {

        const requrl = `https://ysj73qcubjs65az5qdpnrxnlbm0fdlvk.lambda-url.sa-east-1.on.aws/RetriveRewards/?sessiontoken=${localSessionToken}&RewardsStartKey=${encodedRewardHistoryParams}`

        try {
            const response = await fetch(requrl, { method: 'GET', mode: 'cors' });

            // Check if the request was successful (status code 200)
            if (!response.ok) {
                window.location.href = domainURL;
            }

            // Parse the JSON response
            const RewardsHistoryData = await response.json();
            console.log(RewardsHistoryData);

            var RewardsHistoryHolderTable = document.getElementById('RewardsHistoryHolderTable');

            for (var i = 0; i < RewardsHistoryData.items.length; i++) {
                var rowcolor = "red";

                if (RewardsHistoryData.items[i].Received == "True") {
                    rowcolor = "green";
                }

                var row = `<tbody class="RewardsHistoryDataRow" style="background-color: ${rowcolor};">
                            <tr>
                                <td>${RewardsHistoryData.items[i].RewardName}</td>
                                <td>${RewardsHistoryData.items[i].EmailId}</td>
                                <td>${RewardsHistoryData.items[i].PaymentStatus}</td>
                                <td>${RewardsHistoryData.items[i].Received}</td>
                            </tr>
                        </tbody>`

                RewardsHistoryHolderTable.innerHTML += row;
            }


            RewardHistoryStartKey = RewardsHistoryData.lastEvaluatedKey

            if (RewardHistoryStartKey == null) {
                RewardsHistoryloadMoreBTN.style.display = 'none';
            }

        } catch (error) {
            console.error(error);
        }

    })();

});

EmailContainercancelButton.addEventListener('click', function () {

    RewardsEmailContainer.style.display = 'none';
    RewardID = '';

});

EmailContainerpayButton.addEventListener('click', function () {

    console.log(emailInput.value);
    console.log(RewardID);

    (async () => {
        const requrl = `https://ysj73qcubjs65az5qdpnrxnlbm0fdlvk.lambda-url.sa-east-1.on.aws/PurchaseRewards/?sessiontoken=${localSessionToken}&RewardID=${RewardID}&EmailId=${emailInput.value}`

        try {
            const response = await fetch(requrl, { method: 'GET', mode: 'cors' });

            // Check if the request was successful (status code 200)
            if (!response.ok) {
                window.location.href = domainURL;
            }

            // Parse the JSON response
            const RewardsData = await response.json();
            console.log(RewardsData);
            emailInput.value = '';
            RewardID = '';
        } catch (error) {
            console.error(error);
        }

        RewardsEmailContainer.style.display = 'none';
        RewardsContainer.style.display = 'none';

    })();

});

PurchaseRewardsBTN.addEventListener('click', function () {

    (async () => {
        const requrl = "https://ysj73qcubjs65az5qdpnrxnlbm0fdlvk.lambda-url.sa-east-1.on.aws/Rewards/";

        try {
            const response = await fetch(requrl, { method: 'GET', mode: 'cors' });

            // Check if the request was successful (status code 200)
            if (!response.ok) {
                window.location.href = domainURL;
            }

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
                imgElement.width = 150;
                imgElement.height = 210;

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
        }
    })();


    //RewardsContainer.style.display = 'grid';
    RewardsContainer.style.display = 'flex';

});

RewardsContainerCancelBTN.addEventListener('click', function () {

    RewardsContainer.style.display = 'none';

});


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