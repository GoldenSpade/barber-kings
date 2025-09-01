// ID вашей Google Таблицы (замените на свой ID)
const SHEET_ID = '1N6uLNIPKZ--st56l5FtgwyW6vtJZbJgMR25iEGhlaps'

// Функция для генерации короткого ID (аналог nanoid)
function generateShortId() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

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
    // Структура: A=id, B=Timestamp, C=Name, D=Phone, E=Location, F=Date, G=Time, H=Status, I=Service
    for (let i = 1; i < data.length; i++) {
      const row = data[i]
      // Проверяем что строка не пустая (id, Name, Location, Date, Time)
      if (row[0] && row[2] && row[4] && row[5] && row[6]) {
        
        // Преобразуем location в нужный формат для клиента
        let locationKey = ''
        const fullLocation = row[4] // "Barber Kings Adamićeva" или "Barber Kings Martinkovac"
        if (fullLocation.includes('Adamićeva')) {
          locationKey = 'podil'
        } else if (fullLocation.includes('Martinkovac')) {
          locationKey = 'downtown'
        } else {
          locationKey = fullLocation
        }
        
        if (isAdmin) {
          // Для админки возвращаем полную информацию
          bookings.push({
            id: row[0],         // id
            timestamp: row[1],  // Timestamp
            name: row[2],       // Name
            phone: row[3],      // Phone  
            location: row[4],   // Location (полное название)
            date: row[5],       // Date  
            time: row[6],       // Time
            status: row[7] || 'Pending', // Status (по умолчанию Pending)
            service: row[8] || '' // Service
          })
        } else {
          // Для обычных пользователей - только необходимые данные с преобразованным location
          bookings.push({
            location: locationKey, // Location key для сопоставления (podil, downtown)
            date: row[5],     // Date  
            time: row[6],     // Time
            status: row[7],   // Status
            service: row[8] || '' // Service
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
    const service = e.parameter.service || ''
    
    // Проверяем обязательные поля
    if (!name || !phone || !location || !date || !time) {
      throw new Error('Missing required fields')
    }
    
    // Открываем таблицу
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet()
    
    // Генерируем уникальный ID для заказа
    const bookingId = generateShortId()
    
    // Создаем timestamp
    const timestamp = new Date()
    
    // Преобразуем location из ключа в полное название
    let fullLocationName = location
    if (location === 'podil') {
      fullLocationName = 'Barber Kings Adamićeva'
    } else if (location === 'downtown') {
      fullLocationName = 'Barber Kings Martinkovac'
    }

    // Подготавливаем данные для записи в таблицу
    // Порядок: id, Timestamp, Name, Phone, Location, Date, Time, Status, Service
    const rowData = [
      bookingId, // A - id (уникальный идентификатор)
      timestamp, // B - Timestamp (автоматический)
      name, // C - Name
      "'" + phone, // D - Phone (с апострофом для принудительного текстового формата)
      fullLocationName, // E - Location (полное название)
      "'" + date, // F - Date (с апострофом для принудительного текстового формата)
      "'" + time, // G - Time (с апострофом для принудительного текстового формата)
      status, // H - Status
      service, // I - Service (тип услуги)
    ]
    
    // Добавляем строку в конец таблицы
    sheet.appendRow(rowData)
    
    const result = {
      success: true,
      message: 'Booking added successfully',
      id: bookingId
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

    // Генерируем уникальный ID для заказа
    const bookingId = generateShortId()

    // Создаем timestamp
    const timestamp = new Date()

    // Дата и время уже отформатированы на фронтенде в стандартном формате
    const dateString = data.date    // DD/MM/YYYY
    const timeString = data.time    // HH:MM
    const status = data.status || 'Pending'  // Статус из формы или по умолчанию "Pending"
    const service = data.service || ''  // Тип услуги из формы

    // Преобразуем location из ключа в полное название
    let fullLocationName = data.location
    if (data.location === 'podil') {
      fullLocationName = 'Barber Kings Adamićeva'
    } else if (data.location === 'downtown') {
      fullLocationName = 'Barber Kings Martinkovac'
    }

    // Подготавливаем данные для записи в таблицу
    // Порядок: id, Timestamp, Name, Phone, Location, Date, Time, Status, Service
    const rowData = [
      bookingId, // A - id (уникальный идентификатор)
      timestamp, // B - Timestamp (автоматический)
      data.name, // C - Name
      "'" + data.phone, // D - Phone (с апострофом для принудительного текстового формата)
      fullLocationName, // E - Location (полное название)
      "'" + dateString, // F - Date (с апострофом для принудительного текстового формата)
      "'" + timeString, // G - Time (с апострофом для принудительного текстового формата)
      status, // H - Status (из формы или "Pending")
      service, // I - Service (тип услуги)
    ]

    // Добавляем строку в конец таблицы
    sheet.appendRow(rowData)

    // Возвращаем успешный ответ с ID созданной записи
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: 'Booking saved successfully',
        id: bookingId
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
    
    // Проверяем наличие ID
    if (!data.id) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          message: 'Booking ID is required'
        })
      ).setMimeType(ContentService.MimeType.JSON)
    }
    
    // Находим строку по ID
    const allData = sheet.getDataRange().getValues()
    
    for (let i = 1; i < allData.length; i++) {
      const row = allData[i]
      // Ищем по id (колонка A, индекс 0)
      if (row[0] === data.id) {
        // Обновляем статус (колонка H, индекс 7)
        sheet.getRange(i + 1, 8).setValue(data.newStatus)
        
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
