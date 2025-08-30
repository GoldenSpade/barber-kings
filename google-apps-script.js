// Google Apps Script код для интеграции с Google Таблицей
// Этот файл нужно скопировать в Google Apps Script проект

// ID вашей Google Таблицы (замените на свой ID)
const SHEET_ID = '1N6uLNIPKZ--st56l5FtgwyW6vtJZbJgMR25iEGhlaps'

function doGet(e) {
  try {
    // Проверяем действие
    const action = e.parameter.action
    
    if (action === 'add') {
      // Обрабатываем добавление новой записи через GET (для обхода CORS)
      return handleAddBooking(e)
    }
    
    // Стандартная логика для получения данных
    const isAdmin = e.parameter.admin === 'true'
    
    // Открываем таблицу
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet()
    
    // Получаем все данные начиная со второй строки (пропускаем заголовки)
    const data = sheet.getDataRange().getValues()
    const bookings = []
    
    // Начинаем с индекса 1, чтобы пропустить заголовки
    for (let i = 1; i < data.length; i++) {
      const row = data[i]
      // Проверяем что строка не пустая
      if (row[1] && row[3] && row[4] && row[5]) { // Name, Location, Date, Time
        if (isAdmin) {
          // Для админки возвращаем полную информацию
          bookings.push({
            timestamp: row[0],  // Timestamp
            name: row[1],       // Name
            phone: row[2],      // Phone  
            location: row[3],   // Location
            date: row[4],       // Date  
            time: row[5],       // Time
            status: row[6] || 'Pending' // Status (по умолчанию Pending)
          })
        } else {
          // Для обычных пользователей - только необходимые данные
          bookings.push({
            location: row[3], // Location
            date: row[4],     // Date  
            time: row[5],     // Time
            status: row[6]    // Status
          })
        }
      }
    }
    
    const result = {
      success: true,
      bookings: bookings
    }
    
    // Добавляем количество для админки
    if (isAdmin) {
      result.totalCount = bookings.length
    }
    
    // Поддержка JSONP
    const callback = e.parameter.callback
    if (callback) {
      return ContentService
        .createTextOutput(callback + '(' + JSON.stringify(result) + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT)
    }
    
    // Обычный JSON ответ
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON)
      
  } catch (error) {
    const errorResult = {
      success: false,
      message: 'Error fetching bookings: ' + error.toString()
    }
    
    // Поддержка JSONP для ошибок
    const callback = e.parameter.callback
    if (callback) {
      return ContentService
        .createTextOutput(callback + '(' + JSON.stringify(errorResult) + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT)
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResult))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

// Функция для добавления записи через GET параметры (для обхода CORS)
function handleAddBooking(e) {
  try {
    // Получаем параметры из GET запроса
    const name = e.parameter.name
    const phone = e.parameter.phone
    const location = e.parameter.location
    const date = e.parameter.date
    const time = e.parameter.time
    const status = e.parameter.status || 'Pending'
    
    // Проверяем обязательные поля
    if (!name || !phone || !location || !date || !time) {
      throw new Error('Missing required fields')
    }
    
    // Открываем таблицу
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet()
    
    // Создаем timestamp
    const timestamp = new Date()
    
    // Подготавливаем данные для записи в таблицу
    // Порядок: Timestamp, Name, Phone, Location, Date, Time, Status
    const rowData = [
      timestamp, // A - Timestamp (автоматический)
      name, // B - Name
      phone, // C - Phone
      location, // D - Location
      "'" + date, // E - Date (с апострофом для принудительного текстового формата)
      "'" + time, // F - Time (с апострофом для принудительного текстового формата)
      status, // G - Status
    ]
    
    // Добавляем строку в конец таблицы
    sheet.appendRow(rowData)
    
    const result = {
      success: true,
      message: 'Booking added successfully'
    }
    
    // Поддержка JSONP
    const callback = e.parameter.callback
    if (callback) {
      return ContentService
        .createTextOutput(callback + '(' + JSON.stringify(result) + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT)
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON)
      
  } catch (error) {
    const errorResult = {
      success: false,
      message: 'Error adding booking: ' + error.toString()
    }
    
    // Поддержка JSONP для ошибок
    const callback = e.parameter.callback
    if (callback) {
      return ContentService
        .createTextOutput(callback + '(' + JSON.stringify(errorResult) + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT)
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResult))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

function doPost(e) {
  try {
    // Получаем данные из POST запроса
    const data = JSON.parse(e.postData.contents)

    // Открываем таблицу
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet()

    // Создаем timestamp
    const timestamp = new Date()

    // Дата и время уже отформатированы на фронтенде в стандартном формате
    const dateString = data.date    // DD/MM/YYYY
    const timeString = data.time    // HH:MM
    const status = data.status || 'Pending'  // Статус из формы или по умолчанию "Pending"

    // Подготавливаем данные для записи в таблицу
    // Порядок: Timestamp, Name, Phone, Location, Date, Time, Status
    const rowData = [
      timestamp, // A - Timestamp (автоматический)
      data.name, // B - Name
      data.phone, // C - Phone
      data.location, // D - Location
      "'" + dateString, // E - Date (с апострофом для принудительного текстового формата)
      "'" + timeString, // F - Time (с апострофом для принудительного текстового формата)
      status, // G - Status (из формы или "Pending")
    ]

    // Добавляем строку в конец таблицы
    sheet.appendRow(rowData)

    // Возвращаем успешный ответ
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: 'Booking saved successfully',
      })
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    // В случае ошибки возвращаем сообщение об ошибке
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: 'Error saving booking: ' + error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

// Функция для обновления статуса бронирования (для админ-панели)
function updateBookingStatus(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet()
    
    // Находим строку по уникальным данным
    const allData = sheet.getDataRange().getValues()
    
    for (let i = 1; i < allData.length; i++) {
      const row = allData[i]
      // Ищем по комбинации имени, даты и времени
      if (row[1] === data.name && row[4] === data.date && row[5] === data.time) {
        // Обновляем статус (колонка G, индекс 6)
        sheet.getRange(i + 1, 7).setValue(data.newStatus)
        
        return ContentService.createTextOutput(
          JSON.stringify({
            success: true,
            message: 'Status updated successfully'
          })
        ).setMimeType(ContentService.MimeType.JSON)
      }
    }
    
    // Если не найдено
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: 'Booking not found'
      })
    ).setMimeType(ContentService.MimeType.JSON)
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: 'Error updating status: ' + error.toString()
      })
    ).setMimeType(ContentService.MimeType.JSON)
  }
}
