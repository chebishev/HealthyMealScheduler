function getEventsFromDayRange(startOffset, endOffset) {
  const start = new Date();
  start.setDate(start.getDate() + startOffset);
  start.setHours(0, 0, 0, 0); // Start of the day

  const end = new Date();
  end.setDate(end.getDate() + endOffset);
  end.setHours(23, 59, 59, 999); // End of the day

  return CalendarApp.getCalendarById('primary').getEvents(start, end);
}

function deleteEventsByTitle() {
  const calendar = CalendarApp.getCalendarById('primary');
  const titlesToDelete = [
    '🍽️ Сутрин 7:00 - 9:00',
    '🍽️ Междинна закуска 10:30 - 11:30',
    '🍽️ Обяд 13:00 - 14:00',
    '🍽️ Следобедна закуска 16:00 - 17:00',
    '🍽️ Вечеря 19:00 - 20:00',
    '🍽️ Преди лягане 21:30 - 22:00'
  ];

  // From 2 days ago to yesterday
  const events = getEventsFromDayRange(-2, -1);
  let count = 0;

  events.forEach(function(event) {
    if (titlesToDelete.includes(event.getTitle())) {
      event.deleteEvent();
      count++;
    }
  });

  Logger.log(count + ' events deleted.');
}
