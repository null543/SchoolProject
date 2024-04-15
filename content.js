function extractHours(text) {
  let match = text.match(/(\d+)\s+час/);
  if (match) {
      return parseInt(match[1], 10);
  }

  match = text.match(/(\d+)\s+день|дня|дней/);  // Добавлено распознавание дней
  if (match) {
    return parseInt(match[1], 10) * 24;  // Умножаем количество дней на 24 часа
  }

  if (text.includes("час назад")) {
    return 1; 
  }
  return 0;
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "refreshOrders") {
      filterOrders();
  }
});

  
function filterOrders() {
  chrome.storage.local.get(['filterHours', 'filterDays'], (data) => {
      const filterHours = data.filterHours ? parseInt(data.filterHours, 10) : 24; // Значение по умолчанию 24 часа
      const filterDays = data.filterDays ? parseInt(data.filterDays, 10) * 24 : 0; // Добавлено значение по умолчанию для дней
      const totalHours = filterHours + filterDays;

      const orders = Array.from(document.querySelectorAll('.tc-item.info'));
      const filteredOrders = orders.filter(order => {
          const timeElement = order.querySelector('.tc-date-left');
          const hoursAgo = extractHours(timeElement.textContent);
          return hoursAgo <= totalHours;
      });

      const orderIDs = filteredOrders.map(order => order.querySelector('.tc-order').textContent);

      chrome.runtime.sendMessage({ action: 'saveOrders', data: orderIDs });
  });
}
  
  // Выполняем функцию фильтрации при загрузке страницы или когда DOM готов
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', filterOrders);
  } else {
    filterOrders();
  }
  