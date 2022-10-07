'use strict';

const md5 = require('js-md5');

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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('received Message: ' + request.payload.message)

    console.log("Now tab")
    var hash = md5.create();
    hash.update(pageTitle)
    console.log("Now tab is " + hash.hex())

    if (request.type == 'RENDERSS') {
        console.log('Try to save SS.')
        const body = document.body;
        const sshot = '<a href="" id="xakuro-save-ss" download="' + hash.hex() + '.png"></a>';
        body.insertAdjacentHTML("beforebegin", sshot);
        html2canvas(document.body, {
            onrendered: function(canvas){
                var imgData = canvas.toDataURL();
                document.getElementById("xakuro-save-ss").href = imgData;
                const downloadEle = document.getElementById('xakuro-save-ss')
                downloadEle.click()
            }
        });
        sendResponse({});
    } else if (request.type == 'SAVESS') {
        console.log('get doc')
        const downloadEle = document.createElement('a')
        downloadEle.href = 'data:image/png;base64,' + request.payload.data.data;
        downloadEle.download = hash.hex() + '.png';
        downloadEle.click()
        sendResponse({});
    } else if (request.type == 'SAVEJSON') {
        const dljson = '<a href="" id="xakuro-save-json" download="' + hash.hex() + '.json"></a>';
        document.body.insertAdjacentHTML("beforebegin", dljson);
        const downloadEle = document.createElement('a')
        downloadEle.href = 'data:text/json;charset=utf-8,' + JSON.stringify(request.payload.data);
        downloadEle.download = hash.hex() + '.json';
        downloadEle.click()
        sendResponse({});
    }

    return true;
});
