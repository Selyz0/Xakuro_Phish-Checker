'use strict';

const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
console.log(
    `Page title is: '${pageTitle}' - evaluated by Chrome extension's 'contentScript.js' file`
);

chrome.runtime.sendMessage(
    {
        type: 'GREETINGS',
        payload: {
            message : 'Hello, my name is Con. I am from ContentScript.',
        },
    },
    (response) => {
        console.log(response.message);
    }
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'COUNT') {
        console.log(`Current count is ${request.payload.count}`);
    }

    sendResponse({});
    return true;
});
