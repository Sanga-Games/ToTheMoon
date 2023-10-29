
var body = document.body;

var AllPlayersList = [];

var MaxVipPlayers = 10;


function AddDataToAllPlayerList(data) {
    // Check if the user ID is already present in the array
    const existingUserIndex = AllPlayersList.findIndex(item => item.UserID === data.UserID);

    if (existingUserIndex === -1 && data.BetState === "Pending") {
        // User ID is not present in the array, add the data object
        AllPlayersList.push(data);
        // Sort the array based on BetAmount in descending order
        AllPlayersList.sort((a, b) => b.BetAmount - a.BetAmount);

        SpawnPlayersInsideRocket(AllPlayersList);

    } else if (existingUserIndex !== -1) {
        // User ID is already present, check the bet state
        if (AllPlayersList[existingUserIndex].BetState === "Pending" && data.BetState === "CashedOut") {
            // If the existing data has a pending bet state and the new data has a CashedOut state, remove the existing data

            if (existingUserIndex > MaxVipPlayers - 1) {
                PopPlayerFromRocket(-1);
            }
            else {
                PopPlayerFromRocket(existingUserIndex);
            }

            AllPlayersList.splice(existingUserIndex, 1);

        } // else if the bet state is pending in both cases, do nothing
    }

}


function InitialLaunchRocket() {

    $('.Background').animate({ bottom: '-300%' }, 6000)
    setTimeout(stars,3000);
    $('.BackgroundAtmosphere').animate({ bottom:'-500%'}, 6000)
    $('.rocket').animate({ bottom: '22%',height:'60%' }, 3000, function () {
        //stars();
        LoopRocketMotion();
    })
}


function LoopRocketMotion() {
    $('.rocket').css({ bottom: '22%' ,height:'60%'});
    $('.rocket').animate({ bottom: '18%' ,height:'60%'}, 2000, 'linear', function () {
        $('.rocket').animate({ bottom: '22%' ,height:'60%'}, 2000, 'linear', function () {
            LoopRocketMotion();
        })
    })
}

function ResetRocketGame() {
    deleteStars();
    $('.rocket').stop();
    $('.RocketPlayerHolder').stop();
    $('.BackgroundAtmosphere').stop();
    $('.Background').stop();
    $('.earth').stop();
    $('.rocket').animate({ bottom: '17%'}, 1000, 'linear', function () {
        $('.rocket').hide()
    })

    // $('.rocket').hide()
    //DeleteAllPopoutPlayerFromRocket();
    // setTimeout(ResetRocketGame2, 3000);

}

function ResetRocketGame2() {
    //DeleteAllPopoutPlayerFromRocket();
    // $('.rocketExplosion').css({ opacity: 0 });
    $('.rocket').show()
    $('.rocket').css({ bottom: '115px',height:'25%' });
    $('.BackgroundAtmosphere').css({ bottom: '0%'});
    $('.Background').css({ bottom: '0%' });
    // $('.earth').css({ bottom: '-50vh' });
}

function BlastRocket() {
    var $rocket = $('.rocket');
    var offset = $rocket.offset();
    var centerY = offset.top + $rocket.outerHeight() / 2;
    var centerX = offset.left + $rocket.outerWidth() / 2;

    var $explosionDiv = $('<div class="explosion" style="margin-left: 0px; margin-top: 50px; top:'+centerY+'px; transform: translate(-50%, -50%) scale(1) rotate(175deg);"></div>');
    $('body').append($explosionDiv);
    setTimeout(function(){
        $explosionDiv = $('<div class="explosion" style="margin-left: -50px; margin-top: -100px;top:'+centerY+'px; transform: translate(-50%, -50%) scale(0.8) rotate(0deg);"></div>');
        $('body').append($explosionDiv);
    }, 300);
    setTimeout(function(){
        $explosionDiv = $('<div class="explosion" style="margin-right: 0px; margin-bottom: -100px;top:'+centerY+'px; transform: translate(-50%, -50%) scale(0.7) rotate(-90deg);"></div>');
        $('body').append($explosionDiv);
    }, 500);

    setTimeout(function(){
        $('.explosion').remove();
    }, 2500);

    ResetRocketGame();
    EmptyAllPlayersList()
    // setTimeout(InitialLaunchRocket, 8000);
};



function DeleteAllPopoutPlayerFromRocket() {
    AllPoppedPlayers = scene.querySelectorAll('.PoppedPlayer')

    AllPoppedPlayers.forEach((PoppedPlayer) => {
        PoppedPlayer.remove();
    });
}


// function PopPlayerFromRocket(PlayerIndex) {
//     RocketPlayerHolder = document.querySelector('.RocketPlayerHolder');

//     PoppedPlayer = document.createElement('div');
//     PoppedplayerSuit = document.createElement('img');
//     PoppedPlayerImg = document.createElement('img');
//     PoppedplayerSuit.src = "astronaut.png";

//     if (PlayerIndex > -1) {

