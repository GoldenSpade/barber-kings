// ID вашей Google Таблицы (замените на свой ID)
const SHEET_ID = '1ZWjuxtgYWVsDnXpqyXD7hzpt7WN5aJ_tdfWwo9NsELE'

// Настройки Twilio для WhatsApp уведомлений
const TWILIO_ACCOUNT_SID = 'AC85d7e903c497d51fbc7d78240b6f9352'
const TWILIO_AUTH_TOKEN = '6cf4936898a774e088c04a5f60a73cbb'
const TWILIO_WHATSAPP_FROM = 'whatsapp:+14155238886'

// 🔧 НАСТРОЙКИ АДМИНОВ - легко изменить здесь
const ADMIN_WHATSAPP_NUMBERS = [
  'whatsapp:+380951067390',  // Первый администратор
  // Добавьте сюда новые номера по необходимости:
  // 'whatsapp:+380123456789',  // Третий администратор
]

// Функция для генерации короткого ID (аналог nanoid)
function generateShortId() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Функция для получения всех доступных слотов времени
function getAllTimeSlots() {
  return [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
  ]
}

// Функция для отправки WhatsApp уведомлений всем администраторам
function sendWhatsAppNotificationToAdmin(name, phone, location, date, time, service) {
  try {
    // Формируем сообщение для администраторов
    const message = `🔔 New booking at Barber Kings!

👤 Client: ${name}
📞 Phone: ${phone}
📍 Location: ${location}
📅 Date: ${date}
🕐 Time: ${time}
✂️ Service: ${service || 'Not specified'}

Check the booking in admin panel.`

    const results = []
    
    // Отправляем сообщение каждому администратору
    for (let i = 0; i < ADMIN_WHATSAPP_NUMBERS.length; i++) {
      const adminNumber = ADMIN_WHATSAPP_NUMBERS[i]
      
      try {
        const success = sendWhatsAppMessage(adminNumber, message)
        results.push({ 
          number: adminNumber, 
          success: success,
          index: i + 1 
        })
        
        // Небольшая задержка между отправками для избежания rate limits
        if (i < ADMIN_WHATSAPP_NUMBERS.length - 1) {
          Utilities.sleep(500) // 0.5 секунды задержка
        }
      } catch (error) {
        console.error(`Failed to send to admin ${i + 1} (${adminNumber}):`, error.toString())
        results.push({ 
          number: adminNumber, 
          success: false,
          error: error.toString(),
          index: i + 1 
        })
      }
    }
    
    // Логируем результаты
    const successful = results.filter(r => r.success).length
    console.log(`WhatsApp notifications: ${successful}/${results.length} sent successfully`)
    
    return successful > 0 // Возвращаем true если хотя бы одно сообщение отправлено
  } catch (error) {
    console.error('Error in sendWhatsAppNotificationToAdmin:', error.toString())
    return false
  }
}

