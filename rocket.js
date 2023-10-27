
var body = document.body;

function InitialLaunchRocket() {

    stars();
    $('.Background').animate({ bottom: '-100%' }, 2000)
    $('.rocket').animate({ bottom: '50%' }, 2000, function () {

        LoopRocketMotion();
    })
}


function LoopRocketMotion() {
    $('.rocket').css({ bottom: '50%' });
    $('.rocket').animate({ bottom: '45%' }, 500, 'linear', function () {
        $('.rocket').animate({ bottom: '50%' }, 500, 'linear', function () {
            LoopRocketMotion();
        })
    })
}

function ResetRocketGame() {
    deleteStars();
    $('.rocket').stop();
    $('.Background').stop();
    $('.earth').stop();
    $('.rocket').hide()
    //DeleteAllPopoutPlayerFromRocket();
    // setTimeout(ResetRocketGame2, 3000);

}

function ResetRocketGame2() {
    //DeleteAllPopoutPlayerFromRocket();
    $('.rocketExplosion').css({ opacity: 0 });
    $('.rocket').show()
    $('.rocket').css({ bottom: '25%' });
    $('.Background').css({ bottom: '0%' });
    // $('.earth').css({ bottom: '-50vh' });
}

function BlastRocket() {
    $('.rocketExplosion').css({ opacity: 1 });
    ResetRocketGame();
    // setTimeout(InitialLaunchRocket, 8000);
};



function DeleteAllPopoutPlayerFromRocket() {
    AllPoppedPlayers = scene.querySelectorAll('.PoppedPlayer')

    AllPoppedPlayers.forEach((PoppedPlayer) => {
        PoppedPlayer.remove();
    });
}


function PopPlayerFromRocket(Player) {
    RocketPlayerHolder = document.querySelector('.RocketPlayerHolder');

    PoppedPlayer = document.createElement('div');
    PoppedplayerSuit = document.createElement('img');
    PoppedPlayerImg = document.createElement('img');
    PoppedplayerSuit.src = "astronaut.png";
    if (Player) {
        PoppedPlayerImg.src = Player + ".png";
    }

    PoppedPlayer.className = 'PoppedPlayer';
    PoppedplayerSuit.style.position = 'absolute';
    PoppedplayerSuit.style.width = '100%';
    PoppedplayerSuit.style.height = '100%';

    PoppedPlayerImg.style.position = 'absolute';
    PoppedPlayerImg.style.width = '40%';
    PoppedPlayerImg.style.height = '40%';
    PoppedPlayerImg.style.left = '57%';
    PoppedPlayerImg.style.borderRadius = '50%';

    PoppedPlayer.appendChild(PoppedplayerSuit);
    if (Player) {
        PoppedPlayer.appendChild(PoppedPlayerImg);
    }

    var SpawnWidth = Math.floor(Math.random() * RocketPlayerHolder.clientWidth);
    var SpawnHeight = Math.floor(Math.random() * RocketPlayerHolder.clientHeight);

    PoppedPlayer.style.position = 'absolute';
    PoppedPlayer.style.width = '72px';
    PoppedPlayer.style.height = '72px';
    PoppedPlayer.style.left = SpawnWidth + 'px';
    PoppedPlayer.style.top = SpawnHeight + 'px';
    PoppedPlayer.style.zIndex = 10;
    PoppedPlayer.style.animationDuration = '25s';

    if (Player) {
        RemoveSingleVipPlayer(Player);
    }

    RocketPlayerHolder.appendChild(PoppedPlayer);
}

function RemoveAllVipPlayers() {
    PrevRocketPlayers = scene.querySelectorAll('.VipPlayer')

    PrevRocketPlayers.forEach((PrevPlayer) => {
        PrevPlayer.remove();
    });
}

function RemoveSingleVipPlayer(Player) {
    VipPlayer = scene.querySelector('.' + Player)
    if (VipPlayer) {
        VipPlayer.remove();
    }
}

function SpawnVipPlayer(Player) {
    var RocketPlayerHolder = document.querySelector('.RocketPlayerHolder');

    // Create a new image for each player
    var RocketPlayer = document.createElement('div');
    var RocketPlayerImg = document.createElement('img');
    var RocketPlayerHelmet = document.createElement('img');
    RocketPlayerImg.src = Player + ".png";
    RocketPlayerHelmet.src = "Helmet.png";
    RocketPlayer.className = 'VipPlayer' + ' ' + Player;

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
    RocketPlayer.style.width = '24px';
    RocketPlayer.style.height = '24px';

    // Append the player to the container
    RocketPlayerHolder.appendChild(RocketPlayer);

    // Function to move the image smoothly to a random position
    function moveImage() {
        var maxWidth = RocketPlayerHolder.clientWidth - 26; // Subtract image width
        var maxHeight = RocketPlayerHolder.clientHeight - 26; // Subtract image height

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
    var initialX = Math.floor(Math.random() * (RocketPlayerHolder.clientWidth - 26));
    var initialY = Math.floor(Math.random() * (RocketPlayerHolder.clientHeight - 26));
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