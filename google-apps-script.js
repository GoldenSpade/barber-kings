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
        // Теперь в таблице location уже хранится в коротком виде
        const locationKey = row[4] // "Adamiceva" или "Martinkovac"

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
            status: row[7] || 'Confirmed', // Status (по умолчанию Confirmed)
            service: row[8] || '', // Service
          })
        } else {
          // Для обычных пользователей - только необходимые данные с короткими названиями
          bookings.push({
            location: locationKey, // Location key (Martinkovac, Adamiceva)
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
    const endTime = e.parameter.endTime
    const duration = parseInt(e.parameter.duration) || 30
    const status = e.parameter.status || 'Confirmed'
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
    const allSlots = [
      '09:00',
      '09:30',
      '10:00',
      '10:30',
      '11:00',
      '11:30',
      '12:00',
      '12:30',
      '13:00',
      '13:30',
      '14:00',
      '14:30',
      '15:00',
      '15:30',
      '16:00',
      '16:30',
      '17:00',
      '17:30',
      '18:00',
      '18:30',
      '19:00',
      '19:30',
      '20:00',
      '20:30'
    ]
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
    // Получаем данные из POST запроса
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
    const status = data.status || 'Confirmed' // Статус из формы или по умолчанию "Confirmed"
    const service = data.service || '' // Тип услуги из формы

    // Сохраняем location в коротком виде (без преобразования в полное название)
    const shortLocationName = data.location // Martinkovac или Adamiceva

    // Вычисляем все слоты, которые занимает услуга
    const allSlots = [
      '09:00',
      '09:30',
      '10:00',
      '10:30',
      '11:00',
      '11:30',
      '12:00',
      '12:30',
      '13:00',
      '13:30',
      '14:00',
      '14:30',
      '15:00',
      '15:30',
      '16:00',
      '16:30',
      '17:00',
      '17:30',
      '18:00',
      '18:30',
      '19:00',
      '19:30',
      '20:00',
      '20:30'
    ]
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
          message: 'Booking ID is required',
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
            message: 'Status updated successfully',
          })
        ).setMimeType(ContentService.MimeType.JSON)
      }
    }

    // Если не найдено
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: 'Booking not found',
      })
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: 'Error updating status: ' + error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON)
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
