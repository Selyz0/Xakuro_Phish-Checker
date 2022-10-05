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

  chrome.contextMenus.onClicked.addListener(item => {
    console.log(`You clicked ${item.menuItemId} button.`);

    if (item.menuItemId == 'SAVE'){
      // TODO: 保存処理を呼び出す
      contextMenusModule.saveWebInfo.saveUrl('url')
      console.log('Saved some information.');
    }
    return true;
  });
}
