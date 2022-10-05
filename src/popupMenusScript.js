'use strict';

/**
 * 各処理の動作テスト用サンプル
 */

const axios = require('axios')

module.exports.popupMenus = {   
    judgeWebPage: async (url) => {
        const ipAddress = await axios.get('https://dns.google/resolve', {params: {name: url}}).then(res => res.data.Answer[0].data)

        await axios.get('https://api.abuseipdb.com/api/v2/check', {
            headers: {
                'Accept' : 'application/json',
                'Key' : process.env.API_KEY
            },
            params: {
                ipAddress
            }
        })
            .then(res => {
                console.log(res.data)
            })

        console.log('Judge Web Page.')
    },
    saveWebPageInfo: (url) => {
        console.log('Save Web Page.')
    },
    changeSettings: (url) => {
        console.log('Change Settings.')
    }
};
