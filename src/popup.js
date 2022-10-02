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
   * TODO: (必要に応じてメソッド名などの変更)
   * @param {string} initialValue 初期値
   */
  function setupPopupMenus(initialValue = 'undefined') {
    document.getElementById('saveLocation').innerHTML = initialValue;

    document.getElementById('judgingBtn').addEventListener('click', () => {
      // TODO: 判定処理を呼び出す

      // 以下はサンプルとして記述している
      popupMenusModule.popupMenus.judgeWebPage();
      updateSettings({type: 'JUDGE'});
    });

    document.getElementById('savingBtn').addEventListener('click', async () => {
      // タブ情報取得
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // デバッガアタッチ
      chrome.debugger.attach({ tabId: tab.id }, '1.3', async () => {
        console.log('attach - ok');
    
        // デバッガ起動待機
        await new Promise((resolve) => setTimeout(resolve, 500));
    
        // レイアウト情報取得
        chrome.debugger.sendCommand({ tabId: tab.id }, 'Page.getLayoutMetrics', {}, (metrics) => {
          // スクリーンショットパラメータ作成
          const params = {
            format: 'png',
            quality: 50,
            clip: {
            x: 0,
            y: 0,
            width:  metrics.cssContentSize.width,
            height: metrics.cssContentSize.height,
            scale: 1
            },
            captureBeyondViewport: true
          }
      
          // スクリーンショット撮影
          chrome.debugger.sendCommand({ tabId: tab.id }, 'Page.captureScreenshot', params, (result) => {
            // 画像保存
            const downloadEle = document.createElement('a');
            downloadEle.href = 'data:image/png;base64,' + result.data;
            downloadEle.download = 'screenshot.png';
            downloadEle.click()
      
            // デバッガでタッチ
            chrome.debugger.detach({ tabId: tab.id }, () => {
              console.log('detach ok')
            });
          });
        });
      
      // 以下はサンプルとして記述している
      //popupMenusModule.popupMenus.saveWebPageInfo()
      //updateSettings({type: 'SAVE'})
      });
    });

    document.getElementById('settingsBtn').addEventListener('click', async (e) => {
      // TODO: 保存先変更処理を呼び出す
      popupMenusModule.getDirectoryTest();
      console.log('push Settingbtn');

      // 以下はサンプルとして記述している
      popupMenusModule.popupMenus.changeSettings();
      updateSettings({type: 'SETTING'});
      updateSettings({type: 'SETTING'})
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
    });
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
