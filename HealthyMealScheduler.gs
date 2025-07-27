function createHealthyMealsCalendarEvents(silent = false) {
  const calendar = CalendarApp.getDefaultCalendar();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();

  for (let meal of MEAL_EVENTS) {
    const col = headers.indexOf(meal.label);
    if (col === -1) continue;

    const eventStart = new Date(year, month, date, meal.hour, meal.minute);
    if (eventStart < now) continue;

    const options = [];
    for (let row = 1; row < data.length; row++) {
      const cell = data[row][col];
      if (cell && typeof cell === "string") {
        options.push(cell.trim());
      }
    }

    if (options.length > 0) {
      const selected = options[Math.floor(Math.random() * options.length)];
      const eventEnd = new Date(eventStart.getTime() + 30 * 60000);

      calendar.createEvent(`🍽️ ${meal.label}`, eventStart, eventEnd, {
        description: selected
      });
    }
  }

  if (!silent) {
    SpreadsheetApp.getUi().alert("Събитията за деня са обновени в календара.");
  }
}

function refreshHealthyMealCalendar(silent = false) {
  createHealthyMealsCalendarEvents(silent);
}

function createHealthyMealsCalendarEventsWithUI() {
  refreshHealthyMealCalendar(false);
}

function scheduledCreateHealthyMealsCalendarEvents() {
  refreshHealthyMealCalendar(true);
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Меню за храна')
    .addItem('📆 Генерирай меню в календара', 'createHealthyMealsCalendarEventsWithUI')
    .addToUi();
}