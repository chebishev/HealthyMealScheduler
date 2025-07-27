function createHealthyMealsCalendarEvents(silent = false) {
  const calendar = CalendarApp.getDefaultCalendar();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  // Get Properties service
  const props = PropertiesService.getScriptProperties();
  const lastUsedRowStr = props.getProperty("lastUsedRowIndex");
  const dataRowStart = 1; // Skip headers

  const maxDataRow = data.length - 1; // Last usable row index
  let nextRow = dataRowStart;

  if (lastUsedRowStr !== null) {
    const lastUsed = parseInt(lastUsedRowStr, 10);
    if (lastUsed >= maxDataRow) {
      nextRow = dataRowStart; // Wrap around
    } else {
      nextRow = lastUsed + 1;
    }
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();

  for (let meal of MEAL_EVENTS) {
    const col = headers.indexOf(meal.label);
    if (col === -1) continue;

    const eventStart = new Date(year, month, date, meal.hour, meal.minute);
    if (eventStart < now) continue;

    const cell = data[nextRow][col];
    if (!cell || typeof cell !== "string") continue;

    const eventEnd = new Date(eventStart.getTime() + 30 * 60000);

    calendar.createEvent(`🍽️ ${meal.label}`, eventStart, eventEnd, {
      description: cell.trim()
    });
  }

  // Save nextRow index for future use
  props.setProperty("lastUsedRowIndex", nextRow.toString());

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