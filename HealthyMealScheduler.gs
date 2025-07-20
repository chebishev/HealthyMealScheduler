function createHealthyMealsCalendarEvents(silent = false) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  // map the column headers to specific meal times
  const timeMap = {
    // morning (breakfast)
    "Сутрин 7:00 - 9:00": { hour: 7, minute: 30 },
    // second breakfast
    "Междинна закуска 10:30 - 11:30": { hour: 10, minute: 45 },
    // lunch
    "Обяд 13:00 - 14:00": { hour: 13, minute: 0 },
    // afternoon snack
    "Следобедна закуска 16:00 - 17:00": { hour: 16, minute: 0 },
    // dinner
    "Вечеря 19:00 - 20:00": { hour: 19, minute: 0 },
    // before bed
    "Преди лягане 21:30 - 22:00": { hour: 21, minute: 45 }
  };

  const calendar = CalendarApp.getDefaultCalendar();
  const now = new Date(); // current time
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();

  for (let col = 0; col < headers.length; col++) {
    const header = headers[col];
    if (!timeMap[header]) continue;

    const { hour, minute } = timeMap[header];
    const eventStart = new Date(year, month, date, hour, minute);

    // Skip if time already passed
    if (eventStart < now) continue;

    let options = [];
    for (let row = 1; row < data.length; row++) {
      const cell = data[row][col];
      if (cell && typeof cell === "string") {
        options.push(cell.trim());
      }
    }

    if (options.length > 0) {
      const selected = options[Math.floor(Math.random() * options.length)];
      const eventEnd = new Date(eventStart.getTime() + 30 * 60000);

      calendar.createEvent(`🍽️ ${header}`, eventStart, eventEnd, {
        description: selected
      });
    }
  }
  if (!silent){
  // Notify user that events for the rest of the day have been added
  SpreadsheetApp.getUi().alert("Събитията за оставащата част от деня са добавени в календара!");
  }
}

// Manual version (for menu)
function createHealthyMealsCalendarEventsWithUI() {
  createHealthyMealsCalendarEvents(false);  // show alert
}

// Time-driven version
function scheduledCreateHealthyMealsCalendarEvents() {
  createHealthyMealsCalendarEvents(true);   // no alert
}

function onOpen() {
  SpreadsheetApp.getUi()
    // Add a custom menu to the spreadsheet
    .createMenu('Меню за храна')
    // Add a menu item to trigger the event creation
    .addItem('📆 Генерирай меню в календара', 'createHealthyMealsCalendarEventsWithUI')
    .addToUi();
}