import datetime
import os.path
import random

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

from config import get_settings
from read_google_sheet import load_meals_from_google_sheet as load_meals

settings = get_settings()

SHEET_NAME = settings.SHEET_NAME
CREDENTIALS_FILE = settings.CREDENTIALS_FILE

# If modifying these SCOPES, delete the token.json file
SCOPES = settings.CALENDAR_API_SCOPES

# Meal data as dictionary hardcoded for fallback
# meals = {
#     "morning": [
#         "Чаша топла вода с лимон и мед",
#         "1 чаша алое вера + сок от нар (50/50 мл)",
#         "2 варени яйца с авокадо",
#         "Филия ръжено хлебче с масло",
#         "Зелен смути: спанак + банан + чиа + растително мляко"
#     ],
#     "late_breakfast": [
#         "1 нар / киви / чаша боровинки",
#         "10 ореха или бразилски ядки",
#         "1 чаша зелен чай"
#     ],
#     "lunch": [
#         "Печена риба или пилешко филе",
#         "1 чаша кафяв ориз или киноа",
#         "Салата с цвекло, краставица, зехтин и лимон",
#         "Леща чорба или боб яхния"
#     ],
#     "snack": [
#         "Чаша айрян с чесън",
#         "Шепа тиквени семки",
#         "Билков чай: коприва, лайка, невен"
#     ],
#     "dinner": [
#         "Печени картофи със салата",
#         "Печена сьомга и зеленчуци",
#         "Салата с чесън, зехтин, куркума"
#     ],
#     "before_sleep": [
#         "Чаша топло мляко с куркума",
#         "1 ч.л. пчелен прополис (воден разтвор)",
#         "1 чаша вода с лимон",
#         "1 ч.л. ашваганда"
#     ]
# }

meals = load_meals(SHEET_NAME)

time_slots = {
    "morning": (7, 0),
    "late_breakfast": (10, 30),
    "lunch": (13, 0),
    "snack": (16, 0),
    "dinner": (19, 0),
    "before_sleep": (21, 30),
}


def authenticate_google_calendar():
    creds = None
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file(CREDENTIALS_FILE, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)

        with open("token.json", "w") as token:
            token.write(creds.to_json())

    return build("calendar", "v3", credentials=creds)


def create_meal_event(service, title, description, hour, minute):
    today = datetime.date.today()
    start_time = datetime.datetime(today.year, today.month, today.day, hour, minute)
    end_time = start_time + datetime.timedelta(minutes=30)

    event = {
        "summary": f"🍽️ {title}",
        "description": description,
        "start": {
            "dateTime": start_time.isoformat(),
            "timeZone": "Europe/Sofia",
        },
        "end": {
            "dateTime": end_time.isoformat(),
            "timeZone": "Europe/Sofia",
        },
        "reminders": {
            "useDefault": False,
            "overrides": [
                {"method": "popup", "minutes": 10},
            ],
        },
    }

    event_result = service.events().insert(calendarId="primary", body=event).execute()
    print(f"Created: {event_result.get('summary')} at {start_time.time()}")


def main():
    service = authenticate_google_calendar()

    for slot, meal_list in meals.items():
        meal = random.choice(meal_list)
        title = slot.replace("_", " ").title()
        hour, minute = time_slots[slot]
        create_meal_event(service, title, meal, hour, minute)


if __name__ == "__main__":
    main()
