
const FeedbackBTN = document.getElementById('FeedbackBTN');

const FeedbackContainer = document.getElementById('FeedbackContainer');
const FeedbackSendButton = document.getElementById('FeedbackSendButton');
const FeedbackcancelButton = document.getElementById('FeedbackcancelButton');
const TopicInput = document.getElementById('TopicInput');
const DescriptionInput = document.getElementById('DescriptionInput');


FeedbackBTN.addEventListener('click', function () {

    ToggleOptionsMenus();
    FeedbackContainer.style.display = 'flex';

});

FeedbackcancelButton.addEventListener('click', function () {

    FeedbackContainer.style.display = 'none';

});

FeedbackSendButton.addEventListener('click', function () {

    ToggleLoadingScreen(true);

    (async () => {

        const requrl = `https://e4y47rnqjmz6ee5dcjpvaneugm0wglbr.lambda-url.sa-east-1.on.aws/AddFeedback/?sessiontoken=${localSessionToken}&FeedbackTopic=${TopicInput.value}&FeedbackDescription=${DescriptionInput.value}`

        if (TopicInput.value != '' & DescriptionInput.value != '') {

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
                ToggleLoadingScreen(false);

            } catch (error) {
                console.error(error);
                ToggleLoadingScreen(false);
            }
        }
        else {
            console.log("Topic or description is empty");
            ToggleLoadingScreen(false);
        }

    })();

});

