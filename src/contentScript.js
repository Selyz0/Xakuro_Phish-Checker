'use strict';

//const html2canvas = require('./html2canvas.js')
//const ss = require('./screenshot.js')

/**
 * サンプル（不要そう）
 */
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

function getScreenshot (tab) {
    chrome.debugger.attach ({tabId: tab.id}, '1.3', function () {
        console.log('attached')

        chrome.debugger.sendCommand({tabId: tab.id}, 'Page.getLayoutMetrics', {}, (metrics) => {
            const params = {
                format: 'png',
                quality: 50,
                clip: {
                    x: 0,
                    y: 0,
                    width: metrics.cssContentSize.width,
                    height: metrics. cssContentSize.height,
                    scale: 1
                },
                capturaBeyondViewport: true
            }

            chrome.debugger.sendCommand({tabId: tab.id}, 'Page.captureScreenshot', params, (result) => {
                const downloadEle = document.createElement('a')
                downloadEle.href = 'data:image/png;base64,' + result.data;
                downloadEle.download = 'screenshot.png'
                downloadEle.click()

                chrome.debugger.detach({tabId: tab.id}, () => {
                    console.log('detached')
                });
            });
        });
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('received Message')
    if (request.type === 'COUNT') {
        console.log(`Current count is ${request.payload.count}`);
        sendResponse({});
    } else if (request.type == 'LOADEDPAGE') {
        console.log(request.payload.message)
        sendResponse({});
    } else if (request.type == 'SAVEPAGE') {
        console.log('try to save page')
        getScreenshot()
        sendResponse({});
    } else if (request.type == 'GETDOC') {
        console.log('get doc')
        const downloadEle = document.createElement('a')
        downloadEle.href = 'data:image/png;base64,' + request.payload.data.data;
        downloadEle.download = 'screenshot.png';
        downloadEle.click()
        sendResponse({});
    }
    return true;
});