// Вспомогательная функция для отправки одного WhatsApp сообщения
function sendWhatsAppMessage(toNumber, message) {
  try {
    // URL для Twilio API
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`
    
    // Подготавливаем данные для отправки
    const payload = {
      'From': TWILIO_WHATSAPP_FROM,
      'To': toNumber,
      'Body': message
    }

    // Настройки запроса
    const options = {
      'method': 'POST',
      'headers': {
        'Authorization': 'Basic ' + Utilities.base64Encode(TWILIO_ACCOUNT_SID + ':' + TWILIO_AUTH_TOKEN),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      'payload': Object.keys(payload).map(key => key + '=' + encodeURIComponent(payload[key])).join('&')
    }

    // Отправляем запрос
    const response = UrlFetchApp.fetch(url, options)
    const responseData = JSON.parse(response.getContentText())
    
    if (response.getResponseCode() === 201) {
      console.log(`WhatsApp sent to ${toNumber}: ${responseData.sid}`)
      return true
    } else {
      console.error(`Failed to send to ${toNumber}:`, responseData)
      return false
    }
  } catch (error) {
    console.error(`Error sending to ${toNumber}:`, error.toString())
    return false
  }
}


function doGet(e) {
  try {
    // Проверяем действие
    const action = e.parameter.action

    if (action === 'add') {
      // Обрабатываем добавление новой записи через GET (для обхода CORS)
      return handleAddBooking(e)
    }

    if (action === 'updateStatus') {
      // Обрабатываем обновление статуса через GET (для обхода CORS)
      return handleUpdateBookingStatus(e)
    }

    if (action === 'updateBooking') {
      // Обрабатываем обновление полной информации о бронировании через GET (для обхода CORS)
      return handleUpdateBooking(e)
    }

    if (action === 'deleteBooking') {
      // Обрабатываем удаление бронирования через GET (для обхода CORS)
      return handleDeleteBooking(e)
    }

    if (action === 'verifyUser') {
      // Обрабатываем проверку пользователя для авторизации
      return handleUserVerification(e)
    }

    if (action === 'getServices') {
      // Получение всех активных услуг
      return handleGetServices(e)
    }

    if (action === 'addService') {
      // Добавление новой услуги
      return handleAddService(e)
    }

    if (action === 'updateService') {
      // Обновление существующей услуги
      return handleUpdateService(e)
    }

    if (action === 'deleteService') {
      // Удаление услуги (soft delete)
      return handleDeleteService(e)
    }

    if (action === 'checkAvailability') {
      // Проверка доступности времени
      return handleCheckAvailability(e)
    }

    if (action === 'getAvailableSlots') {
      // Получение только свободных слотов
      return handleGetAvailableSlots(e)
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
        if (isAdmin) {
          // Для админки возвращаем полную информацию
          bookings.push({
            id: row[0], // id
            timestamp: row[1], // Timestamp
            name: row[2], // Name
            phone: row[3], // Phone
            location: row[4], // Location (короткое название: Martinkovac, Adamiceva)
            date: row[5], // Date
            time: row[6], // Time
            status: row[7] || 'Pending', // Status (по умолчанию Pending)
            service: row[8] || '', // Service
          })
        } else {
          // Для обычных пользователей - только необходимые данные с короткими названиями
          bookings.push({
            location: row[4], // Location (Martinkovac, Adamiceva)
            date: row[5], // Date
            time: row[6], // Time
            status: row[7], // Status
            service: row[8] || '', // Service
          })
        }
      }
    }

    const result = {
      success: true,
      bookings: bookings,
    }

    // Добавляем количество для админки
    if (isAdmin) {
      result.totalCount = bookings.length
    }

    // Поддержка JSONP
    const callback = e.parameter.callback
    if (callback) {
      return ContentService.createTextOutput(
        callback + '(' + JSON.stringify(result) + ');'
      ).setMimeType(ContentService.MimeType.JAVASCRIPT)
    }

    // Обычный JSON ответ
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
      ContentService.MimeType.JSON
    )
  } catch (error) {
    const errorResult = {
      success: false,
      message: 'Error fetching bookings: ' + error.toString(),
    }

    // Поддержка JSONP для ошибок
    const callback = e.parameter.callback
    if (callback) {
      return ContentService.createTextOutput(
        callback + '(' + JSON.stringify(errorResult) + ');'
      ).setMimeType(ContentService.MimeType.JAVASCRIPT)
    }

    return ContentService.createTextOutput(JSON.stringify(errorResult)).setMimeType(
      ContentService.MimeType.JSON
    )
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
    const duration = parseInt(e.parameter.duration) || 30
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

    // Сохраняем location в коротком виде (без преобразования в полное название)
    const shortLocationName = location // Martinkovac или Adamiceva

    // Вычисляем все слоты, которые занимает услуга
    const allSlots = getAllTimeSlots()
    const startIndex = allSlots.indexOf(time)
    const slotsNeeded = Math.ceil(duration / 30) // Количество 30-минутных слотов

    // Создаем записи для всех занятых слотов
    const rowsToAdd = []
    for (let i = 0; i < slotsNeeded; i++) {
      const slotIndex = startIndex + i
      if (slotIndex < allSlots.length) {
        const slotTime = allSlots[slotIndex]

        // Подготавливаем данные для записи в таблицу
        // Порядок: id, Timestamp, Name, Phone, Location, Date, Time, Status, Service
        const rowData = [
          bookingId, // A - id (одинаковый для всех слотов одной услуги)
          timestamp, // B - Timestamp (автоматический)
          name, // C - Name
          "'" + phone, // D - Phone (с апострофом для принудительного текстового формата)
          shortLocationName, // E - Location (короткое название: Martinkovac, Adamiceva)
          "'" + date, // F - Date (с апострофом для принудительного текстового формата)
          "'" + slotTime, // G - Time (время каждого слота)
          status, // H - Status
          service, // I - Service (тип услуги)
        ]
        rowsToAdd.push(rowData)
      }
    }

    // Добавляем все строки в таблицу
    if (rowsToAdd.length > 0) {
      // Добавляем строки одним вызовом для лучшей производительности
      const range = sheet.getRange(sheet.getLastRow() + 1, 1, rowsToAdd.length, rowsToAdd[0].length)
      range.setValues(rowsToAdd)
      
      // Отправляем WhatsApp уведомление администратору
      sendWhatsAppNotificationToAdmin(name, phone, location, date, time, service)
    }

    const result = {
      success: true,
      message: 'Booking added successfully',
      id: bookingId,
    }

    // Поддержка JSONP
    const callback = e.parameter.callback
    if (callback) {
      return ContentService.createTextOutput(
        callback + '(' + JSON.stringify(result) + ');'
      ).setMimeType(ContentService.MimeType.JAVASCRIPT)
    }

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
      ContentService.MimeType.JSON
    )
  } catch (error) {
    const errorResult = {
      success: false,
      message: 'Error adding booking: ' + error.toString(),
    }

    // Поддержка JSONP для ошибок
    const callback = e.parameter.callback
    if (callback) {
      return ContentService.createTextOutput(
        callback + '(' + JSON.stringify(errorResult) + ');'
      ).setMimeType(ContentService.MimeType.JAVASCRIPT)
    }

    return ContentService.createTextOutput(JSON.stringify(errorResult)).setMimeType(
      ContentService.MimeType.JSON
    )
  }
}

function doPost(e) {
  try {
    // Проверяем, это ли запрос от VAPI
    if (e.postData && e.postData.contents) {
      const rawData = JSON.parse(e.postData.contents)

      // Если это данные от VAPI, обрабатываем их
      if (rawData.message && rawData.message.toolCalls && rawData.message.toolCalls.length > 0) {
        return handleVapiRequest(rawData)
      }
    }

    // Получаем данные из POST запроса (стандартная логика)
    const data = JSON.parse(e.postData.contents)

    // Открываем таблицу
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet()

    // Генерируем уникальный ID для заказа
    const bookingId = generateShortId()

    // Создаем timestamp
    const timestamp = new Date()

    // Дата и время уже отформатированы на фронтенде в стандартном формате
    const dateString = data.date // DD/MM/YYYY
    const timeString = data.time // HH:MM
    const duration = parseInt(data.duration) || 30
    const status = data.status || 'Pending' // Статус из формы или по умолчанию "Pending"
    const service = data.service || '' // Тип услуги из формы

    // Сохраняем location в коротком виде (без преобразования в полное название)
    const shortLocationName = data.location // Martinkovac или Adamiceva

    // Вычисляем все слоты, которые занимает услуга
    const allSlots = getAllTimeSlots()
    const startIndex = allSlots.indexOf(timeString)
    const slotsNeeded = Math.ceil(duration / 30) // Количество 30-минутных слотов

    // Создаем записи для всех занятых слотов
    const rowsToAdd = []
    for (let i = 0; i < slotsNeeded; i++) {
      const slotIndex = startIndex + i
      if (slotIndex < allSlots.length) {
        const slotTime = allSlots[slotIndex]

        // Подготавливаем данные для записи в таблицу
        // Порядок: id, Timestamp, Name, Phone, Location, Date, Time, Status, Service
        const rowData = [
          bookingId, // A - id (одинаковый для всех слотов одной услуги)
          timestamp, // B - Timestamp (автоматический)
          data.name, // C - Name
          "'" + data.phone, // D - Phone (с апострофом для принудительного текстового формата)
          shortLocationName, // E - Location (короткое название: Martinkovac, Adamiceva)
          "'" + dateString, // F - Date (с апострофом для принудительного текстового формата)
          "'" + slotTime, // G - Time (время каждого слота)
          status, // H - Status (из формы или "Pending")
          service, // I - Service (тип услуги)
        ]
        rowsToAdd.push(rowData)
      }
    }

    // Добавляем все строки в таблицу
    if (rowsToAdd.length > 0) {
      // Добавляем строки одним вызовом для лучшей производительности
      const range = sheet.getRange(sheet.getLastRow() + 1, 1, rowsToAdd.length, rowsToAdd[0].length)
      range.setValues(rowsToAdd)
      
      // Отправляем WhatsApp уведомление администратору
      sendWhatsAppNotificationToAdmin(data.name, data.phone, shortLocationName, dateString, timeString, service)
    }

    // Возвращаем успешный ответ с ID созданной записи
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: 'Booking saved successfully',
        id: bookingId,
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

// Функция для обновления статуса бронирования через GET параметры (для обхода CORS)
function handleUpdateBookingStatus(e) {
  try {
    // Получаем параметры из GET запроса
    const id = e.parameter.id
    const newStatus = e.parameter.newStatus

    // Проверяем обязательные поля
    if (!id || !newStatus) {
      throw new Error('Missing required fields: id and newStatus')
    }

    // Открываем таблицу
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet()

    // Находим все строки по ID и обновляем статус для всех
    const allData = sheet.getDataRange().getValues()
    let updatedCount = 0

    for (let i = 1; i < allData.length; i++) {
      const row = allData[i]
      // Ищем по id (колонка A, индекс 0)
      if (row[0] === id) {
        // Обновляем статус (колонка H, индекс 7)
        sheet.getRange(i + 1, 8).setValue(newStatus)
        updatedCount++
      }
    }

    const result = {
      success: updatedCount > 0,
      message: updatedCount > 0 ? `Status updated for ${updatedCount} slots` : 'Booking not found',
      updatedCount: updatedCount,
    }

    // Поддержка JSONP
    const callback = e.parameter.callback
    if (callback) {
      return ContentService.createTextOutput(
        callback + '(' + JSON.stringify(result) + ');'
      ).setMimeType(ContentService.MimeType.JAVASCRIPT)
    }

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
      ContentService.MimeType.JSON
    )
  } catch (error) {
    const errorResult = {
      success: false,
      message: 'Error updating status: ' + error.toString(),
    }

    // Поддержка JSONP для ошибок
    const callback = e.parameter.callback
    if (callback) {
      return ContentService.createTextOutput(
        callback + '(' + JSON.stringify(errorResult) + ');'
      ).setMimeType(ContentService.MimeType.JAVASCRIPT)
    }

    return ContentService.createTextOutput(JSON.stringify(errorResult)).setMimeType(
      ContentService.MimeType.JSON
    )
  }
}


// Функция для обновления полной информации о бронировании через GET параметры (для обхода CORS)
function handleUpdateBooking(e) {
  try {
    // Получаем параметры из GET запроса
    const id = e.parameter.id
    const name = e.parameter.name
    const phone = e.parameter.phone
    const status = e.parameter.status

    // Проверяем обязательные поля
    if (!id || !name || !phone || !status) {
      throw new Error('Missing required fields: id, name, phone, and status')
    }

    // Открываем таблицу
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet()

    // Находим все строки по ID и обновляем информацию для всех
    const allData = sheet.getDataRange().getValues()
    let updatedCount = 0

    for (let i = 1; i < allData.length; i++) {
      const row = allData[i]
      // Ищем по id (колонка A, индекс 0)
      if (row[0] === id) {
        // Обновляем Name (колонка C, индекс 2)
        sheet.getRange(i + 1, 3).setValue(name)
        // Обновляем Phone (колонка D, индекс 3)
        sheet.getRange(i + 1, 4).setValue("'" + phone)
        // Обновляем Status (колонка H, индекс 7)
        sheet.getRange(i + 1, 8).setValue(status)
        updatedCount++
      }
    }

    const result = {
      success: updatedCount > 0,
      message: updatedCount > 0 ? `Booking updated for ${updatedCount} slots` : 'Booking not found',
      updatedCount: updatedCount,
    }

    // Поддержка JSONP
    const callback = e.parameter.callback
    if (callback) {
      return ContentService.createTextOutput(
        callback + '(' + JSON.stringify(result) + ');'
      ).setMimeType(ContentService.MimeType.JAVASCRIPT)
    }

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
      ContentService.MimeType.JSON
    )
  } catch (error) {
    const errorResult = {
      success: false,
      message: 'Error updating booking: ' + error.toString(),
    }

    // Поддержка JSONP для ошибок
    const callback = e.parameter.callback
    if (callback) {
      return ContentService.createTextOutput(
        callback + '(' + JSON.stringify(errorResult) + ');'
      ).setMimeType(ContentService.MimeType.JAVASCRIPT)
    }

    return ContentService.createTextOutput(JSON.stringify(errorResult)).setMimeType(
      ContentService.MimeType.JSON
    )
  }
}

// Функция для удаления бронирования через GET параметры (для обхода CORS)
function handleDeleteBooking(e) {
  try {
    // Получаем параметры из GET запроса
    const id = e.parameter.id

    // Проверяем обязательные поля
    if (!id) {
      throw new Error('Missing required field: id')
    }

    // Открываем таблицу
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet()

    // Находим все строки по ID и удаляем их
    const allData = sheet.getDataRange().getValues()
    let deletedCount = 0
    
    // Проходим по строкам в обратном порядке, чтобы удаление не сдвинуло индексы
    for (let i = allData.length - 1; i >= 1; i--) {
      const row = allData[i]
      // Ищем по id (колонка A, индекс 0)
      if (row[0] === id) {
        // Удаляем строку (i+1 потому что getRange использует 1-based индексацию)
        sheet.deleteRow(i + 1)
        deletedCount++
      }
    }

    const result = {
      success: deletedCount > 0,
      message: deletedCount > 0 ? `Booking deleted (${deletedCount} slots removed)` : 'Booking not found',
      deletedCount: deletedCount,
    }

    // Поддержка JSONP
    const callback = e.parameter.callback
    if (callback) {
      return ContentService.createTextOutput(
        callback + '(' + JSON.stringify(result) + ');'
      ).setMimeType(ContentService.MimeType.JAVASCRIPT)
    }

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
      ContentService.MimeType.JSON
    )
  } catch (error) {
    const errorResult = {
      success: false,
      message: 'Error deleting booking: ' + error.toString(),
    }

    // Поддержка JSONP для ошибок
    const callback = e.parameter.callback
    if (callback) {
      return ContentService.createTextOutput(
        callback + '(' + JSON.stringify(errorResult) + ');'
      ).setMimeType(ContentService.MimeType.JAVASCRIPT)
    }

    return ContentService.createTextOutput(JSON.stringify(errorResult)).setMimeType(
      ContentService.MimeType.JSON
    )
  }
}


// Функция для проверки пользователя при авторизации
function handleUserVerification(e) {
  try {
    // Получаем параметры из GET запроса
    const username = e.parameter.username
    const passwordHash = e.parameter.passwordHash

    // Проверяем обязательные поля
    if (!username || !passwordHash) {
      throw new Error('Missing required fields: username and passwordHash')
    }

    console.log('Verifying user:', username)

    // Открываем таблицу и получаем лист Users
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID)
    const usersSheet = spreadsheet.getSheetByName('Users')
    
    if (!usersSheet) {
      throw new Error('Users sheet not found')
    }

    // Получаем все данные из листа Users
    const userData = usersSheet.getDataRange().getValues()
    
    // Ищем пользователя (начинаем с индекса 1, чтобы пропустить заголовки)
    // Ожидаемая структура: A=username, B=passwordHash, C=role, D=status
    let userFound = false
    let userRole = 'admin'
    
    for (let i = 1; i < userData.length; i++) {
      const row = userData[i]
      const storedUsername = row[0]
      const storedPasswordHash = row[1]
      const storedRole = row[2] || 'admin'
      const storedStatus = row[3] || 'active'
      
      // Проверяем совпадение логина, пароля и статуса
      if (storedUsername === username && 
          storedPasswordHash === passwordHash && 
          storedStatus === 'active') {
        userFound = true
        userRole = storedRole
        break
      }
    }

    const result = {
      success: userFound,
      message: userFound ? 'User authenticated successfully' : 'Invalid credentials',
      user: userFound ? {
        username: username,
        role: userRole
      } : null
    }

    console.log('User verification result:', result)

    // Поддержка JSONP
    const callback = e.parameter.callback
    if (callback) {
      return ContentService.createTextOutput(
        callback + '(' + JSON.stringify(result) + ');'
      ).setMimeType(ContentService.MimeType.JAVASCRIPT)
    }

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
      ContentService.MimeType.JSON
    )
  } catch (error) {
    const errorResult = {
      success: false,
      message: 'Error verifying user: ' + error.toString(),
      user: null
    }

    console.error('User verification error:', errorResult.message)

    // Поддержка JSONP для ошибок
    const callback = e.parameter.callback
    if (callback) {
      return ContentService.createTextOutput(
        callback + '(' + JSON.stringify(errorResult) + ');'
      ).setMimeType(ContentService.MimeType.JAVASCRIPT)
    }

    return ContentService.createTextOutput(JSON.stringify(errorResult)).setMimeType(
      ContentService.MimeType.JSON
    )
  }
}

// Функции для управления услугами

// Получение всех активных услуг
function handleGetServices(e) {
  try {
    // Открываем таблицу и получаем лист Services
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID)
    let servicesSheet = spreadsheet.getSheetByName('Services')
    
    // Если лист не существует, создаем его с заголовками
    if (!servicesSheet) {
      servicesSheet = spreadsheet.insertSheet('Services')
      // Создаем заголовки: A=id, B=name, C=description, D=duration, E=price
      servicesSheet.getRange(1, 1, 1, 5).setValues([
        ['id', 'name', 'description', 'duration', 'price']
      ])
      
      // Добавляем базовые услуги для начала
      const defaultServices = [
        [generateShortId(), "Men's Haircut", 'Classic and modern haircuts for men', 30, 25],
        [generateShortId(), "Men's Haircut + Beard Trim", 'Haircut with professional beard trimming and shaping', 60, 35],
        [generateShortId(), "Women's Haircut", 'Professional haircuts for women', 60, 40]
      ]
      servicesSheet.getRange(2, 1, defaultServices.length, 5).setValues(defaultServices)
    }

    // Получаем все данные из листа Services
    const servicesData = servicesSheet.getDataRange().getValues()
    const services = []
    
    // Начинаем с индекса 1, чтобы пропустить заголовки
    // Структура: A=id, B=name, C=description, D=duration, E=price
    for (let i = 1; i < servicesData.length; i++) {
      const row = servicesData[i]
      // Проверяем что строка не пустая
      if (row[0] && row[1]) {
        services.push({
          id: row[0], // id
          name: row[1], // name
          description: row[2] || '', // description
          duration: parseInt(row[3]) || 30, // duration (minutes)
          price: parseFloat(row[4]) || 0 // price
        })
      }
    }

    // Оставляем порядок как в таблице (сверху вниз)

    const result = {
      success: true,
      services: services,
      totalCount: services.length
    }

    // Поддержка JSONP
    const callback = e.parameter.callback
    if (callback) {
      return ContentService.createTextOutput(
        callback + '(' + JSON.stringify(result) + ');'
      ).setMimeType(ContentService.MimeType.JAVASCRIPT)
    }

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
      ContentService.MimeType.JSON
    )
  } catch (error) {
    const errorResult = {
      success: false,
      message: 'Error fetching services: ' + error.toString(),
      services: []
    }

    // Поддержка JSONP для ошибок
    const callback = e.parameter.callback
    if (callback) {
      return ContentService.createTextOutput(
        callback + '(' + JSON.stringify(errorResult) + ');'
      ).setMimeType(ContentService.MimeType.JAVASCRIPT)
    }

    return ContentService.createTextOutput(JSON.stringify(errorResult)).setMimeType(
      ContentService.MimeType.JSON
    )
  }
}

// Добавление новой услуги
function handleAddService(e) {
  try {
    // Получаем параметры из GET запроса
    const name = e.parameter.name
    const description = e.parameter.description || ''
    const duration = parseInt(e.parameter.duration) || 30
    const price = parseFloat(e.parameter.price) || 0

    // Проверяем обязательные поля
    if (!name || !duration) {
      throw new Error('Missing required fields: name and duration')
    }

    // Открываем таблицу и получаем лист Services
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID)
    let servicesSheet = spreadsheet.getSheetByName('Services')
    
    if (!servicesSheet) {
      throw new Error('Services sheet not found')
    }

    // Генерируем уникальный ID для услуги
    const serviceId = generateShortId()

    // Подготавливаем данные для записи в таблицу
    // Порядок: A=id, B=name, C=description, D=duration, E=price
    const rowData = [
      serviceId, // A - id
      name, // B - name
      description, // C - description
      duration, // D - duration (minutes)
      price // E - price
    ]

    // Добавляем строку в таблицу
    servicesSheet.getRange(servicesSheet.getLastRow() + 1, 1, 1, rowData.length).setValues([rowData])

    const result = {
      success: true,
      message: 'Service added successfully',
      id: serviceId,
      service: {
        id: serviceId,
        name: name,
        description: description,
        duration: duration,
        price: price
      }
    }

    // Поддержка JSONP
    const callback = e.parameter.callback
    if (callback) {
      return ContentService.createTextOutput(
        callback + '(' + JSON.stringify(result) + ');'
      ).setMimeType(ContentService.MimeType.JAVASCRIPT)
    }

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
      ContentService.MimeType.JSON
    )
  } catch (error) {
    const errorResult = {
      success: false,
      message: 'Error adding service: ' + error.toString()
    }

    // Поддержка JSONP для ошибок
    const callback = e.parameter.callback
    if (callback) {
      return ContentService.createTextOutput(
        callback + '(' + JSON.stringify(errorResult) + ');'
      ).setMimeType(ContentService.MimeType.JAVASCRIPT)
    }

    return ContentService.createTextOutput(JSON.stringify(errorResult)).setMimeType(
      ContentService.MimeType.JSON
    )
  }
}

// Обновление существующей услуги
function handleUpdateService(e) {
  try {
    // Получаем параметры из GET запроса
    const id = e.parameter.id
    const name = e.parameter.name
    const description = e.parameter.description || ''
    const duration = parseInt(e.parameter.duration) || 30
    const price = parseFloat(e.parameter.price) || 0

    // Проверяем обязательные поля
    if (!id || !name || !duration) {
      throw new Error('Missing required fields: id, name, and duration')
    }

    // Открываем таблицу и получаем лист Services
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID)
    const servicesSheet = spreadsheet.getSheetByName('Services')
    
    if (!servicesSheet) {
      throw new Error('Services sheet not found')
    }

    // Находим строку по ID и обновляем информацию
    const allData = servicesSheet.getDataRange().getValues()
    let updated = false

    for (let i = 1; i < allData.length; i++) {
      const row = allData[i]
      // Ищем по id (колонка A, индекс 0)
      if (row[0] === id) {
        // Обновляем все поля
        servicesSheet.getRange(i + 1, 2).setValue(name) // B - name
        servicesSheet.getRange(i + 1, 3).setValue(description) // C - description
        servicesSheet.getRange(i + 1, 4).setValue(duration) // D - duration
        servicesSheet.getRange(i + 1, 5).setValue(price) // E - price
        updated = true
        break
      }
    }

    const result = {
      success: updated,
      message: updated ? 'Service updated successfully' : 'Service not found',
      service: updated ? {
        id: id,
        name: name,
        description: description,
        duration: duration,
        price: price
      } : null
    }

    // Поддержка JSONP
    const callback = e.parameter.callback
    if (callback) {
      return ContentService.createTextOutput(
        callback + '(' + JSON.stringify(result) + ');'
      ).setMimeType(ContentService.MimeType.JAVASCRIPT)
    }

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
      ContentService.MimeType.JSON
    )
  } catch (error) {
    const errorResult = {
      success: false,
      message: 'Error updating service: ' + error.toString()
    }

    // Поддержка JSONP для ошибок
    const callback = e.parameter.callback
    if (callback) {
      return ContentService.createTextOutput(
        callback + '(' + JSON.stringify(errorResult) + ');'
      ).setMimeType(ContentService.MimeType.JAVASCRIPT)
    }

    return ContentService.createTextOutput(JSON.stringify(errorResult)).setMimeType(
      ContentService.MimeType.JSON
    )
  }
}

// Удаление услуги (полное удаление строки из таблицы)
function handleDeleteService(e) {
  try {
    // Получаем параметры из GET запроса
    const id = e.parameter.id

    // Проверяем обязательные поля
    if (!id) {
      throw new Error('Missing required field: id')
    }

    // Открываем таблицу и получаем лист Services
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID)
    const servicesSheet = spreadsheet.getSheetByName('Services')

    if (!servicesSheet) {
      throw new Error('Services sheet not found')
    }

    // Находим строку по ID и удаляем её полностью
    const allData = servicesSheet.getDataRange().getValues()
    let deleted = false

    // Проходим по строкам в обратном порядке, чтобы удаление не сдвинуло индексы
    for (let i = allData.length - 1; i >= 1; i--) {
      const row = allData[i]
      // Ищем по id (колонка A, индекс 0)
      if (row[0] === id) {
        // Удаляем строку полностью (i+1 потому что getRange использует 1-based индексацию)
        servicesSheet.deleteRow(i + 1)
        deleted = true
        break
      }
    }

    const result = {
      success: deleted,
      message: deleted ? 'Service deleted successfully' : 'Service not found'
    }

    // Поддержка JSONP
    const callback = e.parameter.callback
    if (callback) {
      return ContentService.createTextOutput(
        callback + '(' + JSON.stringify(result) + ');'
      ).setMimeType(ContentService.MimeType.JAVASCRIPT)
    }

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
      ContentService.MimeType.JSON
    )
  } catch (error) {
    const errorResult = {
      success: false,
      message: 'Error deleting service: ' + error.toString()
    }

    // Поддержка JSONP для ошибок
    const callback = e.parameter.callback
    if (callback) {
      return ContentService.createTextOutput(
        callback + '(' + JSON.stringify(errorResult) + ');'
      ).setMimeType(ContentService.MimeType.JAVASCRIPT)
    }

    return ContentService.createTextOutput(JSON.stringify(errorResult)).setMimeType(
      ContentService.MimeType.JSON
    )
  }
}
<<<<<<< HEAD

// Функция для обработки запросов от VAPI
function handleVapiRequest(vapiData) {
  try {
    console.log('Received VAPI request:', JSON.stringify(vapiData))

    // Извлекаем данные из структуры VAPI
    const toolCall = vapiData.message.toolCalls[0]
    if (!toolCall || !toolCall.function || toolCall.function.name !== 'barber_kings_booking_tool') {
      throw new Error('Invalid tool call from VAPI')
    }

    const args = toolCall.function.arguments
    console.log('Tool arguments:', JSON.stringify(args))

    // Нормализуем данные для совместимости
    const normalizedData = {
      name: args.name,
      phone: args.phone,
      location: args.location,
      date: args.date,
      time: args.time,
      service: normalizeServiceName(args.service),
      duration: parseInt(args.duration) || 30,
      status: 'Pending'
    }

    console.log('Normalized data:', JSON.stringify(normalizedData))

    // Проверяем обязательные поля
    if (!normalizedData.name || !normalizedData.phone || !normalizedData.location ||
        !normalizedData.date || !normalizedData.time) {
      throw new Error('Missing required fields from VAPI')
    }

    // Добавляем запись в таблицу
    const result = addBookingToSheet(normalizedData)

    // Возвращаем ответ для VAPI
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: 'Booking added successfully',
        id: result.id,
        details: normalizedData
      })
    ).setMimeType(ContentService.MimeType.JSON)

  } catch (error) {
    console.error('Error handling VAPI request:', error.toString())

    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: 'Failed to process booking: ' + error.toString()
      })
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

// Функция для нормализации названий услуг
function normalizeServiceName(serviceName) {
  const serviceMap = {
    "Men's Haircut": "Men's Haircut",
    "Men's Haircut + Beard Trim": "Men's Haircut + Beard",
    "Men's Haircut + Beard": "Men's Haircut + Beard",
    "Women's Haircut": "Women's Haircut"
  }

  return serviceMap[serviceName] || serviceName
}

// Функция для добавления записи в таблицу (выделена из doPost)
function addBookingToSheet(data) {
  // Открываем таблицу
  const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet()

  // ПРОВЕРКА ДОСТУПНОСТИ ВРЕМЕНИ
  const allData = sheet.getDataRange().getValues()
  const occupiedSlots = new Set()

  // Собираем занятые слоты для указанной даты и локации
  for (let i = 1; i < allData.length; i++) {
    const row = allData[i]
    const rowLocation = row[4] // Location (колонка E)
    const rowDate = String(row[5]).replace(/'/g, '') // Date (колонка F)
    const rowTime = String(row[6]).replace(/'/g, '') // Time (колонка G)
    const rowStatus = row[7] // Status (колонка H)

    if (rowLocation === data.location &&
        rowDate === data.date &&
        rowStatus !== 'Cancelled') {
      occupiedSlots.add(rowTime)
    }
  }

  // Проверяем доступность запрашиваемого времени
  const allSlots = getAllTimeSlots()
  const startIndex = allSlots.indexOf(data.time)
  const slotsNeeded = Math.ceil(data.duration / 30)

  // Проверяем, что все необходимые слоты свободны
  for (let i = 0; i < slotsNeeded; i++) {
    const slotIndex = startIndex + i
    if (slotIndex < allSlots.length) {
      const slotTime = allSlots[slotIndex]
      if (occupiedSlots.has(slotTime)) {
        throw new Error(`Time slot ${slotTime} is already booked. Please choose another time.`)
      }
    }
  }

  // Генерируем уникальный ID для заказа
  const bookingId = generateShortId()

  // Создаем timestamp
  const timestamp = new Date()

  // Создаем записи для всех занятых слотов
  const rowsToAdd = []
  for (let i = 0; i < slotsNeeded; i++) {
    const slotIndex = startIndex + i
    if (slotIndex < allSlots.length) {
      const slotTime = allSlots[slotIndex]

      // Подготавливаем данные для записи в таблицу
      // Порядок: id, Timestamp, Name, Phone, Location, Date, Time, Status, Service
      const rowData = [
        bookingId, // A - id (одинаковый для всех слотов одной услуги)
        timestamp, // B - Timestamp (автоматический)
        data.name, // C - Name
        "'" + data.phone, // D - Phone (с апострофом для принудительного текстового формата)
        data.location, // E - Location (короткое название: Martinkovac, Adamiceva)
        "'" + data.date, // F - Date (с апострофом для принудительного текстового формата)
        "'" + slotTime, // G - Time (время каждого слота)
        data.status, // H - Status
        data.service, // I - Service (тип услуги)
      ]
      rowsToAdd.push(rowData)
    }
  }

  // Добавляем все строки в таблицу
  if (rowsToAdd.length > 0) {
    // Добавляем строки одним вызовом для лучшей производительности
    const range = sheet.getRange(sheet.getLastRow() + 1, 1, rowsToAdd.length, rowsToAdd[0].length)
    range.setValues(rowsToAdd)

    // Отправляем WhatsApp уведомление администратору
    sendWhatsAppNotificationToAdmin(data.name, data.phone, data.location, data.date, data.time, data.service)
  }

  return {
    id: bookingId,
    slotsAdded: rowsToAdd.length
  }
}

// Функция для проверки доступности времени
function handleCheckAvailability(e) {
  try {
    // Получаем параметры из GET запроса
    const location = e.parameter.location
    const date = e.parameter.date
    const duration = parseInt(e.parameter.duration) || 30

    // Проверяем обязательные поля
    if (!location || !date) {
      throw new Error('Missing required fields: location and date')
    }

    // Открываем таблицу
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet()

    // Получаем все занятые слоты для указанной даты и локации
    const allData = sheet.getDataRange().getValues()
    const occupiedSlots = new Set()

    // Проходим по всем записям и собираем занятые слоты
    for (let i = 1; i < allData.length; i++) {
      const row = allData[i]
      const rowLocation = row[4] // Location (колонка E)
      const rowDate = row[5] // Date (колонка F)
      const rowTime = row[6] // Time (колонка G)
      const rowStatus = row[7] // Status (колонка H)

      // Убираем апострофы из даты и времени для сравнения
      const cleanDate = String(rowDate).replace(/'/g, '')
      const cleanTime = String(rowTime).replace(/'/g, '')

      // Если локация, дата совпадают и статус не "Cancelled"
      if (rowLocation === location &&
          cleanDate === date &&
          rowStatus !== 'Cancelled') {
        occupiedSlots.add(cleanTime)
      }
    }

    // Получаем все возможные слоты времени
    const allSlots = getAllTimeSlots()

    // Определяем доступные слоты
    const availableSlots = []
    const slotsNeeded = Math.ceil(duration / 30)

    for (let i = 0; i <= allSlots.length - slotsNeeded; i++) {
      let isAvailable = true

      // Проверяем, что все необходимые последовательные слоты свободны
      for (let j = 0; j < slotsNeeded; j++) {
        if (occupiedSlots.has(allSlots[i + j])) {
          isAvailable = false
          break
        }
      }

      if (isAvailable) {
        availableSlots.push(allSlots[i])
      }
    }

    const result = {
      success: true,
      location: location,
      date: date,
      duration: duration,
      availableSlots: availableSlots,
      occupiedSlots: Array.from(occupiedSlots),
      totalAvailable: availableSlots.length
    }

    // Поддержка JSONP
    const callback = e.parameter.callback
    if (callback) {
      return ContentService.createTextOutput(
        callback + '(' + JSON.stringify(result) + ');'
      ).setMimeType(ContentService.MimeType.JAVASCRIPT)
    }

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
      ContentService.MimeType.JSON
    )
  } catch (error) {
    const errorResult = {
      success: false,
      message: 'Error checking availability: ' + error.toString()
    }

    // Поддержка JSONP для ошибок
    const callback = e.parameter.callback
    if (callback) {
      return ContentService.createTextOutput(
        callback + '(' + JSON.stringify(errorResult) + ');'
      ).setMimeType(ContentService.MimeType.JAVASCRIPT)
    }

    return ContentService.createTextOutput(JSON.stringify(errorResult)).setMimeType(
      ContentService.MimeType.JSON
    )
  }
}

// Функция для получения только доступных слотов (упрощенная версия)
function handleGetAvailableSlots(e) {
  try {
    // Получаем параметры из GET запроса
    const location = e.parameter.location
    const date = e.parameter.date
    const duration = parseInt(e.parameter.duration) || 30

    // Проверяем обязательные поля
    if (!location || !date) {
      throw new Error('Missing required fields: location and date')
    }

    // Открываем таблицу
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet()

    // Получаем все занятые слоты для указанной даты и локации
    const allData = sheet.getDataRange().getValues()
    const occupiedSlots = new Set()

    // Проходим по всем записям и собираем занятые слоты
    for (let i = 1; i < allData.length; i++) {
      const row = allData[i]
      const rowLocation = row[4] // Location (колонка E)
      const rowDate = row[5] // Date (колонка F)
      const rowTime = row[6] // Time (колонка G)
      const rowStatus = row[7] // Status (колонка H)

      // Убираем апострофы из даты и времени для сравнения
      const cleanDate = String(rowDate).replace(/'/g, '')
      const cleanTime = String(rowTime).replace(/'/g, '')

      // Если локация, дата совпадают и статус не "Cancelled"
      if (rowLocation === location &&
          cleanDate === date &&
          rowStatus !== 'Cancelled') {
        occupiedSlots.add(cleanTime)
      }
    }

    // Получаем все возможные слоты времени
    const allSlots = getAllTimeSlots()

    // Определяем доступные слоты (только те, которые могут вместить нужную длительность)
    const availableSlots = []
    const slotsNeeded = Math.ceil(duration / 30)

    for (let i = 0; i <= allSlots.length - slotsNeeded; i++) {
      let isAvailable = true

      // Проверяем, что все необходимые последовательные слоты свободны
      for (let j = 0; j < slotsNeeded; j++) {
        if (occupiedSlots.has(allSlots[i + j])) {
          isAvailable = false
          break
        }
      }

      if (isAvailable) {
        availableSlots.push(allSlots[i])
      }
    }

    // Возвращаем только список доступных слотов
    const result = {
      success: true,
      availableSlots: availableSlots
    }

    // Поддержка JSONP
    const callback = e.parameter.callback
    if (callback) {
      return ContentService.createTextOutput(
        callback + '(' + JSON.stringify(result) + ');'
      ).setMimeType(ContentService.MimeType.JAVASCRIPT)
    }

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
      ContentService.MimeType.JSON
    )
  } catch (error) {
    const errorResult = {
      success: false,
      message: 'Error getting available slots: ' + error.toString(),
      availableSlots: []
    }

    // Поддержка JSONP для ошибок
    const callback = e.parameter.callback
    if (callback) {
      return ContentService.createTextOutput(
        callback + '(' + JSON.stringify(errorResult) + ');'
      ).setMimeType(ContentService.MimeType.JAVASCRIPT)
    }

    return ContentService.createTextOutput(JSON.stringify(errorResult)).setMimeType(
      ContentService.MimeType.JSON
    )
  }
}
=======
>>>>>>> 5872e1f72892a03f11ba01d471c20f872f305096
