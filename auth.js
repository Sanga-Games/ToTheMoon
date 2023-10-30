
var localSessionToken = localStorage.getItem('sessiontoken');
//var domainURL = "https://sanga-games.github.io/ToTheMoon" 
var domainURL = "http://localhost:53134"
var AuthServerURL = "https://434m33avoi.execute-api.ap-south-1.amazonaws.com/Production/discordauth"

//Post-Signout CLeanup
if(window.location.href == domainURL + "/?action=signout")
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

    (async () => {
        const requrl = `${AuthServerURL}/?sessiontoken=${localSessionToken}&sessiondeviceid=${encodedDeviceidParams}`;
    
        try {
            const response = await fetch(requrl, { method: 'GET', mode: 'cors' });
    
            // Check if the request was successful (status code 200)
            if (!response.ok) {
                localStorage.removeItem('sessiontoken');
                window.location.href = domainURL;
                throw new Error(`Failed to fetch user details. Status: ${response.status}, StatusText: ${response.statusText}`);
            }
    
            // Parse the JSON response
            const userData = await response.json();

            if (userData.msg == "Session token not valid")
            {
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


function UserSignout()
{
    localStorage.removeItem('sessiontoken');
    requrl = AuthServerURL + `/signout?sessiontoken=${localSessionToken}&sessiondeviceid=${encodedDeviceidParams}`
    window.location.href = requrl;       
}
