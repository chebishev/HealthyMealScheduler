# 🥗 Healthy Meal Scheduler with Google Sheets & Calendar

This project automates your daily healthy eating routine by:
- Reading meal options from a **Google Sheet**
- Picking one meal for each time slot
- Creating Google Calendar events for those meals
- Skipping past time slots and already-scheduled events
- Automatically deleting events for the previous day

---

## 📂 Directory Structure \
It started as a python project (the files are still included in the repo), but it was easier to migrate to Google Apps Script, because the Excel file was already a Google Sheet.
```bash
.
├── HealthyMealScheduler.gs     # Apps Script code (the one we only use now)
├── config.py                   # Reads settings from .env using pydantic
├── healthy_meal_scheduler.py   # Main entry point
├── .env                        # Sheet name, .json files for the google APIs, Scopes (env_sample provided)
├── read_google_sheet.py        # get the columns from the sheet using pandas and gspread
├── requirements.txt            # Python dependencies
└── pyproject.toml              # settings for black and isort
```
!! You need to activate Google APIs for Calendar, Drive and Spreadsheet !!
---
> 📅 All powered by Google Apps Script – no servers, no external Python needed.

---

## 🚀 Features

- ✅ Reads from a structured Google Sheet
- ✅ Randomly selects a meal for each time slot
- ✅ Creates Google Calendar events with descriptions
- ✅ Skips events if the time has already passed

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
4. Creates a new event with a randomly selected meal

---
### if you are on the App Script page, you can test and run the code from scheduledCreateHealthyMealsCalendarEvents
