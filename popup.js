document.addEventListener('DOMContentLoaded', () => {
    let ordersText = '';

    chrome.storage.local.get('oldOrders', (data) => {
        const ordersList = document.getElementById('ordersList');
        if (data.oldOrders && data.oldOrders.length > 0) {
            // Создаем текст заказов, разделенных запятыми
            ordersText = data.oldOrders.join(', ');
            // Отображаем заказы в виде списка для пользователя
            data.oldOrders.forEach(orderID => {
                const listItem = document.createElement('li');
                listItem.textContent = orderID;
                ordersList.appendChild(listItem);
            });
        } else {
            ordersList.textContent = 'Старых заказов нет';
        }
    });

    const copyButton = document.getElementById('copyButton');
copyButton.addEventListener('click', () => {
    // Создаем временный элемент textarea для копирования текста
    const textarea = document.createElement('textarea');
    
    // Разделяем ordersText по запятым, инвертируем порядок, и объединяем обратно в строку
    textarea.value = ordersText.split(', ').reverse().join(', ');
    
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
});




// popup.js
function updateUI(orders) {
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = ''; // Очищаем список перед обновлением
    if (orders && orders.length > 0) {
        orders.forEach(orderID => {
            const listItem = document.createElement('li');
            listItem.textContent = orderID;
            ordersList.appendChild(listItem);
        });
    } else {
        ordersList.textContent = 'Старых заказов нет.';
    }
}



// popup.js
const refreshButton = document.getElementById('refreshButton');
refreshButton.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "refreshOrders"});
    });
    updateUI(); // Вызываем обновление интерфейса
    location.reload()
});


document.getElementById('openFormButton').addEventListener('click', () => {
    chrome.tabs.create({url: 'https://funpay.freshdesk.com/ru-RU/support/tickets/new?ticket_form=%D0%BF%D1%80%D0%BE%D0%B1%D0%BB%D0%B5%D0%BC%D0%B0_%D1%81_%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7%D0%BE%D0%BC'}, function(tab) {
        chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
            if (tabId == tab.id && changeInfo.status == 'complete') {
                chrome.tabs.sendMessage(tabId, {action: "fillForm"});
            }
        });
    });
});


});

document.addEventListener('DOMContentLoaded', () => {
    const hoursInput = document.getElementById('hoursInput');
    const saveHoursButton = document.getElementById('saveHoursButton');

    // Загружаем сохраненное значение часов и устанавливаем его в поле ввода
    chrome.storage.local.get('filterHours', (data) => {
        if (data.filterHours) {
            hoursInput.value = data.filterHours;
        }
    });
    function refreshOrders() {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {action: "refreshOrders"});
        });
    }

    // Сохраняем значение часов при нажатии на кнопку
   // В popup.js
saveHoursButton.addEventListener('click', () => {
    const hours = hoursInput.value;
    chrome.storage.local.set({ 'filterHours': hours }, () => {
        console.log(`Значение часов сохранено: ${hours}`);
        refreshOrders(); // Обновляем заказы
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'ordersUpdated') {
        chrome.storage.local.get('oldOrders', (data) => {
            updateUI(data.oldOrders);
        });
    }
});

    
    
});

