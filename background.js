chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'saveOrders') {
    chrome.storage.local.set({ 'oldOrders': message.data }, () => {
      console.log('Заказы сохранены.');
    });
  }
});

// В background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'refreshOrdersComplete') {
      chrome.runtime.sendMessage({ action: 'ordersUpdates' });
  }
});
