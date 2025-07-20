import gspread
import pandas as pd
from oauth2client.service_account import ServiceAccountCredentials

from config import get_settings

settings = get_settings()

SERVICE_ACCOUNT_FILE = settings.SERVICE_ACCOUNT_FILE
SCOPE = settings.DRIVE_API_SCOPES


def load_meals_from_google_sheet(spreadsheet_name):
    """
    Loads meal data from a Google Sheet and organizes it into a dictionary.

    This function connects to a Google Sheet specified by the `spreadsheet_name`,
    retrieves the data, and maps the data to predefined meal categories based
    on time slots. It returns a dictionary where each key corresponds to a meal
    time and the value is a list of meals for that time.

    Args:
        spreadsheet_name (str): The name of the Google Spreadsheet to load meals from.

    Returns:
        dict: A dictionary with keys as meal times and values as lists of meals.
    """

    creds = ServiceAccountCredentials.from_json_keyfile_name(
        SERVICE_ACCOUNT_FILE, SCOPE
    )
    client = gspread.authorize(creds)

    sheet = client.open(spreadsheet_name).sheet1
    data = sheet.get_all_records()

    df = pd.DataFrame(data)

    column_map = {
        "Сутрин 7:00 - 9:00": "morning",
        "Междинна закуска 10:30 - 11:30": "late_breakfast",
        "Обяд 13:00 - 14:00": "lunch",
        "Следобедна закуска 16:00 - 17:00": "snack",
        "Вечеря 19:00 - 20:00": "dinner",
        "Преди лягане 21:30 - 22:00": "before_sleep",
    }

    df.rename(columns=column_map, inplace=True)

    meals = {}
    for key in column_map.values():
        meals[key] = df[key].dropna().tolist()

    return meals
