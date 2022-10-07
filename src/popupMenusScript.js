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
