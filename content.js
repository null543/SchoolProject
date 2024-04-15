function extractHours(text) {
  let match = text.match(/(\d+)\s+час/);
  if (match) {
      return parseInt(match[1], 10);
  }

  if (text.includes("день назад") || text.includes("2 дня назад") || text.includes("3 дня назад") || text.includes("4 дня назад") || text.includes("5 дней назад")) {
    return 24; // Возвращаем 24 часа, так как это эквивалент одного дня
  } 
  
  if (text.includes("час назад")) {
    return 1; // Возвращаем 24 часа, так как это эквивалент одного дня
  }
  return 0;

}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "refreshOrders") {
      filterOrders();
  }
});

  
function filterOrders() {
  chrome.storage.local.get('filterHours', (data) => {
      const filterHours = data.filterHours ? parseInt(data.filterHours, 10) : 1; // Значение по умолчанию 5 часов

      const orders = Array.from(document.querySelectorAll('.tc-item.info'));
      const filteredOrders = orders.filter(order => {
          const timeElement = order.querySelector('.tc-date-left');
          const hoursAgo = extractHours(timeElement.textContent);
          return hoursAgo >= filterHours;
      });

      const orderIDs = filteredOrders.map(order => order.querySelector('.tc-order').textContent);

      chrome.runtime.sendMessage({ action: 'saveOrders', data: orderIDs });
      chrome.runtime.sendMessage({action: 'refreshOrdersComplete'});

  });

  
    // Отправляем идентификаторы заказов в фоновый скрипт или всплывающее окно (popup)
    chrome.runtime.sendMessage({ action: 'saveOrders', data: orderIDs });
  }
  
  // Выполняем функцию фильтрации при загрузке страницы или когда DOM готов
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', filterOrders);
  } else {
    filterOrders();
  }
  