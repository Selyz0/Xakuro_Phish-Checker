'use strict';

const contextMenusModule = require('./contextMenusScript.js')

/**
 * 他スクリプトとの通信
 */
{
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GREETINGS') {
      const message = `Hi ${
        sender.tab ? 'Con' : 'Pop'
      }, my name is Bac. I am from Background. It's great to hear from you.`;

      console.log(request.payload.message);
      sendResponse({
        message,
      });
    }
    
    return true;
  });
}

/**
 * 右クリック時のコンテキストメニューにボタン追加
 */
{
  chrome.runtime.onInstalled.addListener(() => {
    const parent = chrome.contextMenus.create({
        id: 'parent',
        title: 'MWS-2022'
    });
    chrome.contextMenus.create({
        id: 'SAVE',
        parentId: 'parent',
        title:  'フィッシングページ情報を保存する'
    });
  });

  chrome.contextMenus.onClicked.addListener(async (item, tab) => {
    console.log(`You clicked ${item.menuItemId} button.`);

    if (item.menuItemId == 'SAVE'){
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
            chrome.tabs.sendMessage(
              tab.id,
              {
                type: 'GETDOC',
                payload: {
                  data: result,
                  message : 'Want a webpage document.',
                },
              },
              (response) => {
                // デバッガでタッチ
                chrome.debugger.detach({ tabId: tab.id }, () => {
                  console.log('detach ok')
                });
            });
          });
        });
      
      // 以下はサンプルとして記述している
      //popupMenusModule.popupMenus.saveWebPageInfo()
      //updateSettings({type: 'SAVE'})
      });
      console.log('Saved some information.');
    }
    return true;
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status != 'complete'){
    return
  }

  console.log('Created tab');
  chrome.tabs.sendMessage(
    tabId,
    {
      type: 'LOADEDPAGE',
      payload: {
        message : 'Web page was loaded.',
      },
    },
    (response) => {
    }
  );
  return true
});
