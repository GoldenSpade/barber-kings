// Google Apps Script код для интеграции с Google Таблицей
// Этот файл нужно скопировать в Google Apps Script проект

// ID вашей Google Таблицы (замените на свой ID)
const SHEET_ID = '1N6uLNIPKZ--st56l5FtgwyW6vtJZbJgMR25iEGhlaps'

function doGet(e) {
  try {
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
        bookings.push({
          location: row[3], // Location
          date: row[4],     // Date  
          time: row[5],     // Time
          status: row[6]    // Status
        })
      }
    }
    
    const result = {
      success: true,
      bookings: bookings
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

    // Подготавливаем данные для записи в таблицу
    // Порядок: Timestamp, Name, Phone, Location, Date, Time, Status
    const rowData = [
      timestamp, // A - Timestamp (автоматический)
      data.name, // B - Name
      data.phone, // C - Phone
      data.location, // D - Location
      "'" + dateString, // E - Date (с апострофом для принудительного текстового формата)
      "'" + timeString, // F - Time (с апострофом для принудительного текстового формата)
      'Pending', // G - Status (по умолчанию "Pending")
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
