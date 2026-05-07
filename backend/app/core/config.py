from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    openalex_base_url: str = "https://api.openalex.org"
    max_results: int = 25
    request_timeout_seconds: float = 20.0

    model_config = SettingsConfigDict(env_prefix="CNE_", env_file=".env")


@lru_cache
def get_settings() -> Settings:
    return Settings()
