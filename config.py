from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_ignore_empty=True,
        extra="ignore",
    )

    SHEET_NAME: str
    CREDENTIALS_FILE: str
    SERVICE_ACCOUNT_FILE: str
    CALENDAR_API_SCOPES: list[str]
    DRIVE_API_SCOPES: list[str]


def get_settings() -> Settings:
    return Settings()
