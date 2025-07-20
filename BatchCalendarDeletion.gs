function deleteEventsByTitle() {
  const calendar = CalendarApp.getCalendarById('primary');
  // Define the titles of the events to delete
  const titlesToDelete = [
    '🍽️ Сутрин 7:00 - 9:00',
    '🍽️ Междинна закуска 10:30 - 11:30', 
    '🍽️ Обяд 13:00 - 14:00',
    '🍽️ Следобедна закуска 16:00 - 17:00',
    '🍽️ Вечеря 19:00 - 20:00',
    '🍽️ Преди лягане 21:30 - 22:00'
  ];

  const now = new Date();
  // Set the future date to one day later
  const future = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const events = calendar.getEvents(now, future);
  let count = 0;

  events.forEach(function(event) {
    for (const title of titlesToDelete) {
      if (event.getTitle() === title) {
        event.deleteEvent();
        count++;
        // break the loop once a match is found
        break;
      }
    }
  });

  Logger.log(count + ' events deleted.');
}
