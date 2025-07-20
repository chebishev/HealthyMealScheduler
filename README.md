# 🥗 Healthy Meal Scheduler with Google Sheets & Calendar

This project automates your daily healthy eating routine by:
- Reading meal options from a **Google Sheet**
- Picking one meal for each time slot
- Creating Google Calendar events for those meals
- Skipping past time slots and already-scheduled events

> 📅 All powered by Google Apps Script – no servers, no external Python needed.

---

## 🚀 Features

- ✅ Reads from a structured Google Sheet
- ✅ Randomly selects a meal for each time slot
- ✅ Creates Google Calendar events with descriptions
- ✅ Skips events if the time has already passed
- ✅ Prevents duplicate events
- 🧪 Supports development mode and forced overwrite

---

## 📋 Example Table Format (Google Sheet)

| Breakfast 7:00 - 9:00 | Second Breakfast 10:30 - 11:30 | Lunch 13:00 - 14:00 | Afternoon Snack 16:00 - 17:00 | Dinner 19:00 - 20:00 | Before bed 21:30 - 22:00 |
|-----------------------|--------------------------------|---------------------|-------------------------------|----------------------|---------------------------|
| Meal 1                | Meal 1                         | Meal 1              | Meal 1                        | Meal 1                     | Meal 1                    |
| Meal 2                | Meal 2                         | Meal 2              | Meal 2                        | Meal 2                     | Meal 2                    |
| Meal 3                | Meal 3                         | Meal 3              | Meal 3                        | Meal 3                     | Meal 3                    |

---

## ⚙️ How It Works

The script:
1. Loads all columns from the sheet
2. Matches each time slot with a fixed calendar time (e.g. 07:30 for "Сутрин")
3. Skips if the time has already passed today
4. Skips if an event already exists for that time slot
5. Creates a new event with a randomly selected meal

---
