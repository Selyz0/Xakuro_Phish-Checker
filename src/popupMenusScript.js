'use strict';

/**
 * 各処理の動作テスト用サンプル
 */

const axios = require('axios')


const judgeWebPage = async (url) => {
  const ipAddress = await axios.get('https://dns.google/resolve', {params: {name: url, type: 'A'}}).then(res => res.data.Answer.filter(a => a.type == 1).slice(-1)[0].data)

  console.log(ipAddress)

  // Score 100 ip example 159.223.145.235

    const data = await axios.get('https://api.abuseipdb.com/api/v2/check', {
        headers: {
            'Accept' : 'application/json',
            'Key' : process.env.API_KEY
        },
        params: {
          ipAddress
        }
    })
        .then(res => res.data.data)

    console.log('Judge Web Page.')
  return data
}

const dirHandleManager = {
    get: (cb) => {
        chrome.storage.sync.get(['uri'], (result) => {
            cb(result.uri);
        });
    },
    set: (value, cb) => {
        chrome.storage.sync.set({
            uri: value
        },
        () => {
            cb();
        });
    }
}

module.exports.popupMenus = {   
    judgeWebPage,
    saveWebPageInfo: async (url) => {

        const data = await judgeWebPage(url)
        console.log(data)

        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        var dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href",     dataStr     );
        dlAnchorElem.setAttribute("download", "scene.json");
        dlAnchorElem.click();

        console.log('Save Web Page.')
    },
    changeSettings: (url) => {
        console.log('Change Settings.')
    }
};

function getDirectoryTest() {
    console.log('Start Wiriting');
    getDirEntry()
}

async function getDirEntry(){
    const options = {
        types: [
            {
                description: "Text Files",
                accept: {
                    "text/plain": [".txt", ".text"],
                },
            },
        ],
    };
    try {
        const dirHandle = await showDirectoryPicker();
        const fileHandle = await dirHandle.getFileHandle('tmp.txt', {create: true});
        const writable = await fileHandle.createWritable();
        await writable.write('sample');
        await writable.close();

        console.log('Running?')
    } catch (e) {
        console.log(e)
    }


    //const [handle] = await showOpenFilePicker(options)
    //const file = await handle.getFile();
    //console.log(file.text())

    //files = await handle.getFile();
    //console.log(files)
}

function getFileHandle(){
    const options = {
        types: [
            {
                description: "Text Files",
                accept: {
                    "text/plain": [".txt", ".text"],
                },
            },
        ],
    };
    var promise = new Promise((resolve, reject) => {
        const handle = window.showOpenFilePicker(options)[0];
        resolve(handle)
    });
    promise().then(()=>{
        console.log('fin!')
    });
}

function downloadResults() {
    var content  = 'abc';
    var mimeType = 'text/plain';
    var name     = 'test.txt';

    var bom  = new Uint8Array([0xEF, 0xBB, 0xBF]);
    var blob = new Blob([bom, content], {type : mimeType});

    var a = document.createElement('a');
    a.download = name;
    a.target   = '_blank';

    a.href = window.webkitURL.createObjectURL(blob);
    a.click();
}

function loadDirEntry(Entry){
    if (Entry.isDirectory){
        var readEntries = function() {
            dirReader.readEntries (function(results) {
                if (!results.length) {
                    textarea.value = entries.join("\n");
                    saveFileButton.disabled = true; // don't allow saving of the list
                    displayEntryData(chosenEntry);
                    } 
                else {
                    results.forEach(function(item) { 
                        entries = entries.concat(item.fullPath);
                    });
                readEntries();
                }
            }, errorHandler);
        };
        readEntries()
    }
}

function test(){
    navigator.webkitPersistentStorage.requestQuota(1024*1024*5, function(bytes) {
        window.webkitRequestFileSystem(window.PERSISTENT, bytes, function(fs) {
            fs.root.getFile('C:/Users/Sely/Downloads/tmp.txt', {create: true}, function(fileEntry) {
                fileEntry.createWriter(function(fileWriter) {
                    fileWriter.onwriteend = function(e) {
                        console.log('書き込み完了... Parent:' + fileEntry.getParent(()=>{}) + ':' + fileEntry.name);
                    };
            
                    fileWriter.onerror = function(e) {
                        console.log('書き込みエラー: ' + e.toString());
                    };
                    var blobData = new Blob(['hogehoge']);
                    fileWriter.write(blobData);
                });
                //fileEntry.remove(function(success){console.log(success.fullpath)}, function(failed){console.log('failed removing')})
            });
        });
    });
}

module.exports.getDirectoryTest = getDirectoryTest
