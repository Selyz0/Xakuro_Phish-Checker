'use strict';

import './popup.css';
const popupMenusModule = require('./popupMenusScript.js');

(function () {
  /**
   * 保存先の管理
   */
  const uriManager = {
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

  /**
   * ポップアップの情報を設定
   * (必要に応じてメソッド名などの変更)
   * @param {string} initialValue 初期値
   */
  function setupPopupMenus(initialValue = 'undefined') {
    document.getElementById('saveLocation').innerHTML = initialValue;

    document.getElementById('judgingBtn').addEventListener('click', () => {
      // 判定処理を呼び出す

      // 以下はサンプルとして記述している
      popupMenusModule.popupMenus.judgeWebPage()
      updateSettings({type: 'JUDGE'})
    });

    document.getElementById('savingBtn').addEventListener('click', () => {
      // 保存処理を呼び出す

      // 以下はサンプルとして記述している
      popupMenusModule.popupMenus.saveWebPageInfo()
      updateSettings({type: 'SAVE'})
    });

    document.getElementById('settingsBtn').addEventListener('click', () => {
      // 保存先変更処理を呼び出す

      // 以下はサンプルとして記述している
      popupMenusModule.popupMenus.changeSettings()
      updateSettings({type: 'SETTING'})
    });
  }

  /**
   * `saveLocation`の表示を更新
   * @param {string} type 押されたボタンの種類 
   * @returns {boolean} 無意味な値
   */
  function updateSettings({ type }) {
    uriManager.get((saveLocation) => {
      if (type == 'JUDGE'){
        saveLocation = 'Judge'
      } else if (type == 'SAVE'){
        saveLocation = 'Save'
      } else if (type == 'SETTING'){
        saveLocation = 'Setting'
      }

      uriManager.set(saveLocation, () => {
        document.getElementById('saveLocation').innerHTML = saveLocation;
      })
    });

    return true;
  }

  /**
   * `savaLocation`の表示を初期化する
   * (初期値が無いなら必要ないかも)
   */
  function restoreSaveLocation() {
    uriManager.get((saveLocation) => {
      if (typeof saveLocation === 'undefined') {
        uriManager.set('NoSetting', () => {
          setupPopupMenus('NoSetting');
        });
      } else {
        setupPopupMenus(saveLocation);
      }
    });
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
