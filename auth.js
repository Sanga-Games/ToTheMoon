
var localSessionToken = localStorage.getItem('sessiontoken');
var domainURL = "https://sanga-games.github.io/ToTheMoon" 
// var domainURL = "http://localhost:53134"
var AuthServerURL = "https://wov4kdp5cnsniwc66aoyk5imse0nhrpj.lambda-url.sa-east-1.on.aws"
var UserID = ""
var IsVoiceCommsEnabled = false;
let audioStream;

async function loadVoiceSettings()
{
    var tmp = localStorage.getItem('IsVoiceCommsEnabled');
    if(tmp)
    {
       IsVoiceCommsEnabled = localStorage.getItem('IsVoiceCommsEnabled') == 'true'?true:false;
       if(IsVoiceCommsEnabled)
       {
            audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            if(audioStream)
            {
                document.querySelector('#VoiceCommsCheckbox').checked = true;
            }
            else
            {
                IsVoiceCommsEnabled = false;
                localStorage.setItem('IsVoiceCommsEnabled', false);
            }

       }
    }
}

loadVoiceSettings();


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
        GetGameInit();
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
            document.getElementById('BettingControlsArea').style.display = "block";

            // startCapturing();
            GetGameInit();
            SubscribeToGameEvents();
            InitGameWebsocketConnection();
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

function ToggleLoadingScreen(ToggleState)
{

    LoadingScreen = document.getElementById('LoadingScreenContainer');

    if(ToggleState)
    {
        LoadingScreen.style.display = 'flex';
    }
    else
    {
        LoadingScreen.style.display = 'none';
    }
}