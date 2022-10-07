'use strict';

import './popup.css';
const popupMenusModule = require('./popupMenusScript.js');

(function () {
  /**
   * 保存先の管理
   */
  const judgeManager = {
    get: (cb) => {
        chrome.storage.sync.get(['judgeResult'], (result) => {
            cb(result.judgeResult);
        });
    },
    set: (value, cb) => {
        chrome.storage.sync.set({
          judgeResult: value
        },
        () => {
            cb();
        });
    }
  }

  /**
   * ポップアップの情報を設定
   * @param {string} initialValue 初期値
   */
  function setupPopupMenus(initialValue = 'undefined') {
    document.getElementById('judge-result').innerHTML = initialValue;

    document.getElementById('judgingBtn').addEventListener('click', async () => {
      // 現在タブのホスト名を取得する
      const hostname = await chrome.tabs.query({active: true, currentWindow: true})
                                .then(res => new URL(res[0].url).hostname)

      console.log(hostname)

      // 判定処理を呼び出す
      const data = await popupMenusModule.popupMenus.judgeWebPage(hostname)

      document.querySelector('#result').innerHTML = `
      ドメイン: ${data.domain} <br>
      スコア: ${data.abuseConfidenceScore} <br>
      (通報件数: ${data.totalReports}) <br>
      `

      console.log(data)
      //alert(tabs.tab)
      updateResult({type: 'JUDGE', payload: {domain: data.domain, score: data.abuseConfidenceScore, row: data}})
    });

    document.getElementById('savingBtn').addEventListener('click', () => {
      console.log('Can you save this page?')

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            type: 'RENDERSS',
            payload: {
              message: 'Can you save this web page?'
            },
          },
        function (response) {
        });
      });

      judgeManager.get((result) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            {
              type: 'SAVEJSON',
              payload: {
                data: result,
                message: 'Can you save this web page?'
              },
            },
          function (response) {
          });
        });
      })

      return true;
    });
  }

  /**
   * `saveLocation`の表示を更新
   * @param {string} type 押されたボタンの種類 
   * @returns {boolean} 無意味な値
   */
  function updateResult({ type, payload }) {
    if (type == 'JUDGE'){
      let color = ""
      if (payload.score < 5){
        color = '#66FF99';
      } else if (payload.score < 20){
        color = '#FFFF66';
      } else if (payload.score < 40){
        color = '#FF9933';
      } else if (payload.score < 60){
        color = '#FF6600';
      } else if (payload.score < 100){
        color = '#FF0000';
      }

      judgeManager.set(payload.row, () => {});
      const judgeResult = '危険度: ' + payload.score + ' /100';
      document.getElementById('judge-result').innerHTML = judgeResult;
      document.getElementById('judge-result').style.backgroundColor  = color;
    }

    return true;
  }

  /**
   * `savaLocation`の表示を初期化する
   * (初期値が無いなら必要ないかも)
   */
  function restoreSaveLocation() {
    judgeManager.set('undefined', () => {
      setupPopupMenus('');
    });
    return true;
  }

  /**
   * ポップアップ呼び出し時に初期化
   */
  document.addEventListener('DOMContentLoaded', restoreSaveLocation);

  /**
   * background.js との通信
   */
  chrome.runtime.sendMessage(
    {
      type: 'GREETINGS',
      payload: {
        message: 'Hello, my name is Pop. I am from Popup.',
      },
    },
    (response) => {
      console.log(response.message);
    }
  );
})();
