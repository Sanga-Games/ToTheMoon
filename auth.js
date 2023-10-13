
var localSessionToken = localStorage.getItem('sessiontoken');
var domainURL = "http://localhost:53134" 
var AuthServerURL = "https://6dkyzuwzlgtq4gywvqu6hrdtce0ldart.lambda-url.ap-south-1.on.aws"

//Post-Signout CLeanup
if(window.location.href == domainURL + "?action=signout")
{
    localStorage.removeItem('sessiontoken');
    window.location.href = domainURL;
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
var navigator_info = window.navigator;
var screen_info = window.screen;
var uid = navigator_info.mimeTypes.length;
uid += navigator_info.userAgent.replace(/\D+/g, '');
uid += navigator_info.plugins.length;
uid += screen_info.height || '';
uid += screen_info.width || '';
uid += screen_info.pixelDepth || '';

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

if(localSessionToken)
{

    requrl = AuthServerURL + `/?sessiontoken=${localSessionToken}&sessiondeviceid=${encodedDeviceidParams}`

    fetch(requrl)
        .then(res => res.json())
        .then(data => {
            
            if(data.response)
            {
                username = data.dusername;
                avatarid = data.davatarid;
                discordid = data.did;
                document.getElementById('Profile_UserName').textContent = username;
                document.getElementById('Profile_Avatar').src = `https://cdn.discordapp.com/avatars/${discordid}/${avatarid}`;     
            }
            else
            {
                localStorage.removeItem('sessiontoken');
                window.location.href = domainURL;
            }

        });
        


    var refreshButton = document.getElementById('Profile_RefreshButton');

    refreshButton.addEventListener('click', function() {
        requrl = AuthServerURL + `/refresh?sessiontoken=${localSessionToken}`
        console.log('Button clicked');
    });
}


function UserSignout()
{
    requrl = AuthServerURL + `/signout?sessiontoken=${localSessionToken}&sessiondeviceid=${uid}`
    window.location.href = requrl;       
}