//         PoppedPlayerUserID = AllPlayersList[PlayerIndex].UserID;
//         var poppedPlayerDiv = document.querySelector('.' + PoppedPlayerUserID);

//         // Check if the div element exists
//         if (poppedPlayerDiv) {
//             // Select the image element inside the div
//             var InsidePlayerImg = poppedPlayerDiv.querySelector('img');

//             // Check if the image element exists
//             if (InsidePlayerImg) {
//                 // Get the src attribute of the image
//                 var imgSrc = InsidePlayerImg.src;
//                 // Now you can use imgSrc as needed
//                 PoppedPlayerImg.src = imgSrc;
//             }
//         }
//     }

//     PoppedPlayer.className = 'PoppedPlayer';
//     PoppedplayerSuit.style.position = 'absolute';
//     PoppedplayerSuit.style.width = '100%';
//     PoppedplayerSuit.style.height = '100%';

//     PoppedPlayerImg.style.position = 'absolute';
//     PoppedPlayerImg.style.width = '40%';
//     PoppedPlayerImg.style.height = '40%';
//     PoppedPlayerImg.style.left = '57%';
//     PoppedPlayerImg.style.borderRadius = '50%';

//     PoppedPlayer.appendChild(PoppedplayerSuit);
//     if (PlayerIndex > -1) {
//         PoppedPlayer.appendChild(PoppedPlayerImg);
//     }

//     var SpawnWidth = Math.floor(Math.random() * RocketPlayerHolder.clientWidth);
//     var SpawnHeight = Math.floor(Math.random() * RocketPlayerHolder.clientHeight);

//     PoppedPlayer.style.position = 'absolute';
//     PoppedPlayer.style.width = '72px';
//     PoppedPlayer.style.height = '72px';
//     PoppedPlayer.style.left = SpawnWidth + 'px';
//     PoppedPlayer.style.top = SpawnHeight + 'px';
//     PoppedPlayer.style.zIndex = 10;
//     PoppedPlayer.style.animationDuration = '25s';

//     if (PlayerIndex > -1) {
//         RemoveSingleVipPlayer(PlayerIndex);
//     }

//     RocketPlayerHolder.appendChild(PoppedPlayer);
// }

function PopPlayerFromRocket(PlayerIndex) {
    var RocketPlayerHolder = $('.RocketPlayerHolder');

    var PoppedPlayer = $('<div>');
    var PoppedplayerSuit = $('<img>');
    var PoppedPlayerImg = $('<img>');
    PoppedplayerSuit.attr('src', 'Images/astronaut.png');

    if (PlayerIndex > -1) {
        var PoppedPlayerUserID = AllPlayersList[PlayerIndex].UserID;
        var poppedPlayerDiv = $('.' + PoppedPlayerUserID);

        if (poppedPlayerDiv.length) {
            var InsidePlayerImg = poppedPlayerDiv.find('img');

            if (InsidePlayerImg.length) {
                var imgSrc = InsidePlayerImg.attr('src');
                PoppedPlayerImg.attr('src', imgSrc);
            }
        }
    }

    PoppedPlayer.addClass('PoppedPlayer');
    PoppedplayerSuit.css({
        'position': 'absolute',
        'width': '100%',
        'height': '100%'
    });

    PoppedPlayerImg.css({
        'position': 'absolute',
        'width': '40%',
        'height': '40%',
        'left': '57%',
        'border-radius': '50%'
    });

    PoppedPlayer.append(PoppedplayerSuit);
    PoppedPlayer.animate({ left: '+=0' }, 5000, function(){
        console.log("popped player removed");
        PoppedPlayer.remove();
    });
    if (PlayerIndex > -1) {
        PoppedPlayer.append(PoppedPlayerImg);
    }

    var SpawnWidth = Math.floor(Math.random() * RocketPlayerHolder.width());
    var SpawnHeight = Math.floor(Math.random() * RocketPlayerHolder.height());

    PoppedPlayer.css({
        'position': 'absolute',
        'width': '72px',
        'height': '72px',
        'left': SpawnWidth + 'px',
        'top': SpawnHeight + 'px',
        'z-index': 10,
        'animation-duration': '25s'
    });

    if (PlayerIndex > -1) {
        RemoveSingleVipPlayer(PlayerIndex);
    }

    RocketPlayerHolder.append(PoppedPlayer);
}


function EmptyAllPlayersList()
{
    AllPlayersList = [];
}

function RemoveAllVipPlayers() {
    PrevRocketPlayers = body.querySelectorAll('.VipPlayer')

    if (PrevRocketPlayers.length > 0) {

        PrevRocketPlayers.forEach((PrevPlayer) => {
            PrevPlayer.remove();
        });
    }
}

function RemoveSingleVipPlayer(PlayerIndex) {
    PoppedPlayerUserID = AllPlayersList[PlayerIndex].UserID;
    VipPlayer = body.querySelector('.' + PoppedPlayerUserID);
    if (VipPlayer) {
        VipPlayer.remove();
    }
}


