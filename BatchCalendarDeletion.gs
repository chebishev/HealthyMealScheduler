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
