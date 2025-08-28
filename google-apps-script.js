// Google Apps Script код для интеграции с Google Таблицей
// Этот файл нужно скопировать в Google Apps Script проект

function doPost(e) {
  try {
    // Получаем данные из POST запроса
    const data = JSON.parse(e.postData.contents)

    // ID вашей Google Таблицы (замените на свой ID)
    const SHEET_ID = '1N6uLNIPKZ--st56l5FtgwyW6vtJZbJgMR25iEGhlaps' // Замените на ID вашей таблицы

    // Открываем таблицу
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet()

    // Создаем timestamp
    const timestamp = new Date()

    // Дата и время уже отформатированы на фронтенде с -- разделителями
    const dateString = data.date
    const timeString = data.time

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