function SpawnPlayersInsideRocket(AllPlayersList) {

    RemoveAllVipPlayers();

    if (AllPlayersList.length > 10) {
        for (let i = 0; i < MaxVipPlayers - 1; i++) {
            SpawnVipPlayer(AllPlayersList[i]);
        }
    }
    else {
        for (let i = 0; i < AllPlayersList.length; i++) {
            SpawnVipPlayer(AllPlayersList[i]);
        }
    }


}

async function GetAvatarByUserID(RocketPlayerImg, UserId) {
    const response = await fetch(`https://434m33avoi.execute-api.ap-south-1.amazonaws.com/Production/userinfo?uid=${UserId}`, {
        method: 'GET',
        mode: 'cors',
    });

    // Check if the request was successful (status code 200)
    if (!response.ok) {
        throw new Error(`Failed to fetch user details. Status: ${response.status}`);
    }

    // Parse the JSON response
    userData = await response.json();
    RocketPlayerImg.src = userData.avatar_url
}

function SpawnVipPlayer(data) {

    var RocketPlayerHolder = document.querySelector('.RocketPlayerHolder');

    UserID = data.UserID;

    // Create a new image for each player
    var RocketPlayer = document.createElement('div');
    var RocketPlayerImg = document.createElement('img');
    var RocketPlayerHelmet = document.createElement('img');
    //RocketPlayerImg.src = GetAvatarByUserID(UserID);
    GetAvatarByUserID(RocketPlayerImg, UserID);
    RocketPlayerHelmet.src = "Images/Helmet.png";
    RocketPlayer.className = 'VipPlayer' + ' ' + UserID;

    RocketPlayer.appendChild(RocketPlayerImg);
    RocketPlayer.appendChild(RocketPlayerHelmet);

    RocketPlayerImg.style.position = 'absolute';
    RocketPlayerImg.style.borderRadius = '50%';
    RocketPlayerImg.style.left = '10%';
    RocketPlayerImg.style.top = '10%';
    RocketPlayerImg.style.width = '80%';
    RocketPlayerImg.style.height = '80%';

    RocketPlayerHelmet.style.position = 'absolute';
    RocketPlayerHelmet.style.width = '100%';
    RocketPlayerHelmet.style.height = '100%';

    RocketPlayer.style.position = 'absolute';
    RocketPlayer.style.width = '32px';
    RocketPlayer.style.height = '32px';

    // Append the player to the container
    RocketPlayerHolder.appendChild(RocketPlayer);

    // Function to move the image smoothly to a random position
    function moveImage() {
        var maxWidth = RocketPlayerHolder.clientWidth - 32; // Subtract image width
        var maxHeight = RocketPlayerHolder.clientHeight - 32; // Subtract image height

        // Generate random positions for each player
        var newX = Math.floor(Math.random() * maxWidth);
        var newY = Math.floor(Math.random() * maxHeight);

        var currentX = parseFloat(RocketPlayer.style.left) || 0;
        var currentY = parseFloat(RocketPlayer.style.top) || 0;

        var dx = (newX - currentX) / 50; // Adjust the division factor for speed
        var dy = (newY - currentY) / 50;

        function animate() {
            currentX += dx;
            currentY += dy;
            RocketPlayer.style.left = currentX + 'px';
            RocketPlayer.style.top = currentY + 'px';

            if (Math.abs(newX - currentX) > 1 || Math.abs(newY - currentY) > 1) {
                requestAnimationFrame(animate);
            }
        }

        animate();
    }

    // Randomly set the initial position for each player
    var initialX = Math.floor(Math.random() * (RocketPlayerHolder.clientWidth - 32)); //RocketPlayer Width and Height
    var initialY = Math.floor(Math.random() * (RocketPlayerHolder.clientHeight - 32)); //RocketPlayer Width and Height
    RocketPlayer.style.left = initialX + 'px';
    RocketPlayer.style.top = initialY + 'px';

    // Call the moveImage function for each player at random intervals
    setInterval(moveImage, Math.floor(Math.random() * 2000) + 1000); // Random interval between 1 seconds
}



function stars() {
    let count = 60;

    let i = 0;

    while (i < count) {
        // Create a new <i> element
        let star = document.createElement('i');
        star.className = 'stars';

        let x = Math.floor(Math.random() * window.innerWidth);
        let duration = Math.random() * 2;
        let h = Math.random() * 100;

        // Set the styles for the newly created <i> element
        star.style.position = 'absolute';
        star.style.left = x + 'px';
        star.style.width = '1px';
        star.style.height = 40 + h + 'px';
        star.style.animationDuration = duration + 's';

        body.appendChild(star);
        i++;
    }
}

function deleteStars() {
    //let scene = document.querySelector('.scene');
    let stars = body.querySelectorAll('.stars');

    stars.forEach((star) => {
        star.remove();
    });
}