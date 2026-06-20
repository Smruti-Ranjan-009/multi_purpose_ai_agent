import requests
import os
from langchain.tools import tool
from dotenv import load_dotenv

load_dotenv()

@tool
def get_weather(city: str) -> str:
    """Get current weather information for a given city."""
    api_key = os.getenv("OPENWEATHER_API_KEY")
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
    response = requests.get(url)
    data = response.json()

    if response.status_code != 200:
        return f"Could not fetch weather for {city}."

    weather = data["weather"][0]["description"]
    temp     = data["main"]["temp"]
    feels    = data["main"]["feels_like"]
    humidity = data["main"]["humidity"]

    return (f"Weather in {city}: {weather} | "
            f"Temp: {temp}°C | Feels like: {feels}°C | "
            f"Humidity: {humidity}%")