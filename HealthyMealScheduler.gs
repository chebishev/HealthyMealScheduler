const MEAL_EVENTS = [
  { label: "Сутрин 7:00 - 9:00", hour: 7, minute: 30 },
  { label: "Междинна закуска 10:30 - 11:30", hour: 10, minute: 45 },
  { label: "Обяд 13:00 - 14:00", hour: 13, minute: 0 },
  { label: "Следобедна закуска 16:00 - 17:00", hour: 16, minute: 0 },
  { label: "Вечеря 19:00 - 20:00", hour: 19, minute: 0 },
  { label: "Преди лягане 21:30 - 22:00", hour: 21, minute: 45 }
];

function getEventsFromDayRange(startOffset, endOffset) {
  const start = new Date();
  start.setDate(start.getDate() + startOffset);
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setDate(end.getDate() + endOffset);
  end.setHours(23, 59, 59, 999);

  return CalendarApp.getDefaultCalendar().getEvents(start, end);
}

function deleteOldMealEvents() {
  const titlesToDelete = MEAL_EVENTS.map(event => `🍽️ ${event.label}`);
  /* 
  first number is the start offset, second number is the end offset, 
  so "-1, 0" will delete yesterday's and today's events 
  */
  const events = getEventsFromDayRange(-1, -1); // Get events from the previous day
  let count = 0;

  events.forEach(event => {
    if (titlesToDelete.includes(event.getTitle())) {
      event.deleteEvent();
      count++;
    }
  });

  Logger.log(`${count} old meal events deleted.`);
}

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
  deleteOldMealEvents();
  createHealthyMealsCalendarEvents(silent);
}

function createHealthyMealsCalendarEventsWithUI() {
  deleteOldMealEvents();
  refreshHealthyMealCalendar(false);
}

function scheduledCreateHealthyMealsCalendarEvents() {
  deleteOldMealEvents();
  refreshHealthyMealCalendar(true);
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Меню за храна')
    .addItem('📆 Генерирай меню в календара', 'createHealthyMealsCalendarEventsWithUI')
    .addToUi();
}